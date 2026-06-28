import { Link } from "react-router-dom";
import { FaAmbulance, FaHeartbeat, FaHistory, FaMapMarkerAlt, FaPhoneAlt, FaUser } from "react-icons/fa";

function Home() {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  return (
    <div className="container py-5 mt-4">
      {/* Hero Section */}
      <div className="text-center mb-5 pb-3">
        <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3" style={{ background: "rgba(239, 68, 68, 0.12)", border: "1px solid rgba(239, 68, 68, 0.25)", color: "#ef4444" }}>
          <FaHeartbeat className="animate-pulse" style={{ animation: "pulse-ring 2.5s infinite" }} />
          <span className="fw-semibold" style={{ fontSize: "0.85rem", letterSpacing: "1px" }}>24/7 EMERGENCY RESPONSE</span>
        </div>
        <h1 className="display-4 fw-extrabold mb-3" style={{ background: "linear-gradient(to right, #ffffff, #a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Instant Medical Dispatch
        </h1>
        <p className="lead mx-auto text-muted" style={{ maxWidth: "600px", fontFamily: "var(--font-secondary)" }}>
          Book nearby ambulances in seconds. Real-time driver mapping, instant routing, and one-tap emergency triggers to save lives when seconds matter most.
        </p>
      </div>

      {/* Action Cards Grid */}
      <div className="row g-4 justify-content-center mb-5">
        {/* SOS Emergency Block */}
        <div className="col-md-5 col-lg-4">
          <div className="glass-card hero-card h-100 p-4 d-flex flex-column text-center align-items-center">
            <div className="rounded-circle d-flex justify-content-center align-items-center mb-4" style={{ width: "80px", height: "80px", background: "rgba(239, 68, 68, 0.15)", color: "#ef4444" }}>
              <FaPhoneAlt size={36} />
            </div>
            <h3 className="fw-bold mb-3 text-danger">SOS Emergency</h3>
            <p className="text-muted flex-grow-1" style={{ fontSize: "0.95rem" }}>
              In critical situations, trigger an immediate booking to Emergency Hospital with a single tap.
            </p>
            <Link to="/sos" className="btn-premium-danger w-100 mt-3 text-decoration-none d-block">
              Trigger SOS 🚨
            </Link>
          </div>
        </div>

        {/* Regular Booking Block */}
        <div className="col-md-5 col-lg-4">
          <div className="glass-card hero-card h-100 p-4 d-flex flex-column text-center align-items-center">
            <div className="rounded-circle d-flex justify-content-center align-items-center mb-4" style={{ width: "80px", height: "80px", background: "rgba(168, 85, 247, 0.15)", color: "#a855f7" }}>
              <FaAmbulance size={38} />
            </div>
            <h3 className="fw-bold mb-3" style={{ color: "#a855f7" }}>Book Ambulance</h3>
            <p className="text-muted flex-grow-1" style={{ fontSize: "0.95rem" }}>
              Request standard or advanced life support transport to your choice of nearby hospitals.
            </p>
            <Link to={token ? "/book" : "/login"} className="btn-premium w-100 mt-3 text-decoration-none d-block">
              Request Booking
            </Link>
          </div>
        </div>

        {/* Driver Hub Block */}
        <div className="col-md-5 col-lg-4">
          <div className="glass-card hero-card h-100 p-4 d-flex flex-column text-center align-items-center">
            <div className="rounded-circle d-flex justify-content-center align-items-center mb-4" style={{ width: "80px", height: "80px", background: "rgba(16, 185, 129, 0.15)", color: "#10b981" }}>
              <FaUser size={32} />
            </div>
            <h3 className="fw-bold mb-3 text-success">Driver Portal</h3>
            <p className="text-muted flex-grow-1" style={{ fontSize: "0.95rem" }}>
              Manage requests, update status, and track dispatch tasks in real time from the command console.
            </p>
            <Link to={token && userRole === "driver" ? "/driver" : "/login"} className="btn-premium-outline w-100 mt-3 text-decoration-none d-block">
              Enter Console
            </Link>
          </div>
        </div>
      </div>

      {/* Feature section */}
      <div className="glass-card p-5 mt-5">
        <h3 className="text-center fw-bold mb-4">Why Ambulance Dispatch?</h3>
        <div className="row g-4 text-center">
          <div className="col-md-4">
            <div className="mb-3 text-danger"><FaMapMarkerAlt size={28} /></div>
            <h5 className="fw-bold">Nearest Location Dispatch</h5>
            <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>Algorithms automatically query and dispatch the closest available ambulance to guarantee minimal response times.</p>
          </div>
          <div className="col-md-4">
            <div className="mb-3 text-primary"><FaHeartbeat size={28} /></div>
            <h5 className="fw-bold">Seamless Hospital Handoff</h5>
            <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>Direct routing to partner clinics ensures patient documentation and emergency staff are prepared in advance.</p>
          </div>
          <div className="col-md-4">
            <div className="mb-3 text-success"><FaHistory size={28} /></div>
            <h5 className="fw-bold">Full History Tracking</h5>
            <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>Access lists of completed rides, check billing/details, and track driver communications easily.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
