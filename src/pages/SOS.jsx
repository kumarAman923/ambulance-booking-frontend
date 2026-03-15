import { useState } from "react";
import API from "../services/api";

function SOS() {

  const [loading, setLoading] = useState(false);

  const handleSOS = () => {

    setLoading(true);

    navigator.geolocation.getCurrentPosition(async (position) => {

      try {

        const userId = localStorage.getItem("userId");

        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        const res = await API.post("/booking/create", {

          userId,

          pickupLocation: {
            lat,
            lng
          },

          hospital: "Emergency Hospital"

        });

        alert("🚑 Ambulance is on the way");

        console.log(res.data);

      } catch (error) {

        console.log(error);
        alert("No ambulance available");

      }

      setLoading(false);

    });

  };

  return (

    <div className="container d-flex justify-content-center align-items-center vh-100">

      <button
        onClick={handleSOS}
        className="btn btn-danger"
        style={{
          fontSize: "2rem",
          padding: "40px 60px",
          borderRadius: "50px"
        }}
      >

        {loading ? "Calling Ambulance..." : "SOS 🚑"}

      </button>

    </div>

  );

}

export default SOS;