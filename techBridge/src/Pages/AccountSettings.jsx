import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Bell,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Layers,
  Trash2,
  AlertTriangle,
  Image as ImageIcon,
  Camera,
  X
} from "lucide-react";
import { API_BASE_URL } from "../config/api";
import "../Css/AccountSettings.css";

const BASE_URL = API_BASE_URL || "http://localhost:8080";

const AccountSettings = () => {
  const navigate = useNavigate();

  // Active Tab: 'profile', 'security', 'preferences', 'danger'
  const [activeTab, setActiveTab] = useState("profile");

  // Get current logged-in user
  const getStoredUser = () => {
    try {
      const stored = localStorage.getItem("user");
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      return parsed?.user || parsed;
    } catch {
      return null;
    }
  };

  const storedUser = getStoredUser();
  const userId = storedUser?.id || storedUser?.userid || storedUser?.user_id;

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    fullName: "",
    email: "",
    contact: "",
    gender: "",
    address: "",
    profileImage: ""
  });

  const [imageError, setImageError] = useState(false);

  // Password Form State
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Preferences State
  const [preferences, setPreferences] = useState({
    emailUpdates: true,
    repairStatusSms: true,
    promotionalOffers: false
  });

  // Loading & Feedback States
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [deactivating, setDeactivating] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [detectedLocationName, setDetectedLocationName] = useState("");
  const [feedback, setFeedback] = useState(null);

  // Toast Helper
  const showFeedback = (message, type = "success") => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Fetch Fresh User Data from Spring Boot Backend
  const fetchUserData = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/user/getby/${userId}`, { timeout: 4000 });
      const user = res.data;
      setProfileForm({
        fullName: user.fullName || user.fullname || "",
        email: user.email || "",
        contact: user.contact || "",
        gender: user.gender || "",
        address: user.address || "",
        profileImage: user.profileImage || user.profileimage || ""
      });
      setImageError(false);
    } catch (err) {
      console.warn("Could not fetch user profile from backend, using local session:", err);
      if (storedUser) {
        setProfileForm({
          fullName: storedUser.fullName || storedUser.fullname || "",
          email: storedUser.email || "",
          contact: storedUser.contact || "",
          gender: storedUser.gender || "",
          address: storedUser.address || "",
          profileImage: storedUser.profileImage || storedUser.profileimage || ""
        });
      }
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // Handle Geocoding on Address input
  const handleAddressLookup = async () => {
    const rawAddress = profileForm.address.trim();
    if (!rawAddress) return;

    setIsLocating(true);
    setDetectedLocationName("");

    try {
      const geoUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        rawAddress
      )}&limit=1`;

      const geoRes = await axios.get(geoUrl, {
        headers: { "Accept-Language": "en" }
      });

      if (geoRes.data && geoRes.data.length > 0) {
        const place = geoRes.data[0];
        setDetectedLocationName(place.display_name.split(",").slice(0, 3).join(","));
      }
    } catch (err) {
      console.warn("Location lookup error:", err);
    } finally {
      setIsLocating(false);
    }
  };

  // 1. Save Profile Information Handler (including profile picture)
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profileForm.fullName.trim()) {
      showFeedback("Full Name cannot be empty.", "error");
      return;
    }

    setSavingProfile(true);
    try {
      const res = await axios.put(`${BASE_URL}/api/user/update/${userId}`, profileForm);
      const updatedUser = res.data;

      // Update local storage session
      const currentStored = JSON.parse(localStorage.getItem("user") || "{}");
      const newUserData = {
        ...currentStored,
        fullName: updatedUser.fullName || profileForm.fullName,
        fullname: updatedUser.fullName || profileForm.fullName,
        email: updatedUser.email || profileForm.email,
        contact: updatedUser.contact || profileForm.contact,
        gender: updatedUser.gender || profileForm.gender,
        address: updatedUser.address || profileForm.address,
        profileImage: updatedUser.profileImage || profileForm.profileImage,
        profileimage: updatedUser.profileImage || profileForm.profileImage,
        user: {
          ...(currentStored.user || {}),
          ...updatedUser,
          profileImage: updatedUser.profileImage || profileForm.profileImage
        }
      };

      localStorage.setItem("user", JSON.stringify(newUserData));
      window.dispatchEvent(new CustomEvent("auth-change"));

      showFeedback("Profile details and picture updated successfully!", "success");
    } catch (err) {
      console.error("Profile update error:", err);
      // Fallback update in localStorage if backend is offline
      const currentStored = JSON.parse(localStorage.getItem("user") || "{}");
      const newUserData = {
        ...currentStored,
        fullName: profileForm.fullName,
        fullname: profileForm.fullName,
        email: profileForm.email,
        contact: profileForm.contact,
        gender: profileForm.gender,
        address: profileForm.address,
        profileImage: profileForm.profileImage,
        profileimage: profileForm.profileImage,
        user: {
          ...(currentStored.user || {}),
          ...profileForm
        }
      };
      localStorage.setItem("user", JSON.stringify(newUserData));
      window.dispatchEvent(new CustomEvent("auth-change"));

      showFeedback("Profile saved to session! (Backend update pending)", "info");
    } finally {
      setSavingProfile(false);
    }
  };

  // 2. Change Password Handler
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passwordForm.oldPassword) {
      showFeedback("Please enter your current password.", "error");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      showFeedback("New password must be at least 6 characters long.", "error");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showFeedback("New passwords do not match!", "error");
      return;
    }

    setSavingPassword(true);
    try {
      await axios.put(
        `${BASE_URL}/api/user/change-password/${userId}`,
        null,
        {
          params: {
            oldPassword: passwordForm.oldPassword,
            newPassword: passwordForm.newPassword
          }
        }
      );

      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      showFeedback("Password changed successfully!", "success");
    } catch (err) {
      console.error("Password change error:", err);
      const errMsg = err.response?.data?.error || "Failed to change password. Please check your current password.";
      showFeedback(errMsg, "error");
    } finally {
      setSavingPassword(false);
    }
  };

  // 3. Deactivate Account Handler
  const handleDeactivateAccount = async () => {
    if (!window.confirm("Are you sure you want to deactivate your TechBridge account? You will be logged out immediately.")) {
      return;
    }

    setDeactivating(true);
    try {
      await axios.delete(`${BASE_URL}/api/user/deactivate/${userId}`);
      alert("Your account has been deactivated.");
      localStorage.removeItem("user");
      localStorage.removeItem("userId");
      window.dispatchEvent(new CustomEvent("auth-change"));
      navigate("/login");
    } catch (err) {
      console.error("Deactivate error:", err);
      alert("Failed to deactivate account. Backend service may be unreachable.");
    } finally {
      setDeactivating(false);
    }
  };

  // Helper: User Initial
  const getUserInitial = () => {
    const name = profileForm.fullName || storedUser?.fullName || storedUser?.fullname || "U";
    return name.charAt(0).toUpperCase();
  };

  // If user is not authenticated
  if (!storedUser || !userId) {
    return (
      <div className="tb-settings-page-wrapper">
        <div className="tb-settings-container">
          <div className="tb-settings-auth-card text-center my-5">
            <div className="tb-auth-icon-box mb-3">
              <User size={42} className="text-primary" strokeWidth={1.8} />
            </div>
            <h2 className="fw-bold text-dark mb-2">Authentication Required</h2>
            <p className="text-muted mb-4">
              Please sign in to your TechBridge account to access your profile and security settings.
            </p>
            <button className="tb-btn-primary-dark" onClick={() => navigate("/login")}>
              Log In to Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tb-settings-page-wrapper">
      <div className="tb-settings-container">

        {/* Toast Notification */}
        {feedback && (
          <div className={`tb-toast-notification tb-toast-${feedback.type}`}>
            {feedback.type === "success" && <CheckCircle2 size={18} />}
            {feedback.type === "info" && <Sparkles size={18} />}
            {feedback.type === "error" && <AlertCircle size={18} />}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Profile Overview Header Card */}
        <div className="tb-settings-header-card">
          <div className="tb-settings-user-info">
            <div className="tb-settings-avatar">
              {profileForm.profileImage && !imageError ? (
                <img
                  src={profileForm.profileImage}
                  alt={profileForm.fullName}
                  className="tb-avatar-img"
                  onError={() => setImageError(true)}
                />
              ) : (
                <span>{getUserInitial()}</span>
              )}
            </div>
            <div className="tb-settings-meta">
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <h1 className="tb-settings-name">{profileForm.fullName || "TechBridge User"}</h1>
                <span className="tb-settings-role-badge">{storedUser.role || "USER"}</span>
              </div>
              <p className="tb-settings-email">{profileForm.email || storedUser.email}</p>
            </div>
          </div>

          <div className="tb-settings-header-actions">
            <Link to="/userdashboard" className="tb-btn-dashboard-link">
              <Layers size={16} />
              <span>User Dashboard</span>
            </Link>
          </div>
        </div>

        {/* Main Settings Grid */}
        <div className="tb-settings-layout">
          
          {/* Left Navigation Sidebar */}
          <div className="tb-settings-nav-sidebar">
            <button
              type="button"
              className={`tb-settings-tab-btn ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              <User size={18} />
              <span>Profile Information</span>
            </button>

            <button
              type="button"
              className={`tb-settings-tab-btn ${activeTab === "security" ? "active" : ""}`}
              onClick={() => setActiveTab("security")}
            >
              <Lock size={18} />
              <span>Security & Password</span>
            </button>

            <button
              type="button"
              className={`tb-settings-tab-btn ${activeTab === "preferences" ? "active" : ""}`}
              onClick={() => setActiveTab("preferences")}
            >
              <Bell size={18} />
              <span>Notifications & Alerts</span>
            </button>

            <button
              type="button"
              className={`tb-settings-tab-btn danger-tab ${activeTab === "danger" ? "active" : ""}`}
              onClick={() => setActiveTab("danger")}
            >
              <AlertTriangle size={18} />
              <span>Account Status</span>
            </button>
          </div>

          {/* Right Content Area */}
          <div className="tb-settings-content-card">
            
            {/* TAB 1: PROFILE INFORMATION */}
            {activeTab === "profile" && (
              <div>
                <div className="tb-tab-header">
                  <h2 className="tb-tab-title">Personal Information</h2>
                  <p className="tb-tab-subtitle">
                    Update your profile picture, contact details, delivery address, and preferences.
                  </p>
                </div>

                <form onSubmit={handleProfileSubmit}>
                  
                  {/* Profile Picture URL Field */}
                  <div className="tb-form-group">
                    <label className="tb-form-label">Profile Picture URL</label>
                    <div className="tb-image-input-row">
                      <div className="tb-image-preview-box">
                        {profileForm.profileImage && !imageError ? (
                          <img
                            src={profileForm.profileImage}
                            alt="Avatar preview"
                            className="tb-avatar-preview-img"
                            onError={() => setImageError(true)}
                          />
                        ) : (
                          <div className="tb-avatar-placeholder">
                            <Camera size={22} className="text-muted" />
                          </div>
                        )}
                      </div>
                      <div className="tb-input-wrapper flex-grow-1">
                        <ImageIcon size={18} className="tb-input-icon" />
                        <input
                          type="url"
                          className="tb-form-control"
                          placeholder="Paste image URL (e.g. https://images.unsplash.com/... or Imgur link)"
                          value={profileForm.profileImage}
                          onChange={(e) => {
                            setImageError(false);
                            setProfileForm({ ...profileForm, profileImage: e.target.value });
                          }}
                        />
                        {profileForm.profileImage && (
                          <button
                            type="button"
                            className="tb-clear-img-btn"
                            onClick={() => {
                              setImageError(false);
                              setProfileForm({ ...profileForm, profileImage: "" });
                            }}
                            title="Clear image URL"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                    <small className="tb-form-hint">
                      Paste any direct image URL (Unsplash, Cloudinary, Imgur, GitHub avatars, etc.). Changes will preview instantly!
                    </small>
                  </div>

                  {/* Full Name & Email */}
                  <div className="tb-settings-form-row">
                    <div className="tb-form-group">
                      <label className="tb-form-label">Full Name</label>
                      <div className="tb-input-wrapper">
                        <User size={18} className="tb-input-icon" />
                        <input
                          type="text"
                          className="tb-form-control"
                          placeholder="e.g. Alix Joy"
                          value={profileForm.fullName}
                          onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="tb-form-group">
                      <label className="tb-form-label">Email Address</label>
                      <div className="tb-input-wrapper">
                        <Mail size={18} className="tb-input-icon" />
                        <input
                          type="email"
                          className="tb-form-control"
                          placeholder="name@example.com"
                          value={profileForm.email}
                          onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Number & Gender */}
                  <div className="tb-settings-form-row">
                    <div className="tb-form-group">
                      <label className="tb-form-label">Mobile Contact</label>
                      <div className="tb-input-wrapper">
                        <Phone size={18} className="tb-input-icon" />
                        <input
                          type="tel"
                          className="tb-form-control"
                          placeholder="+91 98765 43210"
                          value={profileForm.contact}
                          onChange={(e) => setProfileForm({ ...profileForm, contact: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="tb-form-group">
                      <label className="tb-form-label">Gender</label>
                      <div className="tb-input-wrapper">
                        <select
                          className="tb-form-select"
                          value={profileForm.gender}
                          onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div className="tb-form-group">
                    <label className="tb-form-label">Delivery Address / Area</label>
                    <div className="tb-input-wrapper">
                      <MapPin size={18} className="tb-input-icon" />
                      <input
                        type="text"
                        className="tb-form-control"
                        placeholder="e.g. 102 Crystal Tower, Kurla West, Mumbai"
                        value={profileForm.address}
                        onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                        onBlur={handleAddressLookup}
                      />
                      {isLocating && (
                        <Loader2 size={16} className="spinner-border spinner-border-sm me-2 text-muted" />
                      )}
                    </div>
                    {detectedLocationName && (
                      <small className="tb-location-badge">
                        ✓ Recognized: {detectedLocationName}
                      </small>
                    )}
                  </div>

                  <div className="tb-form-footer">
                    <button
                      type="submit"
                      className="tb-btn-save"
                      disabled={savingProfile}
                    >
                      {savingProfile ? (
                        <>
                          <Loader2 size={16} className="spinner-border spinner-border-sm" />
                          <span>Saving Changes...</span>
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </div>

                </form>
              </div>
            )}

            {/* TAB 2: SECURITY & PASSWORD */}
            {activeTab === "security" && (
              <div>
                <div className="tb-tab-header">
                  <h2 className="tb-tab-title">Security & Password</h2>
                  <p className="tb-tab-subtitle">
                    Ensure your account stays protected by using a strong, unique password.
                  </p>
                </div>

                <form onSubmit={handlePasswordSubmit}>
                  
                  {/* Current Password */}
                  <div className="tb-form-group">
                    <label className="tb-form-label">Current Password</label>
                    <div className="tb-input-wrapper">
                      <Lock size={18} className="tb-input-icon" />
                      <input
                        type={showOldPassword ? "text" : "password"}
                        className="tb-form-control"
                        placeholder="••••••••"
                        value={passwordForm.oldPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                        required
                      />
                      <button
                        type="button"
                        className="tb-toggle-password"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                      >
                        {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* New Password & Confirm Password */}
                  <div className="tb-settings-form-row">
                    <div className="tb-form-group">
                      <label className="tb-form-label">New Password</label>
                      <div className="tb-input-wrapper">
                        <Lock size={18} className="tb-input-icon" />
                        <input
                          type={showNewPassword ? "text" : "password"}
                          className="tb-form-control"
                          placeholder="At least 6 characters"
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                          required
                        />
                        <button
                          type="button"
                          className="tb-toggle-password"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <div className="tb-form-group">
                      <label className="tb-form-label">Confirm New Password</label>
                      <div className="tb-input-wrapper">
                        <Lock size={18} className="tb-input-icon" />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          className="tb-form-control"
                          placeholder="Re-enter new password"
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                          required
                        />
                        <button
                          type="button"
                          className="tb-toggle-password"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="tb-form-footer">
                    <button
                      type="submit"
                      className="tb-btn-save"
                      disabled={savingPassword}
                    >
                      {savingPassword ? (
                        <>
                          <Loader2 size={16} className="spinner-border spinner-border-sm" />
                          <span>Updating Password...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck size={16} />
                          <span>Update Password</span>
                        </>
                      )}
                    </button>
                  </div>

                </form>
              </div>
            )}

            {/* TAB 3: PREFERENCES & NOTIFICATIONS */}
            {activeTab === "preferences" && (
              <div>
                <div className="tb-tab-header">
                  <h2 className="tb-tab-title">Notifications & Preferences</h2>
                  <p className="tb-tab-subtitle">
                    Manage how and when TechBridge sends you system alerts and order updates.
                  </p>
                </div>

                <div className="tb-preferences-list">
                  
                  <div className="tb-preference-item">
                    <div>
                      <h4 className="tb-pref-title">Email Repair Updates</h4>
                      <p className="tb-pref-desc">Receive real-time email notifications whenever your ticket status changes.</p>
                    </div>
                    <label className="tb-switch">
                      <input
                        type="checkbox"
                        checked={preferences.emailUpdates}
                        onChange={(e) => setPreferences({ ...preferences, emailUpdates: e.target.checked })}
                      />
                      <span className="tb-slider"></span>
                    </label>
                  </div>

                  <div className="tb-preference-item">
                    <div>
                      <h4 className="tb-pref-title">SMS / WhatsApp Dispatch Alerts</h4>
                      <p className="tb-pref-desc">Get SMS alerts when ordered spare parts and hardware items are dispatched.</p>
                    </div>
                    <label className="tb-switch">
                      <input
                        type="checkbox"
                        checked={preferences.repairStatusSms}
                        onChange={(e) => setPreferences({ ...preferences, repairStatusSms: e.target.checked })}
                      />
                      <span className="tb-slider"></span>
                    </label>
                  </div>

                  <div className="tb-preference-item">
                    <div>
                      <h4 className="tb-pref-title">Promotional News & Maintenance Reminders</h4>
                      <p className="tb-pref-desc">Receive periodic 6-month thermal maintenance reminders and discount coupons.</p>
                    </div>
                    <label className="tb-switch">
                      <input
                        type="checkbox"
                        checked={preferences.promotionalOffers}
                        onChange={(e) => setPreferences({ ...preferences, promotionalOffers: e.target.checked })}
                      />
                      <span className="tb-slider"></span>
                    </label>
                  </div>

                </div>

                <div className="tb-form-footer mt-4">
                  <button
                    type="button"
                    className="tb-btn-save"
                    onClick={() => showFeedback("Notification preferences saved successfully!", "success")}
                  >
                    <Save size={16} />
                    <span>Save Preferences</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 4: DANGER ZONE / ACCOUNT STATUS */}
            {activeTab === "danger" && (
              <div>
                <div className="tb-tab-header">
                  <h2 className="tb-tab-title text-danger">Account Status & Deactivation</h2>
                  <p className="tb-tab-subtitle">
                    Manage your account visibility or temporarily deactivate your profile.
                  </p>
                </div>

                <div className="tb-danger-box">
                  <div className="d-flex align-items-start gap-3">
                    <AlertTriangle size={24} className="text-danger flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="fw-bold text-dark mb-1">Deactivate TechBridge Account</h4>
                      <p className="text-muted small mb-3">
                        Deactivating your account will disable your active tickets, saved hardware wishlist, and service center history. You can reactivate by contacting customer support.
                      </p>
                      <button
                        type="button"
                        className="tb-btn-danger"
                        disabled={deactivating}
                        onClick={handleDeactivateAccount}
                      >
                        {deactivating ? "Deactivating..." : "Deactivate My Account"}
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

export default AccountSettings;
