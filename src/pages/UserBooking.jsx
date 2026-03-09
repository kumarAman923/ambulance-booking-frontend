// ambulance-frontend/frontend/src/pages/UserBooking.jsx
import { useState, useEffect } from "react";
import API from "../services/api"; // ✅ sahi path
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function UserBooking() {
  const [pickup, setPickup] = useState({ lat: null, lng: null, address: "" });
  const [hospital, setHospital] = useState("");
  const [hospitals, setHospitals] = useState([]);
  const [loadingHospitals, setLoadingHospitals] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const res = await API.get("/hospitals");
        setHospitals(res.data);
      } catch (error) {
        toast.error("Hospitals load nahi ho paaye");
      } finally {
        setLoadingHospitals(false);
      }
    };
    fetchHospitals();
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPickup({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            address: "Current Location",
          });
          toast.success("Location captured");
        },
        () => toast.error("Location access denied")
      );
    }
  };

  const bookAmbulance = async () => {
    if (!pickup.lat || !hospital) {
      toast.error("Pickup location aur hospital dono select karo");
      return;
    }
    setBookingLoading(true);
    try {
      const res = await API.post("/booking", {
        userId: localStorage.getItem("userId"),
        pickupLocation: pickup,
        hospital,
      });
      toast.success("Ambulance booked!");
      navigate(`/my-bookings`); // ya /booking-status
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed");
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">🚑 Book Ambulance</h2>

      <button
        onClick={getCurrentLocation}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4 w-full hover:bg-blue-600"
      >
        📍 Use My Current Location
      </button>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Select Hospital</label>
        {loadingHospitals ? (
          <div className="border p-2 rounded bg-gray-100">Loading hospitals...</div>
        ) : (
          <select
            value={hospital}
            onChange={(e) => setHospital(e.target.value)}
            className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            <option value="">-- Choose Hospital --</option>
            {hospitals.map((h) => (
              <option key={h._id} value={h._id}>
                {h.name} {h.address && `- ${h.address}`}
              </option>
            ))}
          </select>
        )}
      </div>

      <button
        onClick={bookAmbulance}
        disabled={bookingLoading || loadingHospitals}
        className="bg-red-600 text-white px-4 py-3 rounded w-full font-bold hover:bg-red-700 disabled:bg-gray-400"
      >
        {bookingLoading ? "Booking..." : "🚑 Book Now"}
      </button>

      {pickup.address && (
        <div className="mt-4 p-3 bg-gray-100 rounded">
          <p className="font-semibold">Pickup:</p>
          <p>{pickup.address}</p>
        </div>
      )}
    </div>
  );
}

export default UserBooking;