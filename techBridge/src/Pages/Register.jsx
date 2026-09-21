import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Wrench,
  ShieldCheck,
  Building2,
  AlertCircle
} from "lucide-react";
import "../Css/Register.css";

import heroBg from "../assets/hero-banner.png";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [contact, setContact] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Validation States
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // States for nearby centers & dynamic location detection
  const [serviceCenters, setServiceCenters] = useState([]);
  const [isLocating, setIsLocating] = useState(false);
  const [detectedLocationName, setDetectedLocationName] = useState("");
  const [locationError, setLocationError] = useState("");

  const navigate = useNavigate();

  // Validation Rules
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "fullName":
        if (!value.trim()) {
          error = "Full name is required.";
        } else if (!/^[A-Za-z\s]+$/.test(value)) {
          error = "Name can only contain letters and spaces.";
        } else if (value.trim().length < 3) {
          error = "Name must be at least 3 characters.";
        }
        break;

      case "email":
        if (!value.trim()) {
          error = "Email address is required.";
        } else if (
          !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value.trim())
        ) {
          error = "Enter a valid email address (e.g. name@example.com).";
        }
        break;

      case "contact":
        if (!value.trim()) {
          error = "10-digit mobile number is required.";
        } else if (!/^[6-9]\d{9}$/.test(value.trim())) {
          error = "Enter a valid 10-digit mobile number starting with 6-9.";
        }
        break;

      case "password":
        if (!value) {
          error = "Password is required.";
        } else if (value.length < 6) {
          error = "Password must be at least 6 characters.";
        }
        break;

      case "confirmPassword":
        if (!value) {
          error = "Please confirm your password.";
        } else if (value !== password) {
          error = "Passwords do not match.";
        }
        break;

      case "address":
        if (!value.trim()) {
          error = "Address / Area is required.";
        } else if (value.trim().length < 5) {
          error = "Please enter a valid area (min 5 characters).";
        }
        break;

      case "gender":
        if (!value) {
          error = "Please select your gender.";
        }
        break;

      default:
        break;
    }

    return error;
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    let val = "";
    if (field === "fullName") val = fullName;
    else if (field === "email") val = email;
    else if (field === "contact") val = contact;
    else if (field === "password") val = password;
    else if (field === "confirmPassword") val = confirmPassword;
    else if (field === "address") val = address;
    else if (field === "gender") val = gender;

    setErrors((prev) => ({ ...prev, [field]: validateField(field, val) }));
  };

  // Address Geocode & Nearby Center Lookup
  const handleAddressLookup = async () => {
    handleBlur("address");
    const rawAddress = address.trim();
    if (!rawAddress) return;

    setIsLocating(true);
    setLocationError("");
    setServiceCenters([]);

    try {
      const geoUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        rawAddress
      )}&limit=1`;

      const geoRes = await axios.get(geoUrl, {
        headers: { "Accept-Language": "en" },
      });

      if (geoRes.data && geoRes.data.length > 0) {
        const place = geoRes.data[0];
        const lat = parseFloat(place.lat);
        const lng = parseFloat(place.lon);

        setDetectedLocationName(place.display_name);

        const centersRes = await axios.get(
          `http://localhost:8080/api/service-centers/nearby?lat=${lat}&lng=${lng}&radius=10.0`
        );
        setServiceCenters(centersRes.data);
      } else {
        setLocationError("Could not locate area. Try adding your city (e.g., 'Kurla, Mumbai').");
      }
    } catch (err) {
      console.error("Location lookup error:", err);
      setLocationError("Could not fetch location suggestions at this time.");
    } finally {
      setIsLocating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all touched
    const allTouched = {
      fullName: true,
      email: true,
      contact: true,
      password: true,
      confirmPassword: true,
      address: true,
      gender: true
    };
    setTouched(allTouched);

    // Validate all
    const newErrors = {
      fullName: validateField("fullName", fullName),
      email: validateField("email", email),
      contact: validateField("contact", contact),
      password: validateField("password", password),
      confirmPassword: validateField("confirmPassword", confirmPassword),
      address: validateField("address", address),
      gender: validateField("gender", gender)
    };

    // Filter empty errors
    const hasErrors = Object.values(newErrors).some((err) => Boolean(err));
    setErrors(newErrors);

    if (hasErrors) {
      return;
    }

    setLoading(true);

    const user = {
      fullName: fullName.trim(),
      email: email.trim(),
      password: password,
      contact: contact.trim(),
      gender: gender,
      role: "User",
      address: address.trim(),
      active: true
    };

    try {
      await axios.post("http://localhost:8080/api/user/add", user);

      alert("Registered Successfully! Please log in with your credentials.");
      navigate("/login");

      setFullName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setContact("");
      setGender("");
      setAddress("");
      setServiceCenters([]);
      setDetectedLocationName("");
      setErrors({});
      setTouched({});
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response && error.response.data) {
        alert(typeof error.response.data === "string" ? error.response.data : "Registration failed. Please check your details.");
      } else {
        alert("Server connection failed. Make sure your Spring Boot backend is running!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="tb-register-page"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <div className="container position-relative z-2">
        <div className="tb-register-container mx-auto">

          {/* Solid Elevated Register Card */}
          <div className="tb-register-card">

            {/* Header with Official Logo */}
            <div className="text-center mb-4">
              <Link to="/" className="tb-main-logo-pill text-decoration-none">
                <span className="tb-logo-text">TECHBRIDGE</span>
              </Link>
              <h2 className="tb-register-title mt-3 mb-1">Create Account</h2>
              <p className="tb-register-subtitle">
                Join the verified laptop care, telemetry & genuine parts network.
              </p>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} noValidate>

              {/* Row 1: Full Name & Email */}
              <div className="tb-form-row">
                <div className="tb-form-group">
                  <label className="tb-form-label">Full Name *</label>
                  <div className="tb-input-wrapper">
                    <User size={17} className="tb-input-icon" />
                    <input
                      type="text"
                      className={`form-control tb-form-control ${touched.fullName && errors.fullName ? "is-invalid" : ""}`}
                      placeholder="e.g. Rahul Sharma"
                      value={fullName}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (/^[A-Za-z\s]*$/.test(val)) {
                          setFullName(val);
                          if (touched.fullName) {
                            setErrors((prev) => ({ ...prev, fullName: validateField("fullName", val) }));
                          }
                        }
                      }}
                      onBlur={() => handleBlur("fullName")}
                      maxLength={50}
                    />
                  </div>
                  {touched.fullName && errors.fullName && (
                    <div className="tb-input-error"><AlertCircle size={12} /> {errors.fullName}</div>
                  )}
                </div>

                <div className="tb-form-group">
                  <label className="tb-form-label">Email Address *</label>
                  <div className="tb-input-wrapper">
                    <Mail size={17} className="tb-input-icon" />
                    <input
                      type="email"
                      className={`form-control tb-form-control ${touched.email && errors.email ? "is-invalid" : ""}`}
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEmail(val);
                        if (touched.email) {
                          setErrors((prev) => ({ ...prev, email: validateField("email", val) }));
                        }
                      }}
                      onBlur={() => handleBlur("email")}
                    />
                  </div>
                  {touched.email && errors.email && (
                    <div className="tb-input-error"><AlertCircle size={12} /> {errors.email}</div>
                  )}
                </div>
              </div>

              {/* Row 2: Mobile Number & Gender */}
              <div className="tb-form-row">
                <div className="tb-form-group">
                  <label className="tb-form-label">Mobile Number *</label>
                  <div className="tb-input-wrapper">
                    <Phone size={17} className="tb-input-icon" />
                    <input
                      type="tel"
                      className={`form-control tb-form-control ${touched.contact && errors.contact ? "is-invalid" : ""}`}
                      placeholder="9876543210"
                      value={contact}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, "");
                        if (digits.length <= 10) {
                          setContact(digits);
                          if (touched.contact) {
                            setErrors((prev) => ({ ...prev, contact: validateField("contact", digits) }));
                          }
                        }
                      }}
                      onBlur={() => handleBlur("contact")}
                      maxLength={10}
                    />
                  </div>
                  {touched.contact && errors.contact && (
                    <div className="tb-input-error"><AlertCircle size={12} /> {errors.contact}</div>
                  )}
                </div>

                <div className="tb-form-group">
                  <label className="tb-form-label">Gender *</label>
                  <div className="tb-input-wrapper">
                    <select
                      className={`form-select tb-form-select ${touched.gender && errors.gender ? "is-invalid" : ""}`}
                      value={gender}
                      onChange={(e) => {
                        setGender(e.target.value);
                        if (touched.gender) {
                          setErrors((prev) => ({ ...prev, gender: validateField("gender", e.target.value) }));
                        }
                      }}
                      onBlur={() => handleBlur("gender")}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  {touched.gender && errors.gender && (
                    <div className="tb-input-error"><AlertCircle size={12} /> {errors.gender}</div>
                  )}
                </div>
              </div>

              {/* Row 3: Password & Confirm Password */}
              <div className="tb-form-row">
                <div className="tb-form-group">
                  <label className="tb-form-label">Password *</label>
                  <div className="tb-input-wrapper">
                    <Lock size={17} className="tb-input-icon" />
                    <input
                      type={showPassword ? "text" : "password"}
                      className={`form-control tb-form-control ${touched.password && errors.password ? "is-invalid" : ""}`}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (touched.password) {
                          setErrors((prev) => ({ ...prev, password: validateField("password", e.target.value) }));
                        }
                        if (touched.confirmPassword && confirmPassword) {
                          setErrors((prev) => ({
                            ...prev,
                            confirmPassword: e.target.value !== confirmPassword ? "Passwords do not match." : ""
                          }));
                        }
                      }}
                      onBlur={() => handleBlur("password")}
                    />
                    <button
                      type="button"
                      className="tb-toggle-password-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex="-1"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {touched.password && errors.password && (
                    <div className="tb-input-error"><AlertCircle size={12} /> {errors.password}</div>
                  )}
                </div>

                <div className="tb-form-group">
                  <label className="tb-form-label">Confirm Password *</label>
                  <div className="tb-input-wrapper">
                    <Lock size={17} className="tb-input-icon" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className={`form-control tb-form-control ${touched.confirmPassword && errors.confirmPassword ? "is-invalid" : ""}`}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (touched.confirmPassword) {
                          setErrors((prev) => ({
                            ...prev,
                            confirmPassword: e.target.value !== password ? "Passwords do not match." : ""
                          }));
                        }
                      }}
                      onBlur={() => handleBlur("confirmPassword")}
                    />
                    <button
                      type="button"
                      className="tb-toggle-password-btn"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      tabIndex="-1"
                      aria-label="Toggle confirm password visibility"
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {touched.confirmPassword && errors.confirmPassword && (
                    <div className="tb-input-error"><AlertCircle size={12} /> {errors.confirmPassword}</div>
                  )}
                </div>
              </div>

              {/* Row 4: Address with Dynamic Geocoding & Nearby Center Fetch */}
              <div className="tb-form-group">
                <label className="tb-form-label">Area / Address (Auto-detects nearby centers) *</label>
                <div className="tb-input-wrapper">
                  <MapPin size={17} className="tb-input-icon" />
                  <input
                    type="text"
                    className={`form-control tb-form-control ${touched.address && errors.address ? "is-invalid" : ""}`}
                    placeholder="e.g. Ghatkopar East, Mumbai"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      if (touched.address) {
                        setErrors((prev) => ({ ...prev, address: validateField("address", e.target.value) }));
                      }
                    }}
                    onBlur={handleAddressLookup}
                  />
                  {isLocating && (
                    <div className="tb-input-spinner">
                      <Loader2 size={16} className="spinner-border spinner-border-sm text-primary" />
                    </div>
                  )}
                </div>
                {touched.address && errors.address && (
                  <div className="tb-input-error"><AlertCircle size={12} /> {errors.address}</div>
                )}
                {detectedLocationName && (
                  <small className="tb-detected-msg">
                    ✓ Detected: {detectedLocationName.split(",").slice(0, 3).join(",")}
                  </small>
                )}
                {locationError && (
                  <small className="tb-location-err-msg">
                    {locationError}
                  </small>
                )}
              </div>

              {/* Dynamic Nearby Service Centers List */}
              {serviceCenters.length > 0 && (
                <div className="tb-nearby-centers-box p-3 rounded-3 mb-4">
                  <div className="d-flex align-items-center gap-1.5 mb-2">
                    <Wrench size={15} className="text-primary" />
                    <h6 className="fw-bold mb-0 small text-dark">
                      Nearby Service Centers in Your Locality ({serviceCenters.length})
                    </h6>
                  </div>

                  <div className="d-flex flex-column gap-2 tb-nearby-scroll">
                    {serviceCenters.map((center) => (
                      <div key={center.id} className="p-2 rounded-2 bg-white border">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <strong className="small text-dark">{center.name}</strong>
                          <span className={`tb-type-pill ${center.type === "OFFICIAL" ? "official" : "partner"}`}>
                            {center.type === "OFFICIAL" ? <ShieldCheck size={11} /> : <Building2 size={11} />}
                            {center.type}
                          </span>
                        </div>
                        <p className="extra-small text-muted mb-0">
                          📍 {center.address}, {center.area}
                        </p>
                        {center.contactNumber && (
                          <p className="extra-small text-secondary mb-0 mt-0.5">
                            📞 {center.contactNumber}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="btn tb-register-submit-btn w-100 mt-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="spinner-border spinner-border-sm" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create TechBridge Account</span>
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="tb-register-card-footer">
              <span className="text-muted small">Already have an account?</span>
              <Link to="/login" className="tb-link-signin">
                Sign In
              </Link>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Register;