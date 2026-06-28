import { useState, useEffect } from "react";
import API from "../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaHospital, FaCheckCircle, FaSpinner } from "react-icons/fa";

function UserBooking() {
  const [pickup, setPickup] = useState({ lat: null, lng: null, address: "" });
  const [hospital, setHospital] = useState("");
  const [hospitals, setHospitals] = useState([]);
  const [loadingHospitals, setLoadingHospitals] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const navigate = useNavigate();

  // Region filtering states
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const res = await API.get("/hospitals");
        setHospitals(res.data || []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load hospitals list");
      } finally {
        setLoadingHospitals(false);
      }
    };
    fetchHospitals();
  }, []);

  // Compute unique regions dynamically
  const states = [...new Set(hospitals.map(h => h.state).filter(Boolean))].sort();
  
  const districts = selectedState
    ? [...new Set(hospitals.filter(h => h.state === selectedState).map(h => h.district).filter(Boolean))].sort()
    : [];

  const cities = (selectedState && selectedDistrict)
    ? [...new Set(hospitals.filter(h => h.state === selectedState && h.district === selectedDistrict).map(h => h.city).filter(Boolean))].sort()
    : [];

  const filteredHospitals = hospitals.filter(h => {
    if (selectedState && h.state !== selectedState) return false;
    if (selectedDistrict && h.district !== selectedDistrict) return false;
    if (selectedCity && h.city !== selectedCity) return false;
    return true;
  });

  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
    setSelectedDistrict("");
    setSelectedCity("");
    setHospital("");
  };

  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
    setSelectedCity("");
    setHospital("");
  };

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
    setHospital("");
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPickup({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          address: `Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)}`
        });
        toast.success("Current location captured successfully!");
        setLocating(false);
      },
      (error) => {
        console.error(error);
        toast.error("Location access denied or timed out");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const bookAmbulance = async () => {
    if (!pickup.lat || !pickup.lng) {
      toast.error("Please fetch your pickup coordinates first");
      return;
    }

    if (!hospital) {
      toast.error("Please select a target hospital");
      return;
    }

    setBookingLoading(true);
    try {
      const userId = localStorage.getItem("userId");
      
      const payload = {
        userId,
        pickupLocation: {
          lat: pickup.lat,
          lng: pickup.lng,
          address: pickup.address
        },
        hospital: hospital // sending hospital name
      };

      await API.post("/booking", payload);

      toast.success("Ambulance Dispatched! 🚨 Redirecting...");
      setTimeout(() => {
        navigate("/mybookings");
      }, 1500);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Booking Failed. Try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="container py-5 d-flex justify-content-center" style={{ minHeight: "80vh" }}>
      <div className="glass-card p-4 p-md-5" style={{ width: "100%", maxWidth: "480px" }}>
        
        {/* Title */}
        <div className="text-center mb-4">
          <div className="d-inline-flex p-3 rounded-circle mb-3" style={{ background: "rgba(168, 85, 247, 0.15)", color: "#a855f7" }}>
            <FaHospital size={32} />
          </div>
          <h2 className="fw-extrabold text-white mb-2">Request Ambulance</h2>
          <p className="text-muted" style={{ fontSize: "0.9rem", fontFamily: "var(--font-secondary)" }}>
            Provide coordinates and select a target clinic for dispatch.
          </p>
        </div>

        {/* Step 1: Location */}
        <div className="mb-4">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <span className="fw-bold text-white d-flex align-items-center gap-2">
              <span className="badge rounded-circle p-1 d-flex align-items-center justify-content-center" style={{ width: "20px", height: "20px", background: "#a855f7", fontSize: "0.75rem" }}>1</span>
              Pickup Location
            </span>
            {pickup.lat && <span className="text-success fs-6"><FaCheckCircle /> Captured</span>}
          </div>

          <button
            type="button"
            onClick={getCurrentLocation}
            disabled={locating}
            className="btn btn-premium w-100 py-3 d-flex align-items-center justify-content-center gap-2"
          >
            <FaMapMarkerAlt className={locating ? "animate-spin" : ""} />
            {locating ? "Acquiring Satellites..." : "Capture Current Location"}
          </button>

          {pickup.address && (
            <div className="mt-3 p-3 rounded-3" style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid var(--glass-border)" }}>
              <div className="text-white-50 small mb-1">Captured Coordinates:</div>
              <div className="font-monospace fw-semibold text-white small">{pickup.address}</div>
            </div>
          )}
        </div>

        {/* Step 2: Regional Filters */}
        <div className="mb-4">
          <label className="fw-bold text-white d-flex align-items-center gap-2 mb-2">
            <span className="badge rounded-circle p-1 d-flex align-items-center justify-content-center" style={{ width: "20px", height: "20px", background: "#a855f7", fontSize: "0.75rem" }}>2</span>
            Filter Region (State / District / City)
          </label>

          <div className="d-flex flex-column gap-2 p-3 rounded-3" style={{ background: "rgba(255, 255, 255, 0.01)", border: "1px solid var(--glass-border)" }}>
            <div>
              <label className="text-white-50 small mb-1" style={{ fontSize: "0.75rem" }}>Select State</label>
              <select
                value={selectedState}
                onChange={handleStateChange}
                className="form-select glass-input glass-select w-100"
              >
                <option value="">-- All States --</option>
                {states.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-white-50 small mb-1" style={{ fontSize: "0.75rem" }}>Select District</label>
              <select
                value={selectedDistrict}
                onChange={handleDistrictChange}
                disabled={!selectedState}
                className="form-select glass-input glass-select w-100"
              >
                <option value="">-- All Districts --</option>
                {districts.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-white-50 small mb-1" style={{ fontSize: "0.75rem" }}>Select City</label>
              <select
                value={selectedCity}
                onChange={handleCityChange}
                disabled={!selectedDistrict}
                className="form-select glass-input glass-select w-100"
              >
                <option value="">-- All Cities --</option>
                {cities.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Step 3: Select Hospital */}
        <div className="mb-4">
          <label className="fw-bold text-white d-flex align-items-center gap-2 mb-2">
            <span className="badge rounded-circle p-1 d-flex align-items-center justify-content-center" style={{ width: "20px", height: "20px", background: "#a855f7", fontSize: "0.75rem" }}>3</span>
            Select Target Hospital
          </label>

          {loadingHospitals ? (
            <div className="glass-input d-flex align-items-center justify-content-center gap-2 text-white-50">
              <FaSpinner className="animate-spin" /> Loading facilities...
            </div>
          ) : (
            <select
              value={hospital}
              onChange={(e) => setHospital(e.target.value)}
              className="form-select glass-input glass-select w-100"
            >
              <option value="">-- Click to choose clinic --</option>
              {filteredHospitals.map((h) => (
                <option key={h._id} value={h.name}>
                  {h.name} {h.address ? `(${h.address})` : ""}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Submit Booking Button */}
        <div className="mt-5">
          <button
            onClick={bookAmbulance}
            disabled={bookingLoading || loadingHospitals || locating}
            className="btn-premium-danger w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2"
            style={{ fontSize: "1.1rem" }}
          >
            {bookingLoading ? (
              <>
                <FaSpinner className="animate-spin" />
                Dispatching Ambulance...
              </>
            ) : (
              <>
                🚨 Request Dispatch Now
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}

export default UserBooking;