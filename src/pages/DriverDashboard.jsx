import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";
import { FaTruck, FaMapPin, FaHospital, FaPhoneAlt, FaCheck, FaExclamationCircle, FaUserClock, FaSignal } from "react-icons/fa";

function DriverDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [socketStatus, setSocketStatus] = useState("disconnected");
  
  const driverId = localStorage.getItem("driverId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token || !driverId) {
      setLoading(false);
      return;
    }

    // Connect to dynamic backend socket server
    const backendURL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";
    const socketInstance = io(backendURL, {
      transports: ["websocket", "polling"]
    });

    socketInstance.on("connect", () => {
      console.log("🚀 Socket connected:", socketInstance.id);
      setSocketStatus("connected");
    });

    socketInstance.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
      setSocketStatus("error");
      toast.error("Telemetry link offline. Retrying...");
    });

    // Fetch all bookings from REST API
    const fetchBookings = async () => {
      try {
        const res = await API.get("/booking");
        setBookings(res.data.bookings || []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to sync dispatch logs");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();

    // Listen for new booking alerts
    socketInstance.on("newBooking", (newBooking) => {
      console.log("📢 Nayi booking aayi:", newBooking);
      setBookings((prev) => [newBooking, ...(prev || [])]);
      toast.success("🚑 New Emergency Dispatch Request!");
      
      // Play a subtle notification chime if supported by browser
      try {
        const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-600.wav");
        audio.play();
      } catch (e) {
        console.log("Audio alert blocked by browser autoplay rules");
      }
    });

    // Periodically watch driver position and broadcast coordinates
    const watcher = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setLocation({ lat, lng });

        socketInstance.emit("driverLocation", {
          driverId: driverId,
          lat,
          lng
        });
      },
      (error) => {
        console.warn("Location tracking error:", error);
        toast.error("GPS telemetry access is required for auto-dispatching");
      },
      { enableHighAccuracy: true, distanceFilter: 10 }
    );

    return () => {
      socketInstance.off("newBooking");
      socketInstance.off("connect_error");
      socketInstance.off("connect");
      socketInstance.disconnect();
      navigator.geolocation.clearWatch(watcher);
    };

  }, [token, driverId]);

  // Accept booking
  const acceptBooking = async (id) => {
    try {
      await API.post("/booking/accept", { bookingId: id });
      toast.success("Dispatch Approved! Navigate to pickup immediately.");
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: "accepted" } : b))
      );
    } catch (error) {
      console.error(error);
      toast.error("Approval failed. Booking might be cancelled.");
    }
  };

  // Complete booking
  const completeBooking = async (id) => {
    try {
      await API.post("/booking/complete", { bookingId: id });
      toast.success("Mission Complete! Ambulance marked as available.");
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: "completed" } : b))
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to complete dispatch");
    }
  };

  if (!token || !driverId) {
    return (
      <div className="container py-5 d-flex justify-content-center" style={{ minHeight: "80vh" }}>
        <div className="glass-card text-center p-5 align-self-center" style={{ maxWidth: "450px" }}>
          <div className="text-danger mb-3"><FaExclamationCircle size={48} /></div>
          <h4 className="fw-bold text-white">Access Unauthorized</h4>
          <p className="text-muted mb-4" style={{ fontFamily: "var(--font-secondary)" }}>
            Please log in using a registered Driver account to open the command console.
          </p>
          <a href="/login" className="btn-premium text-decoration-none">Go to Login</a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container text-center mt-5 py-5">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Booting dispatcher terminals...</p>
      </div>
    );
  }

  return (
    <div className="container py-5 mt-2">
      {/* Telemetry Header */}
      <div className="row g-4 align-items-center mb-5">
        <div className="col-md-6 d-flex align-items-center gap-3">
          <div className="p-3 rounded-3" style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10b981" }}>
            <FaTruck size={28} />
          </div>
          <div>
            <h2 className="fw-extrabold text-white mb-0">Driver Command Room</h2>
            <div className="d-flex align-items-center gap-2 mt-1 small">
              <span className={`badge rounded-circle p-1 d-inline-block`} style={{ width: "8px", height: "8px", background: socketStatus === "connected" ? "#10b981" : "#ef4444" }}></span>
              <span className="text-muted" style={{ fontFamily: "var(--font-secondary)" }}>
                {socketStatus === "connected" ? "Real-time Telemetry Active" : "Telemetry Offline"}
              </span>
            </div>
          </div>
        </div>

        {/* GPS Live Widget */}
        <div className="col-md-6 d-flex justify-content-md-end">
          <div className="glass-card px-4 py-3 d-flex align-items-center gap-3 border border-success" style={{ background: "rgba(16, 185, 129, 0.04)" }}>
            <FaSignal className={socketStatus === "connected" ? "text-success animate-pulse" : "text-muted"} />
            <div className="text-start">
              <div className="small text-white-50">GPS Live Telemetry</div>
              <div className="font-monospace text-success fw-bold small">
                {location.lat ? `${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}` : "Acquiring..."}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bookings Queue */}
      <h4 className="fw-bold text-white mb-4 d-flex align-items-center gap-2">
        <FaUserClock /> Dispatch Job Queue ({bookings.length})
      </h4>

      {bookings.length === 0 ? (
        <div className="glass-card text-center p-5">
          <p className="text-muted mb-0" style={{ fontFamily: "var(--font-secondary)" }}>
            Standing by. No active bookings in queue.
          </p>
        </div>
      ) : (
        <div className="row g-4">
          {bookings.map((b) => (
            <div key={b._id} className="col-md-6 col-lg-4">
              <div className="glass-card p-4 h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <span className="text-white-50 small" style={{ fontFamily: "var(--font-secondary)" }}>
                      Job ID: ...{b._id.slice(-6).toUpperCase()}
                    </span>
                    <span className={`status-badge status-${b.status}`}>
                      {b.status}
                    </span>
                  </div>

                  <h5 className="fw-bold text-white mb-3 d-flex align-items-center gap-2">
                    <FaHospital size={16} className="text-danger flex-shrink-0" />
                    <span className="text-truncate">{b.hospital || "Emergency Hospital"}</span>
                  </h5>

                  {b.userId && (
                    <div className="p-3 rounded-3 mb-2" style={{ background: "rgba(168, 85, 247, 0.05)", border: "1px dashed rgba(168, 85, 247, 0.2)" }}>
                      <div className="small text-white-50">Patient Details</div>
                      <div className="text-white fw-bold" style={{ fontSize: "0.95rem" }}>{b.userId.name}</div>
                      <div className="text-white-50 small" style={{ fontSize: "0.85rem", fontFamily: "var(--font-secondary)" }}>
                        📞 {b.userId.phone}
                      </div>
                    </div>
                  )}

                  <hr style={{ borderColor: "rgba(255, 255, 255, 0.08)" }} />

                  {/* Location coordinate mapping details */}
                  <div className="p-3 rounded-3 mb-3" style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid var(--glass-border)" }}>
                    <div className="text-white-50 small d-flex align-items-center gap-2 mb-2">
                      <FaMapPin className="text-primary" /> Pickup Location Coordinates
                    </div>
                    <div className="font-monospace text-white small" style={{ wordBreak: "break-all" }}>
                      {b.pickupLocation ? `${b.pickupLocation.lat.toFixed(5)}, ${b.pickupLocation.lng.toFixed(5)}` : "Unavailable"}
                    </div>
                  </div>
                </div>

                {/* Accept/Complete Actions */}
                <div className="mt-3">
                  {b.status === "pending" && (
                    <button
                      onClick={() => acceptBooking(b._id)}
                      className="btn-premium w-100 py-3"
                    >
                      🚀 Accept Dispatch
                    </button>
                  )}

                  {b.status === "accepted" && (
                    <button
                      onClick={() => completeBooking(b._id)}
                      className="btn-premium-danger w-100 py-3 d-flex align-items-center justify-content-center gap-2"
                    >
                      <FaCheck /> Mark Completed
                    </button>
                  )}

                  {b.status === "completed" && (
                    <div className="p-2 rounded text-center text-success fw-bold small" style={{ background: "rgba(16, 185, 129, 0.1)" }}>
                      ✓ Job Complete
                    </div>
                  )}

                  {b.status === "cancelled" && (
                    <div className="p-2 rounded text-center text-danger fw-bold small" style={{ background: "rgba(239, 68, 68, 0.1)" }}>
                      ✕ Job Cancelled
                    </div>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DriverDashboard;