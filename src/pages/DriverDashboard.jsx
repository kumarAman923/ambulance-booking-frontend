import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

function DriverDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ true rakho

  useEffect(() => {
    const socketInstance = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000");

    // Socket error handling
    socketInstance.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
      toast.error('Real-time connection failed. Refresh karein.');
    });

    socketInstance.on('connect', () => {
      console.log('Socket connected');
    });

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

    socketInstance.on("newBooking", (newBooking) => {
      console.log("Nayi booking aayi:", newBooking);
      setBookings(prev => [newBooking, ...(prev || [])]);
      toast.success("Nayi booking aayi!");
    });

    // Location tracking
    const watcher = navigator.geolocation.watchPosition(
      (pos) => {
        socketInstance.emit("driverLocation", {
          driverId: "driver_ka_id", // later dynamic
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

  const acceptBooking = async (id) => {
    try {
      await API.post("/booking/accept", { bookingId: id });
      toast.success("Booking Accepted");
      setBookings(prev =>
        prev.map(b => (b._id === id ? { ...b, status: "accepted" } : b))
      );
    } catch (error) {
      console.error(error);
      toast.error("Accept karne me error");
    }
  };

  const completeBooking = async (id) => {
    try {
      await API.post("/booking/complete", { bookingId: id });
      toast.success("Ride Completed");
      setBookings(prev =>
        prev.map(b => (b._id === id ? { ...b, status: "completed" } : b))
      );
    } catch (error) {
      console.error(error);
      toast.error("Complete karne me error");
    }
  };

  if (loading) return <div className="p-10">Loading dashboard...</div>;

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold mb-6">Driver Dashboard</h2>

      {bookings.length === 0 && <p>No bookings available</p>}

      {bookings.map((b) => (
        <div key={b._id} className="border p-4 mb-4 rounded shadow">
          <p><b>Hospital:</b> {b.hospital}</p>
          <p><b>Status:</b> {b.status}</p>
          <p><b>Pickup:</b> {b.pickupLocation?.address || "Address not available"}</p>
          <p><b>Coordinates:</b> {b.pickupLocation?.lat}, {b.pickupLocation?.lng}</p>

          {b.status === "pending" && (
            <button
              onClick={() => acceptBooking(b._id)}
              className="bg-green-500 text-white px-4 py-2 mt-2 rounded mr-2"
            >
              Accept
            </button>
          )}

          {b.status === "accepted" && (
            <button
              onClick={() => completeBooking(b._id)}
              className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
            >
              Complete Ride
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default DriverDashboard;