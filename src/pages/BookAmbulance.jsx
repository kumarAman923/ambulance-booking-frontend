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

      setPickup({
        lat,
        lng
      });

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

    <div className="flex justify-center items-center h-screen bg-gray-100">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-96"
      >

        <h2 className="text-2xl font-bold mb-6 text-center">
          Book Ambulance
        </h2>

        {/* Location button */}
        <button
          type="button"
          onClick={getLocation}
          className="bg-blue-500 text-white w-full py-2 mb-4 rounded"
        >
          Get Current Location
        </button>

        {/* Latitude */}
        <input
          type="text"
          placeholder="Latitude"
          value={pickup.lat}
          readOnly
          className="w-full border p-2 mb-4"
        />

        {/* Longitude */}
        <input
          type="text"
          placeholder="Longitude"
          value={pickup.lng}
          readOnly
          className="w-full border p-2 mb-4"
        />

        {/* Hospital dropdown */}
        <select
          onChange={(e) => setHospital(e.target.value)}
          className="w-full border p-2 mb-4"
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
          className="bg-red-500 text-white w-full py-2 rounded"
        >
          Book Ambulance
        </button>

      </form>

    </div>

  );

}

export default BookAmbulance;