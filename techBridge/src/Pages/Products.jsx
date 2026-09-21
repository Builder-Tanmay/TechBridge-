import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Heart,
  Search,
  RotateCcw,
  ShieldCheck,
  Clock,
  Package,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import wishlistService from "../services/wishlistService";
import "../Css/Products.css";

import heroBg from "../assets/product.png";

const ITEMS_PER_PAGE = 6;

const Products = () => {
  const navigate = useNavigate();

  // Backend Live Data
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedAvailability, setSelectedAvailability] = useState([]);
  const [sortBy, setSortBy] = useState("recommended");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  // User Session & Actions
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
  const [wishlistProductIds, setWishlistProductIds] = useState(new Set());
  const [togglingWishlistId, setTogglingWishlistId] = useState(null);
  const [addingId, setAddingId] = useState(null);

  // 1. Fetch Wishlist State
  const loadWishlistState = useCallback(async () => {
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
      setWishlistProductIds(new Set());
      return;
    }

    try {
      const items = await wishlistService.getWishlist(currentId);
      const ids = new Set(
        items
          .map((item) => {
            const p = item.product || item;
            const pid = p?.id || item.productid || item.productId || item.id;
            return pid ? Number(pid) : null;
          })
          .filter((id) => id !== null && !isNaN(id))
      );
      setWishlistProductIds(ids);
    } catch (e) {
      console.error("Error loading wishlist state:", e);
    }
  }, []);

  // 2. Fetch Live Backend Inventory
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("http://localhost:8080/api/parts/getall");
        if (!response.ok) {
          throw new Error(`Failed to load parts (HTTP ${response.status})`);
        }
        const data = await response.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching live parts:", err);
        setError("Unable to connect to backend server at http://localhost:8080.");
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
    loadWishlistState();

    const handleWishlistEvent = () => loadWishlistState();
    window.addEventListener("wishlist-change", handleWishlistEvent);
    window.addEventListener("auth-change", handleWishlistEvent);
    window.addEventListener("storage", handleWishlistEvent);

    return () => {
      window.removeEventListener("wishlist-change", handleWishlistEvent);
      window.removeEventListener("auth-change", handleWishlistEvent);
      window.removeEventListener("storage", handleWishlistEvent);
    };
  }, [loadWishlistState]);

  // 3. Dynamically extract unique brands & categories from DB
  const dynamicBrands = useMemo(() => {
    const unique = new Set(
      products
        .map((p) => p.brand?.trim())
        .filter((b) => Boolean(b))
    );
    return Array.from(unique);
  }, [products]);

  const dynamicCategories = useMemo(() => {
    const unique = new Set(
      products
        .map((p) => p.category?.trim())
        .filter((c) => Boolean(c))
    );
    return Array.from(unique);
  }, [products]);

  // 4. Filter Handlers (Resets page to 1 on filter change)
  const handleToggleBrand = (brand) => {
    setCurrentPage(1);
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleToggleCategory = (cat) => {
    setCurrentPage(1);
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleToggleAvailability = (type) => {
    setCurrentPage(1);
    setSelectedAvailability((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleSearchChange = (val) => {
    setCurrentPage(1);
    setSearchQuery(val);
  };

  const handleResetAll = () => {
    setSearchQuery("");
    setSelectedBrands([]);
    setSelectedCategories([]);
    setSelectedAvailability([]);
    setSortBy("recommended");
    setCurrentPage(1);
  };

  // 5. Wishlist Handler
  const handleToggleWishlist = async (e, product) => {
    e.stopPropagation();
    const pid = Number(product?.id);
    if (!pid) return;

    if (!user || !userId) {
      alert("Please log in to add items to your wishlist.");
      navigate("/login");
      return;
    }

    try {
      setTogglingWishlistId(pid);
      const res = await wishlistService.toggleWishlist(userId, product);
      setWishlistProductIds((prev) => {
        const next = new Set(prev);
        if (res.wishlisted) next.add(pid);
        else next.delete(pid);
        return next;
      });
    } catch (err) {
      console.error("Wishlist error:", err);
    } finally {
      setTogglingWishlistId(null);
    }
  };

  // 6. Add to Cart Handler
  const handleAddToCart = async (product) => {
    if (!user || !userId) {
      alert("Please log in to add items to your cart.");
      navigate("/login");
      return;
    }

    try {
      setAddingId(product.id);
      await axios.post("http://localhost:8080/api/cart/addtocart", null, {
        params: {
          userid: userId,
          productid: product.id,
          quantity: 1,
        },
      });
      alert(`${product.partName || "Component"} added to your cart.`);
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Failed to add item to cart. Check backend connectivity.");
    } finally {
      setAddingId(null);
    }
  };

  // 7. Live Filter & Sort Computation
  const filteredProducts = useMemo(() => {
    return products
      .filter((item) => {
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          item.partName?.toLowerCase().includes(q) ||
          item.brand?.toLowerCase().includes(q) ||
          item.modelName?.toLowerCase().includes(q) ||
          item.partDesc?.toLowerCase().includes(q);

        const matchesBrand =
          selectedBrands.length === 0 ||
          selectedBrands.includes(item.brand?.trim());

        const matchesCategory =
          selectedCategories.length === 0 ||
          selectedCategories.includes(item.category?.trim());

        const stock = item.stockQuantity ?? 1;
        let matchesAvail = true;
        if (selectedAvailability.length > 0) {
          const checkInStock = selectedAvailability.includes("inStock") && stock > 0;
          const checkBackorder = selectedAvailability.includes("backorder") && stock <= 0;
          matchesAvail = checkInStock || checkBackorder;
        }

        return matchesSearch && matchesBrand && matchesCategory && matchesAvail;
      })
      .sort((a, b) => {
        const priceA = Number(a.price) || 0;
        const priceB = Number(b.price) || 0;
        if (sortBy === "price-low") return priceA - priceB;
        if (sortBy === "price-high") return priceB - priceA;
        return 0;
      });
  }, [products, searchQuery, selectedBrands, selectedCategories, selectedAvailability, sortBy]);

  // 8. Pagination Calculations
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handlePageChange = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      const gridElem = document.getElementById("catalog-products-grid");
      if (gridElem) {
        gridElem.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <div className="tb-products-canvas">

      {/* =================================================================
          1. HALF-SCREEN HERO BANNER (NO FADE / NO OVERLAY)
          ================================================================= */}
      <section
        className="tb-products-hero"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="container position-relative z-2">
          <div className="row align-items-center">
            <div className="col-lg-8 col-xl-7">
              <div className="tb-products-pill">
                <span className="tb-products-dot"></span>
                <span>OEM CERTIFIED SPARE PARTS & ACCESSORIES</span>
              </div>
              <h1 className="tb-products-hero-title">
                Explore Guaranteed <br />
                <span className="tb-gradient-title">Genuine Hardware & Parts.</span>
              </h1>
              <p className="tb-products-hero-subtext">
                Direct model-matched replacement laptop batteries, screens, adapters, keyboards, RAM modules, and NVMe SSDs delivered with authentic warranty.
              </p>

              {/* Integrated Search Bar */}
              <div className="tb-products-search-box mt-4">
                <Search size={18} className="tb-products-search-icon" />
                <input
                  type="text"
                  placeholder="Search by part name, brand (Dell, HP), or model..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="tb-products-search-input"
                />
                {searchQuery && (
                  <button
                    className="tb-products-search-clear"
                    onClick={() => handleSearchChange("")}
                    aria-label="Clear search"
                  >
                    &times;
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          2. MAIN SECTION: SIDEBAR FILTER + PAGINATED PRODUCT GRID
          ================================================================= */}
      <section id="catalog-products-grid" className="tb-content-section tb-section-contrast">
        <div className="container">
          <div className="row g-4">

            {/* --- LEFT SIDE FILTER BAR --- */}
            <div className="col-lg-3 col-md-4">
              <div className="tb-filter-panel bg-white p-4 rounded-4 border shadow-xs">

                {/* Filter Header & Reset Button */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="fw-bold mb-0 text-dark">Filters</h6>
                  <button
                    onClick={handleResetAll}
                    className="btn btn-link p-0 extra-small text-muted text-decoration-none fw-semibold d-flex align-items-center gap-1"
                  >
                    <RotateCcw size={12} /> Reset All
                  </button>
                </div>

                {/* Filter Search */}
                <div className="mb-4">
                  <label className="tb-filter-label">Search Part / Model</label>
                  <div className="tb-filter-search-wrap">
                    <Search size={14} className="tb-search-icon-inside" />
                    <input
                      type="text"
                      placeholder="e.g. Battery, Latitude, SSD"
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="form-control form-control-sm tb-filter-search-input"
                    />
                  </div>
                </div>

                {/* Laptop Brands Filter */}
                <div className="mb-4">
                  <label className="tb-filter-label">Laptop Brand</label>
                  <div className="d-flex flex-column gap-2 mt-1">
                    {dynamicBrands.length > 0 ? (
                      dynamicBrands.map((brand) => (
                        <label key={brand} className="tb-checkbox-item">
                          <input
                            type="checkbox"
                            checked={selectedBrands.includes(brand)}
                            onChange={() => handleToggleBrand(brand)}
                          />
                          <span className="tb-custom-check"></span>
                          <span className="tb-check-text">{brand}</span>
                        </label>
                      ))
                    ) : (
                      <span className="extra-small text-muted">No brands found</span>
                    )}
                  </div>
                </div>

                {/* Categories Filter */}
                <div className="mb-4">
                  <label className="tb-filter-label">Category</label>
                  <div className="d-flex flex-column gap-2 mt-1">
                    {dynamicCategories.length > 0 ? (
                      dynamicCategories.map((cat) => (
                        <label key={cat} className="tb-checkbox-item">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(cat)}
                            onChange={() => handleToggleCategory(cat)}
                          />
                          <span className="tb-custom-check"></span>
                          <span className="tb-check-text">{cat}</span>
                        </label>
                      ))
                    ) : (
                      <span className="extra-small text-muted">No categories found</span>
                    )}
                  </div>
                </div>

                {/* Availability Filter */}
                <div>
                  <label className="tb-filter-label">Availability</label>
                  <div className="d-flex flex-column gap-2 mt-1">
                    <label className="tb-checkbox-item">
                      <input
                        type="checkbox"
                        checked={selectedAvailability.includes("inStock")}
                        onChange={() => handleToggleAvailability("inStock")}
                      />
                      <span className="tb-custom-check"></span>
                      <span className="tb-check-text">In Stock</span>
                    </label>
                    <label className="tb-checkbox-item">
                      <input
                        type="checkbox"
                        checked={selectedAvailability.includes("backorder")}
                        onChange={() => handleToggleAvailability("backorder")}
                      />
                      <span className="tb-custom-check"></span>
                      <span className="tb-check-text">Backorder / Out of Stock</span>
                    </label>
                  </div>
                </div>

              </div>
            </div>

            {/* --- RIGHT PRODUCT GRID --- */}
            <div className="col-lg-9 col-md-8">

              {/* Sort & Count Header */}
              <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <span className="extra-small text-muted fw-semibold">
                  Showing <strong>{filteredProducts.length}</strong> certified components
                  {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
                </span>

                <div className="d-flex align-items-center gap-2">
                  <span className="extra-small text-muted fw-semibold">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="form-select form-select-sm tb-sort-select shadow-xs"
                  >
                    <option value="recommended">Recommended OEM</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>
              </div>

              {/* Status Views */}
              {loading && (
                <div className="text-center py-5 bg-white rounded-4 border">
                  <div className="spinner-border spinner-border-sm text-primary mb-2" role="status"></div>
                  <p className="extra-small text-muted mb-0">Fetching live inventory from database...</p>
                </div>
              )}

              {error && !loading && (
                <div className="text-center py-5 bg-white rounded-4 border p-4">
                  <AlertCircle size={32} className="text-danger mb-2" />
                  <h6 className="fw-bold text-dark mb-1">Backend Connection Issue</h6>
                  <p className="extra-small text-muted mb-0">{error}</p>
                </div>
              )}

              {!loading && !error && filteredProducts.length === 0 && (
                <div className="tb-empty-state text-center p-5 bg-white rounded-4 border">
                  <Package size={36} className="text-muted opacity-50 mb-2" />
                  <h6 className="fw-bold text-dark mb-1">No Hardware Matches Found</h6>
                  <p className="text-muted extra-small mb-3">
                    No parts in the database matched your selected filters or search keyword.
                  </p>
                  <button onClick={handleResetAll} className="btn btn-dark btn-sm rounded-pill px-3">
                    Reset All Filters
                  </button>
                </div>
              )}

              {/* Grid Cards (Paginated Subset) */}
              {!loading && !error && paginatedProducts.length > 0 && (
                <>
                  <div className="row g-3">
                    {paginatedProducts.map((item) => {
                      const pid = Number(item.id);
                      const stock = item.stockQuantity ?? 1;
                      const isAvailable = stock > 0;
                      const isWishlisted = wishlistProductIds.has(pid);
                      const isAdding = addingId === item.id;
                      const isTogglingWishlist = togglingWishlistId === pid;

                      return (
                        <div key={item.id} className="col-xl-4 col-md-6">
                          <div className="tb-product-tile">

                            {/* Image Box */}
                            <div className="tb-tile-image-wrapper">
                              <img
                                src={item.img || "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500"}
                                alt={item.partName}
                                className="tb-tile-image"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500";
                                }}
                              />

                              {/* Stock Badge */}
                              <span className={`tb-stock-chip ${isAvailable ? "in" : "out"}`}>
                                {isAvailable ? `In Stock (${stock})` : "Out of Stock"}
                              </span>

                              {/* Wishlist Heart Button */}
                              <button
                                type="button"
                                className={`tb-wishlist-btn ${isWishlisted ? "active" : ""}`}
                                onClick={(e) => handleToggleWishlist(e, item)}
                                disabled={isTogglingWishlist}
                                title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                                aria-label="Wishlist toggle"
                              >
                                <Heart
                                  size={15}
                                  className={isWishlisted ? "tb-heart-active" : "tb-heart-idle"}
                                />
                              </button>
                            </div>

                            {/* Info Box */}
                            <div className="tb-tile-info">
                              <div className="d-flex justify-content-between align-items-center mb-1">
                                <span className="tb-brand-tag">{item.brand || "OEM Grade"}</span>
                                <span className="tb-cat-badge">{item.category || "Part"}</span>
                              </div>

                              <h6 className="tb-tile-title" title={item.partName}>
                                {item.partName}
                              </h6>

                              <div className="tb-compat-block p-2 rounded-2 mb-3">
                                <span className="compat-label">Compatible with:</span>
                                <span className="compat-text">
                                  {item.modelName || item.partDesc || "Universal fit for brand laptop series"}
                                </span>
                              </div>

                              <div className="tb-tile-footer">
                                <div className="tb-tile-price">
                                  ₹{Number(item.price || 0).toLocaleString("en-IN")}
                                </div>

                                <button
                                  className="tb-btn-add-cart"
                                  disabled={!isAvailable || isAdding}
                                  onClick={() => handleAddToCart(item)}
                                >
                                  {isAdding ? "Adding..." : "Add to Cart"}
                                </button>
                              </div>
                            </div>

                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* ========================================================= */}
                  {/* 3. DYNAMIC PAGINATION (1, 2, 3, 4...)                      */}
                  {/* ========================================================= */}
                  {totalPages > 1 && (
                    <div className="d-flex justify-content-between align-items-center mt-5 pt-3 border-top flex-wrap gap-3">
                      <span className="extra-small text-muted fw-semibold">
                        Page {currentPage} of {totalPages}
                      </span>

                      <div className="tb-pagination-controls d-flex align-items-center gap-1.5">

                        {/* Previous Page Button */}
                        <button
                          type="button"
                          className="btn tb-page-nav-btn"
                          disabled={currentPage === 1}
                          onClick={() => handlePageChange(currentPage - 1)}
                          aria-label="Previous page"
                        >
                          <ChevronLeft size={14} /> Prev
                        </button>

                        {/* Numbered Page Buttons */}
                        {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
                          <button
                            key={pageNum}
                            type="button"
                            className={`btn tb-page-number-btn ${currentPage === pageNum ? "active" : ""}`}
                            onClick={() => handlePageChange(pageNum)}
                          >
                            {pageNum}
                          </button>
                        ))}

                        {/* Next Page Button */}
                        <button
                          type="button"
                          className="btn tb-page-nav-btn"
                          disabled={currentPage === totalPages}
                          onClick={() => handlePageChange(currentPage + 1)}
                          aria-label="Next page"
                        >
                          Next <ChevronRight size={14} />
                        </button>

                      </div>
                    </div>
                  )}
                </>
              )}

            </div>

          </div>
        </div>
      </section>

      {/* =================================================================
          4. BOTTOM CTA
          ================================================================= */}
      <section className="tb-cta-section">
        <div className="container text-center">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h2 className="tb-cta-headline">Need Assistance Installing Your Hardware?</h2>
              <p className="tb-cta-subtext">
                Connect with official brand service centers or verified cleanroom diagnostic labs to book expert installation and thermal overhauls.
              </p>
              <div className="d-flex flex-wrap justify-content-center gap-3">
                <button
                  onClick={() => navigate('/service-center')}
                  className="tb-btn-cta-white"
                >
                  Locate Service Center
                </button>
                <button
                  onClick={() => navigate('/userdashboard')}
                  className="tb-btn-cta-outline"
                >
                  Open Support Ticket
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Products;