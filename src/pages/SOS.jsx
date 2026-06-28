import { useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";
import { FaExclamationTriangle, FaHeartbeat, FaSpinner, FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function SOS() {
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState("");
  const navigate = useNavigate();

  const handleSOS = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);
    setStatusText("Acquiring GPS coordinates...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const userId = localStorage.getItem("userId");
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          setStatusText("Locating nearest ambulance...");

          await API.post("/booking", {
            userId,
            pickupLocation: {
              lat,
              lng,
              address: "Emergency Broadcast Location"
            },
            hospital: "Emergency Hospital"
          });

          toast.success("Emergency Dispatch Approved! 🚑");
          setStatusText("Ambulance dispatched. On the way!");
          
          setTimeout(() => {
            navigate("/mybookings");
          }, 2000);

        } catch (error) {
          console.error(error);
          toast.error("All ambulances busy or server communication failed");
          setStatusText("");
          setLoading(false);
        }
      },
      (error) => {
        console.error(error);
        toast.error("GPS coordinates access denied. SOS cancelled.");
        setLoading(false);
        setStatusText("");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "85vh" }}>
      
      {/* Warning Alert Banner */}
      <div className="glass-card border-danger p-3 mb-4 text-center d-flex align-items-center gap-3 animate-pulse" style={{ maxWidth: "500px", border: "1px solid rgba(239, 68, 68, 0.3)", background: "rgba(239, 68, 68, 0.05)" }}>
        <FaExclamationTriangle className="text-danger fs-4 flex-shrink-0" />
        <div className="text-start">
          <h6 className="fw-bold text-danger mb-0">Emergency Mode Only</h6>
          <p className="text-muted mb-0 small" style={{ fontFamily: "var(--font-secondary)" }}>
            Tapping the SOS button immediately dispatches the closest available paramedic team to your location.
          </p>
        </div>
      </div>

      {/* Pulsing SOS Button Widget */}
      <div className="my-4">
        {loading ? (
          <div className="d-flex flex-column align-items-center justify-content-center" style={{ width: "260px", height: "260px" }}>
            <div className="position-relative d-flex justify-content-center align-items-center">
              <div className="spinner-grow text-danger" style={{ width: "120px", height: "120px" }} role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <div className="position-absolute text-white fw-bold" style={{ fontSize: "1rem" }}>
                DISPATCHING
              </div>
            </div>
          </div>
        ) : (
          <div className="sos-button-wrapper">
            <div className="sos-ring"></div>
            <div className="sos-ring"></div>
            <div className="sos-ring"></div>
            <button
              onClick={handleSOS}
              className="sos-main-btn"
            >
              <FaHeartbeat />
              <span>SOS</span>
              <span className="subtext">Tap Once</span>
            </button>
          </div>
        )}
      </div>

      {/* Dynamic Status Text */}
      {statusText && (
        <div className="mt-4 p-3 rounded-pill glass-card d-flex align-items-center gap-2 px-4 text-white font-monospace animate-pulse" style={{ background: "rgba(0, 0, 0, 0.4)" }}>
          <FaSpinner className="animate-spin text-danger" />
          <span>{statusText}</span>
        </div>
      )}

      {!loading && (
        <p className="text-muted mt-4 small text-center" style={{ fontFamily: "var(--font-secondary)", maxWidth: "320px" }}>
          <FaMapMarkerAlt className="me-1 text-danger" /> Current browser geolocation permissions required to track nearby drivers.
        </p>
      )}

    </div>
  );
}

export default SOS;