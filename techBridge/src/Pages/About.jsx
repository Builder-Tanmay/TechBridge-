import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Clock,
  Wrench,
  Star,
  CheckCircle2,
  Layers,
  Cpu,
  ArrowRight,
  Sparkles,
  Users
} from 'lucide-react';
import '../Css/About.css';

import heroBg from '../assets/aboutus.png';
import technicianImg from '../assets/img1.png';

const About = () => {
  const navigate = useNavigate();

  const reviews = [
    {
      stars: 5,
      quote: "TechBridge rescued our water-damaged MacBook Pro motherboard when another shop quoted a total unit replacement. Saved us over ₹65,000 and 3 weeks of work downtime.",
      author: "Raj Kadam",
      role: "Lead Architect, Storiux",
      initials: "RK"
    },
    {
      stars: 5,
      quote: "The model-matched spare parts catalog is unmatched. OEM genuine batteries arrived next day for our entire fleet of ThinkPads with verified manufacturer serials.",
      author: "Yash Jadhav",
      role: "IT Operations Manager",
      initials: "YJ"
    },
    {
      stars: 5,
      quote: "Transparent live ticket tracking gave me absolute peace of mind. I could watch the triage stages in real time without calling customer support once.",
      author: "Isha Patil",
      role: "Senior Fullstack Developer",
      initials: "IP"
    }
  ];

  return (
    <div className="tb-about-canvas">

      {/* =================================================================
          1. HALF-SCREEN HERO BANNER (~50vh) - NO FADE OVERLAY
          ================================================================= */}
      <section
        className="tb-about-hero"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="container position-relative z-2">
          <div className="row align-items-center">
            <div className="col-lg-8 col-xl-7">
              <div className="tb-about-pill">
                <span className="tb-about-dot"></span>
                <span>ABOUT TECHBRIDGE</span>
              </div>
              <h1 className="tb-about-hero-title">
                Building Trust in <br />
                <span className="tb-gradient-title">Laptop Care & Service.</span>
              </h1>
              <p className="tb-about-hero-subtext">
                Learn why TechBridge was founded, how our multi-brand ecosystem bridges the disconnect in laptop repair, and how we keep thousands of laptops running at peak performance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          2. CORE MISSION & WHAT TECHBRIDGE DOES
          ================================================================= */}
      <section className="tb-content-section bg-white">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <div className="tb-about-media-wrapper">
                <img
                  src={technicianImg}
                  alt="Certified technician servicing laptop"
                  className="tb-about-framed-img"
                />
                <div className="tb-about-badge-card">
                  <div className="tb-about-stat-num">100%</div>
                  <div className="tb-about-stat-label">Model-matched OEM parts & authorized facility routing</div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <span className="tb-eyebrow">Our Mission</span>
              <h2 className="tb-headline">Why We Created TechBridge</h2>
              <p className="tb-subtext mb-3">
                When a laptop breaks down, users often face a painful choice: risk visiting roadside repair shops that swap parts with unverified clones, call long-hold corporate helplines, or blindly order duplicate parts online that fail within weeks.
              </p>
              <p className="tb-subtext mb-4">
                <strong>TechBridge</strong> was built to unify this scattered process into a clean, transparent platform. By integrating manufacturer networks, certified diagnostic hubs, genuine replacement inventories, and real-time repair telematics, we eliminate guesswork and restore trust.
              </p>

              <div className="row g-3">
                <div className="col-sm-6">
                  <div className="tb-about-box">
                    <CheckCircle2 size={20} className="text-primary mb-2" />
                    <h6 className="fw-bold mb-1">Centralized Access</h6>
                    <p className="small text-muted mb-0">No more checking dozens of brand websites. Access Dell, HP, Lenovo, Apple, and Asus care in one hub.</p>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="tb-about-box">
                    <ShieldCheck size={20} className="text-primary mb-2" />
                    <h6 className="fw-bold mb-1">Authenticity Guaranteed</h6>
                    <p className="small text-muted mb-0">Every battery, keyboard, screen, and charger is verified against exact laptop serial and model codes.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          3. FOUR FOUNDATIONAL PILLARS
          ================================================================= */}
      <section className="tb-content-section tb-section-contrast border-top">
        <div className="container">
          <div className="text-center mb-5">
            <span className="tb-eyebrow">Platform Values</span>
            <h2 className="tb-headline">The TechBridge Standard</h2>
            <p className="tb-subtext mx-auto" style={{ maxWidth: '620px' }}>
              Four guiding principles behind every service ticket, spare part order, and maintenance reminder.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-md-6 col-lg-3">
              <div className="tb-pillar-card">
                <div className="tb-pillar-icon-box">
                  <ShieldCheck size={24} />
                </div>
                <h5>Genuine Parts Only</h5>
                <p className="small text-muted mb-0">
                  We strictly filter out unverified counterfeits. All replacement parts come directly from authorized manufacturer pipelines with valid warranty coverage.
                </p>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="tb-pillar-card">
                <div className="tb-pillar-icon-box">
                  <Clock size={24} />
                </div>
                <h5>Full Live Visibility</h5>
                <p className="small text-muted mb-0">
                  Track tickets through every phase: Received, In Progress, Diagnostics, and Completed. Never call a support desk repeatedly asking for status.
                </p>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="tb-pillar-card">
                <div className="tb-pillar-icon-box">
                  <Sparkles size={24} />
                </div>
                <h5>Preventive Intelligence</h5>
                <p className="small text-muted mb-0">
                  TechBridge looks at your service history and issues automatic reminders before thermal paste dries out or fans clog, preventing expensive chip breakdowns.
                </p>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="tb-pillar-card">
                <div className="tb-pillar-icon-box">
                  <Wrench size={24} />
                </div>
                <h5>Class-100 Cleanroom QA</h5>
                <p className="small text-muted mb-0">
                  All micro-soldering, board repairs, and display replacements are conducted in calibrated, static-free cleanroom environments.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          4. WHO USES TECHBRIDGE (PLATFORM ROLES)
          ================================================================= */}
      <section className="tb-content-section bg-white border-top">
        <div className="container">
          <div className="text-center mb-5">
            <span className="tb-eyebrow">Multi-Tenant Network</span>
            <h2 className="tb-headline">Who Uses This Platform?</h2>
            <p className="tb-subtext mx-auto" style={{ maxWidth: '600px' }}>
              Designed to connect users, company service staff, and platform administrators seamlessly.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="tb-about-role-card">
                <div className="tb-role-badge">Laptop Owners</div>
                <h5 className="fw-bold text-dark mt-2 mb-2">Individual Users</h5>
                <p className="small text-muted mb-3">Developers, students, and professionals needing fast, verified device care.</p>
                <ul className="tb-role-checklist">
                  <li>Pick exact brand and model for relevant care</li>
                  <li>Purchase model-matched genuine components</li>
                  <li>Submit and monitor active repair tickets</li>
                  <li>Access permanent digital repair history logs</li>
                </ul>
              </div>
            </div>

            <div className="col-md-4">
              <div className="tb-about-role-card">
                <div className="tb-role-badge">Brand Side</div>
                <h5 className="fw-bold text-dark mt-2 mb-2">Brand Representatives</h5>
                <p className="small text-muted mb-3">Authorized service center branches and support representatives.</p>
                <ul className="tb-role-checklist">
                  <li>Manage official service center listings</li>
                  <li>Respond directly to customer repair tickets</li>
                  <li>List verified authentic spare parts</li>
                  <li>Ensure manufacturer compliance standards</li>
                </ul>
              </div>
            </div>

            <div className="col-md-4">
              <div className="tb-about-role-card">
                <div className="tb-role-badge">Administration</div>
                <h5 className="fw-bold text-dark mt-2 mb-2">Platform Admins</h5>
                <p className="small text-muted mb-3">System oversight, catalog auditing, and security control.</p>
                <ul className="tb-role-checklist">
                  <li>Audit and approve new brand registrations</li>
                  <li>Monitor overall system health & ticket flow</li>
                  <li>Maintain anti-counterfeit catalog regulations</li>
                  <li>Ensure user data security and reliability</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          5. VALIDATED EXCELLENCE (REVIEWS & TESTIMONIALS)
          ================================================================= */}
      <section className="tb-content-section tb-section-contrast border-top">
        <div className="container">
          <div className="text-center mb-5">
            <span className="tb-eyebrow">Validated Excellence</span>
            <h2 className="tb-headline">Trusted by Professionals & Enterprises</h2>
            <p className="tb-subtext mx-auto" style={{ maxWidth: '600px' }}>
              Read direct feedback from software engineers, creative leads, and IT managers who rely on TechBridge.
            </p>
          </div>

          <div className="row g-4">
            {reviews.map((rev, index) => (
              <div key={index} className="col-md-4">
                <div className="tb-review-card h-100 d-flex flex-column">
                  <div className="d-flex text-warning mb-3">
                    {[...Array(rev.stars)].map((_, i) => (
                      <Star key={i} size={16} fill="#f59e0b" strokeWidth={0} />
                    ))}
                  </div>
                  <p className="tb-review-quote flex-grow-1">"{rev.quote}"</p>
                  <div className="d-flex align-items-center gap-3 pt-3 border-top">
                    <div className="tb-avatar-badge">{rev.initials}</div>
                    <div>
                      <h6 className="fw-bold text-dark mb-0 fs-6">{rev.author}</h6>
                      <small className="text-muted">{rev.role}</small>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =================================================================
          6. BOTTOM CALL TO ACTION
          ================================================================= */}
      <section className="tb-about-cta">
        <div className="container text-center">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h2 className="tb-cta-title">Ready for simple, organized laptop care?</h2>
              <p className="tb-cta-desc">
                Find authorized brand centers, order guaranteed genuine parts, and track your repairs with zero guesswork.
              </p>
              <div className="d-flex flex-wrap justify-content-center gap-3">
                <button
                  onClick={() => navigate('/service-center')}
                  className="tb-btn-cta-primary"
                >
                  Locate Service Center <ArrowRight size={18} />
                </button>
                <button
                  onClick={() => navigate('/products')}
                  className="tb-btn-cta-secondary"
                >
                  Browse Hardware Catalog
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;