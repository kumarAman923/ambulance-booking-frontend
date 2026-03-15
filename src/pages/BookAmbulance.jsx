import { useState, useEffect } from "react";
import API from "../services/api";

function BookAmbulance() {

  const [pickup, setPickup] = useState({
    lat: "",
    lng: ""
  });

  const [hospital, setHospital] = useState("");
  const [hospitals, setHospitals] = useState([]);

  // 📍 fetch hospitals
  useEffect(() => {

    const fetchHospitals = async () => {
      try {
        const res = await API.get("/hospitals");
        setHospitals(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchHospitals();

  }, []);

  // 📍 Get current location
  const getLocation = () => {

    navigator.geolocation.getCurrentPosition((position) => {

      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      setPickup({ lat, lng });

      alert("Location fetched successfully");

    });

  };

  // 🚑 Booking submit
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const userId = localStorage.getItem("userId");

      const res = await API.post("/booking/create", {

        userId,

        pickupLocation: {
          lat: Number(pickup.lat),
          lng: Number(pickup.lng)
        },

        hospital

      });

      alert("Ambulance Booked Successfully");
      console.log(res.data);

    } catch (error) {

      console.log(error);
      alert("Booking Failed");

    }

  };

  return (

    <div className="container d-flex justify-content-center align-items-center vh-100">

      <div className="card shadow p-4" style={{ width: "400px" }}>

        <h2 className="text-center mb-4 fw-bold">
          Book Ambulance
        </h2>

        <form onSubmit={handleSubmit}>

          {/* Location button */}
          <button
            type="button"
            onClick={getLocation}
            className="btn btn-primary w-100 mb-3"
          >
            Get Current Location
          </button>

          {/* Latitude */}
          <input
            type="text"
            placeholder="Latitude"
            value={pickup.lat}
            readOnly
            className="form-control mb-3"
          />

          {/* Longitude */}
          <input
            type="text"
            placeholder="Longitude"
            value={pickup.lng}
            readOnly
            className="form-control mb-3"
          />

          {/* Hospital dropdown */}
          <select
            onChange={(e) => setHospital(e.target.value)}
            className="form-select mb-3"
          >
            <option>Select Hospital</option>

            {hospitals.map((h) => (
              <option key={h._id} value={h.name}>
                {h.name}
              </option>
            ))}

          </select>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-danger w-100"
          >
            Book Ambulance
          </button>

        </form>

      </div>

    </div>

  );

}

export default BookAmbulance;