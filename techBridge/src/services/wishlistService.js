import axios from "axios";
import { API_BASE_URL } from "../config/api";

const BASE_URL = API_BASE_URL || "http://localhost:8080";

// Helper: Read local fallback wishlist
const getLocalWishlist = (userId) => {
  try {
    const raw = localStorage.getItem(`tb_wishlist_${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

// Helper: Save local fallback wishlist safely without heavy images or triggering infinite loops
const safeSetLocalWishlist = (userId, items) => {
  if (!userId) return;
  try {
    // Strip heavy Base64 image strings to ensure localStorage quota is never exceeded
    const lightweight = Array.isArray(items) ? items.map((item) => {
      if (!item) return item;
      const p = item.product || item;
      if (p && p.img && p.img.length > 500) {
        const strippedProduct = { ...p, img: "" };
        return item.product ? { ...item, product: strippedProduct } : strippedProduct;
      }
      return item;
    }) : items;

    localStorage.setItem(`tb_wishlist_${userId}`, JSON.stringify(lightweight));
  } catch (e) {
    console.warn("Could not save wishlist to localStorage (ignored):", e.message);
  }
};

export const wishlistService = {
  // 1. Fetch user's wishlist from Spring Boot backend
  async getWishlist(userId) {
    if (!userId) return [];

    // Attempt 1: Axios API call
    try {
      const response = await axios.get(`${BASE_URL}/api/wishlist/user/${userId}`, {
        headers: { "Content-Type": "application/json" },
      });
      if (Array.isArray(response.data)) {
        safeSetLocalWishlist(userId, response.data);
        return response.data;
      }
    } catch (err) {
      console.warn("Axios wishlist request failed:", err.message);
    }

    // Attempt 2: Native fetch API call
    try {
      const res = await fetch(`${BASE_URL}/api/wishlist/user/${userId}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          safeSetLocalWishlist(userId, data);
          return data;
        }
      }
    } catch (e) {
      console.warn("Native fetch wishlist request failed:", e.message);
    }

    // Attempt 3: Local cache fallback
    return getLocalWishlist(userId);
  },

  // 2. Add product to wishlist
  async addToWishlist(userId, product) {
    if (!userId || !product) throw new Error("User ID and Product are required");

    let savedItem = null;
    try {
      const response = await axios.post(
        `${BASE_URL}/api/wishlist/add`,
        null,
        {
          params: { 
            userId: userId, 
            userid: userId, 
            productId: product.id, 
            productid: product.id 
          },
        }
      );
      savedItem = response.data;
    } catch (err) {
      console.warn("Backend add to wishlist failed, updating locally:", err.message);
      savedItem = {
        id: `local_${Date.now()}_${product.id}`,
        product: product,
        createdAt: new Date().toISOString(),
      };
    }

    // Update local cache
    const current = getLocalWishlist(userId);
    const exists = current.some((item) => {
      const p = item.product || item;
      return Number(p?.id || item.productid) === Number(product.id);
    });

    if (!exists) {
      const updated = [
        ...current,
        savedItem.product ? savedItem : { id: savedItem.id, product },
      ];
      safeSetLocalWishlist(userId, updated);
    }

    window.dispatchEvent(new CustomEvent("wishlist-change"));
    return savedItem;
  },

  // 3. Toggle product in wishlist (Add if absent, remove if present)
  async toggleWishlist(userId, product) {
    if (!userId || !product) throw new Error("User ID and Product are required");

    const pid = product.id;

    // Layer 1: Direct backend toggle endpoint
    try {
      const response = await axios.post(
        `${BASE_URL}/api/wishlist/toggle`,
        null,
        {
          params: { 
            userId: userId, 
            userid: userId, 
            productId: pid, 
            productid: pid 
          },
        }
      );

      if (response.data) {
        window.dispatchEvent(new CustomEvent("wishlist-change"));
        return {
          wishlisted: response.data.inWishlist,
          message: response.data.message
        };
      }
    } catch (err) {
      console.warn("Backend toggle failed, trying add/remove fallback:", err.message);
    }

    // Layer 2: Direct backend add / remove endpoints
    try {
      const isWishlisted = this.isProductWishlisted(userId, pid);
      if (isWishlisted) {
        await axios.delete(`${BASE_URL}/api/wishlist/remove`, {
          params: { userId, userid: userId, productId: pid, productid: pid }
        });
      } else {
        await axios.post(`${BASE_URL}/api/wishlist/add`, null, {
          params: { userId, userid: userId, productId: pid, productid: pid }
        });
      }
      window.dispatchEvent(new CustomEvent("wishlist-change"));
      return {
        wishlisted: !isWishlisted,
        message: !isWishlisted ? "Added to wishlist" : "Removed from wishlist"
      };
    } catch (e) {
      console.warn("Backend add/remove fallback failed, executing local toggle:", e.message);
    }

    // Layer 3: Local fallback toggle
    const current = getLocalWishlist(userId);
    const existingIndex = current.findIndex((item) => {
      const p = item.product || item;
      return Number(p?.id || item.productid || item.id) === Number(pid);
    });

    if (existingIndex > -1) {
      const itemToRemove = current[existingIndex];
      await this.removeFromWishlist(userId, itemToRemove.id, pid);
      return { wishlisted: false, message: "Removed from wishlist" };
    } else {
      await this.addToWishlist(userId, product);
      return { wishlisted: true, message: "Added to wishlist" };
    }
  },

  // 4. Remove item from wishlist
  async removeFromWishlist(userId, wishlistId, productId) {
    if (!userId) return false;

    try {
      if (typeof wishlistId === "number" || (typeof wishlistId === "string" && !wishlistId.startsWith("local_"))) {
        await axios.delete(`${BASE_URL}/api/wishlist/delete/${wishlistId}`);
      } else if (productId) {
        await axios.delete(`${BASE_URL}/api/wishlist/remove`, {
          params: { 
            userId: userId, 
            userid: userId, 
            productId: productId, 
            productid: productId 
          },
        });
      }
    } catch (err) {
      console.warn("Backend remove from wishlist failed, removing locally:", err.message);
    }

    // Always update local cache safely
    const current = getLocalWishlist(userId);
    const filtered = current.filter((item) => {
      if (wishlistId && item.id === wishlistId) return false;
      const p = item.product || item;
      if (productId && (Number(p?.id) === Number(productId) || Number(item.productid) === Number(productId))) return false;
      return true;
    });

    safeSetLocalWishlist(userId, filtered);
    window.dispatchEvent(new CustomEvent("wishlist-change"));
    return true;
  },

  // 5. Clear entire wishlist
  async clearWishlist(userId) {
    if (!userId) return;
    try {
      await axios.delete(`${BASE_URL}/api/wishlist/clear/${userId}`);
    } catch (err) {
      console.warn("Backend clear wishlist failed, clearing locally:", err.message);
    }
    safeSetLocalWishlist(userId, []);
    window.dispatchEvent(new CustomEvent("wishlist-change"));
  },

  // 6. Check if product is wishlisted
  isProductWishlisted(userId, productId, wishlistItems = null) {
    if (!userId || !productId) return false;
    const list = wishlistItems || getLocalWishlist(userId);
    return list.some((item) => {
      const p = item.product || item;
      return Number(p?.id || item.productid || item.id) === Number(productId);
    });
  },

  // 7. Get total count
  getWishlistCount(userId) {
    if (!userId) return 0;
    return getLocalWishlist(userId).length;
  },
};

export default wishlistService;
