import React, { useState, useEffect, useCallback, useRef } from "react";
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup, 
  useMap,
  ZoomControl
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { 
  MapPin, 
  Navigation, 
  Phone, 
  ShieldCheck, 
  Wrench, 
  Search, 
  Compass, 
  SlidersHorizontal,
  ExternalLink,
  LocateFixed,
  Building2,
  Star,
  CheckCircle2,
  List,
  Map as MapIcon,
  Sparkles,
  Clock,
  ChevronRight,
  AlertCircle
} from "lucide-react";
import { API_BASE_URL } from "../config/api";

// Fallback Default: Ghatkopar / Mumbai Center Coordinates
const DEFAULT_COORDS = { lat: 19.0881, lng: 72.9082, name: "Ghatkopar, Mumbai" };

// Real Mumbai Tech Hubs
const MUMBAI_HUBS = [
  { name: "Ghatkopar", lat: 19.0881, lng: 72.9082, label: "Ghatkopar (R-City)" },
  { name: "Andheri", lat: 19.1197, lng: 72.8727, label: "Andheri (MIDC / Link Rd)" },
  { name: "Bandra & BKC", lat: 19.0657, lng: 72.8688, label: "BKC & Bandra" },
  { name: "Dadar & Lamington", lat: 19.0178, lng: 72.8478, label: "Dadar / Lamington" },
  { name: "Borivali", lat: 19.2288, lng: 72.8541, label: "Borivali & Kandivali" },
  { name: "Thane", lat: 19.1860, lng: 72.9754, label: "Thane (Station / Naupada)" },
  { name: "Vashi", lat: 19.0771, lng: 72.9986, label: "Navi Mumbai (Vashi)" }
];

// Helper: Haversine distance in km / meters
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance < 1 ? `${Math.round(distance * 1000)} m` : `${distance.toFixed(1)} km`;
};

// Brand Icon / Color Detection Helper
const getBrandInfo = (name = "") => {
  const lower = name.toLowerCase();
  if (lower.includes("apple") || lower.includes("inspire")) {
    return { brand: "Apple", color: "#111827", bg: "#f3f4f6", badge: "Apple Authorized" };
  }
  if (lower.includes("dell")) {
    return { brand: "Dell", color: "#0076ce", bg: "#eff6ff", badge: "Dell Exclusive" };
  }
  if (lower.includes("hp")) {
    return { brand: "HP", color: "#0096d6", bg: "#f0f9ff", badge: "HP Official" };
  }
  if (lower.includes("lenovo")) {
    return { brand: "Lenovo", color: "#e2231a", bg: "#fef2f2", badge: "Lenovo Authorized" };
  }
  if (lower.includes("asus") || lower.includes("rog")) {
    return { brand: "Asus ROG", color: "#6366f1", bg: "#eef2ff", badge: "Asus Official" };
  }
  if (lower.includes("acer")) {
    return { brand: "Acer", color: "#83b81a", bg: "#f7fee7", badge: "Acer Official" };
  }
  return { brand: "Verified Partner", color: "#d97706", bg: "#fffbeb", badge: "Chip-Level Lab" };
};

// Custom SVG Leaflet Markers
const createUserPin = () => {
  return L.divIcon({
    className: "tb-map-pin-custom",
    html: `
      <div class="tb-user-gps-marker">
        <div class="tb-user-radar"></div>
        <div class="tb-user-center-point">
          <div class="tb-user-core-dot"></div>
        </div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20]
  });
};

const createStorePin = (center, isSelected = false) => {
  const isOfficial = center.type === "OFFICIAL";
  const brandInfo = getBrandInfo(center.name);
  const selectClass = isSelected ? "selected-marker" : "";
  const bgClass = isOfficial ? "official-pin" : "partner-pin";

  return L.divIcon({
    className: "tb-map-pin-custom",
    html: `
      <div class="tb-store-marker-wrap ${bgClass} ${selectClass}">
        <div class="tb-store-marker-bubble">
          ${
            isOfficial
              ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>`
              : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>`
          }
        </div>
        <div class="tb-store-marker-tip"></div>
      </div>
    `,
    iconSize: [34, 40],
    iconAnchor: [17, 40],
    popupAnchor: [0, -40]
  });
};

// Map Fly-To Animation Controller
const MapFlyToHelper = ({ center, zoom, selectedCenter }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedCenter && selectedCenter.latitude && selectedCenter.longitude) {
      map.flyTo([selectedCenter.latitude, selectedCenter.longitude], 15, {
        animate: true,
        duration: 0.9
      });
    } else if (center && center.lat && center.lng) {
      map.flyTo([center.lat, center.lng], zoom, {
        animate: true,
        duration: 0.8
      });
    }
  }, [center, zoom, selectedCenter, map]);

  return null;
};

const ServiceCenterLocator = () => {
  // State
  const [userLocation, setUserLocation] = useState({ lat: DEFAULT_COORDS.lat, lng: DEFAULT_COORDS.lng });
  const [locationName, setLocationName] = useState(DEFAULT_COORDS.name);
  const [gpsState, setGpsState] = useState("DEFAULT"); // "LIVE" | "DEFAULT" | "SEARCHING" | "DENIED"

  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Controls
  const [radius, setRadius] = useState(15);
  const [filterType, setFilterType] = useState("ALL"); // "ALL" | "OFFICIAL" | "UNOFFICIAL"
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [mapZoom, setMapZoom] = useState(13);
  const [mobileView, setMobileView] = useState("SPLIT"); // "SPLIT" | "MAP" | "LIST"

  const markerRefs = useRef({});
  const cardRefs = useRef({});

  // 1. Live GPS Request
  const requestLiveGPS = useCallback(() => {
    if (!navigator.geolocation) {
      setGpsState("DENIED");
      return;
    }

    setGpsState("SEARCHING");
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(coords);
        setLocationName("Your Current GPS Location");
        setGpsState("LIVE");
        setSelectedCenter(null);
        setMapZoom(14);
      },
      (err) => {
        console.warn("GPS Permission Denied or Timeout:", err.message);
        setGpsState("DENIED");
        setUserLocation({ lat: DEFAULT_COORDS.lat, lng: DEFAULT_COORDS.lng });
        setLocationName("Ghatkopar, Mumbai (Default)");
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 }
    );
  }, []);

  useEffect(() => {
    requestLiveGPS();
  }, [requestLiveGPS]);

  // 2. Fetch Service Centers from Backend API
  const fetchNearbyCenters = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/service-centers/nearby?lat=${userLocation.lat}&lng=${userLocation.lng}&radius=${radius}`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setCenters(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Backend fetch error:", err);
      // Fallback query
      try {
        const fb = await fetch(`${API_BASE_URL}/api/service-centers/area?name=Ghatkopar`);
        if (fb.ok) {
          const fbData = await fb.json();
          setCenters(Array.isArray(fbData) ? fbData : []);
          return;
        }
      } catch (fbErr) {
        console.error("Fallback error:", fbErr);
      }
      setError("Unable to connect to Spring Boot backend at http://localhost:8080. Verify backend is running.");
      setCenters([]);
    } finally {
      setLoading(false);
    }
  }, [userLocation, radius]);

  useEffect(() => {
    if (userLocation.lat && userLocation.lng) {
      fetchNearbyCenters();
    }
  }, [userLocation, radius, fetchNearbyCenters]);

  // 3. Quick Area Jump
  const handleHubSelect = (hub) => {
    setUserLocation({ lat: hub.lat, lng: hub.lng });
    setLocationName(`${hub.name}, Mumbai`);
    setGpsState("DEFAULT");
    setSelectedCenter(null);
    setMapZoom(13);
  };

  // 4. Center Card Click
  const handleCardClick = (center) => {
    setSelectedCenter(center);
    if (markerRefs.current[center.id]) {
      markerRefs.current[center.id].openPopup();
    }
  };

  // Filtered List Logic
  const filteredCenters = centers.filter((c) => {
    const matchesType =
      filterType === "ALL"
        ? true
        : filterType === "OFFICIAL"
        ? c.type === "OFFICIAL"
        : c.type === "UNOFFICIAL";

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      c.name?.toLowerCase().includes(q) ||
      c.area?.toLowerCase().includes(q) ||
      c.city?.toLowerCase().includes(q) ||
      c.details?.toLowerCase().includes(q) ||
      c.address?.toLowerCase().includes(q);

    return matchesType && matchesSearch;
  });

  const officialCount = centers.filter((c) => c.type === "OFFICIAL").length;
  const partnerCount = centers.filter((c) => c.type === "UNOFFICIAL").length;

  return (
    <div className="tb-locator-unified-wrapper">
      
      {/* 🔝 TOP FLOATING EXPLORER BAR */}
      <div className="tb-explorer-topbar bg-white border rounded-4 p-3 p-md-4 shadow-sm mb-4">
        
        {/* Row 1: Search + Live GPS Trigger */}
        <div className="row g-3 align-items-center mb-3">
          
          <div className="col-lg-6 col-md-12">
            <div className="tb-search-bar-unified d-flex align-items-center bg-light rounded-pill px-3 py-1.5 border">
              <Search size={18} className="text-muted me-2 flex-shrink-0" />
              <input
                type="text"
                className="form-control form-control-sm bg-transparent border-0 shadow-none ps-0"
                placeholder="Search by brand (HP, Dell, Apple...), area, or service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className="btn btn-sm btn-link text-muted p-0 text-decoration-none"
                  onClick={() => setSearchQuery("")}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="col-lg-6 col-md-12 d-flex align-items-center justify-content-lg-end gap-2 flex-wrap">
            
            {/* Live GPS Button */}
            <button
              type="button"
              className={`btn btn-sm rounded-pill px-3 py-2 fw-semibold d-inline-flex align-items-center gap-1.5 shadow-sm transition ${
                gpsState === "LIVE"
                  ? "btn-success text-white"
                  : "btn-dark text-white"
              }`}
              onClick={requestLiveGPS}
              disabled={gpsState === "SEARCHING"}
            >
              <LocateFixed size={15} className={gpsState === "SEARCHING" ? "spinner-grow spinner-grow-sm" : ""} />
              {gpsState === "SEARCHING" ? "Detecting GPS..." : gpsState === "LIVE" ? "GPS Active" : "Detect My Live GPS"}
            </button>

            {/* Radius Selector */}
            <div className="d-flex align-items-center gap-1.5 bg-light rounded-pill px-3 py-1.5 border">
              <SlidersHorizontal size={14} className="text-muted" />
              <span className="extra-small text-muted fw-bold">Radius:</span>
              <select
                className="form-select form-select-sm bg-transparent border-0 shadow-none py-0 ps-1 pe-4 extra-small fw-bold text-dark cursor-pointer"
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                style={{ width: "auto" }}
              >
                <option value={5}>5 km</option>
                <option value={10}>10 km</option>
                <option value={15}>15 km (Best)</option>
                <option value={25}>25 km</option>
                <option value={50}>50 km (All MMR)</option>
              </select>
            </div>

            {/* Mobile View Toggle */}
            <div className="d-flex d-lg-none bg-light rounded-pill p-1 border">
              <button
                className={`btn btn-sm rounded-pill px-2.5 py-1 extra-small fw-bold ${mobileView === "MAP" ? "btn-dark" : "text-muted"}`}
                onClick={() => setMobileView("MAP")}
              >
                <MapIcon size={13} className="me-1" /> Map
              </button>
              <button
                className={`btn btn-sm rounded-pill px-2.5 py-1 extra-small fw-bold ${mobileView === "LIST" ? "btn-dark" : "text-muted"}`}
                onClick={() => setMobileView("LIST")}
              >
                <List size={13} className="me-1" /> List
              </button>
            </div>

          </div>

        </div>

        {/* Row 2: Popular Hub Chips + Segmented Type Switch */}
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 pt-3 border-top">
          
          {/* Quick Mumbai Hubs */}
          <div className="d-flex align-items-center gap-1.5 flex-wrap">
            <span className="extra-small text-uppercase text-muted fw-bold me-1">Hubs:</span>
            {MUMBAI_HUBS.map((hub) => (
              <button
                key={hub.name}
                type="button"
                className={`btn btn-sm rounded-pill tb-quick-hub-btn ${
                  locationName.includes(hub.name) && gpsState !== "LIVE"
                    ? "tb-hub-active"
                    : "tb-hub-idle"
                }`}
                onClick={() => handleHubSelect(hub)}
              >
                {hub.name}
              </button>
            ))}
          </div>

          {/* Segmented Brand / Clinic Filter */}
          <div className="tb-segmented-filter bg-light p-1 rounded-pill border d-inline-flex">
            <button
              className={`btn btn-sm rounded-pill px-3 py-1 extra-small fw-bold transition ${
                filterType === "ALL" ? "btn-dark shadow-sm text-white" : "text-secondary"
              }`}
              onClick={() => setFilterType("ALL")}
            >
              All ({centers.length})
            </button>
            <button
              className={`btn btn-sm rounded-pill px-3 py-1 extra-small fw-bold transition ${
                filterType === "OFFICIAL" ? "btn-primary shadow-sm text-white" : "text-secondary"
              }`}
              onClick={() => setFilterType("OFFICIAL")}
            >
              <ShieldCheck size={13} className="me-1 d-inline" /> Official ({officialCount})
            </button>
            <button
              className={`btn btn-sm rounded-pill px-3 py-1 extra-small fw-bold transition ${
                filterType === "UNOFFICIAL" ? "btn-warning text-dark shadow-sm" : "text-secondary"
              }`}
              onClick={() => setFilterType("UNOFFICIAL")}
            >
              <Wrench size={12} className="me-1 d-inline" /> Partner Clinics ({partnerCount})
            </button>
          </div>

        </div>

      </div>

      {/* ERROR BANNER */}
      {error && (
        <div className="alert alert-danger rounded-4 d-flex align-items-center gap-3 mb-4 shadow-sm">
          <AlertCircle size={22} className="text-danger flex-shrink-0" />
          <div className="small">{error}</div>
        </div>
      )}

      {/* 🗺️ MAIN UNIFIED DUAL EXPLORER */}
      <div className="tb-main-explorer-card bg-white rounded-4 border shadow-sm overflow-hidden">
        <div className="row g-0">
          
          {/* ========================================================= */}
          {/* 📋 LEFT: CARDS SIDEBAR LIST (40% width on Desktop) */}
          {/* ========================================================= */}
          <div className={`col-lg-5 tb-sidebar-column ${mobileView === "MAP" ? "d-none d-lg-block" : "d-block"}`}>
            
            {/* Sidebar Feed Header */}
            <div className="tb-feed-header p-3 px-md-4 border-bottom bg-light bg-opacity-50 d-flex justify-content-between align-items-center">
              <div>
                <h6 className="fw-bold text-dark mb-0">
                  {filteredCenters.length} Service Centers Found
                </h6>
                <span className="extra-small text-muted">
                  Near {locationName} • Sorted by closest
                </span>
              </div>
              <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 rounded-pill px-2.5 py-1 extra-small fw-bold">
                {radius} km Radius
              </span>
            </div>

            {/* Scrollable Feed Container */}
            <div className="tb-cards-feed-scroll p-3 p-md-3">
              
              {loading ? (
                <div className="py-5 text-center text-muted">
                  <div className="spinner-border spinner-border-sm text-primary mb-2" role="status"></div>
                  <div className="small fw-semibold">Loading verified service centers...</div>
                </div>
              ) : filteredCenters.length === 0 ? (
                <div className="text-center py-5 px-3">
                  <Compass size={38} className="text-muted opacity-40 mb-2" />
                  <h6 className="fw-bold text-dark mb-1">No Centers in this Range</h6>
                  <p className="extra-small text-muted mb-3">
                    No verified centers found within {radius} km of your selected location.
                  </p>
                  <button
                    className="btn btn-dark btn-sm rounded-pill px-3.5 extra-small fw-bold shadow-sm"
                    onClick={() => {
                      setRadius(50);
                      setFilterType("ALL");
                      setSearchQuery("");
                    }}
                  >
                    Expand to 50 km (All Mumbai)
                  </button>
                </div>
              ) : (
                filteredCenters.map((center) => {
                  const isSelected = selectedCenter?.id === center.id;
                  const isOfficial = center.type === "OFFICIAL";
                  const brandInfo = getBrandInfo(center.name);
                  const distanceStr = calculateDistance(
                    userLocation.lat,
                    userLocation.lng,
                    center.latitude,
                    center.longitude
                  );

                  return (
                    <div
                      key={center.id}
                      ref={(el) => (cardRefs.current[center.id] = el)}
                      className={`tb-store-card p-3 rounded-4 mb-3 border transition ${
                        isSelected ? "tb-store-card-active" : "bg-white"
                      }`}
                      onClick={() => handleCardClick(center)}
                    >
                      {/* Badge Row */}
                      <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                        <div className="d-flex align-items-center gap-1.5 flex-wrap">
                          <span
                            className={`badge ${
                              isOfficial
                                ? "bg-success bg-opacity-10 text-success border border-success border-opacity-25"
                                : "bg-warning bg-opacity-15 text-dark border border-warning border-opacity-50"
                            } rounded-pill px-2.5 py-1 extra-small fw-bold d-inline-flex align-items-center gap-1`}
                          >
                            {isOfficial ? <ShieldCheck size={12} /> : <Wrench size={11} />}
                            {isOfficial ? "OFFICIAL BRAND" : "PARTNER LAB"}
                          </span>

                          <span
                            className="badge rounded-pill px-2 py-1 extra-small fw-semibold"
                            style={{ background: brandInfo.bg, color: brandInfo.color }}
                          >
                            {brandInfo.badge}
                          </span>
                        </div>

                        {distanceStr && (
                          <span className="badge bg-primary text-white rounded-pill px-2.5 py-1 extra-small fw-bold shadow-sm text-nowrap">
                            📍 {distanceStr}
                          </span>
                        )}
                      </div>

                      {/* Store Name */}
                      <h6 className="fw-bold text-dark mb-1 fs-6">{center.name}</h6>

                      {/* Address */}
                      <p className="extra-small text-muted mb-2 d-flex align-items-start gap-1.5 lh-sm">
                        <MapPin size={13} className="text-secondary flex-shrink-0 mt-0.5" />
                        <span>{center.address}</span>
                      </p>

                      {/* Details / Specialization */}
                      {center.details && (
                        <div className="extra-small text-secondary bg-light p-2 rounded-3 mb-3 border">
                          <Sparkles size={11} className="text-warning me-1 d-inline" />
                          {center.details}
                        </div>
                      )}

                      {/* Action Links */}
                      <div className="d-flex align-items-center justify-content-between pt-2 border-top gap-2">
                        {center.contactNumber ? (
                          <a
                            href={`tel:${center.contactNumber}`}
                            className="btn btn-outline-dark btn-sm rounded-pill px-3 py-1 extra-small fw-bold d-inline-flex align-items-center gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Phone size={12} /> {center.contactNumber}
                          </a>
                        ) : (
                          <span></span>
                        )}

                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${center.latitude},${center.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary btn-sm rounded-pill px-3 py-1 extra-small fw-bold d-inline-flex align-items-center gap-1 shadow-sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Navigation size={12} /> Get Directions
                        </a>
                      </div>
                    </div>
                  );
                })
              )}

            </div>

          </div>

          {/* ========================================================= */}
          {/* 🗺️ RIGHT: LEAFLET MAP CANVAS (60% width on Desktop) */}
          {/* ========================================================= */}
          <div className={`col-lg-7 tb-map-column position-relative ${mobileView === "LIST" ? "d-none d-lg-block" : "d-block"}`}>
            
            {/* Floating Top Status Indicator on Map */}
            <div className="tb-map-floating-indicator position-absolute top-0 start-0 m-3 z-3 bg-white p-2 px-3 rounded-pill shadow-sm border d-flex align-items-center gap-2">
              <span className={`tb-live-dot ${gpsState === "LIVE" ? "live" : "idle"}`}></span>
              <span className="extra-small fw-bold text-dark">
                {gpsState === "LIVE" ? "Live GPS Connected" : locationName}
              </span>
            </div>

            <MapContainer
              center={[userLocation.lat, userLocation.lng]}
              zoom={mapZoom}
              scrollWheelZoom={true}
              zoomControl={false}
              className="tb-unified-leaflet-canvas"
              style={{ height: "660px", width: "100%" }}
            >
              <ZoomControl position="bottomright" />

              <MapFlyToHelper 
                center={userLocation} 
                zoom={mapZoom} 
                selectedCenter={selectedCenter} 
              />

              {/* OpenStreetMap Base Tile Layer */}
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* User Position GPS Marker */}
              {userLocation.lat && userLocation.lng && (
                <Marker
                  position={[userLocation.lat, userLocation.lng]}
                  icon={createUserPin()}
                >
                  <Popup className="tb-unified-map-popup">
                    <div className="p-2 text-center">
                      <span className="badge bg-primary text-white rounded-pill px-2.5 py-1 mb-1 extra-small fw-bold">
                        📍 Your GPS Location
                      </span>
                      <h6 className="fw-bold text-dark mb-0 extra-small mt-1">{locationName}</h6>
                    </div>
                  </Popup>
                </Marker>
              )}

              {/* Verified Service Center Markers */}
              {filteredCenters.map((center) => {
                const isSelected = selectedCenter?.id === center.id;
                const isOfficial = center.type === "OFFICIAL";
                const distanceStr = calculateDistance(
                  userLocation.lat,
                  userLocation.lng,
                  center.latitude,
                  center.longitude
                );

                return (
                  <Marker
                    key={center.id}
                    position={[center.latitude, center.longitude]}
                    icon={createStorePin(center, isSelected)}
                    ref={(el) => (markerRefs.current[center.id] = el)}
                    eventHandlers={{
                      click: () => {
                        setSelectedCenter(center);
                        if (cardRefs.current[center.id]) {
                          cardRefs.current[center.id].scrollIntoView({ behavior: "smooth", block: "nearest" });
                        }
                      }
                    }}
                  >
                    <Popup className="tb-unified-map-popup">
                      <div className="p-2" style={{ minWidth: "220px" }}>
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <span
                            className={`badge ${
                              isOfficial ? "bg-success text-white" : "bg-warning text-dark"
                            } rounded-pill px-2 py-0.5 extra-small fw-bold`}
                          >
                            {isOfficial ? "✓ OFFICIAL" : "★ PARTNER"}
                          </span>
                          {distanceStr && (
                            <span className="badge bg-light text-dark border extra-small fw-bold">
                              📍 {distanceStr}
                            </span>
                          )}
                        </div>

                        <h6 className="fw-bold text-dark mb-1 fs-6">{center.name}</h6>
                        <p className="extra-small text-muted mb-2 lh-sm">{center.address}</p>

                        <div className="d-flex gap-1.5 pt-2 border-top">
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${center.latitude},${center.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-dark btn-sm rounded-pill w-100 extra-small fw-bold py-1.5 d-inline-flex align-items-center justify-content-center gap-1"
                          >
                            <ExternalLink size={12} /> Directions
                          </a>
                          {center.contactNumber && (
                            <a
                              href={`tel:${center.contactNumber}`}
                              className="btn btn-outline-success btn-sm rounded-pill px-2.5 d-inline-flex align-items-center"
                              title="Call"
                            >
                              <Phone size={12} />
                            </a>
                          )}
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>

          </div>

        </div>
      </div>

    </div>
  );
};

export default ServiceCenterLocator;
