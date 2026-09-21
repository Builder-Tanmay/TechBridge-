import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Css/Cart.css";

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Get logged-in user from localStorage
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const currentUser = storedUser?.user || storedUser;
  const userId = currentUser?.id || currentUser?.userid || currentUser?.user_id;

  // 2. Fetch cart items from Spring Boot database
  const fetchCartItems = useCallback(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    fetch(`http://localhost:8080/api/cart/cartitem/${userId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch cart items from database.");
        }
        return response.json();
      })
      .then((data) => {
        setCartItems(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching cart:", err);
        setError("Could not load cart items. Please check if your backend is running.");
        setLoading(false);
      });
  }, [userId]);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  // Helper to extract dynamic available stock from product entity
  const getProductStock = (product) => {
    if (!product) return 0;
    if (product.stockQuantity !== undefined && product.stockQuantity !== null) {
      return Number(product.stockQuantity);
    }
    if (product.stock !== undefined && product.stock !== null) {
      return Number(product.stock);
    }
    if (product.availableQuantity !== undefined && product.availableQuantity !== null) {
      return Number(product.availableQuantity);
    }
    if (product.qty !== undefined && product.qty !== null) {
      return Number(product.qty);
    }
    return Infinity;
  };

  // 3. INCREASE QUANTITY (Respects dynamic available stock from database product entity)
  const increaseqty = async (item) => {
    const maxStock = getProductStock(item.product);
    const currentQty = Number(item.quantity) || 1;

    if (maxStock !== Infinity && currentQty >= maxStock) {
      return;
    }

    const newQty = currentQty + 1;
    try {
      await axios.patch(`http://localhost:8080/api/cart/patch/${item.id}`, {
        quantity: newQty,
      });

      setCartItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, quantity: newQty } : i))
      );
    } catch (err) {
      console.error("Error increasing quantity:", err);
    }
  };

  // 4. DECREASE QUANTITY (Locked at 1)
  const decreaseqty = async (item) => {
    const currentQty = Number(item.quantity) || 1;
    if (currentQty <= 1) return;

    const newQty = currentQty - 1;
    try {
      await axios.patch(`http://localhost:8080/api/cart/patch/${item.id}`, {
        quantity: newQty,
      });

      setCartItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, quantity: newQty } : i))
      );
    } catch (err) {
      console.error("Error decreasing quantity:", err);
    }
  };

  // 5. REMOVE ITEM FROM DATABASE
  const removeItem = async (cartId) => {
    if (!window.confirm("Remove this hardware component from your cart?")) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8080/api/cart/delete/${cartId}`);
      setCartItems((prev) => prev.filter((i) => i.id !== cartId));
    } catch (err) {
      console.error("Error removing item:", err);
      alert("Failed to remove item from cart.");
    }
  };

  // 6. IF USER IS NOT LOGGED IN
  if (!currentUser || !userId) {
    return (
      <div className="tb-theme-wrapper">
        <div className="tb-cart-container">
          <div className="tb-card p-5 text-center my-5">
            <div className="tb-empty-icon mb-3">
              <i className="bi bi-shield-lock text-primary display-5"></i>
            </div>
            <h3 className="fw-bold text-dark mb-2">Authentication Required</h3>
            <p className="text-muted mb-4">Please log in to your account to view your active hardware cart.</p>
            <button className="tb-btn-black" onClick={() => navigate("/login")}>
              Log In to TechBridge
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 7. LOADING & ERROR STATES
  if (loading) {
    return (
      <div className="tb-theme-wrapper d-flex justify-content-center align-items-center" style={{ minHeight: "70vh" }}>
        <div className="tb-card p-5 text-center" style={{ maxWidth: "400px" }}>
          <div className="spinner-border text-dark mb-3" role="status"></div>
          <p className="text-muted mb-0 fw-medium">Loading TechBridge Cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tb-theme-wrapper">
        <div className="tb-cart-container py-5">
          <div className="tb-card p-4 text-center border-danger-subtle">
            <i className="bi bi-exclamation-triangle-fill text-danger fs-2 d-block mb-2"></i>
            <h5 className="fw-bold text-dark">Unable to Load Cart</h5>
            <p className="text-muted small mb-0">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => {
    const price = Number(item.product?.price) || 0;
    const qty = Number(item.quantity) || 1;
    return acc + price * qty;
  }, 0);

  const deliveryFee = subtotal >= 2000 || subtotal === 0 ? 0 : 150;
  const grandTotal = subtotal + deliveryFee;

  return (
    <div className="tb-theme-wrapper">
      <div className="tb-cart-container">

        {/* ---------------- HEADER ---------------- */}
        <div className="tb-cart-header text-center mb-4">
          <span className="tb-badge-dark mb-2 d-inline-block">
            <i className="bi bi-check2-circle me-1 text-primary"></i> OEM Verified Checkout
          </span>
          <h2 className="fw-bold text-dark mb-1">
            Your Tech<span className="text-primary">Bridge</span> Cart
          </h2>
          <p className="text-muted small mb-0">
            Review and adjust your selected genuine spare parts and accessories
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="tb-card p-5 text-center my-4">
            <div className="tb-empty-icon mb-3">
              <i className="bi bi-cart-x text-muted display-4"></i>
            </div>
            <h4 className="fw-bold text-dark mb-2">Your Cart is Empty</h4>
            <p className="text-muted small mb-4">You have not added any hardware parts or laptop components yet.</p>
            <button className="tb-btn-black" onClick={() => navigate("/product")}>
              <i className="bi bi-cpu me-2"></i> Browse Hardware Catalog
            </button>
          </div>
        ) : (
          <div className="tb-cart-grid">

            {/* ---------------- ITEMS LIST ---------------- */}
            <div className="tb-cart-items-column">
              {cartItems.map((item) => {
                const part = item.product || {};
                const partName = part.partName || "Hardware Component";
                const brand = part.brand || "TechBridge";
                const price = Number(part.price) || 0;
                const quantity = Number(item.quantity) || 1;
                const image = part.img;
                const maxStock = getProductStock(part);
                const hasStockLimit = maxStock !== Infinity && maxStock > 0;
                const isMaxStockReached = hasStockLimit && quantity >= maxStock;

                return (
                  <div key={item.id} className="tb-card tb-cart-item-card p-3 mb-3">
                    <div className="d-flex align-items-center gap-3">

                      {/* Image Thumbnail */}
                      <div className="tb-item-thumb-box">
                        {image ? (
                          <img
                            src={image}
                            alt={partName}
                            className="tb-item-thumb"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=300";
                            }}
                          />
                        ) : (
                          <i className="bi bi-cpu text-secondary fs-3"></i>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-grow-1 min-w-0">
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <span className="tb-tag-brand">{brand}</span>
                          {part.modelName && (
                            <span className="text-muted extra-small">{part.modelName}</span>
                          )}
                        </div>
                        <h6 className="fw-bold text-dark text-truncate mb-1" title={partName}>
                          {partName}
                        </h6>
                        <span className="text-muted small">
                          ₹{price.toLocaleString("en-IN")} each
                        </span>
                      </div>

                      {/* Stepper */}
                      <div className="d-flex flex-column align-items-center">
                        <div className="tb-dock-stepper d-flex align-items-center">
                          <button
                            type="button"
                            className="tb-stepper-btn"
                            onClick={() => decreaseqty(item)}
                            disabled={quantity <= 1}
                            title={quantity <= 1 ? "Minimum quantity is 1" : "Decrease quantity"}
                          >
                            -
                          </button>
                          <span className="tb-stepper-value">{quantity}</span>
                          <button
                            type="button"
                            className="tb-stepper-btn"
                            onClick={() => increaseqty(item)}
                            disabled={isMaxStockReached}
                            title={
                              isMaxStockReached
                                ? `Stock limit reached (Max: ${maxStock})`
                                : "Increase quantity"
                            }
                          >
                            +
                          </button>
                        </div>
                        {isMaxStockReached && (
                          <span
                            className="text-warning extra-small mt-1 fw-semibold"
                            style={{ fontSize: "0.68rem", whiteSpace: "nowrap" }}
                          >
                            Max stock ({maxStock})
                          </span>
                        )}
                      </div>

                      {/* Subtotal & Delete */}
                      <div className="text-end" style={{ minWidth: "100px" }}>
                        <span className="fw-bold text-dark d-block">
                          ₹{(price * quantity).toLocaleString("en-IN")}
                        </span>
                        <button
                          type="button"
                          className="tb-remove-link mt-1"
                          onClick={() => removeItem(item.id)}
                          title="Remove item"
                        >
                          <i className="bi bi-trash3 me-1"></i> Remove
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>

            {/* ---------------- ORDER SUMMARY ---------------- */}
            <div className="tb-cart-summary-column">
              <div className="tb-card p-4">
                <h5 className="fw-bold text-dark mb-3">Order Summary</h5>

                <div className="d-flex justify-content-between text-muted small mb-2">
                  <span>Subtotal ({cartItems.reduce((acc, i) => acc + (Number(i.quantity) || 1), 0)} items)</span>
                  <span className="fw-bold text-dark">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>

                <div className="d-flex justify-content-between text-muted small mb-2">
                  <span>Logistics & Handling</span>
                  <span>
                    {deliveryFee === 0 ? (
                      <span className="tb-tag-success">FREE</span>
                    ) : (
                      `₹${deliveryFee}`
                    )}
                  </span>
                </div>

                {deliveryFee > 0 && (
                  <div className="tb-promo-pill mt-2 mb-3">
                    <i className="bi bi-lightning-charge-fill me-1 text-primary"></i>
                    Add <strong>₹{(2000 - subtotal).toLocaleString("en-IN")}</strong> for free dispatch.
                  </div>
                )}

                <hr className="my-3" />

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <span className="fw-bold text-dark">Grand Total</span>
                  <h4 className="fw-bold text-dark mb-0">₹{grandTotal.toLocaleString("en-IN")}</h4>
                </div>

                <button
                  type="button"
                  className="tb-btn-black w-100 py-3 d-flex align-items-center justify-content-center gap-2"
                  onClick={() => {
                    console.log("Navigating to /ordersummary...");
                    navigate("/ordersummary");
                  }}
                >
                  Proceed to Checkout <i className="bi bi-arrow-right"></i>
                </button>

                <div className="d-flex justify-content-between text-muted extra-small mt-3 pt-3 border-top">
                  <span><i className="bi bi-shield-check text-primary me-1"></i> Genuine Parts</span>
                  <span><i className="bi bi-truck text-primary me-1"></i> Express Courier</span>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default Cart;