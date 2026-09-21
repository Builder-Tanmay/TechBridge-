import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { 
  Heart, 
  ShoppingCart, 
  Trash2, 
  ArrowRight, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Package, 
  Sparkles 
} from "lucide-react";
import wishlistService from "../services/wishlistService";
import { API_BASE_URL } from "../config/api";
import "../Css/Wishlist.css";

const BASE_URL = API_BASE_URL || "http://localhost:8080";

const Wishlist = () => {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [movingId, setMovingId] = useState(null);
  const [movingAll, setMovingAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [feedback, setFeedback] = useState(null);

  // 1. Get logged-in user state
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      return parsed?.user || parsed;
    } catch {
      return null;
    }
  });

  const userId = user?.id || user?.userid || user?.user_id;

  // 2. Fetch Wishlist Items
  const loadWishlist = useCallback(async () => {
    let currentId = null;
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        const u = parsed?.user || parsed;
        setUser(u);
        currentId = u?.id || u?.userid || u?.user_id;
      }
    } catch (e) {
      console.error("Error reading user state:", e);
    }

    if (!currentId) {
      const directId = localStorage.getItem("userId");
      if (directId) {
        currentId = Number(directId);
      }
    }

    if (!currentId) {
      setWishlistItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await wishlistService.getWishlist(currentId);
      console.log("Loaded wishlist items for user", currentId, data);
      
      const normalized = (Array.isArray(data) ? data : []).map((item) => {
        // If item has a nested product object (from WishlistEntity)
        if (item.product) {
          return {
            id: item.id,
            product: item.product,
            createdAt: item.createdAt || new Date().toISOString()
          };
        }
        // If item is already the product entity itself
        return {
          id: item.id,
          product: item,
          createdAt: item.createdAt || new Date().toISOString()
        };
      });

      setWishlistItems(normalized);
    } catch (err) {
      console.error("Error loading wishlist:", err);
      setWishlistItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWishlist();

    const handleWishlistChange = () => {
      loadWishlist();
    };

    window.addEventListener("wishlist-change", handleWishlistChange);
    return () => {
      window.removeEventListener("wishlist-change", handleWishlistChange);
    };
  }, [loadWishlist]);

  // Show temporary toast feedback
  const showFeedback = (message, type = "success") => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 3500);
  };

  // 3. Remove Item from Wishlist
  const handleRemove = async (item) => {
    const product = item.product || item || {};
    const productId = product?.id || item.productid || item.productId;
    try {
      await wishlistService.removeFromWishlist(userId, item.id, productId);
      setWishlistItems((prev) => prev.filter((i) => i.id !== item.id));
      showFeedback(`${product?.partName || product?.part_name || product?.name || "Item"} removed from your wishlist.`, "info");
    } catch (err) {
      console.error("Error removing from wishlist:", err);
      showFeedback("Failed to remove item from wishlist", "error");
    }
  };

  // 4. Move Item to Cart (Adds to Database Cart + Removes from Wishlist)
  const handleMoveToCart = async (item) => {
    const product = item.product || item || {};
    const productId = product?.id || item.productid || item.productId;

    if (!productId) return;

    try {
      setMovingId(item.id);

      // Add to Spring Boot database Cart
      await axios.post(`${BASE_URL}/api/cart/addtocart`, null, {
        params: {
          userid: userId,
          productid: productId,
          quantity: 1,
        },
      });

      // Remove from Wishlist
      await wishlistService.removeFromWishlist(userId, item.id, productId);
      setWishlistItems((prev) => prev.filter((i) => i.id !== item.id));

      showFeedback(`${product.partName || product.part_name || product.name || "Item"} moved to your cart!`, "success");
    } catch (err) {
      console.error("Error moving item to cart:", err);
      showFeedback("Could not move to cart. Backend cart service may be offline.", "error");
    } finally {
      setMovingId(null);
    }
  };

  // 5. Move All In-Stock Items to Cart
  const handleMoveAllToCart = async () => {
    const inStockItems = wishlistItems.filter((item) => {
      const product = item.product || item || {};
      const stock = product.stockQuantity ?? product.stock_quantity ?? 1;
      return stock > 0;
    });

    if (inStockItems.length === 0) {
      showFeedback("No in-stock items available to move.", "info");
      return;
    }

    setMovingAll(true);
    let successCount = 0;

    for (const item of inStockItems) {
      const product = item.product || item || {};
      const productId = product?.id || item.productid || item.productId;
      try {
        await axios.post(`${BASE_URL}/api/cart/addtocart`, null, {
          params: {
            userid: userId,
            productid: productId,
            quantity: 1,
          },
        });
        await wishlistService.removeFromWishlist(userId, item.id, productId);
        successCount++;
      } catch (err) {
        console.error("Failed to move item:", item, err);
      }
    }

    setMovingAll(false);
    loadWishlist();
    showFeedback(`Moved ${successCount} item(s) to your shopping cart!`, "success");
  };

  // 6. Clear Entire Wishlist
  const handleClearWishlist = async () => {
    if (!window.confirm("Are you sure you want to clear all items from your wishlist?")) {
      return;
    }

    try {
      await wishlistService.clearWishlist(userId);
      setWishlistItems([]);
      showFeedback("Wishlist cleared successfully.", "info");
    } catch (err) {
      console.error("Error clearing wishlist:", err);
      showFeedback("Failed to clear wishlist.", "error");
    }
  };

  // Brands list for quick filters
  const uniqueBrands = ["All", ...new Set(
    wishlistItems
      .map((item) => {
        const p = item.product || item || {};
        return p.brand || p.brandName;
      })
      .filter(Boolean)
  )];

  // Filtered wishlist items
  const filteredItems = wishlistItems.filter((item) => {
    const product = item.product || item || {};
    const brand = (product.brand || product.brandName || "").toLowerCase();
    const partName = (product.partName || product.part_name || product.name || "").toLowerCase();
    const modelName = (product.modelName || product.model_name || product.model || "").toLowerCase();
    const query = searchQuery.toLowerCase().trim();

    const matchesBrand = selectedBrand === "All" || brand === selectedBrand.toLowerCase();
    const matchesSearch =
      !query ||
      partName.includes(query) ||
      brand.includes(query) ||
      modelName.includes(query);

    return matchesBrand && matchesSearch;
  });

  // Calculate totals
  const totalValue = wishlistItems.reduce((acc, item) => {
    const product = item.product || item || {};
    const price = Number(product.price || product.partPrice || 0);
    return acc + (isNaN(price) ? 0 : price);
  }, 0);

  // If user is not logged in
  if (!user || !userId) {
    return (
      <div className="tb-wishlist-page-wrapper">
        <div className="tb-wishlist-container">
          <div className="tb-auth-required-card text-center my-5">
            <div className="tb-auth-icon-box mb-3">
              <Heart size={42} className="text-danger" strokeWidth={1.75} />
            </div>
            <h2 className="fw-bold text-dark mb-2">Sign In to View Your Wishlist</h2>
            <p className="text-muted mb-4">
              Save your favorite OEM spare parts, components, and accessories across all your devices.
            </p>
            <div className="d-flex justify-content-center gap-3">
              <button className="tb-btn-primary-dark" onClick={() => navigate("/login")}>
                Log In Now
              </button>
              <button className="tb-btn-outline" onClick={() => navigate("/products")}>
                Browse Catalog
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tb-wishlist-page-wrapper">
      <div className="tb-wishlist-container">

        {/* Toast Feedback Notification */}
        {feedback && (
          <div className={`tb-toast-notification tb-toast-${feedback.type}`}>
            {feedback.type === "success" && <CheckCircle2 size={18} />}
            {feedback.type === "info" && <Heart size={18} />}
            {feedback.type === "error" && <AlertCircle size={18} />}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Hero Section Banner */}
        <section className="tb-wishlist-hero text-center">
          <div className="tb-badge-pill">
            <Sparkles size={14} className="text-primary" />
            <span>Personalized Hardware Wishlist</span>
          </div>
          <h1 className="tb-wishlist-title">My Saved Hardware & Parts</h1>
          <p className="tb-wishlist-subtitle">
            Keep track of OEM spare parts, upgrades, and accessories you plan to purchase for your devices.
          </p>
        </section>

        {/* Loading State */}
        {loading && (
          <div className="tb-status-box text-center py-5">
            <div className="spinner-border text-dark mb-3" role="status"></div>
            <p className="text-muted fw-medium">Loading your TechBridge wishlist...</p>
          </div>
        )}

        {/* Content Section */}
        {!loading && (
          <>
            {wishlistItems.length > 0 ? (
              <>
                {/* Wishlist Controls & Summary Bar */}
                <div className="tb-wishlist-summary-card">
                  <div className="tb-summary-left">
                    <div className="tb-stat-pill">
                      <span className="tb-stat-number">{wishlistItems.length}</span>
                      <span className="tb-stat-label">Saved Item{wishlistItems.length > 1 ? "s" : ""}</span>
                    </div>
                    <div className="tb-summary-divider"></div>
                    <div className="tb-total-estimate">
                      <span className="tb-estimate-label">Total Value:</span>
                      <span className="tb-estimate-value">₹{totalValue.toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  <div className="tb-summary-actions">
                    <button 
                      className="tb-btn-move-all"
                      disabled={movingAll}
                      onClick={handleMoveAllToCart}
                    >
                      <ShoppingCart size={16} />
                      <span>{movingAll ? "Moving All..." : "Add All to Cart"}</span>
                    </button>

                    <button 
                      className="tb-btn-clear-wishlist"
                      onClick={handleClearWishlist}
                      title="Clear all items from wishlist"
                    >
                      <Trash2 size={16} />
                      <span>Clear All</span>
                    </button>
                  </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="tb-wishlist-filter-row">
                  <div className="tb-wishlist-search-box">
                    <Search size={18} className="tb-search-icon" />
                    <input
                      type="text"
                      placeholder="Search saved parts by name, brand, or model..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <button className="tb-clear-btn" onClick={() => setSearchQuery("")}>
                        ×
                      </button>
                    )}
                  </div>

                  {uniqueBrands.length > 2 && (
                    <div className="tb-brand-pills-list">
                      {uniqueBrands.map((brand) => (
                        <button
                          key={brand}
                          className={`tb-brand-pill-item ${selectedBrand === brand ? "active" : ""}`}
                          onClick={() => setSelectedBrand(brand)}
                        >
                          {brand}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Wishlist Grid */}
                {filteredItems.length > 0 ? (
                  <div className="tb-wishlist-grid">
                    {filteredItems.map((item) => {
                      const product = item.product || item || {};
                      const partName = product.partName || product.part_name || product.name || "OEM Hardware Part";
                      const partDesc = product.partDesc || product.part_desc || product.description || "Original certified replacement component with warranty support.";
                      const brand = product.brand || product.brandName || "TechBridge";
                      const modelName = product.modelName || product.model_name || product.model || "";
                      const price = Number(product.price || product.partPrice || 0);
                      const stock = product.stockQuantity ?? product.stock_quantity ?? product.quantity ?? 1;
                      const isAvailable = stock > 0;
                      const img = product.img || product.image || product.partImg || "";
                      const category = product.category || "SPARE_PART";
                      const isMoving = movingId === item.id;

                      return (
                        <div key={item.id} className="tb-wishlist-card">
                          {/* Image Box */}
                          <div className="tb-card-image-box">
                            {img ? (
                              <img
                                src={img}
                                alt={partName}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500";
                                }}
                              />
                            ) : (
                              <div className="tb-card-placeholder-icon">
                                <Package size={44} className="text-secondary" />
                              </div>
                            )}

                            {/* Stock Status Badge */}
                            <span className={`tb-stock-tag ${isAvailable ? "in-stock" : "out-of-stock"}`}>
                              {isAvailable ? `In Stock (${stock})` : "Out of Stock"}
                            </span>

                            {/* Remove Heart Button */}
                            <button
                              type="button"
                              className="tb-card-remove-btn"
                              onClick={() => handleRemove(item)}
                              title="Remove from wishlist"
                            >
                              <Heart size={18} className="tb-heart-filled" />
                            </button>
                          </div>

                          {/* Card Details */}
                          <div className="tb-card-content">
                            <div className="tb-card-tags mb-2">
                              {brand && (
                                <span className="tb-brand-tag">{brand}</span>
                              )}
                              <span className="tb-category-tag">
                                {category === "ACCESSORY" ? "Accessory" : "Spare Part"}
                              </span>
                            </div>

                            <h3 className="tb-card-title" title={partName}>
                              {partName}
                            </h3>

                            {modelName && (
                              <div className="tb-card-model">
                                <span>Model: {modelName}</span>
                              </div>
                            )}

                            <p className="tb-card-description">
                              {partDesc}
                            </p>

                            <div className="tb-card-divider"></div>

                            {/* Price & Action Row */}
                            <div className="tb-card-footer">
                              <div className="tb-price-wrapper">
                                <span className="tb-price-currency">₹</span>
                                <span className="tb-price-amount">
                                  {price.toLocaleString("en-IN")}
                                </span>
                              </div>

                              <button
                                type="button"
                                className="tb-btn-move-cart"
                                disabled={!isAvailable || isMoving}
                                onClick={() => handleMoveToCart(item)}
                              >
                                {isMoving ? (
                                  <span>Moving...</span>
                                ) : (
                                  <>
                                    <ShoppingCart size={15} />
                                    <span>Move to Cart</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="tb-no-results text-center py-5">
                    <Search size={40} className="text-muted mb-3 d-block mx-auto" />
                    <h4 className="fw-bold text-dark">No Matching Items</h4>
                    <p className="text-muted">Try changing your search keywords or brand filter.</p>
                  </div>
                )}
              </>
            ) : (
              /* Empty Wishlist State */
              <div className="tb-empty-wishlist-state text-center py-5">
                <div className="tb-empty-illustration mb-3">
                  <div className="tb-heart-bubble">
                    <Heart size={46} className="tb-empty-heart-icon" strokeWidth={1.5} />
                  </div>
                </div>
                <h3 className="fw-bold text-dark mb-2">Your Wishlist is Empty</h3>
                <p className="tb-empty-desc text-muted mb-4">
                  You haven't saved any hardware components or spare parts yet. Explore our genuine inventory and click the heart icon on any part to save it here!
                </p>
                <div className="d-flex justify-content-center gap-3">
                  <Link to="/products" className="tb-btn-primary-dark text-decoration-none">
                    <span>Explore Hardware Parts</span>
                    <ArrowRight size={16} />
                  </Link>
                  <Link to="/services" className="tb-btn-outline text-decoration-none">
                    <span>View Repair Services</span>
                  </Link>
                </div>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
};

export default Wishlist;
