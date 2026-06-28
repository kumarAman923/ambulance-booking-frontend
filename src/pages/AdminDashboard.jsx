import { useEffect, useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";
import { FaUserShield, FaClipboardList, FaUsers, FaFileMedical, FaExclamationCircle, FaShieldAlt, FaTrashAlt, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [activeTab, setActiveTab] = useState("bookings"); // "bookings" or "drivers"
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  const fetchData = async () => {
    try {
      setLoading(true);
      const bookingsRes = await API.get("/booking");
      const driversRes = await API.get("/ambulance");
      const hospitalsRes = await API.get("/hospitals");
      
      setBookings(bookingsRes.data.bookings || []);
      setDrivers(driversRes.data.drivers || []);
      setHospitals(hospitalsRes.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to sync metrics from central server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && userRole === "admin") {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [token, userRole]);

  const cancelBooking = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await API.delete("/booking/cancel", { data: { bookingId: id } });
      toast.success("Dispatch request cancelled");
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status: "cancelled" } : b));
    } catch (error) {
      console.error(error);
      toast.error("Cancellation failed");
    }
  };

  if (!token || userRole !== "admin") {
    return (
      <div className="container py-5 d-flex justify-content-center" style={{ minHeight: "80vh" }}>
        <div className="glass-card text-center p-5 align-self-center" style={{ maxWidth: "450px" }}>
          <div className="text-danger mb-3"><FaExclamationCircle size={48} /></div>
          <h4 className="fw-bold text-white">Administrative Lock</h4>
          <p className="text-muted mb-4" style={{ fontFamily: "var(--font-secondary)" }}>
            This panel is reserved for authorized system administrators only.
          </p>
          <a href="/login" className="btn-premium text-decoration-none">Return to Login</a>
        </div>
      </div>
    );
  }

  // Calculate live statistics
  const totalBookings = bookings.length;
  const activeBookings = bookings.filter(b => b.status === "pending" || b.status === "accepted").length;
  const availableDrivers = drivers.filter(d => d.status === "available").length;

  return (
    <div className="container py-5 mt-2">
      {/* HUD Header */}
      <div className="d-flex align-items-center gap-3 mb-5">
        <div className="p-3 rounded-3" style={{ background: "rgba(168, 85, 247, 0.15)", color: "#a855f7" }}>
          <FaUserShield size={28} />
        </div>
        <div>
          <h2 className="fw-extrabold text-white mb-0">System Control Console</h2>
          <p className="text-muted mb-0 small" style={{ fontFamily: "var(--font-secondary)" }}>
            Live administrative dispatch metrics and driver tracking node.
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="kpi-card">
            <div className="kpi-title">Total Dispatches</div>
            <div className="kpi-val">{totalBookings}</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="kpi-card kpi-danger">
            <div className="kpi-title">Active Emergency Runs</div>
            <div className="kpi-val">{activeBookings}</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="kpi-card kpi-success">
            <div className="kpi-title">Available Ambulances</div>
            <div className="kpi-val">{availableDrivers} / {drivers.length}</div>
          </div>
        </div>
      </div>

      {/* Console Tab Toggles */}
      <div className="d-flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab("bookings")}
          className={`btn ${activeTab === "bookings" ? "btn-premium" : "btn-premium-outline"} px-4 d-flex align-items-center gap-2`}
        >
          <FaClipboardList /> Dispatches database
        </button>
        <button
          onClick={() => setActiveTab("drivers")}
          className={`btn ${activeTab === "drivers" ? "btn-premium" : "btn-premium-outline"} px-4 d-flex align-items-center gap-2`}
        >
          <FaUsers /> Ambulance Fleet Roster
        </button>
      </div>

      {/* Database Display Tables */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted mt-3">Syncing secure logs...</p>
        </div>
      ) : activeTab === "bookings" ? (
        /* BOOKINGS TABLE */
        <div className="glass-table-container">
          <table className="glass-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Patient Name</th>
                <th>Patient Phone</th>
                <th>Target Hospital</th>
                <th>Coordinates</th>
                <th>Assigned Driver</th>
                <th>Status</th>
                <th>Control</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-muted">No dispatches logged in database.</td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b._id}>
                    <td className="font-monospace small text-white-50">...{b._id.slice(-6).toUpperCase()}</td>
                    <td className="fw-bold text-white">{b.userId?.name || "SOS Booker"}</td>
                    <td style={{ fontFamily: "var(--font-secondary)" }}>{b.userId?.phone || "Unavailable"}</td>
                    <td className="fw-semibold">
                      <div className="text-white"><FaHospitalIcon /> {b.hospital || "Emergency"}</div>
                      {(() => {
                        const match = hospitals.find(h => h.name === b.hospital);
                        return match ? (
                          <div className="text-muted font-monospace" style={{ fontSize: "0.72rem", marginTop: "2px" }}>
                            {match.city} • {match.district} • {match.state}
                          </div>
                        ) : null;
                      })()}
                    </td>
                    <td className="font-monospace small">
                      {b.pickupLocation ? `${b.pickupLocation.lat.toFixed(4)}, ${b.pickupLocation.lng.toFixed(4)}` : "Unavailable"}
                    </td>
                    <td>
                      {b.ambulanceId ? (
                        <div className="d-flex flex-column">
                          <span className="text-white fw-bold">{b.ambulanceId.name}</span>
                          <span className="small text-muted">{b.ambulanceId.ambulanceNumber}</span>
                        </div>
                      ) : (
                        <span className="text-muted small">None Assigned</span>
                      )}
                    </td>
                    <td>
                      <span className={`status-badge status-${b.status}`}>
                        {b.status}
                      </span>
                    </td>
                    <td>
                      {(b.status === "pending" || b.status === "accepted") ? (
                        <button
                          onClick={() => cancelBooking(b._id)}
                          className="btn btn-outline-danger btn-sm rounded-3 d-flex align-items-center gap-1 border-0"
                          style={{ padding: "6px 12px" }}
                        >
                          <FaTrashAlt size={12} /> Cancel
                        </button>
                      ) : (
                        <span className="text-muted small">Closed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        /* DRIVERS TABLE */
        <div className="glass-table-container">
          <table className="glass-table">
            <thead>
              <tr>
                <th>Driver Name</th>
                <th>Contact Phone</th>
                <th>Vehicle Number</th>
                <th>Live Coordinates</th>
                <th>Fleet Status</th>
              </tr>
            </thead>
            <tbody>
              {drivers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">No ambulance drivers registered in fleet.</td>
                </tr>
              ) : (
                drivers.map((d) => (
                  <tr key={d._id}>
                    <td className="fw-bold text-white">{d.name}</td>
                    <td style={{ fontFamily: "var(--font-secondary)" }}>{d.phone}</td>
                    <td className="font-monospace fw-semibold" style={{ color: "#a855f7" }}>{d.ambulanceNumber}</td>
                    <td className="font-monospace small">
                      {d.location ? `${d.location.lat.toFixed(4)}, ${d.location.lng.toFixed(4)}` : "No Sat Signal"}
                    </td>
                    <td>
                      <span className={`status-badge ${d.status === "available" ? "status-completed" : "status-pending"}`}>
                        {d.status === "available" ? "Available" : "Busy"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Inline helper icon component
function FaHospitalIcon() {
  return (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="14" width="14" className="text-danger me-1" style={{ verticalAlign: "middle" }} xmlns="http://www.w3.org/2000/svg">
      <path d="M240 192h32v-48h48v-32h-48V64h-32v48h-48v32h48v48zm194.24 163.66l-50.64-50.63a8 8 0 00-5.66-2.34H134.06a8 8 0 00-5.66 2.34l-50.64 50.63C65 366.42 74.08 384 91.13 384h329.74c17.05 0 26.13-17.58 13.13-30.34zM432 400H80v48a16 16 0 0016 16h320a16 16 0 0016-16v-48zM384 256v-96a16 16 0 00-16-16h-48v32h32v80H160v-80h32v-32h-48a16 16 0 00-16 16v96a16 16 0 0016 16h224a16 16 0 0016-16z"></path>
    </svg>
  );
}

export default AdminDashboard;
