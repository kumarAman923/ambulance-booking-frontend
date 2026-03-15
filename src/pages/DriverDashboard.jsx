import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

function DriverDashboard() {

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    // ✅ Socket connection (Render backend)
    const socketInstance = io(
      "https://ambulance-booking-backend-lafq.onrender.com",
      {
        transports: ["websocket"]
      }
    );

    socketInstance.on("connect", () => {
      console.log("🚀 Socket connected:", socketInstance.id);
    });

    socketInstance.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
      toast.error("Real-time connection failed. Refresh karein.");
    });

    // 📦 Fetch bookings
    const fetchBookings = async () => {
      try {

        const res = await API.get("/booking");

        setBookings(res.data.bookings || []);

      } catch (error) {

        console.error(error);
        toast.error("Bookings fetch nahi ho payi");

      } finally {

        setLoading(false);

      }
    };

    fetchBookings();

    // 🆕 New booking socket event
    socketInstance.on("newBooking", (newBooking) => {

      console.log("📢 Nayi booking aayi:", newBooking);

      setBookings((prev) => [newBooking, ...(prev || [])]);

      toast.success("🚑 Nayi booking aayi!");

    });

    // 📍 Driver live location tracking
    const watcher = navigator.geolocation.watchPosition(

      (pos) => {

        socketInstance.emit("driverLocation", {

          driverId: "driver_ka_id",

          lat: pos.coords.latitude,
          lng: pos.coords.longitude,

        });

      },

      (error) => {

        console.log("Location error:", error);
        toast.error("Location access nahi mil pa raha");

      }

    );

    return () => {

      socketInstance.off("newBooking");
      socketInstance.off("connect_error");
      socketInstance.off("connect");

      socketInstance.disconnect();

      navigator.geolocation.clearWatch(watcher);

    };

  }, []);

  // ✅ Accept booking
  const acceptBooking = async (id) => {

    try {

      await API.post("/booking/accept", { bookingId: id });

      toast.success("Booking Accepted");

      setBookings((prev) =>
        prev.map((b) =>
          b._id === id ? { ...b, status: "accepted" } : b
        )
      );

    } catch (error) {

      console.error(error);
      toast.error("Accept karne me error");

    }

  };

  // ✅ Complete booking
  const completeBooking = async (id) => {

    try {

      await API.post("/booking/complete", { bookingId: id });

      toast.success("Ride Completed");

      setBookings((prev) =>
        prev.map((b) =>
          b._id === id ? { ...b, status: "completed" } : b
        )
      );

    } catch (error) {

      console.error(error);
      toast.error("Complete karne me error");

    }

  };

  if (loading) {

    return (

      <div className="container text-center mt-5">

        <div className="spinner-border text-danger"></div>

        <p className="mt-3">Loading dashboard...</p>

      </div>

    );

  }

  return (

    <div className="container mt-5">

      <h2 className="mb-4 fw-bold">
        Driver Dashboard
      </h2>

      {bookings.length === 0 && (

        <div className="alert alert-warning">
          No bookings available
        </div>

      )}

      {bookings.map((b) => (

        <div key={b._id} className="card mb-3 shadow-sm">

          <div className="card-body">

            <p>
              <strong>Hospital:</strong> {b.hospital}
            </p>

            <p>
              <strong>Status:</strong> {b.status}
            </p>

            <p>
              <strong>Pickup:</strong>{" "}
              {b.pickupLocation?.address || "Address not available"}
            </p>

            <p>
              <strong>Coordinates:</strong>{" "}
              {b.pickupLocation?.lat}, {b.pickupLocation?.lng}
            </p>

            {b.status === "pending" && (

              <button
                onClick={() => acceptBooking(b._id)}
                className="btn btn-success me-2"
              >
                Accept
              </button>

            )}

            {b.status === "accepted" && (

              <button
                onClick={() => completeBooking(b._id)}
                className="btn btn-primary"
              >
                Complete Ride
              </button>

            )}

          </div>

        </div>

      ))}

    </div>

  );

}

export default DriverDashboard;