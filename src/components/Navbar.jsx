import { Link } from "react-router-dom";

function Navbar() {

  return (

    <nav className="sticky top-0 bg-white shadow-md z-50">

      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

        {/* Logo */}
        <h1 className="text-xl font-bold text-red-600">
          🚑 Ambulance System
        </h1>

        {/* Navigation Buttons */}
        <div className="flex gap-6">

          <Link
            to="/book"
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Book Ambulance
          </Link>

          <Link
            to="/mybookings"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            My Bookings
          </Link>

          <Link
            to="/driver"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Driver Dashboard
          </Link>

          <Link
            to="/login"
            className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
          >
            Login
          </Link>
            <Link
            to="/Register"
            className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
          >
            Register
          </Link>

        </div>

      </div>

    </nav>

  );

}

export default Navbar;