import { useEffect, useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";
import { FaFileMedical, FaClock, FaCheckCircle, FaBan, FaCalendarAlt, FaHospital, FaMapPin, FaPhoneAlt, FaTruck } from "react-icons/fa";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setLoading(false);
        return;
      }
      const res = await API.get(`/booking/user/${userId}`);
      setBookings(res.data.bookings || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load booking history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const cancelBooking = async (id) => {
    try {
      await API.delete("/booking/cancel", {
        data: { bookingId: id }
      });
      toast.success("Booking Cancelled successfully");
      
      // Update local state status to cancelled
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status: "cancelled" } : b));
    } catch (error) {
      console.error(error);
      toast.error("Failed to cancel booking");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending": return <FaClock />;
      case "accepted": return <FaTruck className="animate-pulse" />;
      case "completed": return <FaCheckCircle />;
      case "cancelled": return <FaBan />;
      default: return <FaClock />;
    }
  };

  if (loading) {
    return (
      <div className="container text-center mt-5 py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Retrieving dispatch archives...</p>
      </div>
    );
  }

  return (
    <div className="container py-5 mt-2">
      <div className="d-flex align-items-center gap-3 mb-5">
        <div className="p-3 rounded-3" style={{ background: "rgba(168, 85, 247, 0.15)", color: "#a855f7" }}>
          <FaFileMedical size={28} />
        </div>
        <div>
          <h2 className="fw-extrabold text-white mb-0">Booking Archives</h2>
          <p className="text-muted mb-0 small" style={{ fontFamily: "var(--font-secondary)" }}>
            History of your active and archived ambulance dispatch requests.
          </p>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="glass-card text-center p-5">
          <div className="text-muted mb-3"><FaFileMedical size={48} /></div>
          <h4 className="fw-bold text-white">No Bookings Found</h4>
          <p className="text-muted mb-0" style={{ fontFamily: "var(--font-secondary)" }}>
            You haven't requested any ambulance dispatches yet.
          </p>
        </div>
      ) : (
        <div className="row g-4">
          {bookings.map((b) => (
            <div key={b._id} className="col-12 col-md-6 col-lg-4">
              <div className="glass-card h-100 p-4 d-flex flex-column justify-content-between">
                
                {/* Header: Date and Status */}
                <div>
                  <div className="d-flex align-items-start justify-content-between mb-3">
                    <span className="text-white-50 small d-flex align-items-center gap-2" style={{ fontFamily: "var(--font-secondary)" }}>
                      <FaCalendarAlt />
                      {new Date(b.createdAt).toLocaleDateString()}
                    </span>
                    <span className={`status-badge status-${b.status}`}>
                      {getStatusIcon(b.status)}
                      {b.status}
                    </span>
                  </div>

                  {/* Hospital Details */}
                  <h4 className="fw-bold text-white mb-3 d-flex align-items-center gap-2">
                    <FaHospital size={18} className="text-danger flex-shrink-0" />
                    <span className="text-truncate">{b.hospital || "Emergency Hospital"}</span>
                  </h4>

                  <hr style={{ borderColor: "rgba(255, 255, 255, 0.08)" }} />

                  {/* Pickup Coordinates */}
                  <div className="p-3 rounded-3 mb-3" style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid var(--glass-border)" }}>
                    <div className="text-white-50 small d-flex align-items-center gap-2 mb-2">
                      <FaMapPin className="text-primary" /> Pickup Coordinates
                    </div>
                    <div className="font-monospace text-white small" style={{ wordBreak: "break-all" }}>
                      {b.pickupLocation ? `${b.pickupLocation.lat.toFixed(5)}, ${b.pickupLocation.lng.toFixed(5)}` : "Unavailable"}
                    </div>
                  </div>
                </div>

                {/* Footer Action: Driver Info or Cancel Trigger */}
                <div>
                  {b.status === "accepted" && b.ambulanceId && (
                    <div className="p-3 rounded-3 mb-3 border border-info" style={{ background: "rgba(6, 182, 212, 0.05)" }}>
                      <div className="small fw-bold text-info mb-1">Paramedic Contact Details</div>
                      <div className="text-white small fw-semibold">{b.ambulanceId.name || "Assigned Driver"}</div>
                      <a href={`tel:${b.ambulanceId.phone}`} className="text-info text-decoration-none small d-flex align-items-center gap-1 mt-1">
                        <FaPhoneAlt size={12} /> {b.ambulanceId.phone}
                      </a>
                    </div>
                  )}

                  {b.status === "pending" && (
                    <button
                      onClick={() => cancelBooking(b._id)}
                      className="btn-premium-outline w-100 d-flex align-items-center justify-content-center gap-2 border-danger text-danger hover-bg-danger-transparent"
                    >
                      <FaBan /> Cancel Dispatch Request
                    </button>
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

export default MyBookings;