import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Wrench,
  Clock,
  Calendar,
  Cpu,
  CheckCircle2,
  AlertCircle,
  RotateCw,
  Heart,
  Ticket,
  Laptop,
  Plus,
  ShieldAlert,
  ShoppingBag,
  PackageCheck,
  Truck,
  Package
} from 'lucide-react';
import '../Css/UserDashboard.css';
import CreateTicketModal from './CreateTicketModal';

import heroBg from '../assets/hero-banner.png';

const UserDashboard = ({ userId }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [services, setServices] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('tickets');

  // Modals state
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [serviceForm, setServiceForm] = useState({ deviceModel: '', issueDescription: '' });
  const [serviceSubmitting, setServiceSubmitting] = useState(false);

  const getStoredUser = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        return parsed?.user || parsed;
      } catch (e) {
        console.error("Error parsing user object from localStorage", e);
      }
    }
    return null;
  };

  const storedUserObj = getStoredUser();
  const currentUserId = userId || storedUserObj?.id || storedUserObj?.userid || storedUserObj?.user_id;

  const fetchDashboardData = useCallback(async () => {
    if (!currentUserId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [userRes, dashboardRes, ticketsRes, ordersRes] = await Promise.all([
        fetch(`http://localhost:8080/api/user/getby/${currentUserId}`),
        fetch(`http://localhost:8080/api/user/dashboard/${currentUserId}`),
        fetch(`http://localhost:8080/api/tickets/user/${currentUserId}`),
        fetch(`http://localhost:8080/api/orders/user/${currentUserId}`).catch(() => null)
      ]);

      if (!userRes.ok) throw new Error(`User API status: ${userRes.status}`);

      const userDataJson = await userRes.json();
      setUserData(userDataJson);

      if (dashboardRes.ok) {
        const dashboardJson = await dashboardRes.json();
        setServices(dashboardJson.recentServices || []);
        if (dashboardJson.recentOrders && (!ordersRes || !ordersRes.ok)) {
          setOrders(dashboardJson.recentOrders);
        }
      }

      if (ticketsRes.ok) {
        const ticketsJson = await ticketsRes.json();
        setTickets(ticketsJson || []);
      }

      if (ordersRes && ordersRes.ok) {
        const ordersJson = await ordersRes.json();
        setOrders(Array.isArray(ordersJson) ? ordersJson : []);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    if (!serviceForm.deviceModel.trim() || !serviceForm.issueDescription.trim()) return;

    setServiceSubmitting(true);
    try {
      const res = await fetch(`http://localhost:8080/api/user/dashboard/${currentUserId}/book-service`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceForm)
      });
      if (!res.ok) throw new Error('Failed to book service.');

      setServiceForm({ deviceModel: '', issueDescription: '' });
      setIsServiceModalOpen(false);
      fetchDashboardData();
    } catch (err) {
      alert(err.message || 'Error booking service.');
    } finally {
      setServiceSubmitting(false);
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'URGENT':
      case 'HIGH':
        return <span className="tb-badge-danger">{priority}</span>;
      case 'MEDIUM':
        return <span className="tb-badge-warning">MEDIUM</span>;
      default:
        return <span className="tb-badge-secondary">LOW</span>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'DELIVERED':
      case 'RESOLVED':
      case 'COMPLETED':
        return <span className="tb-tag success">{status}</span>;
      case 'SHIPPED':
      case 'IN_PROGRESS':
        return <span className="tb-tag warning">{status === 'SHIPPED' ? 'Shipped' : 'In Progress'}</span>;
      case 'CANCELLED':
      case 'CLOSED':
        return <span className="tb-tag danger">{status}</span>;
      default:
        return <span className="tb-tag secondary">{status || 'Processing'}</span>;
    }
  };

  if (!storedUserObj || !currentUserId) {
    return (
      <div className="tb-dash-canvas">
        <div className="container py-5 mt-5">
          <div className="tb-dash-card p-5 text-center my-4 mx-auto" style={{ maxWidth: '520px' }}>
            <div className="tb-icon-circle mx-auto mb-3">
              <ShieldAlert size={32} className="text-primary" />
            </div>
            <h3 className="fw-bold text-dark mb-2 font-grotesk">Sign In Required</h3>
            <p className="text-muted small mb-4">Please log in to view your repairs, orders, support tickets, and service history.</p>
            <button className="btn tb-btn-dark rounded-pill px-4 py-2" onClick={() => navigate("/login")}>
              Log In to TechBridge
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="tb-dash-canvas d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <div className="tb-dash-card p-5 text-center" style={{ maxWidth: '380px' }}>
          <div className="spinner-border spinner-border-sm text-primary mb-3" role="status"></div>
          <p className="text-muted mb-0 small fw-semibold">Synchronizing Dashboard Telemetry...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tb-dash-canvas">
        <div className="container py-5 mt-5">
          <div className="tb-dash-card p-5 text-center border-danger-subtle mx-auto" style={{ maxWidth: '520px' }}>
            <AlertCircle size={36} className="text-danger mb-2" />
            <h5 className="fw-bold text-dark font-grotesk">Unable to Load Dashboard</h5>
            <p className="text-muted small mb-4">{error}</p>
            <button onClick={fetchDashboardData} className="btn tb-btn-dark btn-sm rounded-pill px-4">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tb-dash-canvas">

      {/* 1. HERO BANNER */}
      <section
        className="tb-dash-hero"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="container position-relative z-2">
          <div className="row align-items-center">
            <div className="col-lg-8 col-xl-7">
              <div className="tb-dash-pill">
                <span className="tb-dash-dot"></span>
                <span>CENTRAL HARDWARE DASHBOARD & TELEMETRY</span>
              </div>
              <h1 className="tb-dash-hero-title">
                Manage Repairs & <br />
                <span className="tb-gradient-title">Hardware Telemetry.</span>
              </h1>
              <p className="tb-dash-hero-subtext">
                Real-time tracking of cleanroom diagnostics, OEM component orders, warranty coverage, and active technician support tickets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN CONTENT */}
      <section className="tb-content-section tb-section-contrast">
        <div className="container">

          {/* 2.1 USER PROFILE CARD */}
          <div className="tb-dash-card tb-profile-card mb-4">
            <div className="tb-profile-inner">
              <div className="tb-profile-left">
                <div className="tb-dash-avatar">
                  {userData?.fullName ? userData.fullName.charAt(0).toUpperCase() : (userData?.fullname ? userData.fullname.charAt(0).toUpperCase() : 'U')}
                </div>
                <div className="tb-profile-meta">
                  <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                    <h4 className="fw-bold text-dark mb-0 font-grotesk">
                      {userData?.fullName || userData?.fullname || 'User Profile'}
                    </h4>
                    <span className="tb-dash-role-badge">
                      {userData?.role || 'User'}
                    </span>
                  </div>

                  <div className="tb-profile-details">
                    <span className="tb-profile-item">
                      <Mail size={13} className="text-muted" />
                      <span>{userData?.email}</span>
                    </span>
                    {userData?.contact && (
                      <span className="tb-profile-item">
                        <Phone size={13} className="text-muted" />
                        <span>+91 {userData.contact}</span>
                      </span>
                    )}
                    {userData?.gender && (
                      <span className="tb-profile-item">
                        <User size={13} className="text-muted" />
                        <span>{userData.gender}</span>
                      </span>
                    )}
                    {userData?.address && (
                      <span className="tb-profile-item">
                        <MapPin size={13} className="text-muted" />
                        <span>{userData.address}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="tb-profile-right">
                <span className={`tb-status-pill ${userData?.active ? 'active' : 'inactive'}`}>
                  ● {userData?.active ? 'Active Account' : 'Inactive'}
                </span>
                <button
                  onClick={fetchDashboardData}
                  className="btn tb-btn-refresh"
                  title="Refresh Telemetry"
                >
                  <RotateCw size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* 2.2 PREDICTIVE SERVICE BANNER (FIXED HORIZONTAL / FLEX WIDTHS) */}
          <div className="tb-dash-card tb-reminder-card mb-4">
            <div className="tb-reminder-inner">

              <div className="tb-reminder-left">
                <div className="tb-reminder-thumb">
                  <img
                    src="https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=400&q=80"
                    alt="Thermal Maintenance"
                  />
                </div>

                <div className="tb-reminder-content">
                  <div className="d-flex align-items-center gap-2 mb-1.5 flex-wrap">
                    <span className="tb-tag warning">
                      <Cpu size={12} className="me-1 inline-icon" /> Thermal Telemetry
                    </span>
                    <span className="extra-small text-muted fw-semibold">
                      Recommended Every 6 Months
                    </span>
                  </div>
                  <h5 className="fw-bold text-dark mb-1 font-grotesk fs-6">
                    Predictive Service & Thermal Overhaul
                  </h5>
                  <p className="text-muted extra-small mb-0 lh-base">
                    Eliminate thermal throttling and prolong chipset life with cleanroom micro-dust extraction, heatsink ultrasonic cleaning, and fresh Arctic-grade compound application.
                  </p>
                </div>
              </div>

              <div className="tb-reminder-action">
                <button
                  onClick={() => {
                    setServiceForm({
                      deviceModel: 'Laptop',
                      issueDescription: 'Routine Thermal Pasting & Internal Fan Dust Cleaning'
                    });
                    setIsServiceModalOpen(true);
                  }}
                  className="btn tb-btn-dark rounded-pill px-4 py-2 font-grotesk fw-semibold d-inline-flex align-items-center justify-content-center gap-2 text-nowrap"
                >
                  <Calendar size={14} />
                  <span>Schedule Checkup</span>
                </button>
              </div>

            </div>
          </div>

          {/* 2.3 NAVIGATION TABS DOCK */}
          <div className="d-flex justify-content-center mb-4">
            <div className="tb-tab-dock p-1.5 d-flex gap-1.5">
              <button
                className={`tb-dock-btn ${activeTab === 'tickets' ? 'active' : ''}`}
                onClick={() => setActiveTab('tickets')}
              >
                <Ticket size={15} className="me-1.5" />
                Support Tickets ({tickets.length})
              </button>
              <button
                className={`tb-dock-btn ${activeTab === 'services' ? 'active' : ''}`}
                onClick={() => setActiveTab('services')}
              >
                <Wrench size={15} className="me-1.5" />
                Service Requests ({services.length})
              </button>
              <button
                className={`tb-dock-btn ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
              >
                <ShoppingBag size={15} className="me-1.5" />
                My Orders ({orders.length})
              </button>
              <button
                className="tb-dock-btn"
                onClick={() => navigate('/wishlist')}
              >
                <Heart size={15} className="me-1.5 text-danger" />
                My Wishlist
              </button>
            </div>
          </div>

          {/* 2.4 TAB CONTENTS */}

          {/* TAB 1: SUPPORT TICKETS */}
          {activeTab === 'tickets' && (
            <div className="row g-3">
              <div className="col-12 d-flex justify-content-between align-items-center mb-1">
                <h5 className="fw-bold text-dark mb-0 font-grotesk">Your Support Tickets</h5>
                <button
                  onClick={() => setIsTicketModalOpen(true)}
                  className="btn tb-btn-dark btn-sm rounded-pill px-3 py-1.5 d-flex align-items-center gap-1.5"
                >
                  <Plus size={15} /> Raise New Ticket
                </button>
              </div>

              {tickets.length > 0 ? (
                tickets.map((t) => (
                  <div key={t.id} className="col-12">
                    <div className="tb-dash-card p-4">
                      <div className="d-flex justify-content-between align-items-start mb-2 flex-wrap gap-2">
                        <div className="d-flex align-items-center gap-2">
                          <span className="fw-bold text-dark font-monospace small">#TCK-{t.id}</span>
                          {getStatusBadge(t.status)}
                          {getPriorityBadge(t.priority)}
                        </div>
                        <span className="extra-small text-muted d-flex align-items-center gap-1">
                          <Clock size={13} />
                          {t.createdAt ? new Date(t.createdAt).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          }) : 'Recent'}
                        </span>
                      </div>

                      <h6 className="fw-bold text-dark mb-1 font-grotesk fs-6">{t.subject}</h6>
                      <p className="text-muted small mb-3">{t.description}</p>

                      <div className="tb-pipeline-box p-3 rounded-3">
                        <div className="row text-center extra-small fw-semibold g-2">
                          <div className="col text-dark">
                            <CheckCircle2 size={14} className="text-success me-1 inline-icon" /> Ticket Opened
                          </div>
                          <div className={`col ${t.status === 'IN_PROGRESS' || t.status === 'RESOLVED' || t.status === 'CLOSED' ? 'text-dark' : 'text-muted'}`}>
                            <RotateCw size={14} className={`me-1 inline-icon ${t.status === 'IN_PROGRESS' ? 'text-warning' : ''}`} />
                            Under Review
                          </div>
                          <div className={`col ${t.status === 'RESOLVED' || t.status === 'CLOSED' ? 'text-dark' : 'text-muted'}`}>
                            <ShieldCheck size={14} className={`me-1 inline-icon ${t.status === 'RESOLVED' ? 'text-success' : ''}`} />
                            Resolved
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12 text-center p-5 tb-dash-card">
                  <Ticket size={36} className="text-muted opacity-40 mb-2" />
                  <p className="text-muted small mb-3">You haven't opened any support tickets yet.</p>
                  <button
                    onClick={() => setIsTicketModalOpen(true)}
                    className="btn tb-btn-dark btn-sm rounded-pill px-4 py-2"
                  >
                    Raise Support Ticket
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: LIVE REPAIR REQUESTS */}
          {activeTab === 'services' && (
            <div className="row g-3">
              <div className="col-12 d-flex justify-content-between align-items-center mb-1">
                <h5 className="fw-bold text-dark mb-0 font-grotesk">Laptop Repair & Diagnostics History</h5>
                <button
                  onClick={() => {
                    setServiceForm({ deviceModel: '', issueDescription: '' });
                    setIsServiceModalOpen(true);
                  }}
                  className="btn tb-btn-dark btn-sm rounded-pill px-3 py-1.5 d-flex align-items-center gap-1.5"
                >
                  <Plus size={15} /> Book Service
                </button>
              </div>

              {services.length > 0 ? (
                services.map((req) => (
                  <div key={req.id} className="col-12">
                    <div className="tb-dash-card p-4">
                      <div className="d-flex justify-content-between align-items-start mb-2 flex-wrap gap-2">
                        <div className="d-flex align-items-center gap-2">
                          <span className="fw-bold text-dark font-monospace small">#REQ-{req.id}</span>
                          {getStatusBadge(req.status)}
                        </div>
                        <span className="extra-small text-muted d-flex align-items-center gap-1">
                          <Clock size={13} />
                          {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : 'Recent'}
                        </span>
                      </div>

                      <h6 className="fw-bold text-dark mb-1 font-grotesk fs-6">{req.deviceModel}</h6>
                      <p className="text-muted small mb-3">{req.issueDescription}</p>

                      <div className="tb-pipeline-box p-3 rounded-3">
                        <div className="row text-center extra-small fw-semibold g-2">
                          <div className="col text-dark">
                            <CheckCircle2 size={14} className="text-success me-1 inline-icon" /> Received
                          </div>
                          <div className={`col ${req.status === 'IN_PROGRESS' || req.status === 'COMPLETED' ? 'text-dark' : 'text-muted'}`}>
                            <Wrench size={14} className={`me-1 inline-icon ${req.status === 'IN_PROGRESS' ? 'text-warning' : ''}`} />
                            In Service
                          </div>
                          <div className={`col ${req.status === 'COMPLETED' ? 'text-dark' : 'text-muted'}`}>
                            <ShieldCheck size={14} className={`me-1 inline-icon ${req.status === 'COMPLETED' ? 'text-success' : ''}`} />
                            Completed
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12 text-center p-5 tb-dash-card">
                  <Laptop size={36} className="text-muted opacity-40 mb-2" />
                  <p className="text-muted small mb-3">No laptop service requests found.</p>
                  <button
                    onClick={() => setIsServiceModalOpen(true)}
                    className="btn tb-btn-dark btn-sm rounded-pill px-4 py-2"
                  >
                    Book Your First Repair
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: MY ORDERS */}
          {activeTab === 'orders' && (
            <div className="row g-3">
              <div className="col-12 d-flex justify-content-between align-items-center mb-1">
                <h5 className="fw-bold text-dark mb-0 font-grotesk">Purchased Spare Parts & Hardware Orders</h5>
                <button
                  onClick={() => navigate('/products')}
                  className="btn tb-btn-dark btn-sm rounded-pill px-3 py-1.5 d-flex align-items-center gap-1.5"
                >
                  <Plus size={15} /> Order New Components
                </button>
              </div>

              {orders.length > 0 ? (
                orders.map((order) => {
                  const orderItems = order.items || order.orderItems || order.products || [];
                  const orderTotal = Number(order.totalAmount || order.price || order.totalPrice || 0);

                  return (
                    <div key={order.id} className="col-12">
                      <div className="tb-dash-card p-4">
                        <div className="d-flex justify-content-between align-items-start mb-3 flex-wrap gap-2 pb-2.5 border-bottom border-light">
                          <div>
                            <div className="d-flex align-items-center gap-2 mb-1">
                              <span className="fw-bold text-dark font-monospace small">#ORD-{order.id}</span>
                              {getStatusBadge(order.status || 'PROCESSING')}
                            </div>
                            <span className="extra-small text-muted">
                              Placed on: {order.orderDate || order.createdAt ? new Date(order.orderDate || order.createdAt).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              }) : 'Recent'}
                            </span>
                          </div>

                          <div className="text-md-end">
                            <span className="extra-small text-muted d-block">Grand Total</span>
                            <strong className="fs-6 fw-bold text-dark">
                              ₹{orderTotal.toLocaleString('en-IN')}
                            </strong>
                          </div>
                        </div>

                        <div className="d-flex flex-column gap-2 mb-3">
                          {orderItems.length > 0 ? (
                            orderItems.map((item, idx) => (
                              <div key={idx} className="d-flex align-items-center justify-content-between p-2 rounded-2 bg-light border border-slate-100">
                                <div className="d-flex align-items-center gap-2.5">
                                  <div className="tb-order-thumb-wrap">
                                    <img
                                      src={item.img || item.product?.img || "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=100"}
                                      alt={item.partName || item.product?.partName || "Part"}
                                      className="tb-order-thumb"
                                      onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=100";
                                      }}
                                    />
                                  </div>
                                  <div>
                                    <h6 className="mb-0 extra-small fw-bold text-dark">
                                      {item.partName || item.product?.partName || item.name || "OEM Hardware Part"}
                                    </h6>
                                    <span className="extra-small text-muted">
                                      Qty: {item.quantity || 1} &bull; Warranty: 90 Days
                                    </span>
                                  </div>
                                </div>
                                <span className="extra-small fw-bold text-dark">
                                  ₹{Number(item.price || item.product?.price || 0).toLocaleString('en-IN')}
                                </span>
                              </div>
                            ))
                          ) : (
                            <div className="p-2.5 rounded-2 bg-light border border-slate-100 extra-small text-muted d-flex align-items-center gap-2">
                              <Package size={16} className="text-secondary flex-shrink-0" />
                              <span>{order.partName || order.description || "Model-matched genuine hardware replacement pack"}</span>
                            </div>
                          )}
                        </div>

                        <div className="tb-pipeline-box p-3 rounded-3">
                          <div className="row text-center extra-small fw-semibold g-2">
                            <div className="col text-dark">
                              <PackageCheck size={14} className="text-success me-1 inline-icon" /> Order Placed
                            </div>
                            <div className={`col ${order.status === 'SHIPPED' || order.status === 'DELIVERED' || order.status === 'COMPLETED' ? 'text-dark' : 'text-muted'}`}>
                              <Truck size={14} className={`me-1 inline-icon ${order.status === 'SHIPPED' ? 'text-warning' : ''}`} />
                              Dispatched & Shipped
                            </div>
                            <div className={`col ${order.status === 'DELIVERED' || order.status === 'COMPLETED' ? 'text-dark' : 'text-muted'}`}>
                              <ShieldCheck size={14} className={`me-1 inline-icon ${order.status === 'DELIVERED' ? 'text-success' : ''}`} />
                              Delivered
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-12 text-center p-5 tb-dash-card">
                  <ShoppingBag size={36} className="text-muted opacity-40 mb-2" />
                  <p className="text-muted small mb-3">You haven't placed any hardware or spare parts orders yet.</p>
                  <button
                    onClick={() => navigate('/products')}
                    className="btn tb-btn-dark btn-sm rounded-pill px-4 py-2"
                  >
                    Browse Spare Parts Catalog
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </section>

      {/* 3. MODALS */}
      <CreateTicketModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        userId={currentUserId}
        onTicketCreated={fetchDashboardData}
      />

      {isServiceModalOpen && (
        <div className="modal show d-block tb-modal-backdrop" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content tb-dash-modal border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-dark text-white px-4 py-3">
                <h5 className="modal-title fw-bold fs-6 font-grotesk">
                  Book Laptop Repair Service
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setIsServiceModalOpen(false)}></button>
              </div>
              <form onSubmit={handleServiceSubmit}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="tb-modal-label">Device Model *</label>
                    <input
                      type="text"
                      className="form-control tb-dash-input"
                      placeholder="e.g. Dell Inspiron 15 / Asus TUF Gaming"
                      value={serviceForm.deviceModel}
                      onChange={(e) => setServiceForm({ ...serviceForm, deviceModel: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="tb-modal-label">Issue Description or Service Type *</label>
                    <textarea
                      className="form-control tb-dash-input"
                      rows="4"
                      placeholder="Describe symptoms, thermal paste preference, liquid spill timeline..."
                      value={serviceForm.issueDescription}
                      onChange={(e) => setServiceForm({ ...serviceForm, issueDescription: e.target.value })}
                      required
                    ></textarea>
                  </div>
                  <div className="p-2.5 rounded-3 bg-light border extra-small text-muted">
                    <ShieldCheck size={14} className="text-primary me-1 inline-icon" /> An automated service tracking confirmation will be dispatched upon scheduling.
                  </div>
                </div>
                <div className="modal-footer bg-light px-4 py-3 border-top">
                  <button type="button" className="btn btn-light btn-sm rounded-pill px-3 border" onClick={() => setIsServiceModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" disabled={serviceSubmitting} className="btn tb-btn-dark btn-sm rounded-pill px-4">
                    {serviceSubmitting ? 'Scheduling...' : 'Confirm Schedule'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default UserDashboard;