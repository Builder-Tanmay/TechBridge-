import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Mail,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  RotateCcw,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Check
} from "lucide-react";
import { API_BASE_URL } from "../config/api";
import "../Css/ForgotPassword.css";

import heroBg from "../assets/hero-banner.png";

const BASE_URL = API_BASE_URL || "http://localhost:8080";

const ForgotPassword = () => {
  const navigate = useNavigate();

  // Step tracker: 1 = Email, 2 = OTP, 3 = New Password
  const [step, setStep] = useState(1);

  // Form values
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Loading & Feedback State
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Toast Helper
  const showFeedback = (message, type = "success") => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 4500);
  };

  // Helper to make API call with fallback between /api/user and /user
  const postWithFallback = async (primaryPath, fallbackPath, params) => {
    try {
      return await axios.post(`${BASE_URL}${primaryPath}`, null, { params });
    } catch (err) {
      if (err.response?.status === 404) {
        return await axios.post(`${BASE_URL}${fallbackPath}`, null, { params });
      }
      throw err;
    }
  };

  // Step 1: Send OTP Handler
  const handleSendOtp = async () => {
    if (!email.trim()) {
      showFeedback("Please enter your registered email address.", "error");
      return;
    }
    setLoading(true);
    try {
      const res = await postWithFallback(
        "/api/user/send-otp",
        "/user/send-otp",
        { email: email.trim() }
      );
      showFeedback(typeof res.data === "string" ? res.data : "Verification OTP sent to your email!", "success");
      setStep(2);
    } catch (err) {
      console.error("Send OTP Error:", err);
      const errMsg = err.response?.data?.error || err.response?.data || "Failed to send OTP. Please verify your email address.";
      showFeedback(errMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Validate OTP Handler
  const handleValidateOtp = async () => {
    if (!otp.trim()) {
      showFeedback("Please enter the 6-digit verification OTP.", "error");
      return;
    }
    setLoading(true);
    try {
      const res = await postWithFallback(
        "/api/user/validate-otp",
        "/user/validate-otp",
        { email: email.trim(), otp: otp.trim() }
      );
      showFeedback(typeof res.data === "string" ? res.data : "OTP verified successfully!", "success");
      setStep(3);
    } catch (err) {
      console.error("Validate OTP Error:", err);
      const errMsg = err.response?.data?.error || err.response?.data || "Invalid or expired OTP! Please try again.";
      showFeedback(errMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password Handler
  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      showFeedback("Please fill both password fields.", "error");
      return;
    }
    if (newPassword.length < 6) {
      showFeedback("New password must be at least 6 characters long.", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showFeedback("Passwords do not match! Please check and retry.", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await postWithFallback(
        "/api/user/reset-password",
        "/user/reset-password",
        { email: email.trim(), newPassword }
      );
      showFeedback(typeof res.data === "string" ? res.data : "Password reset successfully! Redirecting...", "success");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error("Reset Password Error:", err);
      const errMsg = err.response?.data?.error || err.response?.data || "Failed to reset password.";
      showFeedback(errMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="tb-forgot-page"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <div className="container position-relative z-2">
        <div className="tb-forgot-container mx-auto">

          {/* Floating Feedback Alert */}
          {feedback && (
            <div className={`tb-toast-notification tb-toast-${feedback.type}`}>
              {feedback.type === "success" && <CheckCircle2 size={18} className="text-success flex-shrink-0" />}
              {feedback.type === "info" && <Sparkles size={18} className="text-primary flex-shrink-0" />}
              {feedback.type === "error" && <AlertCircle size={18} className="text-danger flex-shrink-0" />}
              <span>{feedback.message}</span>
            </div>
          )}

          {/* Elevated Forgot Password Card */}
          <div className="tb-forgot-card">

            {/* Header with Official Logo */}
            <div className="text-center mb-4">
              <Link to="/" className="tb-main-logo-pill text-decoration-none">
                <span className="tb-logo-text">TECHBRIDGE</span>
              </Link>
              <h2 className="tb-forgot-title mt-3 mb-1">Reset Password</h2>
              <p className="tb-forgot-subtitle">
                Follow the 3-step verification process to recover your account securely.
              </p>
            </div>

            {/* Step Progression Timeline */}
            <div className="tb-steps-indicator">
              <div className={`tb-step-item ${step >= 1 ? (step > 1 ? "completed" : "active") : ""}`}>
                <div className="tb-step-num">
                  {step > 1 ? <Check size={14} strokeWidth={3} /> : "1"}
                </div>
                <span>Email</span>
              </div>

              <div className={`tb-step-line ${step >= 2 ? "active" : ""}`}></div>

              <div className={`tb-step-item ${step >= 2 ? (step > 2 ? "completed" : "active") : ""}`}>
                <div className="tb-step-num">
                  {step > 2 ? <Check size={14} strokeWidth={3} /> : "2"}
                </div>
                <span>OTP</span>
              </div>

              <div className={`tb-step-line ${step >= 3 ? "active" : ""}`}></div>

              <div className={`tb-step-item ${step === 3 ? "active" : ""}`}>
                <div className="tb-step-num">3</div>
                <span>Password</span>
              </div>
            </div>

            {/* Forms */}
            <form onSubmit={(e) => e.preventDefault()} noValidate>

              {/* STEP 1: EMAIL */}
              {step === 1 && (
                <div>
                  <div className="mb-3">
                    <label className="tb-input-label">Registered Email Address</label>
                    <div className="tb-input-wrapper">
                      <Mail size={17} className="tb-field-icon" />
                      <input
                        type="email"
                        className="form-control tb-input-control"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn tb-auth-submit-btn w-100"
                    onClick={handleSendOtp}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="spinner-border spinner-border-sm" />
                        <span>Sending OTP...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Verification OTP</span>
                        <ArrowRight size={17} />
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* STEP 2: OTP */}
              {step === 2 && (
                <div>
                  <div className="mb-3">
                    <label className="tb-input-label">Enter 6-Digit Verification OTP</label>
                    <div className="tb-input-wrapper">
                      <KeyRound size={17} className="tb-field-icon" />
                      <input
                        type="text"
                        className="form-control tb-input-control text-center letter-spacing-otp"
                        placeholder="123456"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        disabled={loading}
                        maxLength={6}
                        required
                      />
                    </div>
                  </div>

                  <div className="d-flex gap-2 mt-3">
                    <button
                      type="button"
                      className="btn tb-btn-secondary-outline flex-grow-1"
                      onClick={handleSendOtp}
                      disabled={loading}
                    >
                      <RotateCcw size={15} />
                      <span>Resend OTP</span>
                    </button>

                    <button
                      type="button"
                      className="btn tb-auth-submit-btn flex-grow-1 mt-0"
                      onClick={handleValidateOtp}
                      disabled={loading}
                    >
                      {loading ? (
                        <Loader2 size={18} className="spinner-border spinner-border-sm" />
                      ) : (
                        <>
                          <span>Verify OTP</span>
                          <CheckCircle2 size={17} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: NEW PASSWORD */}
              {step === 3 && (
                <div>
                  <div className="mb-3">
                    <label className="tb-input-label">New Password</label>
                    <div className="tb-input-wrapper">
                      <Lock size={17} className="tb-field-icon" />
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control tb-input-control"
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        disabled={loading}
                        required
                      />
                      <button
                        type="button"
                        className="tb-eye-btn"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex="-1"
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="tb-input-label">Confirm New Password</label>
                    <div className="tb-input-wrapper">
                      <Lock size={17} className="tb-field-icon" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        className="form-control tb-input-control"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={loading}
                        required
                      />
                      <button
                        type="button"
                        className="tb-eye-btn"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        tabIndex="-1"
                        aria-label="Toggle confirm password visibility"
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn tb-auth-submit-btn w-100"
                    onClick={handleResetPassword}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="spinner-border spinner-border-sm" />
                        <span>Updating Password...</span>
                      </>
                    ) : (
                      <>
                        <span>Set New Password</span>
                        <ShieldCheck size={17} />
                      </>
                    )}
                  </button>
                </div>
              )}

            </form>

            {/* Footer */}
            <div className="tb-forgot-card-footer">
              <span className="text-muted small">Remembered your password?</span>
              <Link to="/login" className="tb-link-signin">
                Back to Sign In
              </Link>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;