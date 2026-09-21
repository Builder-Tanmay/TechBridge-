import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  LayoutDashboard,
  Wrench,
  LifeBuoy,
  Cpu,
  Users,
  PlusCircle,
  LogOut,
  RotateCw,
  Edit3,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Layers,
  ShoppingBag,
  X,
  Upload,
  ShieldCheck,
  TrendingUp,
  Package,
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Css/AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Navigation Tab State (Default: dashboard)
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('adminActiveTab') || 'dashboard';
  });

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    localStorage.setItem('adminActiveTab', tabName);
  };

  // State Declarations
  const [parts, setParts] = useState([]);
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [tickets, setTickets] = useState([]);

  // Loading and feedback states
  const [servicesLoading, setServicesLoading] = useState(false);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [statusLoadingId, setStatusLoadingId] = useState(null);
  const [updatingServiceId, setUpdatingServiceId] = useState(null);
  const [updatingTicketId, setUpdatingTicketId] = useState(null);

  const [feedback, setFeedback] = useState({ message: '', type: '' });

  // Form State for Adding Parts / Accessories
  const [newPart, setNewPart] = useState({
    partName: '',
    partDesc: '',
    brand: '',
    modelName: '',
    stockQuantity: '',
    price: '',
    category: 'SPARE_PART',
    img: ''
  });

  // Modal State for Editing
  const [showModal, setShowModal] = useState(false);
  const [editPart, setEditPart] = useState({
    id: null,
    partName: '',
    partDesc: '',
    brand: '',
    modelName: '',
    stockQuantity: 0,
    price: 0,
    category: 'SPARE_PART',
    img: ''
  });

  // 1. Fetch Parts
  const fetchParts = useCallback(() => {
    axios.get("http://localhost:8080/api/parts/getall")
      .then((res) => setParts(res.data))
      .catch((err) => console.error("Error fetching parts:", err));
  }, []);

  // 2. Fetch Users
  const fetchUsers = useCallback(() => {
    axios.get("http://localhost:8080/api/user/getall")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  // 3. Fetch Service Requests
  const fetchServices = useCallback(() => {
    setServicesLoading(true);
    axios.get("http://localhost:8080/api/admin/services/all")
      .then((res) => setServices(res.data))
      .catch((err) => console.error("Error fetching service requests:", err))
      .finally(() => setServicesLoading(false));
  }, []);

  // 4. Fetch Support Tickets
  const fetchTickets = useCallback(() => {
    setTicketsLoading(true);
    axios.get("http://localhost:8080/api/tickets/admin/all")
      .then((res) => setTickets(res.data))
      .catch((err) => console.error("Error fetching tickets:", err))
      .finally(() => setTicketsLoading(false));
  }, []);

  useEffect(() => {
    fetchParts();
    fetchUsers();
    fetchServices();
    fetchTickets();
  }, [fetchParts, fetchUsers, fetchServices, fetchTickets]);

  // Handle Input Changes for Add Form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPart({ ...newPart, [name]: value });
  };

  // Handle Image File Browser Upload
  const handleImageUpload = (e, isEdit = false) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image file size should be less than 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isEdit) {
          setEditPart((prev) => ({ ...prev, img: reader.result }));
        } else {
          setNewPart((prev) => ({ ...prev, img: reader.result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Add Part Submit
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/parts/add", newPart);
      alert("Product Listed Successfully!");
      setNewPart({
        partName: '', partDesc: '', brand: '', modelName: '', stockQuantity: '', price: '', category: 'SPARE_PART', img: ''
      });
      fetchParts();
      handleTabChange('view-parts');
    } catch (err) {
      console.error("Error adding part:", err);
      alert("Failed to add product. Please check backend API.");
    }
  };

  // Edit Part Modal Setup
  const handleEditClick = (part) => {
    setEditPart({
      id: part.id,
      partName: part.partName || '',
      partDesc: part.partDesc || '',
      brand: part.brand || '',
      modelName: part.modelName || '',
      stockQuantity: part.stockQuantity || 0,
      price: part.price || 0,
      category: part.category || 'SPARE_PART',
      img: part.img || ''
    });
    setShowModal(true);
  };

  // Update Part Submit
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:8080/api/parts/update/${editPart.id}`, editPart);
      alert("Product Updated Successfully!");
      setShowModal(false);
      fetchParts();
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update product.");
    }
  };

  // Delete Part
  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to remove this product listing?")) {
      try {
        await axios.delete(`http://localhost:8080/api/parts/delete/${id}`);
        alert("Product listing deleted successfully!");
        fetchParts();
      } catch (err) {
        console.error("Delete error:", err);
        alert("Failed to delete product.");
      }
    }
  };

  // User Active/Inactive Toggle
  const toggleStatus = async (id) => {
    if (statusLoadingId) return;
    setStatusLoadingId(id);

    try {
      const res = await axios.patch(`http://localhost:8080/api/user/toggle-status/${id}`);
      const updatedUser = res.data;
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === id ? { ...user, active: updatedUser.active } : user))
      );
    } catch (err) {
      console.error("Status toggle error:", err);
      alert("Failed to update user status in database.");
    } finally {
      setStatusLoadingId(null);
    }
  };

  // Service Status Update (PATCH)
  const handleServiceStatusUpdate = async (requestId, newStatus) => {
    setUpdatingServiceId(requestId);
    setFeedback({ message: '', type: '' });

    try {
      await axios.patch(
        `http://localhost:8080/api/admin/services/update-status/${requestId}?status=${newStatus}`
      );

      setServices((prev) =>
        prev.map((item) => (item.id === requestId ? { ...item, status: newStatus } : item))
      );

      setFeedback({
        message: `Service Request #${requestId} updated to ${newStatus}`,
        type: 'success'
      });
    } catch (err) {
      console.error("Error updating service status:", err);
      setFeedback({
        message: `Failed to update Request #${requestId}`,
        type: 'danger'
      });
    } finally {
      setUpdatingServiceId(null);
      setTimeout(() => setFeedback({ message: '', type: '' }), 4000);
    }
  };

  // Support Ticket Status Update (PATCH)
  const handleTicketStatusUpdate = async (ticketId, newStatus) => {
    setUpdatingTicketId(ticketId);
    setFeedback({ message: '', type: '' });

    try {
      await axios.patch(
        `http://localhost:8080/api/tickets/admin/update-status/${ticketId}?status=${newStatus}`
      );

      setTickets((prev) =>
        prev.map((item) => (item.id === ticketId ? { ...item, status: newStatus } : item))
      );

      setFeedback({
        message: `Ticket #TCK-${ticketId} status updated to ${newStatus}`,
        type: 'success'
      });
    } catch (err) {
      console.error("Error updating ticket status:", err);
      setFeedback({
        message: `Failed to update Ticket #${ticketId}`,
        type: 'danger'
      });
    } finally {
      setUpdatingTicketId(null);
      setTimeout(() => setFeedback({ message: '', type: '' }), 4000);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
      window.dispatchEvent(new CustomEvent('auth-change'));
      navigate('/login');
    }
  };

  // Regular users filter
  const regularUsers = users.filter(
    (u) => (u.role || '').toString().toUpperCase() !== 'ADMIN'
  );

  const activeUsersCount = regularUsers.filter((u) => u.active === true || u.active === 1).length;
  const inactiveUsersCount = regularUsers.length - activeUsersCount;
  const userStatusData = [
    { name: 'Active Users', value: activeUsersCount, fill: '#1d4ed8' },
    { name: 'Inactive Users', value: inactiveUsersCount, fill: '#cbd5e1' }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'RESOLVED':
      case 'COMPLETED':
        return <span className="tb-tag success">{status}</span>;
      case 'IN_PROGRESS':
        return <span className="tb-tag warning">In Progress</span>;
      case 'CLOSED':
      case 'CANCELLED':
        return <span className="tb-tag danger">{status}</span>;
      default:
        return <span className="tb-tag secondary">{status || 'Open'}</span>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'URGENT':
      case 'HIGH':
        return <span className="tb-badge-danger">{priority}</span>;
      case 'MEDIUM':
        return <span className="tb-badge-warning">Medium</span>;
      default:
        return <span className="tb-badge-secondary">Low</span>;
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="tb-admin-content-body">
            {/* Top Metric Cards */}
            <div className="row g-3 mb-4">
              <div className="col-12 col-sm-6 col-lg-3">
                <div className="tb-admin-card tb-kpi-card p-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="tb-kpi-title">Inventory Items</span>
                    <div className="tb-kpi-icon-wrap">
                      <Cpu size={18} />
                    </div>
                  </div>
                  <h3 className="tb-kpi-val mb-0">{parts.length}</h3>
                  <small className="text-muted extra-small mt-1 d-block">Listed Hardware SKUs</small>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-lg-3">
                <div className="tb-admin-card tb-kpi-card p-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="tb-kpi-title">Registered Users</span>
                    <div className="tb-kpi-icon-wrap">
                      <Users size={18} />
                    </div>
                  </div>
                  <h3 className="tb-kpi-val mb-0">{regularUsers.length}</h3>
                  <small className="text-muted extra-small mt-1 d-block">Active Verified Clients</small>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-lg-3">
                <div className="tb-admin-card tb-kpi-card p-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="tb-kpi-title">Service Requests</span>
                    <div className="tb-kpi-icon-wrap">
                      <Wrench size={18} />
                    </div>
                  </div>
                  <h3 className="tb-kpi-val mb-0">{services.length}</h3>
                  <small className="text-muted extra-small mt-1 d-block">Repairs & Thermal Cleanups</small>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-lg-3">
                <div className="tb-admin-card tb-kpi-card p-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="tb-kpi-title">Support Tickets</span>
                    <div className="tb-kpi-icon-wrap">
                      <LifeBuoy size={18} />
                    </div>
                  </div>
                  <h3 className="tb-kpi-val mb-0">{tickets.length}</h3>
                  <small className="text-muted extra-small mt-1 d-block">Open Hardware Inquiries</small>
                </div>
              </div>
            </div>

            {/* Inventory Stock Chart */}
            <div className="tb-admin-card p-4 mb-4">
              <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <div>
                  <h5 className="font-grotesk fw-bold text-dark mb-0">Inventory Stock Level Telemetry</h5>
                  <small className="text-muted extra-small">Available stock distribution across registered OEM components</small>
                </div>
                <span className="tb-badge-dark">{parts.length} Items Listed</span>
              </div>

              {parts.length === 0 ? (
                <p className="text-muted text-center py-4 extra-small">No inventory data available for chart.</p>
              ) : (
                <div style={{ width: '100%', height: 320 }}>
                  <ResponsiveContainer>
                    <BarChart data={parts} margin={{ top: 10, right: 30, left: 0, bottom: 25 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="partName" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 8px 24px rgba(15,23,42,0.08)' }}
                        formatter={(val) => [`${val} units`, 'Stock']}
                      />
                      <Bar dataKey="stockQuantity" fill="#1d4ed8" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Customer Status Chart */}
            <div className="tb-admin-card p-4 mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h5 className="font-grotesk fw-bold text-dark mb-0">Customer Account Distribution</h5>
                  <small className="text-muted extra-small">Active versus Inactive registered user ratio</small>
                </div>
              </div>
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={userStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={5} dataKey="value">
                      {userStatusData.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );

      case 'view-services':
        return (
          <div className="tb-admin-content-body">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
              <div>
                <h4 className="font-grotesk fw-bold text-dark mb-0">Customer Laptop Service Requests</h4>
                <p className="text-muted extra-small mb-0">Real-time triage and diagnostics pipeline updates</p>
              </div>
              <button
                className="btn tb-btn-outline btn-sm rounded-pill d-flex align-items-center gap-1.5"
                onClick={fetchServices}
                disabled={servicesLoading}
              >
                <RotateCw size={14} className={servicesLoading ? 'spin-icon' : ''} />
                <span>{servicesLoading ? 'Refreshing...' : 'Refresh List'}</span>
              </button>
            </div>

            {feedback.message && (
              <div className={`alert alert-${feedback.type} alert-dismissible fade show py-2.5 extra-small rounded-3`} role="alert">
                {feedback.message}
                <button type="button" className="btn-close py-2.5" onClick={() => setFeedback({ message: '', type: '' })}></button>
              </div>
            )}

            <div className="tb-admin-card p-4">
              {services.length === 0 ? (
                <div className="p-5 text-center text-muted extra-small">No service requests submitted yet.</div>
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle mb-0 tb-custom-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Customer</th>
                        <th>Device Model</th>
                        <th>Issue Reported</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {services.map((req) => (
                        <tr key={req.id}>
                          <td className="fw-bold text-dark font-monospace extra-small">#REQ-{req.id}</td>
                          <td>
                            <div className="d-flex flex-column">
                              <span className="fw-bold text-dark extra-small">{req.user?.fullName || req.user?.fullname || 'Customer'}</span>
                              <span className="text-muted extra-small">{req.user?.email || 'N/A'}</span>
                            </div>
                          </td>
                          <td className="fw-semibold text-dark extra-small">{req.deviceModel}</td>
                          <td style={{ maxWidth: '240px' }}>
                            <span className="text-muted extra-small text-truncate d-block" title={req.issueDescription}>
                              {req.issueDescription}
                            </span>
                          </td>
                          <td className="text-muted extra-small">
                            {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : 'Recent'}
                          </td>
                          <td>{getStatusBadge(req.status)}</td>
                          <td className="text-center">
                            <div className="d-inline-flex align-items-center gap-2">
                              <select
                                className="form-select form-select-sm tb-admin-select"
                                value={req.status || 'RECEIVED'}
                                disabled={updatingServiceId === req.id || req.status === 'CANCELLED'}
                                onChange={(e) => handleServiceStatusUpdate(req.id, e.target.value)}
                              >
                                <option value="RECEIVED">RECEIVED</option>
                                <option value="IN_PROGRESS">IN_PROGRESS</option>
                                <option value="COMPLETED">COMPLETED</option>
                                <option value="CANCELLED">CANCELLED</option>
                              </select>
                              {updatingServiceId === req.id && (
                                <span className="spinner-border spinner-border-sm text-primary" role="status"></span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        );

      case 'view-tickets':
        return (
          <div className="tb-admin-content-body">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
              <div>
                <h4 className="font-grotesk fw-bold text-dark mb-0">Customer Support Inquiries & Tickets</h4>
                <p className="text-muted extra-small mb-0">Active customer assistance queues</p>
              </div>
              <button
                className="btn tb-btn-outline btn-sm rounded-pill d-flex align-items-center gap-1.5"
                onClick={fetchTickets}
                disabled={ticketsLoading}
              >
                <RotateCw size={14} className={ticketsLoading ? 'spin-icon' : ''} />
                <span>{ticketsLoading ? 'Refreshing...' : 'Refresh Tickets'}</span>
              </button>
            </div>

            {feedback.message && (
              <div className={`alert alert-${feedback.type} alert-dismissible fade show py-2.5 extra-small rounded-3`} role="alert">
                {feedback.message}
                <button type="button" className="btn-close py-2.5" onClick={() => setFeedback({ message: '', type: '' })}></button>
              </div>
            )}

            <div className="tb-admin-card p-4">
              {tickets.length === 0 ? (
                <div className="p-5 text-center text-muted extra-small">No support tickets found.</div>
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle mb-0 tb-custom-table">
                    <thead>
                      <tr>
                        <th>Ticket ID</th>
                        <th>Customer</th>
                        <th>Subject</th>
                        <th>Priority</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tickets.map((t) => (
                        <tr key={t.id}>
                          <td className="fw-bold text-dark font-monospace extra-small">#TCK-{t.id}</td>
                          <td>
                            <div className="d-flex flex-column">
                              <span className="fw-bold text-dark extra-small">{t.user?.fullName || t.user?.fullname || 'Customer'}</span>
                              <span className="text-muted extra-small">{t.user?.email || 'N/A'}</span>
                            </div>
                          </td>
                          <td style={{ maxWidth: '260px' }}>
                            <span className="fw-semibold text-dark d-block mb-0.5 extra-small">{t.subject}</span>
                            <span className="text-muted extra-small text-truncate d-block" title={t.description}>
                              {t.description || "No description provided."}
                            </span>
                          </td>
                          <td>{getPriorityBadge(t.priority)}</td>
                          <td className="text-muted extra-small">
                            {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : 'Recent'}
                          </td>
                          <td>{getStatusBadge(t.status)}</td>
                          <td className="text-center">
                            <div className="d-inline-flex align-items-center gap-2">
                              <select
                                className="form-select form-select-sm tb-admin-select"
                                value={t.status || 'OPEN'}
                                disabled={updatingTicketId === t.id || t.status === 'CLOSED'}
                                onChange={(e) => handleTicketStatusUpdate(t.id, e.target.value)}
                              >
                                <option value="OPEN">OPEN</option>
                                <option value="IN_PROGRESS">IN_PROGRESS</option>
                                <option value="RESOLVED">RESOLVED</option>
                                <option value="CLOSED">CLOSED (Final)</option>
                              </select>
                              {updatingTicketId === t.id && (
                                <span className="spinner-border spinner-border-sm text-primary" role="status"></span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        );

      case 'view-parts':
        return (
          <div className="tb-admin-content-body">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
              <div>
                <h4 className="font-grotesk fw-bold text-dark mb-0">All Spare Parts & Accessories</h4>
                <p className="text-muted extra-small mb-0">Manage listed hardware inventory and stock allowances</p>
              </div>
              <button
                className="btn tb-btn-dark btn-sm rounded-pill d-flex align-items-center gap-1.5"
                onClick={() => handleTabChange('add-part')}
              >
                <PlusCircle size={15} /> Add New SKU
              </button>
            </div>

            {parts.length === 0 ? (
              <div className="tb-admin-card p-5 text-center">
                <Package size={40} className="text-muted opacity-40 mb-2" />
                <p className="text-muted mb-0 extra-small">No items available in database.</p>
              </div>
            ) : (
              <div className="row g-3">
                {parts.map((part) => (
                  <div className="col-12 col-md-6 col-lg-4" key={part.id}>
                    <div className="tb-sku-card">

                      {/* Fixed height image frame */}
                      <div className="tb-sku-thumb-container">
                        {part.img ? (
                          <img
                            src={part.img}
                            alt={part.partName}
                            className="tb-sku-thumb-image"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=300";
                            }}
                          />
                        ) : (
                          <Cpu size={36} className="text-muted opacity-40" />
                        )}
                      </div>

                      {/* Card Content with guaranteed vertical stretch */}
                      <div className="tb-sku-content">

                        {/* Brand & Category row */}
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="tb-badge-dark text-uppercase">{part.brand || 'OEM'}</span>
                          <span className={`tb-tag ${part.category === 'ACCESSORY' ? 'warning' : 'secondary'}`}>
                            {part.category === 'ACCESSORY' ? 'Accessory' : 'Spare Part'}
                          </span>
                        </div>

                        {/* Standardized 2-line title */}
                        <h6 className="tb-sku-title" title={part.partName}>
                          {part.partName}
                        </h6>

                        {/* Model name */}
                        <p className="tb-sku-model">
                          <strong>Model:</strong> {part.modelName || 'Universal Fit'}
                        </p>

                        {/* Standardized 2-line description clamp */}
                        <p className="tb-sku-desc" title={part.partDesc}>
                          {part.partDesc || 'Standard factory-certified hardware component with cleanroom packaging.'}
                        </p>

                        {/* Metric Row: Aligned to bottom of text section */}
                        <div className="tb-sku-metrics-row">
                          <span className="extra-small text-muted">
                            Stock: <strong className="text-dark">{part.stockQuantity ?? 0} units</strong>
                          </span>
                          <span className="tb-sku-price">
                            ₹{Number(part.price || 0).toLocaleString('en-IN')}
                          </span>
                        </div>

                        {/* Action Buttons: Guaranteed bottom lock */}
                        <div className="tb-sku-actions">
                          <button
                            className="btn tb-sku-btn-edit"
                            onClick={() => handleEditClick(part)}
                          >
                            <Edit3 size={13} /> Edit
                          </button>
                          <button
                            className="btn tb-sku-btn-delete"
                            onClick={() => handleDeleteClick(part.id)}
                          >
                            <Trash2 size={13} /> Delete
                          </button>
                        </div>

                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* EDIT MODAL */}
            {showModal && (
              <div className="tb-admin-modal-backdrop" onClick={() => setShowModal(false)}>
                <div className="tb-admin-modal-dialog" onClick={(e) => e.stopPropagation()}>
                  <div className="tb-admin-modal-header">
                    <div>
                      <h5 className="fw-bold text-dark mb-0 font-grotesk">Edit Component SKU</h5>
                      <span className="extra-small text-muted">ID: #{editPart.id} • Revision Controls</span>
                    </div>
                    <button type="button" className="tb-modal-close-btn" onClick={() => setShowModal(false)}>
                      <X size={18} />
                    </button>
                  </div>

                  <form onSubmit={handleUpdateSubmit} className="tb-admin-modal-body">
                    <div className="row g-3 mb-3">
                      <div className="col-md-6">
                        <label className="tb-form-label">Classification *</label>
                        <select
                          className="form-select tb-form-control"
                          value={editPart.category}
                          onChange={(e) => setEditPart({ ...editPart, category: e.target.value })}
                          required
                        >
                          <option value="SPARE_PART">Spare Part</option>
                          <option value="ACCESSORY">Accessory</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="tb-form-label">Hardware Part Name *</label>
                        <input
                          type="text"
                          className="form-control tb-form-control"
                          value={editPart.partName}
                          onChange={(e) => setEditPart({ ...editPart, partName: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="tb-form-label">Technical Description</label>
                      <textarea
                        className="form-control tb-form-control"
                        rows="2"
                        value={editPart.partDesc || ''}
                        onChange={(e) => setEditPart({ ...editPart, partDesc: e.target.value })}
                        placeholder="Pins, wattage, form factor..."
                      />
                    </div>

                    <div className="row g-3 mb-3">
                      <div className="col-md-6">
                        <label className="tb-form-label">Manufacturer / Brand *</label>
                        <input
                          type="text"
                          className="form-control tb-form-control"
                          value={editPart.brand}
                          onChange={(e) => setEditPart({ ...editPart, brand: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="tb-form-label">Target Model Compatibility</label>
                        <input
                          type="text"
                          className="form-control tb-form-control"
                          value={editPart.modelName || ''}
                          onChange={(e) => setEditPart({ ...editPart, modelName: e.target.value })}
                          placeholder="e.g. Dell Inspiron 15"
                        />
                      </div>
                    </div>

                    <div className="row g-3 mb-3">
                      <div className="col-md-6">
                        <label className="tb-form-label">Stock Quantity Available *</label>
                        <input
                          type="number"
                          className="form-control tb-form-control"
                          value={editPart.stockQuantity}
                          onChange={(e) => setEditPart({ ...editPart, stockQuantity: parseInt(e.target.value) || 0 })}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="tb-form-label">Unit Price (₹ INR) *</label>
                        <input
                          type="number"
                          step="0.01"
                          className="form-control tb-form-control"
                          value={editPart.price}
                          onChange={(e) => setEditPart({ ...editPart, price: parseFloat(e.target.value) || 0 })}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-2">
                      <label className="tb-form-label">Update Hardware Image</label>
                      <div className="tb-file-dropzone">
                        <Upload size={22} className="text-secondary mb-1" />
                        <span className="extra-small fw-semibold text-dark d-block">Click to select new part photo</span>
                        <span className="extra-small text-muted">PNG, JPG, WEBP up to 5MB</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="tb-file-input-hidden"
                          onChange={(e) => handleImageUpload(e, true)}
                        />
                      </div>

                      {editPart.img && (
                        <div className="d-flex align-items-center gap-3 p-2 mt-2 rounded-3 bg-light border">
                          <img
                            src={editPart.img}
                            alt="Preview"
                            className="rounded border"
                            style={{ width: '54px', height: '54px', objectFit: 'contain' }}
                          />
                          <div className="extra-small text-muted">
                            <span className="text-success fw-bold d-block">✓ Image Attached</span>
                            Ready to persist on update
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="tb-admin-modal-footer">
                      <button
                        type="button"
                        className="btn tb-btn-outline rounded-pill px-4 btn-sm"
                        onClick={() => setShowModal(false)}
                      >
                        Discard
                      </button>
                      <button type="submit" className="btn tb-btn-dark rounded-pill px-4 btn-sm font-grotesk fw-bold">
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        );

      case 'view-users':
        return (
          <div className="tb-admin-content-body">
            <div className="mb-4">
              <h4 className="font-grotesk fw-bold text-dark mb-0">Registered Customers Management</h4>
              <p className="text-muted extra-small mb-0">Verify and control account security statuses</p>
            </div>
            <div className="tb-admin-card p-4">
              {regularUsers.length === 0 ? (
                <div className="p-5 text-center text-muted extra-small">No registered customer accounts found.</div>
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle mb-0 tb-custom-table">
                    <thead>
                      <tr>
                        <th>User ID</th>
                        <th>Full Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Access Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {regularUsers.map((u) => (
                        <tr key={u.id}>
                          <td className="font-monospace extra-small">#{u.id}</td>
                          <td className="fw-bold text-dark extra-small">{u.fullName || u.fullname}</td>
                          <td className="extra-small text-muted">{u.email}</td>
                          <td><span className="tb-badge-dark">{u.role || 'USER'}</span></td>
                          <td>
                            <div className="form-check form-switch d-flex align-items-center gap-2 m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id={`switch-${u.id}`}
                                checked={Boolean(u.active)}
                                onChange={() => toggleStatus(u.id)}
                                disabled={statusLoadingId === u.id}
                                style={{ cursor: 'pointer', width: '2.2rem', height: '1.15rem' }}
                              />
                              <label className="form-check-label extra-small fw-semibold" htmlFor={`switch-${u.id}`} style={{ cursor: 'pointer' }}>
                                <span className={`tb-status-pill ${u.active ? 'active' : 'inactive'}`}>
                                  ● {u.active ? 'Active' : 'Inactive'}
                                </span>
                              </label>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        );

      case 'add-part':
        return (
          <div className="tb-admin-content-body">
            <div className="mb-4">
              <h4 className="font-grotesk fw-bold text-dark mb-0">Add New Component SKU</h4>
              <p className="text-muted extra-small mb-0">Create new OEM parts or accessories listing</p>
            </div>

            <div className="tb-admin-card p-4 p-md-5" style={{ maxWidth: '860px' }}>
              <form onSubmit={handleAddSubmit}>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="tb-form-label">Classification *</label>
                    <select
                      name="category"
                      className="form-select tb-form-control"
                      value={newPart.category}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="SPARE_PART">Spare Part</option>
                      <option value="ACCESSORY">Accessory</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="tb-form-label">Item / Part Name *</label>
                    <input
                      type="text"
                      name="partName"
                      className="form-control tb-form-control"
                      placeholder="e.g. Dell 86Wh Battery or Wireless Mouse"
                      value={newPart.partName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="tb-form-label">Description & Warranty Specifications</label>
                  <textarea
                    name="partDesc"
                    className="form-control tb-form-control"
                    rows="3"
                    placeholder="Describe pinouts, compatibility revisions, cleanroom certification, etc."
                    value={newPart.partDesc}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="tb-form-label">Brand Name *</label>
                    <input
                      type="text"
                      name="brand"
                      className="form-control tb-form-control"
                      placeholder="Dell, HP, Apple, Lenovo, Asus..."
                      value={newPart.brand}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="tb-form-label">Target Model Compatibility</label>
                    <input
                      type="text"
                      name="modelName"
                      className="form-control tb-form-control"
                      placeholder="XPS 15, ThinkPad T14, MacBook Pro M2..."
                      value={newPart.modelName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="tb-form-label">Stock Quantity Available *</label>
                    <input
                      type="number"
                      name="stockQuantity"
                      className="form-control tb-form-control"
                      placeholder="0"
                      value={newPart.stockQuantity}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="tb-form-label">Price (₹ INR) *</label>
                    <input
                      type="number"
                      step="0.01"
                      name="price"
                      className="form-control tb-form-control"
                      placeholder="0.00"
                      value={newPart.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="tb-form-label">Product Image *</label>
                  <div className="tb-file-dropzone">
                    <Upload size={24} className="text-secondary mb-1" />
                    <span className="extra-small fw-semibold text-dark d-block">Click to browse hardware photo</span>
                    <span className="extra-small text-muted">Supports high-res PNG, JPG, or WEBP up to 5MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="tb-file-input-hidden"
                      onChange={(e) => handleImageUpload(e, false)}
                    />
                  </div>

                  {newPart.img && (
                    <div className="d-flex align-items-center gap-3 p-2.5 mt-3 rounded-3 bg-light border">
                      <img
                        src={newPart.img}
                        alt="Selected Preview"
                        className="rounded border"
                        style={{ width: '68px', height: '68px', objectFit: 'contain' }}
                      />
                      <div className="extra-small">
                        <span className="text-success fw-bold d-block">✓ Image Staged</span>
                        Preview verified. Ready for database upload.
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-top">
                  <button type="submit" className="btn tb-btn-dark rounded-pill px-4 py-2.5 font-grotesk fw-bold d-inline-flex align-items-center gap-2">
                    <PlusCircle size={16} /> Save & Publish SKU
                  </button>
                </div>

              </form>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="tb-admin-layout">
      {/* SIDEBAR NAVIGATION */}
      <aside className="tb-admin-sidebar">
        <div className="tb-admin-brand-box">
          <div>
            <h4 className="m-0 fw-bold font-grotesk text-dark">
              Tech<span className="text-primary">Bridge</span>
            </h4>
            <span className="tb-admin-sub-tag">Ecosystem Admin</span>
          </div>
          <span className="tb-badge-dark">v2.4</span>
        </div>

        <ul className="tb-admin-menu-list">
          <li
            className={`tb-admin-menu-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleTabChange('dashboard')}
          >
            <LayoutDashboard size={17} />
            <span>Dashboard Overview</span>
          </li>
          <li
            className={`tb-admin-menu-item ${activeTab === 'view-services' ? 'active' : ''}`}
            onClick={() => handleTabChange('view-services')}
          >
            <Wrench size={17} />
            <span>Service Requests ({services.length})</span>
          </li>
          <li
            className={`tb-admin-menu-item ${activeTab === 'view-tickets' ? 'active' : ''}`}
            onClick={() => handleTabChange('view-tickets')}
          >
            <LifeBuoy size={17} />
            <span>Support Tickets ({tickets.length})</span>
          </li>
          <li
            className={`tb-admin-menu-item ${activeTab === 'view-parts' ? 'active' : ''}`}
            onClick={() => handleTabChange('view-parts')}
          >
            <Cpu size={17} />
            <span>All Parts & SKUs ({parts.length})</span>
          </li>
          <li
            className={`tb-admin-menu-item ${activeTab === 'view-users' ? 'active' : ''}`}
            onClick={() => handleTabChange('view-users')}
          >
            <Users size={17} />
            <span>Registered Users</span>
          </li>
          <li
            className={`tb-admin-menu-item ${activeTab === 'add-part' ? 'active' : ''}`}
            onClick={() => handleTabChange('add-part')}
          >
            <PlusCircle size={17} />
            <span>Add New Item</span>
          </li>
        </ul>

        {/* LOGOUT BUTTON */}
        <div className="tb-admin-sidebar-footer">
          <button type="button" className="btn btn-outline-danger w-100 rounded-pill btn-sm d-flex align-items-center justify-content-center gap-2" onClick={handleLogout}>
            <LogOut size={15} /> Logout Admin
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="tb-admin-main-viewport">
        {renderTabContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;