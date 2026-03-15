import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Register from "./pages/Register";
import MapView from "./pages/MapView";
import MyBookings from "./pages/MyBookings";
import SOS from "./pages/SOS";
import UserBooking from "./pages/UserBooking";
import DriverDashboard from "./pages/DriverDashboard";

function App() {
  return (
    <Router>

      {/* Navigation */}
      <Navbar />

      {/* Routes */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/mybookings" element={<MyBookings />} />
        <Route path="/sos" element={<SOS />} />
        <Route path="/book" element={<UserBooking />} />
        <Route path="/driver" element={<DriverDashboard />} />
      </Routes>

    </Router>
  );
}

export default App;