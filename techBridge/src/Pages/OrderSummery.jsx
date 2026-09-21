import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Css/OrderSummery.css";

const OrderSummary = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Get logged-in user from localStorage
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const currentUser = storedUser?.user || storedUser;
  const userId = currentUser?.id || currentUser?.userid || currentUser?.user_id;

  const [formData, setFormData] = useState({
    fullName: currentUser?.fullName || currentUser?.fullname || "",
    phone: currentUser?.contact || "",
    email: currentUser?.email || "",
    address: currentUser?.address || "",
    city: "",
    state: "",
    pinCode: "",
    landmark: "",
    paymentMethod: "online",
  });

  // 2. Fetch cart items from Spring Boot database
  useEffect(() => {
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
        setError("Could not load cart items. Please check if your Spring Boot backend is running.");
        setLoading(false);
      });
  }, [userId]);

  // 3. Calculate totals
  const subtotal = cartItems.reduce((acc, item) => {
    const price = Number(item.product?.price) || 0;
    const qty = Number(item.quantity) || 1;
    return acc + price * qty;
  }, 0);

  const deliveryFee = subtotal >= 2000 || subtotal === 0 ? 0 : 150;
  const grandTotal = subtotal + deliveryFee;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 4. Handle Razorpay Payment Trigger & Backend Order Creation
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const amount = Math.round(grandTotal);

      const response = await fetch(
        `http://localhost:8080/gettranscation/${amount}`
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to create Razorpay order");
      }

      const data = await response.json();
      console.log("Razorpay Order:", data);

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency || "INR",
        name: "TechBridge Hardware",
        description: "Order Payment",
        order_id: data.orderId,
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone
        },
        notes: {
          address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pinCode}`
        },
        theme: {
          color: "#0f172a"
        },
        handler: async function (paymentResponse) {
          try {
            const paymentId = paymentResponse.razorpay_payment_id;

            // Trigger backend order creation from cart items
            const orderRes = await fetch(
              `http://localhost:8080/api/orders/place-order/${userId}/${paymentId}`,
              { method: "POST" }
            );

            if (!orderRes.ok) {
              const errBody = await orderRes.text();
              throw new Error(errBody || "Failed to record order in backend.");
            }

            // Notify header and components to clear/update cart count
            window.dispatchEvent(new CustomEvent("cart-change"));

            alert("Order placed and verified successfully! 📦");
            navigate("/myorders");
          } catch (err) {
            console.error("Post-payment order recording error:", err);
            alert("Payment was successful, but order recording failed: " + err.message);
            navigate("/userdashboard");
          }
        },
        modal: {
          ondismiss: function () {
            console.log("Payment popup closed");
          }
        }
      };

      if (window.Razorpay) {
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => {
          const razorpay = new window.Razorpay(options);
          razorpay.open();
        };
        document.body.appendChild(script);
      }

    } catch (error) {
      console.error("Razorpay Error:", error);
      alert("Unable to start payment.");
    }
  };

  // 5. Unauthenticated State
  if (!currentUser || !userId) {
    return (
      <div className="tb-order-wrapper">
        <div className="tb-order-container">
          <div className="tb-order-card p-5 text-center my-5">
            <div className="tb-empty-icon mb-3">
              <i className="bi bi-shield-lock text-primary display-5"></i>
            </div>
            <h3 className="fw-bold text-dark mb-2">Login Required</h3>
            <p className="text-muted mb-4">Please log in to finalize your checkout and place an order.</p>
            <button className="tb-btn-black" onClick={() => navigate("/login")}>
              Log In to TechBridge
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 6. Loading State
  if (loading) {
    return (
      <div className="tb-order-wrapper d-flex justify-content-center align-items-center" style={{ minHeight: "70vh" }}>
        <div className="tb-order-card p-5 text-center" style={{ maxWidth: "400px" }}>
          <div className="spinner-border text-dark mb-3" role="status"></div>
          <p className="text-muted mb-0 fw-medium">Preparing your order summary...</p>
        </div>
      </div>
    );
  }

  // 7. Error State
  if (error) {
    return (
      <div className="tb-order-wrapper">
        <div className="tb-order-container py-5">
          <div className="tb-order-card p-4 text-center border-danger-subtle">
            <i className="bi bi-exclamation-triangle-fill text-danger fs-2 d-block mb-2"></i>
            <h5 className="fw-bold text-dark">Unable to Load Order Summary</h5>
            <p className="text-muted small mb-0">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // 8. Empty Cart State
  if (cartItems.length === 0) {
    return (
      <div className="tb-order-wrapper">
        <div className="tb-order-container">
          <div className="tb-order-card p-5 text-center my-5">
            <div className="tb-empty-icon mb-3">
              <i className="bi bi-cart-x text-muted display-4"></i>
            </div>
            <h4 className="fw-bold text-dark mb-2">Your Cart is Empty</h4>
            <p className="text-muted small mb-4">Add spare parts to your cart before proceeding to checkout.</p>
            <button className="tb-btn-black" onClick={() => navigate("/product")}>
              <i className="bi bi-cpu me-2"></i> Browse Hardware Catalog
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tb-order-wrapper">
      <div className="tb-order-container">

        {/* Header */}
        <header className="tb-order-header text-center mb-4">
          <span className="tb-badge-dark mb-2 d-inline-block">
            <i className="bi bi-shield-check me-1 text-primary"></i> 256-Bit Encrypted Checkout
          </span>
          <h2 className="fw-bold text-dark mb-1">
            Order <span className="text-primary">Summary</span> & Checkout
          </h2>
          <p className="text-muted small mb-0">Confirm delivery address and finalize your hardware purchase</p>
        </header>

        <div className="tb-order-grid">

          {/* LEFT: SHIPPING & CONTACT FORM */}
          <form className="tb-order-form" onSubmit={handleSubmit}>

            {/* Contact Details */}
            <div className="tb-order-card p-4 mb-4">
              <h5 className="fw-bold text-dark mb-3">
                <i className="bi bi-person-lines-fill me-2 text-primary"></i> Contact Information
              </h5>

              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  className="form-control"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter full recipient name"
                  required
                />
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted">Mobile Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-control"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10-digit phone number"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="tb-order-card p-4 mb-4">
              <h5 className="fw-bold text-dark mb-3">
                <i className="bi bi-geo-alt-fill me-2 text-primary"></i> Shipping Destination
              </h5>

              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">Street Address / Flat / Building *</label>
                <textarea
                  name="address"
                  className="form-control"
                  rows="2"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="House no., Building, Street area"
                  required
                />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted">City *</label>
                  <input
                    type="text"
                    name="city"
                    className="form-control"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Mumbai"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted">State *</label>
                  <input
                    type="text"
                    name="state"
                    className="form-control"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="e.g. Maharashtra"
                    required
                  />
                </div>
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted">PIN Code *</label>
                  <input
                    type="text"
                    name="pinCode"
                    className="form-control"
                    value={formData.pinCode}
                    onChange={handleChange}
                    placeholder="6-digit postal code"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted">Landmark (Optional)</label>
                  <input
                    type="text"
                    name="landmark"
                    className="form-control"
                    value={formData.landmark}
                    onChange={handleChange}
                    placeholder="Nearby landmark or building"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="d-flex gap-3">
              <button
                type="button"
                className="btn btn-outline-dark rounded-pill px-4 py-2 fw-semibold"
                onClick={() => navigate("/cart")}
              >
                &larr; Back to Cart
              </button>
              <button
                type="submit"
                className="tb-btn-black flex-grow-1 py-2 fw-semibold"
              >
                Pay & Confirm Order (₹{grandTotal.toLocaleString("en-IN")})
              </button>
            </div>

          </form>

          {/* RIGHT: ORDER DETAILS CARD */}
          <div className="tb-order-summary-sidebar">
            <div className="tb-order-card p-4">
              <h5 className="fw-bold text-dark mb-3">Order Items ({cartItems.length})</h5>

              {/* Items Scroll Area */}
              <div className="tb-order-items-scroll">
                {cartItems.map((item) => {
                  const part = item.product || {};
                  const partName = part.partName || "Hardware Part";
                  const price = Number(part.price) || 0;
                  const quantity = Number(item.quantity) || 1;
                  const image = part.img;

                  return (
                    <div className="tb-order-item-row" key={item.id}>
                      <div className="tb-order-item-thumb">
                        {image ? (
                          <img
                            src={image}
                            alt={partName}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=300";
                            }}
                          />
                        ) : (
                          <i className="bi bi-cpu text-secondary"></i>
                        )}
                      </div>

                      <div className="flex-grow-1 min-w-0">
                        <p className="tb-order-item-title mb-0" title={partName}>{partName}</p>
                        <small className="text-muted">Qty: {quantity} &times; ₹{price.toLocaleString("en-IN")}</small>
                      </div>

                      <div className="text-end fw-bold text-dark">
                        ₹{(price * quantity).toLocaleString("en-IN")}
                      </div>
                    </div>
                  );
                })}
              </div>

              <hr className="my-3" />

              <div className="d-flex justify-content-between text-muted small mb-2">
                <span>Items Subtotal</span>
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

              <div className="d-flex justify-content-between text-muted small mb-3">
                <span>Warranty & Insurance</span>
                <span className="text-success fw-bold">Included</span>
              </div>

              <hr className="my-3" />

              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="fw-bold text-dark">Total Payable</span>
                <h4 className="fw-bold text-dark mb-0">₹{grandTotal.toLocaleString("en-IN")}</h4>
              </div>

              <div className="tb-trust-note text-center p-2 rounded-3 bg-light text-muted extra-small">
                <i className="bi bi-lock-fill text-dark me-1"></i> Secured via Razorpay Payment Gateway
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default OrderSummary;