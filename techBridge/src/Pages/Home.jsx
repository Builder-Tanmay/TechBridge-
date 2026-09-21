import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Heart,
  ArrowRight,
  ShieldCheck,
  Clock,
  AlertCircle,
  ChevronRight,
  Wrench,
  CalendarCheck,
  Search,
  PhoneOff,
  History
} from 'lucide-react';
import wishlistService from '../services/wishlistService';
import '../Css/Home.css';

import heroBg from '../assets/hero-banner.png';
import technicianImg from '../assets/img1.png';

const Home = () => {
  const navigate = useNavigate();

  // User session
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      return parsed?.user || parsed;
    } catch {
      return null;
    }
  });

  const userId = user?.id || user?.userid || user?.user_id;
  const [wishlistProductIds, setWishlistProductIds] = useState(new Set());
  const [togglingWishlistId, setTogglingWishlistId] = useState(null);
  const [addingId, setAddingId] = useState(null);

  // Live inventory state
  const [popularParts, setPopularParts] = useState([]);
  const [loadingParts, setLoadingParts] = useState(true);

  // Synchronize Wishlist
  const loadWishlistState = useCallback(async () => {
    let currentId = null;
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        const parsed = JSON.parse(stored);
        const u = parsed?.user || parsed;
        setUser(u);
        currentId = u?.id || u?.userid || u?.user_id;
      }
    } catch (e) {
      console.error('Error reading user state:', e);
    }

    if (!currentId) {
      setWishlistProductIds(new Set());
      return;
    }

    try {
      const items = await wishlistService.getWishlist(currentId);
      const ids = new Set(
        items
          .map((item) => {
            const p = item.product || item;
            const pid = p?.id || item.productid || item.productId || item.id;
            return pid ? Number(pid) : null;
          })
          .filter((id) => id !== null && !isNaN(id))
      );
      setWishlistProductIds(ids);
    } catch (e) {
      console.error('Error loading wishlist state:', e);
    }
  }, []);

  // Fetch Parts from Backend
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoadingParts(true);
        const res = await fetch('http://localhost:8080/api/parts/getall');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setPopularParts(data.slice(0, 4));
          }
        }
      } catch (err) {
        console.error('Failed to retrieve inventory items:', err);
      } finally {
        setLoadingParts(false);
      }
    };

    fetchInventory();
    loadWishlistState();

    const handleWishlistEvent = () => loadWishlistState();
    window.addEventListener('wishlist-change', handleWishlistEvent);
    window.addEventListener('auth-change', handleWishlistEvent);
    window.addEventListener('storage', handleWishlistEvent);

    return () => {
      window.removeEventListener('wishlist-change', handleWishlistEvent);
      window.removeEventListener('auth-change', handleWishlistEvent);
      window.removeEventListener('storage', handleWishlistEvent);
    };
  }, [loadWishlistState]);

  // Wishlist toggle
  const handleToggleWishlist = async (e, product) => {
    e.stopPropagation();
    const pid = Number(product?.id);
    if (!pid) return;

    if (!user || !userId) {
      alert('Please log in to manage your saved items.');
      navigate('/login');
      return;
    }

    try {
      setTogglingWishlistId(pid);
      const res = await wishlistService.toggleWishlist(userId, product);
      setWishlistProductIds((prev) => {
        const next = new Set(prev);
        if (res.wishlisted) next.add(pid);
        else next.delete(pid);
        return next;
      });
    } catch (err) {
      console.error('Wishlist error:', err);
    } finally {
      setTogglingWishlistId(null);
    }
  };

  // Add to cart
  const handleAddToCart = async (product) => {
    if (!user || !userId) {
      alert('Please log in to add items to your cart.');
      navigate('/login');
      return;
    }

    try {
      setAddingId(product.id);
      await axios.post('http://localhost:8080/api/cart/addtocart', null, {
        params: {
          userid: userId,
          productid: product.id,
          quantity: 1
        }
      });
      alert(`Added ${product.partName} to your cart.`);
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Could not add to cart. Check backend connectivity.');
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div className="tb-canvas">

      {/* 1. HERO SECTION */}
      <section
        className="tb-hero-stage"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="tb-hero-gradient-overlay"></div>

        <div className="container position-relative z-2 tb-hero-container">
          <div className="row align-items-center">
            <div className="col-xl-8 col-lg-9">

              <div className="tb-hero-pill">
                <span className="tb-live-dot"></span>
                <span>ALL-IN-ONE LAPTOP CARE ECOSYSTEM</span>
              </div>

              <h1 className="tb-hero-headline">
                Everything for your <br />
                <span className="tb-gradient-title">Laptop’s Care & Service</span> <br />
                in one single place.
              </h1>

              <p className="tb-hero-subtext">
                No more jumping between websites or calling support numbers. Connect directly with official brand service centers, order guaranteed genuine spare parts, and track repair tickets in real time.
              </p>

              <div className="d-flex flex-wrap gap-3">
                <button
                  onClick={() => navigate('/services')}
                  className="tb-btn-primary"
                >
                  Find Authorized Centers <ArrowRight size={18} />
                </button>
                <button
                  onClick={() => navigate('/products')}
                  className="tb-btn-outline"
                >
                  Order Genuine Parts
                </button>
              </div>

              <div className="tb-hero-trust-bar">
                <div className="tb-trust-node">
                  <ShieldCheck size={17} className="tb-trust-icon" />
                  <span>Official Centers & Parts</span>
                </div>
                <div className="tb-trust-separator"></div>
                <div className="tb-trust-node">
                  <Clock size={17} className="tb-trust-icon" />
                  <span>Live Status Tracking</span>
                </div>
                <div className="tb-trust-separator"></div>
                <div className="tb-trust-node">
                  <CalendarCheck size={17} className="tb-trust-icon" />
                  <span>Automatic Preventive Alerts</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 2. MARQUEE STRIP */}
      <div className="tb-ticker-bar">
        <div className="tb-ticker-track">
          <div className="tb-ticker-content">
            <span>DELL AUTHORIZED SERVICE</span>
            <span className="tb-ticker-bullet">•</span>
            <span>HP CERTIFIED SUPPORT</span>
            <span className="tb-ticker-bullet">•</span>
            <span>LENOVO SERVICE PARTNER</span>
            <span className="tb-ticker-bullet">•</span>
            <span>APPLE INDEPENDENT REPAIR</span>
            <span className="tb-ticker-bullet">•</span>
            <span>ASUS GENUINE HUB</span>
            <span className="tb-ticker-bullet">•</span>
            <span>SAMSUNG LAPTOP CARE</span>
            <span className="tb-ticker-bullet">•</span>
            <span>ACER OFFICIAL SERVICE</span>
            <span className="tb-ticker-bullet">•</span>
          </div>
          <div className="tb-ticker-content" aria-hidden="true">
            <span>DELL AUTHORIZED SERVICE</span>
            <span className="tb-ticker-bullet">•</span>
            <span>HP CERTIFIED SUPPORT</span>
            <span className="tb-ticker-bullet">•</span>
            <span>LENOVO SERVICE PARTNER</span>
            <span className="tb-ticker-bullet">•</span>
            <span>APPLE INDEPENDENT REPAIR</span>
            <span className="tb-ticker-bullet">•</span>
            <span>ASUS GENUINE HUB</span>
            <span className="tb-ticker-bullet">•</span>
            <span>SAMSUNG LAPTOP CARE</span>
            <span className="tb-ticker-bullet">•</span>
            <span>ACER OFFICIAL SERVICE</span>
            <span className="tb-ticker-bullet">•</span>
          </div>
        </div>
      </div>

      {/* 3. WHO WE ARE & WHAT WE SOLVE */}
      <section className="tb-content-section bg-white">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <div className="tb-image-frame">
                <img
                  src={technicianImg}
                  alt="Laptop Technician at Work"
                  className="tb-framed-img"
                />
                <div className="tb-floating-stat-card">
                  <div className="tb-stat-number">One Platform</div>
                  <div className="tb-stat-label">Brands, service centers, parts, and repair tracking in one place</div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <span className="tb-eyebrow">Project Overview</span>
              <h2 className="tb-headline">What is TechBridge?</h2>
              <p className="tb-subtext mb-3">
                Today, if someone's laptop needs a repair or a spare part, they have to search the brand's website, call a support number, find a local repair shop, or search online shops separately for spare parts — it takes a lot of time and effort.
              </p>
              <p className="tb-subtext mb-4">
                <strong>TechBridge</strong> solves this by bringing brand manufacturers, official service centers, genuine spare parts, and repair tracking all together into one unified system.
              </p>

              <div className="row g-3">
                <div className="col-sm-6">
                  <div className="tb-feature-tile">
                    <h6>No More Confusion</h6>
                    <p>Find official brand service centers directly instead of trusting unverified local repair shops.</p>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="tb-feature-tile">
                    <h6>Exact Model Matching</h6>
                    <p>Spare parts are matched to your exact laptop model, eliminating the risk of buying wrong or duplicate parts.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. REAL PROBLEMS SOLVED IN DAILY LIFE */}
      <section className="tb-content-section tb-section-contrast border-top">
        <div className="container">
          <div className="text-center mb-5">
            <span className="tb-eyebrow">Real World Headaches Solved</span>
            <h2 className="tb-headline">Problems TechBridge Eliminates for Laptop Owners</h2>
            <p className="tb-subtext mx-auto" style={{ maxWidth: '640px' }}>
              Common maintenance frustrations and how our platform resolves them step-by-step.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-md-6 col-lg-3">
              <div className="tb-solution-card">
                <div className="tb-problem-badge">
                  <AlertCircle size={14} /> The Problem
                </div>
                <h5>Where To Go?</h5>
                <p className="tb-problem-desc">
                  People don't know where to go when their laptop has a problem — official service or a local shop?
                </p>
                <div className="tb-solution-box">
                  <span className="tb-solution-title">The TechBridge Fix</span>
                  <p>Authorized service centers are listed directly on the platform with verified credentials and contact details.</p>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="tb-solution-card">
                <div className="tb-problem-badge">
                  <AlertCircle size={14} /> The Problem
                </div>
                <h5>Finding Genuine Parts</h5>
                <p className="tb-problem-desc">
                  Finding genuine batteries, chargers, or screens for a specific laptop model is hard, risky, and confusing.
                </p>
                <div className="tb-solution-box">
                  <span className="tb-solution-title">The TechBridge Fix</span>
                  <p>Parts come directly from the company side and are mapped to your exact model to avoid wrong orders.</p>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="tb-solution-card">
                <div className="tb-problem-badge">
                  <AlertCircle size={14} /> The Problem
                </div>
                <h5>No Repair Records</h5>
                <p className="tb-problem-desc">
                  There is no record of past fixes, so people forget when their laptop was last serviced or what was replaced.
                </p>
                <div className="tb-solution-box">
                  <span className="tb-solution-title">The TechBridge Fix</span>
                  <p>Every completed ticket is automatically stored in a permanent digital service log with fix details and dates.</p>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="tb-solution-card">
                <div className="tb-problem-badge">
                  <AlertCircle size={14} /> The Problem
                </div>
                <h5>Unnoticed Breakdowns</h5>
                <p className="tb-problem-desc">
                  Users often don't realize their laptop needs thermal cleaning or checkups until it breaks down completely.
                </p>
                <div className="tb-solution-box">
                  <span className="tb-solution-title">The TechBridge Fix</span>
                  <p>The system inspects your history and reminds you automatically before minor dust issues turn into costly repairs.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WORK REDUCTION BENEFITS */}
      <section className="tb-content-section bg-white border-top">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-5">
              <span className="tb-eyebrow">Practical Efficiency</span>
              <h2 className="tb-headline">What Work Does TechBridge Reduce?</h2>
              <p className="tb-subtext mb-4">
                TechBridge turns a slow, scattered, and confusing process into one simple, fast, and organized experience.
              </p>
              <div className="p-4 bg-light rounded-4 border">
                <div className="fs-5 fw-bold text-primary mb-1">Zero Guesswork</div>
                <p className="small text-muted mb-0">
                  Save time, save effort, avoid wrong part orders, and get automatic reminders before problems happen.
                </p>
              </div>
            </div>

            <div className="col-lg-7">
              <div className="d-flex flex-column gap-3">
                <div className="tb-work-item">
                  <div className="tb-work-icon"><Search size={20} /></div>
                  <div>
                    <h6 className="fw-bold mb-1">No need to visit multiple brand websites</h6>
                    <p className="small text-muted mb-0">Everything related to parts, diagnostics, and centers is centralized in one dashboard.</p>
                  </div>
                </div>

                <div className="tb-work-item">
                  <div className="tb-work-icon"><PhoneOff size={20} /></div>
                  <div>
                    <h6 className="fw-bold mb-1">No need to call customer support repeatedly</h6>
                    <p className="small text-muted mb-0">Follow live repair stages (Received, In Progress, Resolved) anytime on the website.</p>
                  </div>
                </div>

                <div className="tb-work-item">
                  <div className="tb-work-icon"><Wrench size={20} /></div>
                  <div>
                    <h6 className="fw-bold mb-1">No need to search online or ask around for parts</h6>
                    <p className="small text-muted mb-0">Buy genuine batteries, chargers, and keyboards matched strictly to your laptop's serial model.</p>
                  </div>
                </div>

                <div className="tb-work-item">
                  <div className="tb-work-icon"><History size={20} /></div>
                  <div>
                    <h6 className="fw-bold mb-1">No need to remember or track service dates manually</h6>
                    <p className="small text-muted mb-0">The system automatically alerts you when periodic maintenance or cleaning is due.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. GENUINE HARDWARE STORE */}
      <section className="tb-content-section tb-section-contrast border-top">
        <div className="container">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-end mb-4">
            <div>
              <span className="tb-eyebrow">Direct From Brand Inventory</span>
              <h2 className="tb-headline mb-0">High-Demand Genuine Spare Parts</h2>
            </div>
            <button
              className="tb-link-action mt-2 mt-md-0"
              onClick={() => navigate('/products')}
            >
              Browse complete parts store <ChevronRight size={16} />
            </button>
          </div>

          {loadingParts ? (
            <div className="text-center py-5">
              <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
              <p className="tb-subtext small mt-2">Loading model-matched inventory...</p>
            </div>
          ) : (
            <div className="row g-4">
              {popularParts.map((part) => {
                const pid = Number(part.id);
                const isWishlisted = wishlistProductIds.has(pid);
                const isAdding = addingId === part.id;
                const stock = part.stockQuantity ?? 1;

                return (
                  <div key={part.id} className="col-md-6 col-lg-3">
                    <div className="tb-product-tile">
                      <div className="tb-tile-image-wrapper">
                        <img
                          src={part.img || "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500"}
                          alt={part.partName}
                          className="tb-tile-image"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500";
                          }}
                        />
                        <span className={`tb-stock-chip ${stock > 0 ? 'in' : 'out'}`}>
                          {stock > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                        <button
                          className="tb-wishlist-btn"
                          onClick={(e) => handleToggleWishlist(e, part)}
                          disabled={togglingWishlistId === pid}
                          aria-label="Toggle wishlist"
                        >
                          <Heart
                            size={16}
                            className={isWishlisted ? 'tb-heart-active' : 'tb-heart-idle'}
                          />
                        </button>
                      </div>

                      <div className="tb-tile-info">
                        <div className="d-flex justify-content-between text-muted small mb-1">
                          <span className="fw-semibold text-uppercase">{part.brand || 'OEM Grade'}</span>
                          <span>{part.modelName || 'Model Matched'}</span>
                        </div>
                        <h6 className="tb-tile-title" title={part.partName}>
                          {part.partName}
                        </h6>

                        <div className="tb-tile-footer">
                          <div className="tb-tile-price">
                            ₹{Number(part.price || 0).toLocaleString('en-IN')}
                          </div>
                          <button
                            className="tb-btn-add"
                            onClick={() => handleAddToCart(part)}
                            disabled={isAdding || stock <= 0}
                          >
                            {isAdding ? 'Adding...' : 'Buy Part'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 7. EXACT 8-STEP WORKFLOW */}
      <section className="tb-content-section bg-white border-top">
        <div className="container">
          <div className="text-center mb-5">
            <span className="tb-eyebrow">Step-By-Step Guide</span>
            <h2 className="tb-headline">How Does TechBridge Work?</h2>
            <p className="tb-subtext mx-auto" style={{ maxWidth: '640px' }}>
              From initial selection to automated maintenance reminders, everything follows a simple 8-step flow.
            </p>
          </div>

          <div className="row g-3">
            {[
              { step: '01', title: 'Select Your Laptop', desc: 'Select your laptop brand (like Dell, HP, Lenovo) and enter your exact model.' },
              { step: '02', title: 'Choose What You Need', desc: 'Pick from three options: find a center, buy a spare part, or raise a support ticket.' },
              { step: '03', title: 'Get Matched Instantly', desc: 'The website displays only the verified information relevant to that exact model.' },
              { step: '04', title: 'Raise a Service Ticket', desc: 'Describe your issue and submit it. This creates a ticket the company can see and act on.' },
              { step: '05', title: 'Track The Request', desc: 'See the live status of your request: Received, In Progress, or Resolved without calling.' },
              { step: '06', title: 'Buy The Right Part', desc: 'Order verified genuine batteries, screens, or chargers made for your model.' },
              { step: '07', title: 'Service Gets Logged', desc: 'Once resolved, past fixes are saved as service history—a permanent record of fixes.' },
              { step: '08', title: 'Get Reminded Automatically', desc: 'The system reviews your history and reminds you before maintenance is due.' }
            ].map((item) => (
              <div key={item.step} className="col-md-6 col-lg-3">
                <div className="tb-step-card">
                  <div className="tb-step-badge">{item.step}</div>
                  <h6 className="tb-step-title">{item.title}</h6>
                  <p className="tb-step-desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. PLATFORM ROLES */}
      <section className="tb-content-section tb-section-contrast border-top">
        <div className="container">
          <div className="text-center mb-5">
            <span className="tb-eyebrow">Platform Community</span>
            <h2 className="tb-headline">Who Uses TechBridge?</h2>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="tb-role-panel">
                <div className="tb-role-tag">Laptop Owner</div>
                <h5 className="tb-role-title">Laptop Owner (User)</h5>
                <p className="tb-role-desc">Individual laptop users seeking reliable care.</p>
                <ul className="tb-role-list">
                  <li>Selects laptop brand and exact model</li>
                  <li>Buys genuine, model-matched spare parts</li>
                  <li>Raises and tracks live repair service tickets</li>
                  <li>Maintains a permanent digital service history</li>
                </ul>
              </div>
            </div>

            <div className="col-md-4">
              <div className="tb-role-panel">
                <div className="tb-role-tag">Company Side</div>
                <h5 className="tb-role-title">Brand Representative</h5>
                <p className="tb-role-desc">Authorized service center branches and staff.</p>
                <ul className="tb-role-list">
                  <li>Manages their brand’s official service centers</li>
                  <li>Responds directly to user service tickets</li>
                  <li>Lists authentic replacement parts with stock status</li>
                  <li>Ensures standard manufacturer resolution quality</li>
                </ul>
              </div>
            </div>

            <div className="col-md-4">
              <div className="tb-role-panel">
                <div className="tb-role-tag">Administration</div>
                <h5 className="tb-role-title">Platform Admin</h5>
                <p className="tb-role-desc">Overall network governance and monitoring.</p>
                <ul className="tb-role-list">
                  <li>Oversees the whole platform ecosystem</li>
                  <li>Verifies and approves new brand registrations</li>
                  <li>Monitors overall system ticket activity</li>
                  <li>Ensures data reliability and account security</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. CTA FOOTER */}
      <section className="tb-cta-section">
        <div className="container text-center">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h2 className="tb-cta-headline">Ready to experience simple laptop care?</h2>
              <p className="tb-cta-subtext">
                Connect with official brand service centers, order guaranteed genuine parts, and track your repairs with zero guesswork.
              </p>
              <div className="d-flex flex-wrap justify-content-center gap-3">
                <button
                  onClick={() => navigate('/service-center')}
                  className="tb-btn-cta-white"
                >
                  Locate Service Center
                </button>
                <button
                  onClick={() => navigate('/products')}
                  className="tb-btn-cta-outline"
                >
                  Browse Spare Parts Store
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;