import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Laptop,
  Cpu,
  ShieldCheck,
  Flame,
  HardDrive,
  Wrench,
  Check,
  ArrowRight,
  Sparkles,
  MapPin,
  Clock,
  Zap,
  HelpCircle,
  ChevronDown,
  Navigation,
  Compass
} from "lucide-react";
import ServiceCenterLocator from "../Components/ServiceCenterLocator";
import heroBg from "../assets/service.png";
import "../Css/Services.css";

const Services = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const scrollToMap = () => {
    const el = document.getElementById("map-explorer-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const serviceOfferings = [
    {
      icon: <Laptop size={26} />,
      title: "Display & Screen Replacement",
      tag: "Same Day Swap",
      price: "From ₹2,499",
      desc: "Original IPS, OLED, FHD and high-refresh display panel replacements for Apple MacBook, Dell, HP, Lenovo, and Asus laptops.",
      perks: [
        "Zero frame-gap OEM fitting",
        "Color gamut & brightness calibration",
        "Zero dead-pixel warranty"
      ]
    },
    {
      icon: <Cpu size={26} />,
      title: "Motherboard & Chip-Level Repair",
      tag: "Micro-Soldering",
      price: "From ₹1,499",
      desc: "Component-level micro-soldering, power IC replacement, short-circuit diagnostics, GPU reballing, and liquid damage recovery.",
      perks: [
        "Advanced oscilloscope diagnostic",
        "Full board ultrasonic cleaning",
        "90-Day service warranty"
      ]
    },
    {
      icon: <Flame size={26} />,
      title: "Thermal Overhaul & De-Dusting",
      tag: "Prevents Throttling",
      price: "From ₹699",
      desc: "High-grade thermal compound re-application, fan bearing lubrication, and comprehensive interior dust extraction.",
      perks: [
        "Drops CPU/GPU temps by up to 15°C",
        "Eliminates thermal throttling",
        "Silent fan acoustic restoration"
      ]
    },
    {
      icon: <HardDrive size={26} />,
      title: "RAM & Gen4 NVMe SSD Boost",
      tag: "Express Speed",
      price: "From ₹1,199",
      desc: "Upgrade slow workstations and laptops with genuine high-speed NVMe PCIe 4.0 SSDs and DDR4/DDR5 memory modules.",
      perks: [
        "Free Windows / OS data cloning",
        "Read/write performance benchmark",
        "Up to 5 years brand warranty"
      ]
    },
    {
      icon: <Zap size={26} />,
      title: "Battery & DC Power Jack Repair",
      tag: "Original Cells",
      price: "From ₹1,799",
      desc: "Authentic OEM high-cycle replacement batteries and Type-C / DC-in power jack micro-soldering with surge protection checks.",
      perks: [
        "Full battery health cycle calibration",
        "Safe surge & short protection",
        "1-Year warranty on batteries"
      ]
    },
    {
      icon: <Wrench size={26} />,
      title: "Broken Hinge & Chassis Repair",
      tag: "Structural Fix",
      price: "From ₹899",
      desc: "Precision fabrication, metal bracket reinforcement, and base chassis repair for laptops with broken hinges or loose lids.",
      perks: [
        "Smooth, laser-aligned lid opening",
        "High-tensile epoxy reinforcement",
        "Prevents future screen cracking"
      ]
    }
  ];

  const processSteps = [
    {
      step: "01",
      title: "Locate or Book Online",
      desc: "Find your nearest official or partner service center on the map or request doorstep pickup.",
      icon: <MapPin size={22} />
    },
    {
      step: "02",
      title: "Free Initial Diagnostics",
      desc: "Certified technicians perform a multi-point hardware inspection and provide an upfront transparent quote.",
      icon: <Wrench size={22} />
    },
    {
      step: "03",
      title: "OEM Genuine Repair",
      desc: "Your device is repaired using authentic manufacturer spare parts inside static-safe cleanroom labs.",
      icon: <Cpu size={22} />
    },
    {
      step: "04",
      title: "Quality Tested & Returned",
      desc: "Post-repair stress testing and benchmark verification backed by a standard 90-day warranty.",
      icon: <ShieldCheck size={22} />
    }
  ];

  const faqs = [
    {
      q: "What is the difference between Official Brand Centers and Partner Clinics?",
      a: "Official Brand Centers (Dell, HP, Apple, Lenovo, Asus) are authorized directly by the manufacturer and handle warranty claims with 100% OEM parts. Partner Clinics are verified multi-brand expert labs specialized in out-of-warranty repairs, motherboard micro-soldering, and affordable quick fixes."
    },
    {
      q: "How does the GPS locator find the closest service center?",
      a: "When you grant location access, our system calculates spherical distances in kilometers using the real-world GPS coordinates of certified service hubs across Mumbai (Ghatkopar, Andheri, Bandra, Dadar, Borivali, Thane, Vashi, etc.) and lists the closest centers first."
    },
    {
      q: "Do you offer doorstep pickup and drop-off?",
      a: "Yes! If you are unable to visit a service center physically, you can open a service ticket or log into your User Dashboard to schedule an insured courier pickup right from your home or workplace."
    },
    {
      q: "Are replacement spare parts covered under warranty?",
      a: "Yes. All replacement screens, batteries, keyboards, and SSDs come with manufacturer warranty ranging from 6 months to 5 years, along with service warranty from TechBridge."
    }
  ];

  return (
    <div className="tb-services-canvas">

      {/* 1. SERVICES HERO BANNER - NO OVERLAY */}
      <section
        className="tb-services-hero"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="container position-relative z-2">
          <div className="row align-items-center">
            <div className="col-lg-8 col-xl-7">
              <div className="tb-services-pill">
                <span className="tb-services-dot"></span>
                <span>CERTIFIED SERVICE & REPAIR HUBS</span>
              </div>
              <h1 className="tb-services-hero-title">
                Locate Authorized Centers & <br />
                <span className="tb-gradient-title">Factory-Grade Repairs.</span>
              </h1>
              <p className="tb-services-hero-subtext">
                Discover verified brand service centers (Dell, HP, Lenovo, Apple, Asus) and certified chip-level repair labs with real-time GPS distance calculation and OEM warranty.
              </p>

              <div className="d-flex flex-wrap gap-3 mt-4">
                <button
                  type="button"
                  onClick={scrollToMap}
                  className="btn tb-btn-hero-primary"
                >
                  <Compass size={18} /> Locate Nearby Centers
                </button>
                <Link
                  to="/userdashboard"
                  className="btn tb-btn-hero-secondary text-decoration-none"
                >
                  <Wrench size={16} /> Book Service Ticket
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE SERVICE CENTER LOCATOR & MAP EXPLORER */}
      <section id="map-explorer-section" className="tb-content-section bg-white border-bottom">
        <div className="container tb-services-main-container">
          <div className="text-center mb-4">
            <span className="tb-eyebrow">Real-Time Geolocation</span>
            <h2 className="tb-headline">Find Verified Service Centers Near You</h2>
            <p className="tb-subtext mx-auto" style={{ maxWidth: "600px" }}>
              Filter between brand-authorized service facilities and partner diagnostic clinics by distance and locality.
            </p>
          </div>
          <ServiceCenterLocator />
        </div>
      </section>

      {/* 3. CORE REPAIR SERVICES CATALOG */}
      <section className="tb-content-section tb-section-contrast">
        <div className="container tb-services-main-container">
          <div className="text-center mb-5">
            <span className="tb-eyebrow">Hardware Solutions</span>
            <h2 className="tb-headline">Expert Diagnostic & Repair Offerings</h2>
            <p className="tb-subtext mx-auto" style={{ maxWidth: "620px" }}>
              Every device is inspected with calibrated laboratory equipment and fixed by certified engineers using factory-grade procedures.
            </p>
          </div>

          <div className="row g-4">
            {serviceOfferings.map((srv, idx) => (
              <div key={idx} className="col-md-6 col-lg-4">
                <div className="tb-service-offering-card p-4 rounded-4 bg-white border h-100 d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="tb-srv-icon-box rounded-3 d-flex align-items-center justify-content-center">
                        {srv.icon}
                      </div>
                      <div className="text-end">
                        <span className="badge bg-light text-dark border extra-small fw-bold mb-1">
                          {srv.tag}
                        </span>
                        <div className="fw-bold text-primary small">{srv.price}</div>
                      </div>
                    </div>

                    <h5 className="fw-bold text-dark mb-2">{srv.title}</h5>
                    <p className="text-muted small mb-3 lh-base">{srv.desc}</p>

                    <ul className="list-unstyled mb-4">
                      {srv.perks.map((p, pIdx) => (
                        <li key={pIdx} className="extra-small text-secondary d-flex align-items-center gap-2 mb-1.5">
                          <Check size={14} className="text-success flex-shrink-0" /> {p}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    to="/userdashboard"
                    className="btn tb-btn-card-action w-100 py-2 fw-semibold d-flex align-items-center justify-content-center gap-1.5 text-decoration-none"
                  >
                    Book This Repair <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. 4-STEP REPAIR WORKFLOW */}
      <section className="tb-content-section bg-white border-top">
        <div className="container tb-services-main-container">
          <div className="text-center mb-5">
            <span className="tb-eyebrow">Transparent Process</span>
            <h2 className="tb-headline">How Service Works</h2>
            <p className="tb-subtext mx-auto" style={{ maxWidth: "560px" }}>
              Effortless laptop servicing from instant GPS center discovery to certified completion.
            </p>
          </div>

          <div className="row g-4">
            {processSteps.map((st, idx) => (
              <div key={idx} className="col-sm-6 col-lg-3">
                <div className="tb-workflow-card text-center p-4 rounded-4 border bg-light h-100">
                  <div className="tb-workflow-badge-wrap mx-auto mb-3">
                    <span className="tb-workflow-number">{st.step}</span>
                    <div className="tb-workflow-icon">{st.icon}</div>
                  </div>
                  <h6 className="fw-bold text-dark mb-1">{st.title}</h6>
                  <p className="extra-small text-muted mb-0 lh-base">{st.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FREQUENTLY ASKED QUESTIONS */}
      <section className="tb-content-section tb-section-contrast border-top">
        <div className="container tb-services-main-container">
          <div className="text-center mb-5">
            <span className="tb-eyebrow">Clear Answers</span>
            <h2 className="tb-headline mb-2">Frequently Asked Questions</h2>
            <p className="tb-subtext mx-auto" style={{ maxWidth: "540px" }}>
              Everything you need to know about centers, genuine parts, warranties, and doorstep pickup.
            </p>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-9 col-xl-8">
              <div className="tb-faq-wrapper d-flex flex-column gap-3">
                {faqs.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div
                      key={idx}
                      className={`tb-faq-card ${isOpen ? "active" : ""}`}
                      onClick={() => toggleFaq(idx)}
                    >
                      <button
                        type="button"
                        className="tb-faq-trigger"
                        aria-expanded={isOpen}
                      >
                        <span className="tb-faq-question">{faq.q}</span>
                        <div className="tb-faq-icon-bubble">
                          <ChevronDown
                            size={18}
                            className={`tb-faq-chevron ${isOpen ? "rotate-180" : ""}`}
                          />
                        </div>
                      </button>

                      {isOpen && (
                        <div className="tb-faq-body">
                          <p className="tb-faq-answer mb-0">
                            {faq.a}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. BOTTOM CALL TO ACTION */}
      <section className="tb-cta-section">
        <div className="container text-center">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h2 className="tb-cta-headline">Need a Specific Hardware Replacement?</h2>
              <p className="tb-cta-subtext">
                Explore our real-time inventory of original laptop batteries, screens, adapters, keyboards, and NVMe SSDs.
              </p>
              <div className="d-flex flex-wrap justify-content-center gap-3">
                <Link
                  to="/products"
                  className="tb-btn-cta-white text-decoration-none"
                >
                  Browse Parts Catalog <ArrowRight size={17} />
                </Link>
                <Link
                  to="/userdashboard"
                  className="tb-btn-cta-outline text-decoration-none"
                >
                  Open Support Ticket
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Services;