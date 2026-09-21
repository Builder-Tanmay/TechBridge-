import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Loader2,
  AlertCircle
} from "lucide-react";
import "../Css/Login.css";

import heroBg from "../assets/hero-banner.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Validation States
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const navigate = useNavigate();

  // Field validation rules
  const validateField = (name, value) => {
    let error = "";
    if (name === "email") {
      if (!value.trim()) {
        error = "Email address is required.";
      } else if (
        !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value.trim())
      ) {
        error = "Enter a valid email address (e.g. name@example.com).";
      }
    }

    if (name === "password") {
      if (!value) {
        error = "Password is required.";
      } else if (value.length < 6) {
        error = "Password must be at least 6 characters.";
      }
    }
    return error;
  };

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    if (touched.email) {
      setErrors((prev) => ({ ...prev, email: validateField("email", val) }));
    }
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    if (touched.password) {
      setErrors((prev) => ({ ...prev, password: validateField("password", val) }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const val = field === "email" ? email : password;
    setErrors((prev) => ({ ...prev, [field]: validateField(field, val) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched({ email: true, password: true });

    const emailErr = validateField("email", email);
    const passErr = validateField("password", password);

    if (emailErr || passErr) {
      setErrors({ email: emailErr, password: passErr });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/user/login",
        null,
        {
          params: {
            email: email.trim(),
            password: password
          }
        }
      );

      const loggedInUser = response.data;

      // Save session into localStorage
      localStorage.setItem("user", JSON.stringify({
        id: loggedInUser.id,
        fullname: loggedInUser.fullName || loggedInUser.fullname,
        email: loggedInUser.email,
        role: loggedInUser.role,
        user: loggedInUser
      }));

      // Notify app components (e.g. Navbar)
      window.dispatchEvent(new CustomEvent("auth-change"));

      const displayName = loggedInUser.fullName || loggedInUser.fullname || "User";
      alert(`Welcome back, ${displayName}!`);

      // Role-based routing
      const userRole = loggedInUser.role ? loggedInUser.role.toString().toUpperCase() : "";
      if (userRole === "ADMIN") {
        navigate("/admindashboard");
      } else {
        navigate("/userdashboard");
      }

    } catch (error) {
      console.error("Login Error:", error);
      if (error.response && error.response.data) {
        alert(typeof error.response.data === "string" ? error.response.data : "Invalid Email or Password!");
      } else {
        alert("Server connection failed. Make sure your Spring Boot backend is running!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="tb-auth-page"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <div className="container position-relative z-2">
        <div className="tb-auth-wrapper mx-auto">

          <div className="tb-auth-card">

            {/* Header with TechBridge Logo Badge */}
            <div className="text-center mb-4">
              <Link to="/" className="tb-main-logo-pill text-decoration-none">
                <span className="tb-logo-text">TECHBRIDGE</span>
              </Link>
              <h2 className="tb-auth-title mt-3 mb-1">Welcome Back</h2>
              <p className="tb-auth-subtitle">
                Sign in to manage your laptop repairs, service telemetry, and spare parts orders.
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} noValidate>

              {/* Email Address */}
              <div className="mb-3">
                <label className="tb-input-label">Email Address</label>
                <div className="tb-input-wrapper">
                  <Mail size={17} className="tb-field-icon" />
                  <input
                    type="email"
                    className={`form-control tb-input-control ${touched.email && errors.email ? "is-invalid" : ""}`}
                    placeholder="name@example.com"
                    value={email}
                    onChange={handleEmailChange}
                    onBlur={() => handleBlur("email")}
                  />
                </div>
                {touched.email && errors.email && (
                  <div className="tb-input-error">
                    <AlertCircle size={13} /> {errors.email}
                  </div>
                )}
              </div>

              {/* Password Field */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="tb-input-label mb-0">Password</label>
                  <Link to="/forgot" className="tb-link-forgot">
                    Forgot Password?
                  </Link>
                </div>
                <div className="tb-input-wrapper">
                  <Lock size={17} className="tb-field-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`form-control tb-input-control ${touched.password && errors.password ? "is-invalid" : ""}`}
                    placeholder="••••••••"
                    value={password}
                    onChange={handlePasswordChange}
                    onBlur={() => handleBlur("password")}
                  />
                  <button
                    type="button"
                    className="tb-eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex="-1"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                {touched.password && errors.password && (
                  <div className="tb-input-error">
                    <AlertCircle size={13} /> {errors.password}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn tb-auth-submit-btn w-100"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="spinner-border spinner-border-sm" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </form>

            {/* Footer Registration Link */}
            <div className="tb-auth-card-footer">
              <span className="text-muted small">Don't have an account?</span>
              <Link to="/register" className="tb-link-signup">
                Create one now
              </Link>
            </div>

            {/* Security Trust Badges */}
            <div className="tb-trust-footer-row">
              <div className="d-flex align-items-center gap-1.5 text-muted extra-small">
                <ShieldCheck size={14} className="text-primary" />
                <span>OEM Verified Hub</span>
              </div>
              <div className="d-flex align-items-center gap-1.5 text-muted extra-small">
                <Cpu size={14} className="text-primary" />
                <span>Encrypted Telemetry</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;