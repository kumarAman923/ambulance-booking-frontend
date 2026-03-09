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

    <div className="flex justify-center items-center h-screen">

      <button
        onClick={handleSOS}
        className="bg-red-600 text-white text-3xl px-10 py-6 rounded-full"
      >

        {loading ? "Calling Ambulance..." : "SOS 🚑"}

      </button>

    </div>

  );

}

export default SOS;