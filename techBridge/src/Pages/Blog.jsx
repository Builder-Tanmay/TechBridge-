import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Search,
    Clock,
    Calendar,
    ArrowRight,
    BookOpen,
    ShieldCheck,
    AlertTriangle,
    Wrench,
    ChevronRight,
    Sparkles,
    CheckCircle2,
    X,
    Share2,
    Bookmark,
    AlertCircle
} from "lucide-react";
import "../Css/Blog.css";

import heroBg from "../assets/blog1.png";

const Blog = () => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState("ALL");
    const [searchQuery, setSearchQuery] = useState("");
    const [activeArticle, setActiveArticle] = useState(null);

    // Prevent background scrolling when modal is open
    useEffect(() => {
        if (activeArticle) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [activeArticle]);

    const categories = [
        { id: "ALL", label: "All Insights" },
        { id: "MAINTENANCE", label: "Preventive Care" },
        { id: "HARDWARE", label: "Genuine Parts" },
        { id: "TROUBLESHOOTING", label: "Diagnostic Guides" },
        { id: "SERVICE", label: "Official Centers" }
    ];

    const articles = [
        {
            id: 1,
            category: "HARDWARE",
            categoryLabel: "Genuine Hardware",
            readTime: "5 min read",
            date: "Aug 28, 2026",
            title: "The Danger of Duplicate Batteries: How Counterfeits Swell & Kill Motherboards",
            summary: "Cheap duplicate batteries flood online marketplaces without thermal runaway protection. Learn how authentic OEM serial authentication keeps your device safe.",
            image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=700",
            featured: true,
            tag: "Critical Safety",
            content: {
                intro: "Lithium-ion polymer battery cells require precision charge controllers and embedded firmware to balance cell voltages safely. Counterfeit third-party batteries cut production costs by omitting onboard thermal cut-off microchips, putting your entire machine at risk.",
                sections: [
                    {
                        heading: "1. The Phenomenon of Cell Swelling (Pouch Distension)",
                        text: "When inferior cathode materials degrade, chemical gas builds up inside the sealed foil pouches. Because internal laptop space is restricted to fractions of a millimeter, swollen cells apply immense upward pressure against your trackpad and chassis, cracking keyboard decks and flexing the motherboard until solder joints break."
                    },
                    {
                        heading: "2. Voltage Spikes on the Primary Power Rail",
                        text: "OEM batteries from Dell, HP, Apple, and Lenovo feature dedicated Battery Management Systems (BMS) communicating via SMBus protocols. Clone batteries deliver unstable voltage pulses that blow the main power MOSFETs and charging controller ICs, transforming an inexpensive battery replacement into an expensive multi-layer motherboard failure."
                    },
                    {
                        heading: "3. How TechBridge Authenticates Genuine Batteries",
                        text: "All replacement cells available on TechBridge originate from brand manufacturer distributors. Each unit is mapped against exact sub-model revision codes and verified via internal serial handshake to guarantee correct thermal curves and genuine battery cycle longevity."
                    }
                ],
                takeaways: [
                    "Always verify your battery's part number and serial against manufacturer databases.",
                    "Never purchase unbranded or 'OEM Grade' batteries from unregulated online marketplaces.",
                    "If your trackpad becomes stiff or hard to click, inspect the battery immediately for swelling."
                ]
            }
        },
        {
            id: 2,
            category: "MAINTENANCE",
            categoryLabel: "Preventive Care",
            readTime: "4 min read",
            date: "Aug 19, 2026",
            title: "Why Thermal Overhaul Every 12 Months Saves Your CPU & GPU From Death",
            summary: "Dried-out thermal paste causes silent throttling and micro-cracks on silicon dies. Here is how static-free ultrasonic de-dusting restores peak clock speeds.",
            image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600",
            featured: false,
            content: {
                intro: "Laptops pack high-performance processors into tight thermal enclosures. Over time, thermal interface material dries out and fan fins clog with microscopic dust, trapping heat directly against delicate silicon dies.",
                sections: [
                    {
                        heading: "1. Thermal Throttling vs. Permanent Silicon Degradation",
                        text: "Modern processors automatically downclock their frequencies when core temperatures breach 95°C. While this prevents immediate burn-out, prolonged exposure to high thermal cycles produces microscopic solder fatigue underneath BGA chips, leading to GPU artifacting and boot failures."
                    },
                    {
                        heading: "2. The Problem with Generic Silicone Paste",
                        text: "Roadside repair shops often use generic white silicone paste with low thermal conductivity (<1.5 W/mK). High-performance cooling requires non-conductive, high-viscosity carbon or metal-oxide compounds (such as Arctic MX-4 or Kryonaut rated above 8.5 W/mK) that do not pump out under thermal expansion."
                    },
                    {
                        heading: "3. Ultrasonic De-Dusting & Fan Bearing Service",
                        text: "Blowing compressed air into assembled laptop vents spins fan bearings past their rated RPM, pushing dust deeper into heatsink fins. Professional service involves disassembling the blower assembly, cleaning copper heat pipes, and lubricating bearings with low-friction synthetic oil."
                    }
                ],
                takeaways: [
                    "Schedule complete internal de-dusting and thermal compound refresh every 10 to 14 months.",
                    "Loud fan noise under low workloads is the primary warning sign of thermal exhaustion.",
                    "Preventive cleaning costs a fraction of micro-soldering an overheated processor or GPU."
                ]
            }
        },
        {
            id: 3,
            category: "TROUBLESHOOTING",
            categoryLabel: "Diagnostics",
            readTime: "6 min read",
            date: "Aug 12, 2026",
            title: "Spilled Water or Coffee on Your Laptop? The First 5 Steps Before It's Too Late",
            summary: "Do not put it in rice. Power off immediately, disconnect the DC rail, and learn why ultrasonic board cleaning is necessary to neutralize corrosion.",
            image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600",
            featured: false,
            content: {
                intro: "Liquid spills cause panic, but your quick actions within the first 60 seconds determine whether your laptop can be saved with simple board cleaning or ruined by galvanic corrosion.",
                sections: [
                    {
                        heading: "1. Immediate Emergency Protocol (First 60 Seconds)",
                        text: "Hold down the power button for 10 seconds to force an immediate hard shutdown. Do not use the operating system shut-down menu. Unplug the AC charger immediately to cut external voltage delivery."
                    },
                    {
                        heading: "2. The Rice Myth: Why It Accelerates Destruction",
                        text: "Placing a wet laptop in a bag of uncooked rice does not dry out water trapped underneath SMD capacitors and BGA chips. Instead, it introduces starchy dust that mixes with moisture, forming an acidic sludge that accelerates pin corrosion across copper traces."
                    },
                    {
                        heading: "3. Ultrasonic Isopropyl Bath & PCB Neutralization",
                        text: "Even if your laptop turns on after drying, minerals left behind by evaporated water slowly eat through microscopic copper vias. A certified diagnostic lab disassembles the motherboard and places it in an ultrasonic tank with 99.9% pure electronic-grade Isopropyl Alcohol (IPA) to dissolve ionic salts."
                    }
                ],
                takeaways: [
                    "Never attempt to power on a liquid-damaged laptop to 'see if it still works.'",
                    "Disconnect the internal battery connector if you have the proper screwdrivers and experience.",
                    "Transport the machine in an open tent position directly to a verified cleanroom facility."
                ]
            }
        },
        {
            id: 4,
            category: "SERVICE",
            categoryLabel: "Official Support",
            readTime: "4 min read",
            date: "Jul 29, 2026",
            title: "Official Brand Centers vs. Local Street Repair: Where Should You Go?",
            summary: "When does manufacturer warranty handling require an authorized service center, and when does component-level chip repair save you from buying a whole new laptop?",
            image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600",
            featured: false,
            content: {
                intro: "Choosing where to repair your laptop is usually confusing: official centers can be rigid and expensive out-of-warranty, while local street shops carry risks of duplicate components and untracked work.",
                sections: [
                    {
                        heading: "1. When to Choose Official Brand Authorized Centers",
                        text: "If your laptop is within its active manufacturer warranty period (or covered by Dell ProSupport, AppleCare+, or HP CarePack), always visit an official service center. Third-party tampering immediately voids warranty claims, and authorized facilities hold access to diagnostic tools and genuine serial provisioning."
                    },
                    {
                        heading: "2. The Out-of-Warranty Dilemma: Unit Swaps vs. Board Repair",
                        text: "Official centers rarely conduct micro-soldering; if a single capacitor burns out on a motherboard, their policy often requires replacing the entire board at 60-80% of the laptop's original purchase price. This is where verified partner clinics step in with precision BGA rework."
                    },
                    {
                        heading: "3. The TechBridge Dual Network Advantage",
                        text: "TechBridge lists authorized manufacturer hubs for warranty and genuine parts, alongside verified chip-level diagnostic clinics for affordable micro-soldering, so you get transparent rates and live ticket tracking either way."
                    }
                ],
                takeaways: [
                    "Use official centers for active warranty claims, official screen replacements, and genuine battery swaps.",
                    "Use verified chip-level labs for liquid damage recovery and power circuit troubleshooting.",
                    "Insist on live ticket tracking and written component warranties on all repairs."
                ]
            }
        },
        {
            id: 5,
            category: "MAINTENANCE",
            categoryLabel: "Preventive Care",
            readTime: "3 min read",
            date: "Jul 15, 2026",
            title: "Why You Need a Permanent Digital Service Log for Your Laptop",
            summary: "Most users forget past repairs until a breakdown occurs. See how digital repair ticketing increases laptop resale value and helps spot recurring component faults.",
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600",
            featured: false,
            content: {
                intro: "Automobiles have digital service logs that verify their health and boost resale value. Laptops—which hold your career, projects, and personal data—deserve the exact same documented maintenance standard.",
                sections: [
                    {
                        heading: "1. The Cost of Forgotten Repair Records",
                        text: "When a technician asks 'When was this battery installed?' or 'Has this motherboard been micro-soldered before?', most owners have no answer. Technicians must waste billable diagnostic hours testing circuits that were already serviced."
                    },
                    {
                        heading: "2. Higher Resale Value in Secondary Markets",
                        text: "Buyers on used hardware marketplaces often assume second-hand laptops contain swapped counterfeit parts. A verified TechBridge digital service history proves the machine received authentic parts and routine thermal servicing, commanding 20-30% higher resale prices."
                    },
                    {
                        heading: "3. Automated Telematics & Early Warning Reminders",
                        text: "By maintaining a timestamped service log, TechBridge can calculate the degradation cycle of your fan bearings and thermal paste, alerting you proactively before a small thermal issue escalates into hardware damage."
                    }
                ],
                takeaways: [
                    "Never rely on loose paper repair slips that get lost over time.",
                    "Keep records of replaced component serials, battery batch numbers, and repair dates.",
                    "Use an ecosystem that stores repair history securely linked to your account."
                ]
            }
        },
        {
            id: 6,
            category: "HARDWARE",
            categoryLabel: "Genuine Hardware",
            readTime: "5 min read",
            date: "Jul 04, 2026",
            title: "OLED vs. IPS vs. 144Hz: Choosing the Exact Matching Display Panel",
            summary: "Replacing a broken display panel isn't just about screen size. Learn about eDP pin connectors, color calibration, and zero dead-pixel standards.",
            image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600",
            featured: false,
            content: {
                intro: "A shattered laptop screen is one of the most common hardware mishaps. But buying a replacement panel online without understanding interface standards often results in dark screens, distorted colors, or blown motherboard fuses.",
                sections: [
                    {
                        heading: "1. The Critical eDP Connector Standards (30-Pin vs. 40-Pin)",
                        text: "Standard 60Hz 1080p display panels utilize a 30-pin Embedded DisplayPort (eDP) ribbon cable with 2 data lanes. High-refresh 144Hz/240Hz gaming panels and 4K resolution screens require 40-pin 4-lane eDP cables. Forcing an incompatible panel can fry the backlight circuitry."
                    },
                    {
                        heading: "2. Color Accuracy: 45% NTSC vs. 100% sRGB vs. OLED",
                        text: "Generic replacement panels found in street shops are almost always basic 45% NTSC panels with washed-out color gamuts and poor viewing angles. OEM factory panels match original specifications, maintaining accurate color rendering for creators and programmers."
                    },
                    {
                        heading: "3. ISO 13406-2 Class-1 Dead Pixel Standards",
                        text: "Unverified replacement panels often come with 2-5 stuck or dead pixels that sellers refuse to refund. TechBridge provides Class-1 panels guaranteed with zero dead-pixel policies and factory-calibrated brightness profiles."
                    }
                ],
                takeaways: [
                    "Check your laptop's exact display model code printed on the rear of the original LCD panel.",
                    "Verify whether your motherboard cable is 30-pin (Full HD 60Hz) or 40-pin (UHD/144Hz).",
                    "Always ensure replacement displays are tested inside an ESD-safe cleanroom."
                ]
            }
        }
    ];

    const filteredArticles = articles.filter((art) => {
        const matchesCategory = selectedCategory === "ALL" || art.category === selectedCategory;
        const matchesSearch =
            art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            art.summary.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const featuredArticle = articles.find((a) => a.featured);

    return (
        <div className="tb-blog-canvas">

            {/* =================================================================
          1. HALF-SCREEN HERO BANNER (~60VH) - NO FADE OVERLAY
          ================================================================= */}
            <section
                className="tb-blog-hero"
                style={{ backgroundImage: `url(${heroBg})` }}
            >
                <div className="container position-relative z-2">
                    <div className="row align-items-center">
                        <div className="col-lg-8 col-xl-7">
                            <div className="tb-blog-pill">
                                <span className="tb-blog-dot"></span>
                                <span>KNOWLEDGE BASE & DEVICE CARE INSIGHTS</span>
                            </div>
                            <h1 className="tb-blog-hero-title">
                                Hardware Knowledge & <br />
                                <span className="tb-gradient-title">Laptop Care Guides.</span>
                            </h1>
                            <p className="tb-blog-hero-subtext">
                                Expert maintenance advice, anti-counterfeit component guides, and diagnostic tutorials directly from certified technicians to keep your workstation healthy.
                            </p>

                            {/* Search Bar */}
                            <div className="tb-blog-search-box mt-4">
                                <Search size={18} className="tb-blog-search-icon" />
                                <input
                                    type="text"
                                    placeholder="Search maintenance guides, battery safety, thermal fixes..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="tb-blog-search-input"
                                />
                                {searchQuery && (
                                    <button
                                        className="tb-blog-search-clear"
                                        onClick={() => setSearchQuery("")}
                                        aria-label="Clear search"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =================================================================
          2. CATEGORY PILL FILTER BAR
          ================================================================= */}
            <div className="tb-blog-nav-strip border-bottom bg-white sticky-top">
                <div className="container">
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 py-3">
                        <div className="d-flex align-items-center gap-2 overflow-x-auto pb-1 pb-md-0">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    className={`tb-category-tab ${selectedCategory === cat.id ? "active" : ""}`}
                                    onClick={() => setSelectedCategory(cat.id)}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                        <span className="extra-small text-muted fw-semibold d-none d-md-inline">
                            Showing {filteredArticles.length} guides
                        </span>
                    </div>
                </div>
            </div>

            {/* =================================================================
          3. FEATURED EDITORIAL HIGHLIGHT
          ================================================================= */}
            {selectedCategory === "ALL" && !searchQuery && featuredArticle && (
                <section className="tb-featured-section py-5 bg-white border-bottom">
                    <div className="container">
                        <div className="row align-items-center g-4 tb-featured-card p-3 p-md-4 rounded-4 border">
                            <div className="col-lg-6">
                                <div className="tb-featured-img-wrap rounded-4 overflow-hidden">
                                    <img
                                        src={featuredArticle.image}
                                        alt={featuredArticle.title}
                                        className="tb-featured-img w-100"
                                    />
                                    <span className="tb-featured-chip">{featuredArticle.tag}</span>
                                </div>
                            </div>

                            <div className="col-lg-6 ps-lg-4">
                                <div className="d-flex align-items-center gap-3 mb-2 flex-wrap">
                                    <span className="tb-badge-category">{featuredArticle.categoryLabel}</span>
                                    <span className="extra-small text-muted d-flex align-items-center gap-1">
                                        <Clock size={13} /> {featuredArticle.readTime}
                                    </span>
                                    <span className="extra-small text-muted d-flex align-items-center gap-1">
                                        <Calendar size={13} /> {featuredArticle.date}
                                    </span>
                                </div>

                                <h3 className="tb-featured-title fw-bold text-dark mb-3">
                                    {featuredArticle.title}
                                </h3>
                                <p className="tb-subtext mb-4">
                                    {featuredArticle.summary}
                                </p>

                                <div className="d-flex flex-wrap gap-3">
                                    <button
                                        onClick={() => setActiveArticle(featuredArticle)}
                                        className="tb-btn-primary d-inline-flex align-items-center gap-2"
                                    >
                                        Read Full Guide <ArrowRight size={16} />
                                    </button>
                                    <button
                                        onClick={() => navigate('/products')}
                                        className="tb-btn-outline d-inline-flex align-items-center gap-2"
                                    >
                                        Browse Genuine Parts
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* =================================================================
          4. ARTICLES GRID
          ================================================================= */}
            <section className="tb-content-section tb-section-contrast">
                <div className="container">
                    <div className="text-center mb-5">
                        <span className="tb-eyebrow">Practical Knowledge</span>
                        <h2 className="tb-headline">Troubleshooting & Device Care Library</h2>
                        <p className="tb-subtext mx-auto" style={{ maxWidth: "580px" }}>
                            Practical breakdowns designed to prevent unexpected breakdowns, verify genuine parts, and protect your device investment.
                        </p>
                    </div>

                    {filteredArticles.length === 0 ? (
                        <div className="text-center py-5 bg-white rounded-4 border p-4">
                            <BookOpen size={36} className="text-muted opacity-50 mb-2" />
                            <h5 className="fw-bold text-dark mb-1">No Matching Articles Found</h5>
                            <p className="text-muted small mb-3">Try searching for other terms or reset your filter.</p>
                            <button
                                className="tb-btn-outline btn-sm"
                                onClick={() => {
                                    setSelectedCategory("ALL");
                                    setSearchQuery("");
                                }}
                            >
                                Reset Filters
                            </button>
                        </div>
                    ) : (
                        <div className="row g-4">
                            {filteredArticles.map((art) => (
                                <div key={art.id} className="col-md-6 col-lg-4">
                                    <div
                                        className="tb-article-card rounded-4 bg-white border h-100 d-flex flex-column"
                                        onClick={() => setActiveArticle(art)}
                                    >
                                        <div className="tb-card-img-wrap">
                                            <img
                                                src={art.image}
                                                alt={art.title}
                                                className="tb-card-img"
                                            />
                                            <span className="tb-badge-category-floating">{art.categoryLabel}</span>
                                        </div>

                                        <div className="tb-card-body p-4 d-flex flex-column flex-grow-1">
                                            <div className="d-flex align-items-center gap-3 text-muted extra-small mb-2">
                                                <span className="d-flex align-items-center gap-1">
                                                    <Calendar size={13} /> {art.date}
                                                </span>
                                                <span>•</span>
                                                <span className="d-flex align-items-center gap-1">
                                                    <Clock size={13} /> {art.readTime}
                                                </span>
                                            </div>

                                            <h5 className="tb-card-title fw-bold text-dark mb-2">
                                                {art.title}
                                            </h5>

                                            <p className="tb-card-desc small text-muted mb-4 flex-grow-1">
                                                {art.summary}
                                            </p>

                                            <div className="pt-3 border-top d-flex justify-content-between align-items-center">
                                                <button
                                                    className="tb-link-guide-btn"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveArticle(art);
                                                    }}
                                                >
                                                    Read Full Guide <ChevronRight size={15} />
                                                </button>
                                                <span className="extra-small text-muted fw-semibold">Click to expand</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* =================================================================
          5. PREVENTATIVE AUTO-REMINDER NOTIFICATION BANNER
          ================================================================= */}
            <section className="tb-content-section bg-white border-top">
                <div className="container">
                    <div className="row align-items-center g-5">
                        <div className="col-lg-6">
                            <span className="tb-eyebrow">Preventive Intelligence</span>
                            <h2 className="tb-headline">Stop Waiting for Breakdowns Before Servicing</h2>
                            <p className="tb-subtext mb-4">
                                Most laptop failures—like burnt power MOSFETs and swollen battery cells—begin with neglected thermal paste and clogged fan bearings. TechBridge monitors your service history and notifies you before critical damage happens.
                            </p>

                            <div className="row g-3">
                                <div className="col-sm-6">
                                    <div className="p-3 bg-light rounded-3 border h-100">
                                        <CheckCircle2 size={18} className="text-success mb-2" />
                                        <h6 className="fw-bold text-dark mb-1">Thermal Scheduling</h6>
                                        <p className="extra-small text-muted mb-0">Automated 12-month alerts for Arctic compound refresh and fan ultrasonic dusting.</p>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="p-3 bg-light rounded-3 border h-100">
                                        <ShieldCheck size={18} className="text-primary mb-2" />
                                        <h6 className="fw-bold text-dark mb-1">Battery Health Tracking</h6>
                                        <p className="extra-small text-muted mb-0">Alerts when charge-cycle capacity dips below 80% to protect the motherboard power rail.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="p-4 p-md-5 rounded-4 bg-light border shadow-sm text-center text-lg-start">
                                <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-primary bg-opacity-10 text-primary fw-bold extra-small mb-3">
                                    <Sparkles size={14} /> Automated Service Reminders
                                </div>
                                <h4 className="fw-bold text-dark mb-2">Register Your Laptop Model</h4>
                                <p className="small text-muted mb-4">
                                    Add your brand and serial model to receive customized maintenance alerts and view model-matched components.
                                </p>
                                <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-lg-start">
                                    <button
                                        onClick={() => navigate('/userdashboard')}
                                        className="tb-btn-primary"
                                    >
                                        Open User Dashboard <ArrowRight size={16} />
                                    </button>
                                    <button
                                        onClick={() => navigate('/service-center')}
                                        className="tb-btn-outline"
                                    >
                                        Find Nearby Center
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =================================================================
          6. BOTTOM CALL TO ACTION
          ================================================================= */}
            <section className="tb-cta-section">
                <div className="container text-center">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <h2 className="tb-cta-headline">Experiencing a Hardware Glitch Right Now?</h2>
                            <p className="tb-cta-subtext">
                                Don't guess with unverified fixes. Locate an authorized brand service center or order verified genuine replacement hardware today.
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
                                    Shop Genuine Parts
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =================================================================
          7. EXPANDED ARTICLE READING MODAL
          ================================================================= */}
            {activeArticle && (
                <div className="tb-modal-backdrop" onClick={() => setActiveArticle(null)}>
                    <div
                        className="tb-modal-container"
                        onClick={(e) => e.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                    >
                        {/* Modal Header Bar */}
                        <div className="tb-modal-header d-flex align-items-center justify-content-between p-3 px-md-4 border-bottom bg-white sticky-top">
                            <div className="d-flex align-items-center gap-2">
                                <span className="tb-badge-category">{activeArticle.categoryLabel}</span>
                                <span className="extra-small text-muted d-none d-sm-inline">• {activeArticle.readTime}</span>
                            </div>
                            <button
                                className="tb-modal-close-btn"
                                onClick={() => setActiveArticle(null)}
                                aria-label="Close modal"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Scrollable Content */}
                        <div className="tb-modal-body p-4 p-md-5">

                            {/* Header Image */}
                            <div className="tb-modal-hero-img-wrap rounded-4 overflow-hidden mb-4">
                                <img
                                    src={activeArticle.image}
                                    alt={activeArticle.title}
                                    className="w-100 h-100 object-fit-cover"
                                />
                            </div>

                            {/* Title & Metadata */}
                            <div className="d-flex align-items-center gap-3 text-muted extra-small mb-2">
                                <span className="d-flex align-items-center gap-1">
                                    <Calendar size={14} /> {activeArticle.date}
                                </span>
                                <span>•</span>
                                <span className="d-flex align-items-center gap-1">
                                    <Clock size={14} /> {activeArticle.readTime}
                                </span>
                                <span>•</span>
                                <span className="text-primary fw-bold">Verified Technician Guide</span>
                            </div>

                            <h2 className="tb-modal-title fw-bold text-dark mb-3">
                                {activeArticle.title}
                            </h2>

                            {/* Intro Callout */}
                            <div className="p-3.5 p-md-4 rounded-3 bg-light border-start border-4 border-primary mb-4">
                                <p className="tb-modal-intro mb-0 text-dark fw-medium lh-base">
                                    {activeArticle.content.intro}
                                </p>
                            </div>

                            {/* Detailed Article Sections */}
                            <div className="tb-modal-sections mb-5">
                                {activeArticle.content.sections.map((sec, idx) => (
                                    <div key={idx} className="mb-4">
                                        <h5 className="fw-bold text-dark mb-2">{sec.heading}</h5>
                                        <p className="text-muted lh-lg mb-0">{sec.text}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Key Diagnostic Takeaways */}
                            <div className="p-4 rounded-4 bg-primary bg-opacity-10 border border-primary border-opacity-25 mb-5">
                                <h6 className="fw-bold text-primary mb-3 d-flex align-items-center gap-2">
                                    <CheckCircle2 size={18} /> Important Practical Takeaways
                                </h6>
                                <ul className="list-unstyled mb-0 d-flex flex-column gap-2">
                                    {activeArticle.content.takeaways.map((item, idx) => (
                                        <li key={idx} className="small text-dark d-flex align-items-start gap-2">
                                            <span className="text-primary fw-bold">•</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Modal Footer Routing */}
                            <div className="pt-4 border-top d-flex flex-wrap justify-content-between align-items-center gap-3">
                                <span className="extra-small text-muted">
                                    Need help diagnosing your laptop? Talk with our authorized repair team.
                                </span>
                                <div className="d-flex gap-2">
                                    <button
                                        className="btn btn-outline-dark btn-sm rounded-pill px-3"
                                        onClick={() => {
                                            setActiveArticle(null);
                                            navigate('/service-center');
                                        }}
                                    >
                                        Locate Service Center
                                    </button>
                                    <button
                                        className="btn btn-primary btn-sm rounded-pill px-3"
                                        onClick={() => {
                                            setActiveArticle(null);
                                            navigate('/products');
                                        }}
                                    >
                                        Shop Verified Parts
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Blog;