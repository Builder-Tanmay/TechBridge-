import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Headphones,
  Compass
} from "lucide-react";
import "../Css/ContactUs.css";

import heroBg from "../assets/contact.png";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    subject: "",
    message: ""
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Validation Rules
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "name":
        if (!value.trim()) {
          error = "Full name is required.";
        } else if (!/^[A-Za-z\s]+$/.test(value)) {
          error = "Name can only contain letters and spaces (no numbers).";
        } else if (value.trim().length < 3) {
          error = "Name must be at least 3 characters.";
        }
        break;

      case "phone":
        if (!value.trim()) {
          error = "10-digit mobile number is required.";
        } else if (!/^[6-9]\d{9}$/.test(value.trim())) {
          error = "Enter a valid 10-digit mobile number starting with 6-9.";
        }
        break;

      case "email":
        if (!value.trim()) {
          error = "Email address is required.";
        } else if (
          !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value.trim())
        ) {
          error = "Please enter a valid email address (e.g. name@domain.com).";
        }
        break;

      case "address":
        if (!value.trim()) {
          error = "Address / City area is required.";
        } else if (value.trim().length < 8) {
          error = "Please provide a complete address or street location (min 8 chars).";
        } else if (/^(.)\1+$/.test(value.trim()) || /(.)\1{4,}/.test(value.trim())) {
          error = "Please enter a valid realistic address (no repetitive characters).";
        }
        break;

      case "subject":
        if (!value.trim()) {
          error = "Please select or enter a topic.";
        } else if (value.trim().length < 4) {
          error = "Subject must be at least 4 characters.";
        }
        break;

      case "message":
        if (!value.trim()) {
          error = "Message details are required.";
        } else if (value.trim().length < 15) {
          error = "Please elaborate your issue or requirement (minimum 15 characters).";
        }
        break;

      default:
        break;
    }

    return error;
  };

  // Real-time Input Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Strict keystroke restrictions
    if (name === "name") {
      if (!/^[A-Za-z\s]*$/.test(value)) return;
    }

    if (name === "phone") {
      const digitsOnly = value.replace(/\D/g, "");
      if (digitsOnly.length > 10) return;
      setFormData((prev) => ({ ...prev, [name]: digitsOnly }));
      if (touched[name]) {
        setErrors((prev) => ({ ...prev, [name]: validateField(name, digitsOnly) }));
      }
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  // Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();

    const allTouched = {
      name: true,
      phone: true,
      email: true,
      address: true,
      subject: true,
      message: true
    };
    setTouched(allTouched);

    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const err = validateField(key, formData[key]);
      if (err) newErrors[key] = err;
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          name: "",
          phone: "",
          email: "",
          address: "",
          subject: "",
          message: ""
        });
        setTouched({});
        setErrors({});
      }, 5000);
    }
  };

  return (
    <div className="tb-contact-canvas">

      {/* =================================================================
          1. HALF-SCREEN HERO BANNER (~60vh, NO FADE/BLUR)
          ================================================================= */}
      <section
        className="tb-contact-hero"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="container position-relative z-2">
          <div className="row align-items-center">
            <div className="col-lg-8 col-xl-7">
              <div className="tb-contact-pill">
                <span className="tb-contact-dot"></span>
                <span>CENTRAL HARDWARE HELPDESK & SUPPORT</span>
              </div>
              <h1 className="tb-contact-hero-title">
                Connect Directly with <br />
                <span className="tb-gradient-title">TechBridge Engineers.</span>
              </h1>
              <p className="tb-contact-hero-subtext">
                Have inquiries about model component compatibility, verified diagnostics, warranty validation, or bulk service requests? Contact our technical team.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          2. MAIN CONTENT: CENTRAL OPERATIONS + FORM
          ================================================================= */}
      <section className="tb-content-section tb-section-contrast">
        <div className="container">
          <div className="row g-4">

            {/* LEFT COLUMN: CENTRAL OPERATIONS (IMAGE BACKGROUND) */}
            <div className="col-lg-5">
              <div
                className="tb-contact-info-card"
                style={{
                  backgroundImage: `url("https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80")`
                }}
              >
                <div className="tb-contact-info-overlay"></div>

                <div className="position-relative z-2">

                  {/* FIXED PILL BADGE */}
                  <div className="tb-assist-pill">
                    <Headphones size={13} className="text-primary-light" />
                    <span>Immediate Technical Assistance</span>
                  </div>

                  <h3 className="fw-bold mb-2 text-white">Central Operations</h3>
                  <p className="text-white-50 small mb-4 lh-base">
                    Reach out via our direct communication lines or visit our primary cleanroom facility in Mumbai.
                  </p>

                  <div className="tb-contact-item">
                    <div className="tb-contact-icon"><Phone size={18} /></div>
                    <div>
                      <span className="d-block text-white-50 extra-small">Customer Helpline</span>
                      <strong className="text-white fs-6">+91 74991 66215</strong>
                    </div>
                  </div>

                  <div className="tb-contact-item">
                    <div className="tb-contact-icon"><Mail size={18} /></div>
                    <div>
                      <span className="d-block text-white-50 extra-small">Email Support</span>
                      <strong className="text-white fs-6">support@techbridge.com</strong>
                    </div>
                  </div>

                  <div className="tb-contact-item">
                    <div className="tb-contact-icon"><MapPin size={18} /></div>
                    <div>
                      <span className="d-block text-white-50 extra-small">Engineering Headquarters</span>
                      <span className="text-white small d-block">
                        TechBridge Engineering Hub, Ghatkopar East, Mumbai, Maharashtra 400077
                      </span>
                    </div>
                  </div>

                  <div className="tb-contact-item">
                    <div className="tb-contact-icon"><Clock size={18} /></div>
                    <div>
                      <span className="d-block text-white-50 extra-small">Operating Schedule</span>
                      <span className="text-white small d-block">
                        Monday – Saturday: 9:00 AM – 8:00 PM IST
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-top border-white border-opacity-20 mt-4 position-relative z-2">
                  <div className="d-flex align-items-center gap-2 text-white-50 small">
                    <ShieldCheck size={18} className="text-success flex-shrink-0" />
                    <span className="text-white">Authorized OEM parts warranty with live ticket telemetry</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: VALIDATED FORM */}
            <div className="col-lg-7">
              <div className="tb-contact-form-card">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <h4 className="fw-bold text-dark mb-0">Submit a Service Ticket</h4>
                  <span className="extra-small text-muted">* Mandatory Fields</span>
                </div>
                <p className="text-muted small mb-4">
                  Provide your contact information and requirement. Our certified technicians will respond within 2–4 hours.
                </p>

                {submitted && (
                  <div className="alert alert-success d-flex align-items-center gap-2.5 py-3 rounded-3 mb-4 shadow-sm border-0" role="alert">
                    <CheckCircle2 size={20} className="text-success flex-shrink-0" />
                    <div className="small fw-semibold">
                      Thank you! Your ticket inquiry has been received. A technician will contact you shortly on your verified phone or email.
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate>

                  {/* Row 1: Name & Phone */}
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="tb-form-label">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        className={`form-control tb-form-input ${touched.name && errors.name ? "is-invalid" : ""}`}
                        placeholder="e.g. Rahul Sharma"
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        maxLength={50}
                      />
                      {touched.name && errors.name && (
                        <div className="tb-error-msg"><AlertCircle size={12} /> {errors.name}</div>
                      )}
                    </div>

                    <div className="col-md-6">
                      <label className="tb-form-label">10-Digit Mobile Number *</label>
                      <div className="input-group">
                        <span className="input-group-text tb-phone-prefix">+91</span>
                        <input
                          type="tel"
                          name="phone"
                          className={`form-control tb-form-input ${touched.phone && errors.phone ? "is-invalid" : ""}`}
                          placeholder="9876543210"
                          value={formData.phone}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          maxLength={10}
                        />
                      </div>
                      {touched.phone && errors.phone && (
                        <div className="tb-error-msg"><AlertCircle size={12} /> {errors.phone}</div>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Email & City / Address */}
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="tb-form-label">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        className={`form-control tb-form-input ${touched.email && errors.email ? "is-invalid" : ""}`}
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {touched.email && errors.email && (
                        <div className="tb-error-msg"><AlertCircle size={12} /> {errors.email}</div>
                      )}
                    </div>

                    <div className="col-md-6">
                      <label className="tb-form-label">Location / Area Address *</label>
                      <input
                        type="text"
                        name="address"
                        className={`form-control tb-form-input ${touched.address && errors.address ? "is-invalid" : ""}`}
                        placeholder="e.g. Andheri East, Mumbai"
                        value={formData.address}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {touched.address && errors.address && (
                        <div className="tb-error-msg"><AlertCircle size={12} /> {errors.address}</div>
                      )}
                    </div>
                  </div>

                  {/* Row 3: Subject / Topic */}
                  <div className="mb-3">
                    <label className="tb-form-label">Topic / Subject *</label>
                    <input
                      type="text"
                      name="subject"
                      className={`form-control tb-form-input ${touched.subject && errors.subject ? "is-invalid" : ""}`}
                      placeholder="e.g. Dell XPS 15 Battery replacement or motherboard diagnostics"
                      value={formData.subject}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {touched.subject && errors.subject && (
                      <div className="tb-error-msg"><AlertCircle size={12} /> {errors.subject}</div>
                    )}
                  </div>

                  {/* Row 4: Message Details */}
                  <div className="mb-4">
                    <label className="tb-form-label">Detailed Requirement or Symptoms *</label>
                    <textarea
                      name="message"
                      rows="4"
                      className={`form-control tb-form-input ${touched.message && errors.message ? "is-invalid" : ""}`}
                      placeholder="Please specify your laptop model, the exact fault (e.g. liquid spill, screen flicker, battery drain), and any past repairs..."
                      value={formData.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    ></textarea>
                    {touched.message && errors.message && (
                      <div className="tb-error-msg"><AlertCircle size={12} /> {errors.message}</div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="btn tb-btn-submit"
                  >
                    <Send size={16} /> Send Technical Inquiry
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =================================================================
          3. BOTTOM CTA BANNER
          ================================================================= */}
      <section className="tb-cta-section">
        <div className="container text-center">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h2 className="tb-cta-headline">Need Urgent Physical Inspection?</h2>
              <p className="tb-cta-subtext">
                Locate our authorized brand service centers and partner diagnostic clinics across Mumbai with live GPS navigation.
              </p>
              <div className="d-flex flex-wrap justify-content-center gap-3">
                <a
                  href="/service-center"
                  className="tb-btn-cta-white text-decoration-none"
                >
                  <Compass size={17} /> Open Service Center Locator
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default ContactUs;