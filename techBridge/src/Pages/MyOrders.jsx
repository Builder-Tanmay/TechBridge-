import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
    Package,
    Calendar,
    CreditCard,
    ShoppingBag,
    Eye,
    X,
    ShieldCheck,
    Truck,
    PackageCheck,
    CheckCircle2
} from 'lucide-react';
import '../Css/Myorders.css';
import heroBg from '../assets/hero-banner.png';

const MyOrders = () => {
    const [user, setUser] = useState(null);
    const [rawOrders, setRawOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const getFullImageUrl = (imageSrc) => {
        if (!imageSrc) return 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=100';
        if (imageSrc.startsWith('http://') || imageSrc.startsWith('https://') || imageSrc.startsWith('data:')) {
            return imageSrc;
        }
        const cleanPath = imageSrc.startsWith('/') ? imageSrc.substring(1) : imageSrc;
        return `http://localhost:8080/${cleanPath}`;
    };

    const fetchOrders = async (userId) => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:8080/api/orders/user/${userId}`);
            if (Array.isArray(response.data)) {
                setRawOrders(response.data);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                const currentUser = parsed.user || parsed;
                setUser(currentUser);
                const userId = currentUser.id || currentUser.userid || currentUser.user_id;
                if (userId) {
                    fetchOrders(userId);
                } else {
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error parsing session user:', error);
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }, []);

    // Group flat items by payment transaction
    const groupedOrders = useMemo(() => {
        if (!Array.isArray(rawOrders) || rawOrders.length === 0) return [];

        const groups = {};

        rawOrders.forEach((item) => {
            const groupKey = item.paymentId && item.paymentId !== 'N/A' ? item.paymentId : `order-${item.id}`;

            if (!groups[groupKey]) {
                groups[groupKey] = {
                    orderId: item.id,
                    paymentId: item.paymentId,
                    orderDate: item.orderDate,
                    orderStatus: item.orderStatus || 'PLACED',
                    paymentStatus: item.paymentStatus || 'SUCCESS',
                    totalAmount: 0,
                    items: []
                };
            }

            const itemPrice = Number(item.price || 0);
            const itemQty = Number(item.quantity || 1);
            const itemTotal = Number(item.totalAmount || (itemPrice * itemQty));

            groups[groupKey].items.push({
                id: item.id,
                name: item.productName || item.name || 'OEM Hardware Part',
                image: item.productImage || item.img || item.image,
                price: itemPrice,
                quantity: itemQty,
                itemTotal: itemTotal
            });

            groups[groupKey].totalAmount += itemTotal;
        });

        return Object.values(groups);
    }, [rawOrders]);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'DELIVERED':
                return <span className="tb-tag success">Delivered</span>;
            case 'SHIPPED':
            case 'DISPATCHED':
                return <span className="tb-tag warning">{status}</span>;
            case 'CANCELLED':
                return <span className="tb-tag danger">Cancelled</span>;
            default:
                return <span className="tb-tag secondary">{status || 'Processing'}</span>;
        }
    };

    return (
        <div className="tb-orders-canvas">

            {/* 1. HERO BANNER (~60VH) */}
            <section
                className="tb-orders-hero"
                style={{ backgroundImage: `url(${heroBg})` }}
            >
                <div className="container position-relative z-2">
                    <div className="row align-items-center">
                        <div className="col-lg-8 col-xl-7">
                            <div className="tb-orders-pill">
                                <span className="tb-orders-dot"></span>
                                <span>VERIFIED OEM HARDWARE SHIPMENTS</span>
                            </div>
                            <h1 className="tb-orders-hero-title">
                                Component Orders & <br />
                                <span className="tb-gradient-title">Fulfillment Telemetry.</span>
                            </h1>
                            <p className="tb-orders-hero-subtext">
                                Track dispatched packages, inspect serial-verified hardware bills, and access ESD-safe replacement warranties.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. ORDERS LISTING SECTION */}
            <section className="tb-content-section tb-section-contrast">
                <div className="container">

                    <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                        <div>
                            <h4 className="fw-bold text-dark font-grotesk mb-1">Purchase & Fulfillment History</h4>
                            <p className="text-muted extra-small mb-0">Showing verified transaction records linked to your account.</p>
                        </div>
                        <span className="tb-orders-count-badge">
                            {groupedOrders.length} Order{groupedOrders.length !== 1 ? 's' : ''} Found
                        </span>
                    </div>

                    {loading ? (
                        <div className="text-center py-5 tb-orders-card">
                            <div className="spinner-border spinner-border-sm text-primary mb-3" role="status" />
                            <p className="text-muted small mb-0 fw-semibold">Fetching telemetry records...</p>
                        </div>
                    ) : !user ? (
                        <div className="text-center py-5 tb-orders-card p-5">
                            <ShoppingBag size={52} className="text-muted mb-3 opacity-50" />
                            <h5 className="font-grotesk fw-bold text-dark mb-2">Sign In Required</h5>
                            <p className="text-muted small mb-4">Please log in to view your hardware shipments and order details.</p>
                            <Link to="/login" className="btn tb-btn-dark rounded-pill px-4 py-2">
                                Sign In to TechBridge
                            </Link>
                        </div>
                    ) : groupedOrders.length === 0 ? (
                        <div className="text-center py-5 tb-orders-card p-5">
                            <Package size={54} className="text-muted mb-3 opacity-50" />
                            <h5 className="font-grotesk fw-bold text-dark mb-2">No Orders Found</h5>
                            <p className="text-muted small mb-4">You haven't ordered any OEM laptop components or diagnostic toolkits yet.</p>
                            <Link to="/products" className="btn tb-btn-dark rounded-pill px-4 py-2">
                                Browse Genuine Spare Parts
                            </Link>
                        </div>
                    ) : (
                        <div className="d-flex flex-column gap-3">
                            {groupedOrders.map((order, idx) => (
                                <div className="tb-orders-card p-4" key={order.paymentId || idx}>

                                    {/* Top Bar */}
                                    <div className="d-flex justify-content-between align-items-start mb-3 flex-wrap gap-2 pb-3 border-bottom border-light">
                                        <div>
                                            <div className="d-flex align-items-center gap-2 mb-1">
                                                <span className="fw-bold text-dark font-monospace small">#ORD-{order.orderId}</span>
                                                {getStatusBadge(order.orderStatus)}
                                                <span className="badge bg-light text-secondary border extra-small">
                                                    {order.items.length} {order.items.length === 1 ? 'Part' : 'Parts'}
                                                </span>
                                            </div>
                                            <span className="extra-small text-muted d-flex align-items-center gap-1">
                                                <Calendar size={13} />
                                                {order.orderDate
                                                    ? new Date(order.orderDate).toLocaleDateString('en-IN', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })
                                                    : 'Recent'}
                                            </span>
                                        </div>

                                        <div className="text-md-end">
                                            <span className="extra-small text-muted d-block">Grand Total</span>
                                            <strong className="fs-6 fw-bold text-dark">
                                                ₹{order.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                            </strong>
                                        </div>
                                    </div>

                                    {/* Part Item Thumbnails & Action */}
                                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
                                        <div className="d-flex align-items-center gap-2">
                                            {order.items.slice(0, 4).map((item, i) => (
                                                <div key={i} className="tb-order-thumb-wrap" title={item.name}>
                                                    <img
                                                        src={getFullImageUrl(item.image)}
                                                        alt={item.name}
                                                        className="tb-order-thumb"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=100';
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                            {order.items.length > 4 && (
                                                <span className="tb-order-more-badge">
                                                    +{order.items.length - 4}
                                                </span>
                                            )}
                                        </div>

                                        <button
                                            className="btn tb-btn-outline-dark btn-sm rounded-pill px-3 py-1.5 d-flex align-items-center gap-1.5"
                                            onClick={() => setSelectedOrder(order)}
                                        >
                                            <Eye size={14} />
                                            <span>Inspect Telemetry & Receipt</span>
                                        </button>
                                    </div>

                                    {/* Shipment Pipeline Tracker */}
                                    <div className="tb-pipeline-box p-3 rounded-3">
                                        <div className="row text-center extra-small fw-semibold g-2">
                                            <div className="col text-dark">
                                                <PackageCheck size={14} className="text-success me-1 inline-icon" /> Order Placed
                                            </div>
                                            <div className={`col ${order.orderStatus === 'SHIPPED' || order.orderStatus === 'DELIVERED' ? 'text-dark' : 'text-muted'}`}>
                                                <Truck size={14} className={`me-1 inline-icon ${order.orderStatus === 'SHIPPED' ? 'text-warning' : ''}`} />
                                                Dispatched & Shipped
                                            </div>
                                            <div className={`col ${order.orderStatus === 'DELIVERED' ? 'text-dark' : 'text-muted'}`}>
                                                <ShieldCheck size={14} className={`me-1 inline-icon ${order.orderStatus === 'DELIVERED' ? 'text-success' : ''}`} />
                                                Delivered
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            ))}
                        </div>
                    )}

                </div>
            </section>

            {/* 3. MODAL POPUP: DETAILED BILL & SERIAL BREAKDOWN */}
            {selectedOrder && (
                <div className="tb-modal-backdrop" onClick={() => setSelectedOrder(null)}>
                    <div className="tb-order-modal-dialog" onClick={(e) => e.stopPropagation()}>

                        {/* Modal Header */}
                        <div className="d-flex justify-content-between align-items-center p-4 border-bottom">
                            <div>
                                <h5 className="fw-bold font-grotesk mb-0 text-dark">Order Telemetry Breakdown</h5>
                                <span className="extra-small text-muted">
                                    Transaction #{selectedOrder.orderId} &bull; {selectedOrder.items.length} Product(s)
                                </span>
                            </div>
                            <button
                                className="btn btn-light rounded-circle p-1"
                                onClick={() => setSelectedOrder(null)}
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-4" style={{ overflowY: 'auto', maxHeight: '68vh' }}>
                            <h6 className="extra-small fw-bold text-uppercase text-muted mb-3 tracking-wider">
                                Manifest Items
                            </h6>

                            <div className="d-flex flex-column gap-2 mb-4">
                                {selectedOrder.items.map((item, idx) => (
                                    <div key={idx} className="d-flex align-items-center justify-content-between p-2.5 rounded-2 bg-light border border-slate-100">
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="tb-order-thumb-wrap">
                                                <img
                                                    src={getFullImageUrl(item.image)}
                                                    alt={item.name}
                                                    className="tb-order-thumb"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=100';
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <h6 className="mb-0 extra-small fw-bold text-dark">{item.name}</h6>
                                                <span className="extra-small text-muted">
                                                    Qty: {item.quantity} &times; ₹{item.price.toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                        <span className="extra-small fw-bold text-dark">
                                            ₹{item.itemTotal.toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Payment Summary Box */}
                            <div className="p-3 rounded-3 bg-light border">
                                <div className="d-flex align-items-center gap-1.5 mb-2 font-grotesk fw-bold small text-dark">
                                    <CreditCard size={16} className="text-primary" />
                                    <span>Razorpay Payment Summary</span>
                                </div>
                                <div className="d-flex justify-content-between extra-small mb-1 text-muted">
                                    <span>Verification Status</span>
                                    <span className="text-success fw-bold">{selectedOrder.paymentStatus}</span>
                                </div>
                                <div className="d-flex justify-content-between extra-small mb-1 text-muted">
                                    <span>Razorpay Payment ID</span>
                                    <span className="font-monospace text-dark fw-bold">{selectedOrder.paymentId || 'N/A'}</span>
                                </div>
                                <hr className="my-2" />
                                <div className="d-flex justify-content-between fw-bold text-dark small">
                                    <span>Total Amount Paid</span>
                                    <span className="text-primary fs-6">₹{selectedOrder.totalAmount.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-3 border-top text-end bg-light">
                            <button
                                className="btn tb-btn-dark btn-sm rounded-pill px-4"
                                onClick={() => setSelectedOrder(null)}
                            >
                                Done
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
};

export default MyOrders;