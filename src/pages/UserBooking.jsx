// ambulance-frontend/frontend/src/pages/UserBooking.jsx

import { useState, useEffect } from "react";
import API from "../services/api";
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

      await API.post("/booking", {

        userId: localStorage.getItem("userId"),
        pickupLocation: pickup,
        hospital,

      });

      toast.success("Ambulance booked!");
      navigate(`/mybookings`);

    } catch (error) {

      toast.error(error.response?.data?.message || "Booking failed");

    } finally {

      setBookingLoading(false);

    }

  };

  return (

    <div className="container mt-4 d-flex justify-content-center">

      <div className="card shadow p-4" style={{ width: "420px" }}>

        <h2 className="text-center fw-bold mb-4">
          🚑 Book Ambulance
        </h2>

        <button
          onClick={getCurrentLocation}
          className="btn btn-primary w-100 mb-3"
        >
          📍 Use My Current Location
        </button>

        <div className="mb-3">

          <label className="form-label fw-semibold">
            Select Hospital
          </label>

          {loadingHospitals ? (

            <div className="form-control bg-light">
              Loading hospitals...
            </div>

          ) : (

            <select
              value={hospital}
              onChange={(e) => setHospital(e.target.value)}
              className="form-select"
            >

              <option value="">
                -- Choose Hospital --
              </option>

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
          className="btn btn-danger w-100 fw-bold"
        >

          {bookingLoading ? "Booking..." : "🚑 Book Now"}

        </button>

        {pickup.address && (

          <div className="alert alert-light mt-3">

            <strong>Pickup:</strong>
            <p className="mb-0">{pickup.address}</p>

          </div>

        )}

      </div>

    </div>

  );

}

export default UserBooking;