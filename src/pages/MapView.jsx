import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useState } from "react";

function MapView() {

  const [location, setLocation] = useState({
    lat: 28.9874,
    lng: 79.4141
  });

  const containerStyle = {
    width: "100%",
    height: "500px"
  };

  return (

    <div className="container mt-4">

      <div className="card shadow p-3">

        <h4 className="text-center mb-3 fw-bold">
          Ambulance Location Map
        </h4>

        <LoadScript googleMapsApiKey="AIzaSyC9Lkiu3ARPf2fDgIK4phS0uEFBI6T6pBY">

          <GoogleMap
            mapContainerStyle={containerStyle}
            center={location}
            zoom={12}
          >

            <Marker position={location} />

          </GoogleMap>

        </LoadScript>

      </div>

    </div>

  );

}

export default MapView;