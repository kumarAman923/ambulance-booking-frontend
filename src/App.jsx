import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MapView from "./pages/MapView";
import MyBookings from "./pages/MyBookings";
import SOS from "./pages/SOS";
import UserBooking from "./pages/UserBooking";  // ✅ Ek booking page rakho
import Navbar from "./components/Navbar";
import DriverDashboard from "./pages/DriverDashboard";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/mybookings" element={<MyBookings />} />
        <Route path="/sos" element={<SOS />} />
        <Route path="/book" element={<UserBooking />} />  {/* ✅ Sirf ye rakho */}
        <Route path="/driver" element={<DriverDashboard />} />
        {/* ❌ Hatao: /userBooking, /navbar, /bookAmbulace */}
      </Routes>
    </Router>
  );
}

export default App;