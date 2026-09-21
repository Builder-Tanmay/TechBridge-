import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  Info,
  Layers,
  BookOpen,
  Briefcase,
  Mail,
  ShoppingCart,
  Heart,
  User,
  Package,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import wishlistService from '../services/wishlistService';
import '../Css/Header.css';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);

  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  // Load user object and wishlist count
  const checkAuthAndWishlist = async () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        const userObj = parsed?.user || parsed;
        setCurrentUser(userObj);
        const userId = userObj?.id || userObj?.userid || userObj?.user_id;
        if (userId) {
          setWishlistCount(wishlistService.getWishlistCount(userId));
          try {
            const list = await wishlistService.getWishlist(userId);
            if (Array.isArray(list)) {
              setWishlistCount(list.length);
            }
          } catch (err) {
            console.warn("Backend wishlist sync error:", err);
          }
        } else {
          setWishlistCount(0);
        }
      } catch (e) {
        console.error("Error parsing user object from localStorage", e);
        setCurrentUser(null);
        setWishlistCount(0);
      }
    } else {
      setCurrentUser(null);
      setWishlistCount(0);
    }
  };

  useEffect(() => {
    checkAuthAndWishlist();

    window.addEventListener("auth-change", checkAuthAndWishlist);
    window.addEventListener("wishlist-change", checkAuthAndWishlist);
    window.addEventListener("storage", checkAuthAndWishlist);

    // Close menus when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest('.tb-mobile-toggle-btn')
      ) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("auth-change", checkAuthAndWishlist);
      window.removeEventListener("wishlist-change", checkAuthAndWishlist);
      window.removeEventListener("storage", checkAuthAndWishlist);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Logout Handler
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    setCurrentUser(null);
    setWishlistCount(0);
    setDropdownOpen(false);
    setMobileMenuOpen(false);

    window.dispatchEvent(new CustomEvent("auth-change"));
    window.dispatchEvent(new CustomEvent("wishlist-change"));

    alert("Logged out successfully!");
    navigate("/login");
  };

  // User initial
  const getUserInitial = () => {
    if (!currentUser) return 'U';
    const name = currentUser.fullName || currentUser.fullname || currentUser.email || 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <header className="fixed-top d-flex justify-content-center pt-3 pt-md-4 px-2 px-md-3 tb-header-z">

      {/* Outer Main Glass Navbar */}
      <nav className="glass-navbar d-flex align-items-center justify-content-between rounded-pill">

        {/* 1. Brand Logo */}
        <Link to="/" className="brand-logo d-flex align-items-center justify-content-center rounded text-decoration-none flex-shrink-0">
          <span className="logo-text fw-bold text-center text-white">TECHBRIDGE</span>
        </Link>

        {/* Divider (Desktop Only) */}
        <div className="nav-divider d-none d-lg-block"></div>

        {/* 2. Desktop Navigation Icons Bar (Visible on lg and above) */}
        <div className="nav-icons-wrapper d-none d-lg-block">
          <ul className="nav nav-icon-list align-items-center list-unstyled mb-0">

            <li className="nav-item">
              <NavLink
                to="/"
                end
                data-tooltip="Home"
                className={({ isActive }) => `nav-icon-btn d-flex align-items-center justify-content-center ${isActive ? 'active-icon' : ''}`}
              >
                <Home size={21} strokeWidth={1.8} />
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/about"
                data-tooltip="About"
                className={({ isActive }) => `nav-icon-btn d-flex align-items-center justify-content-center ${isActive ? 'active-icon' : ''}`}
              >
                <Info size={21} strokeWidth={1.8} />
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/services"
                data-tooltip="Services"
                className={({ isActive }) => `nav-icon-btn d-flex align-items-center justify-content-center ${isActive ? 'active-icon' : ''}`}
              >
                <Layers size={21} strokeWidth={1.8} />
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/blog"
                data-tooltip="Blogs"
                className={({ isActive }) => `nav-icon-btn d-flex align-items-center justify-content-center ${isActive ? 'active-icon' : ''}`}
              >
                <BookOpen size={21} strokeWidth={1.8} />
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/product"
                data-tooltip="Products"
                className={({ isActive }) => `nav-icon-btn d-flex align-items-center justify-content-center ${isActive ? 'active-icon' : ''}`}
              >
                <Briefcase size={21} strokeWidth={1.8} />
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/contact"
                data-tooltip="Contact Us"
                className={({ isActive }) => `nav-icon-btn d-flex align-items-center justify-content-center ${isActive ? 'active-icon' : ''}`}
              >
                <Mail size={21} strokeWidth={1.8} />
              </NavLink>
            </li>

            {/* Cart Icon (Only if logged in) */}
            {currentUser && (
              <li className="nav-item">
                <NavLink
                  to="/cart"
                  data-tooltip="Cart"
                  className={({ isActive }) => `nav-icon-btn d-flex align-items-center justify-content-center ${isActive ? 'active-icon' : ''}`}
                >
                  <ShoppingCart size={21} strokeWidth={1.8} />
                </NavLink>
              </li>
            )}

          </ul>
        </div>

        {/* Divider (Desktop Only) */}
        <div className="nav-divider d-none d-lg-block"></div>

        {/* 3. Action Buttons & User Menu */}
        <div className="d-flex align-items-center nav-actions flex-shrink-0">

          {!currentUser ? (
            <div className="d-flex align-items-center gap-1.5">
              <Link
                to="/login"
                className="btn-login-link text-decoration-none fw-medium d-none d-sm-inline-block"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="btn-signup-pill text-decoration-none fw-semibold"
              >
                Sign up
              </Link>
            </div>
          ) : (
            /* Logged In User Avatar Dropdown */
            <div className="user-dropdown-container" ref={dropdownRef}>
              <button
                type="button"
                className="user-avatar-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                title={currentUser.fullName || "Account"}
                aria-label="User profile menu"
              >
                {currentUser?.profileImage || currentUser?.profileimage ? (
                  <img
                    src={currentUser.profileImage || currentUser.profileimage}
                    alt={currentUser.fullName || "User"}
                    className="header-avatar-img"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  getUserInitial()
                )}
              </button>

              {dropdownOpen && (
                <div className="user-dropdown-menu">
                  <div className="dropdown-header-info">
                    <div className="d-flex align-items-center gap-2">
                      {(currentUser?.profileImage || currentUser?.profileimage) && (
                        <img
                          src={currentUser.profileImage || currentUser.profileimage}
                          alt="Avatar"
                          className="dropdown-avatar-thumb"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      )}
                      <div>
                        <span className="dropdown-user-name">{currentUser.fullName || currentUser.fullname || 'User'}</span>
                        <span className="dropdown-user-email">{currentUser.email}</span>
                      </div>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>

                  <Link
                    to="/userdashboard"
                    className="dropdown-item-link"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <User size={16} />
                    <span>User Dashboard</span>
                  </Link>

                  {/* My Orders Link */}
                  <Link
                    to="/myorders"
                    className="dropdown-item-link"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Package size={16} />
                    <span>My Orders</span>
                  </Link>

                  {/* Wishlist Link inside User Avatar Dropdown */}
                  <Link
                    to="/wishlist"
                    className="dropdown-item-link wishlist-dropdown-link"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Heart size={16} className="text-danger" />
                    <span>My Wishlist</span>
                    {wishlistCount > 0 && (
                      <span className="dropdown-count-badge">{wishlistCount}</span>
                    )}
                  </Link>

                  <Link
                    to="/settings"
                    className="dropdown-item-link"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Settings size={16} />
                    <span>Account Settings</span>
                  </Link>

                  <div className="dropdown-divider"></div>

                  <button
                    type="button"
                    className="dropdown-item-link logout-item"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 4. Mobile Menu Hamburger Button (Hidden on Desktop) */}
          <button
            type="button"
            className="tb-mobile-toggle-btn d-lg-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

        </div>

      </nav>

      {/* =================================================================
          MOBILE SLIDE-DOWN GLASS DRAWER (< 992px)
          ================================================================= */}
      {mobileMenuOpen && (
        <div className="tb-mobile-drawer" ref={mobileMenuRef}>
          <ul className="list-unstyled d-flex flex-column gap-1 mb-0">
            <li>
              <NavLink
                to="/"
                end
                className={({ isActive }) => `tb-mobile-link ${isActive ? 'active' : ''}`}
              >
                <Home size={18} />
                <span>Home</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className={({ isActive }) => `tb-mobile-link ${isActive ? 'active' : ''}`}
              >
                <Info size={18} />
                <span>About Us</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/services"
                className={({ isActive }) => `tb-mobile-link ${isActive ? 'active' : ''}`}
              >
                <Layers size={18} />
                <span>Services</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/blog"
                className={({ isActive }) => `tb-mobile-link ${isActive ? 'active' : ''}`}
              >
                <BookOpen size={18} />
                <span>Hardware Blog</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/product"
                className={({ isActive }) => `tb-mobile-link ${isActive ? 'active' : ''}`}
              >
                <Briefcase size={18} />
                <span>Spare Parts</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                className={({ isActive }) => `tb-mobile-link ${isActive ? 'active' : ''}`}
              >
                <Mail size={18} />
                <span>Contact Us</span>
              </NavLink>
            </li>

            {currentUser && (
              <>
                <li>
                  <NavLink
                    to="/myorders"
                    className={({ isActive }) => `tb-mobile-link ${isActive ? 'active' : ''}`}
                  >
                    <Package size={18} />
                    <span>My Orders</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/cart"
                    className={({ isActive }) => `tb-mobile-link ${isActive ? 'active' : ''}`}
                  >
                    <ShoppingCart size={18} />
                    <span>Shopping Cart</span>
                  </NavLink>
                </li>
              </>
            )}

            {!currentUser && (
              <li className="pt-2 border-top border-secondary border-opacity-10 mt-1 d-sm-none">
                <Link to="/login" className="tb-mobile-link">
                  <User size={18} />
                  <span>Login</span>
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Floating Bottom-Right Wishlist Pill */}
      {currentUser && (
        <Link
          to="/wishlist"
          className="tb-floating-wishlist-pill"
          aria-label="View Saved Wishlist"
        >
          <div className="tb-floating-icon-wrap">
            <Heart size={20} className="tb-floating-heart-icon" />
            {wishlistCount > 0 && (
              <span className="tb-floating-count-badge">{wishlistCount}</span>
            )}
          </div>
          <span className="tb-floating-label">Wishlist</span>
        </Link>
      )}

    </header>
  );
}

export default Header;