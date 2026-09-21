import React from 'react';
import { Link } from 'react-router-dom';
import {
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import '../Css/Footer.css';

// SVG Brand Icons
const TwitterXIcon = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
  </svg>
);

const LinkedinIcon = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const GithubIcon = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-section position-relative bg-light text-dark pt-5 pb-4 overflow-hidden">

      {/* Background Watermark Text */}
      <div className="watermark-text position-absolute top-50 start-50 translate-middle user-select-none">
        TECHBRIDGE
      </div>

      <div className="container position-relative z-2">

        {/* Main Content Grid */}
        <div className="row gy-4 mb-5 align-items-start">

          {/* 1. Brand Info */}
          <div className="col-lg-4 col-md-6 pe-lg-4">
            <h3 className="fw-bold fs-2 text-dark mb-2">TechBridge</h3>
            <div className="d-inline-flex align-items-center gap-2 px-2.5 py-1 rounded-pill bg-sky-light text-primary extra-small fw-bold mb-3">
              <span className="tb-light-dot"></span>
              <span>OEM Certified Diagnostic Network</span>
            </div>
            <p className="text-secondary small lh-base mb-3">
              India's premier hardware ecosystem connecting laptop owners with certified cleanroom service facilities, serial-verified genuine components, and real-time repair ticket telemetry.
            </p>
            <div className="d-flex align-items-center gap-2 text-muted extra-small">
              <ShieldCheck size={15} className="text-success" />
              <span>100% Genuine Parts with Standard Warranty</span>
            </div>
          </div>

          {/* 2. Explore / Quick Links */}
          <div className="col-lg-2 col-md-6 col-6 ps-lg-3">
            <h6 className="text-uppercase text-muted fw-bold small mb-3 tracking-wider">Explore</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
              <li>
                <Link to="/services" className="footer-link text-decoration-none fw-medium">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/products" className="footer-link text-decoration-none fw-medium">
                  Genuine Parts
                </Link>
              </li>
              <li>
                <Link to="/service-center" className="footer-link text-decoration-none fw-medium">
                  Service Centers
                </Link>
              </li>
              <li>
                <Link to="/blog" className="footer-link text-decoration-none fw-medium">
                  Device Care Blog
                </Link>
              </li>
              <li>
                <Link to="/about" className="footer-link text-decoration-none fw-medium">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="footer-link text-decoration-none fw-medium">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. Hardware Solutions */}
          <div className="col-lg-3 col-md-6 col-6">
            <h6 className="text-uppercase text-muted fw-bold small mb-3 tracking-wider">Hardware Care</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
              <li>
                <Link to="/products" className="footer-link text-decoration-none fw-medium">
                  OEM Laptop Batteries
                </Link>
              </li>
              <li>
                <Link to="/products" className="footer-link text-decoration-none fw-medium">
                  OLED & 144Hz Displays
                </Link>
              </li>
              <li>
                <Link to="/services" className="footer-link text-decoration-none fw-medium">
                  Chip-Level Motherboard Repair
                </Link>
              </li>
              <li>
                <Link to="/services" className="footer-link text-decoration-none fw-medium">
                  Liquid Corrosion Cleaning
                </Link>
              </li>
              <li>
                <Link to="/services" className="footer-link text-decoration-none fw-medium">
                  Thermal Compound Overhaul
                </Link>
              </li>
              <li>
                <Link to="/userdashboard" className="footer-link text-decoration-none fw-medium">
                  Track Service Ticket
                </Link>
              </li>
            </ul>
          </div>

          {/* 4. Get In Touch (PROPERLY ALIGNED - NO OVERFLOW OR CUTOFF) */}
          <div className="col-lg-3 col-md-6">
            <div className="tb-contact-pill-container">
              <h6 className="text-uppercase text-muted fw-bold small mb-3 tracking-wider">Get in Touch</h6>

              {/* Phone Card */}
              <a href="tel:+917499166215" className="contact-pill-card text-decoration-none">
                <div className="icon-box d-flex align-items-center justify-content-center rounded-3 bg-sky-light text-primary">
                  <Phone size={16} />
                </div>
                <div className="contact-text-box">
                  <span className="d-block text-muted extra-small lh-1">Customer Helpline</span>
                  <span className="fw-bold text-dark small">+91 74991 66215</span>
                </div>
              </a>

              {/* Email Card */}
              <a href="mailto:info@techbridge.com" className="contact-pill-card text-decoration-none">
                <div className="icon-box d-flex align-items-center justify-content-center rounded-3 bg-sky-light text-primary">
                  <Mail size={16} />
                </div>
                <div className="contact-text-box">
                  <span className="d-block text-muted extra-small lh-1">Support Email</span>
                  <span className="fw-bold text-dark small">info@techbridge.com</span>
                </div>
              </a>

              {/* Timings Card */}
              <div className="contact-pill-card">
                <div className="icon-box d-flex align-items-center justify-content-center rounded-3 bg-sky-light text-primary">
                  <Clock size={16} />
                </div>
                <div className="contact-text-box">
                  <span className="d-block text-muted extra-small lh-1">Support Timings</span>
                  <span className="fw-bold text-dark small">Mon–Sat: 9AM–8PM</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Social Icons Row */}
        <div className="d-flex justify-content-center align-items-center gap-2 mb-4">
          <Link to="/contact" className="social-icon-card shadow-sm" aria-label="Schedule Service" title="Schedule">
            <Calendar size={18} />
          </Link>
          <a href="tel:+917499166215" className="social-icon-card shadow-sm" aria-label="Call Helpline" title="Call">
            <Phone size={18} />
          </a>
          <a href="https://x.com" target="_blank" rel="noreferrer" className="social-icon-card shadow-sm" aria-label="Twitter X" title="Twitter">
            <TwitterXIcon size={18} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-icon-card shadow-sm" aria-label="LinkedIn" title="LinkedIn">
            <LinkedinIcon size={18} />
          </a>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="social-icon-card shadow-sm" aria-label="GitHub" title="GitHub">
            <GithubIcon size={18} />
          </a>
          <a href="mailto:info@techbridge.com" className="social-icon-card shadow-sm" aria-label="Email Support" title="Email">
            <Mail size={18} />
          </a>
        </div>

        {/* Centered Brand Square Badge */}
        <div className="d-flex justify-content-center mb-4">
          <Link to="/" className="text-decoration-none">
            <div className="brand-square-badge bg-dark rounded-4 d-flex align-items-center justify-content-center p-3 shadow">
              <span className="text-white fw-bold tracking-widest text-center">TECHBRIDGE</span>
            </div>
          </Link>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="border-top pt-4 text-center">
          <p className="text-muted extra-small mb-0">
            &copy; {currentYear} TechBridge. All rights reserved. OEM trademarks (Dell, HP, Lenovo, Apple, Asus, Samsung) belong to their respective holders.
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;