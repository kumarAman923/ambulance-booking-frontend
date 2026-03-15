import { useEffect, useState } from "react";
import API from "../services/api";

function MyBookings() {

  const [bookings, setBookings] = useState([]);

  useEffect(() => {

    const fetchBookings = async () => {

      try {

        const userId = localStorage.getItem("userId");

        const res = await API.get(`/booking/user/${userId}`);

        setBookings(res.data.bookings);

      } catch (error) {

        console.log(error);

      }

    };

    fetchBookings();

  }, []);

  // 🚑 Cancel Booking
  const cancelBooking = async (id) => {

    try {

      await API.delete("/booking/cancel", {
        data: { bookingId: id }
      });

      alert("Booking Cancelled");

      // booking list refresh
      setBookings(bookings.filter(b => b._id !== id));

    } catch (error) {

      console.log(error);

    }

  };

  return (

    <div className="container mt-4">

      <h2 className="fw-bold mb-4">
        My Bookings
      </h2>

      {bookings.length === 0 && (
        <p>No bookings found</p>
      )}

      {bookings.map((b) => (

        <div key={b._id} className="card mb-3 shadow-sm">

          <div className="card-body">

            <p className="mb-1">
              <strong>Hospital:</strong> {b.hospital}
            </p>

            <p className="mb-2">
              <strong>Status:</strong> {b.status}
            </p>

            {/* Cancel Button */}
            {b.status !== "cancelled" && (
              <button
                onClick={() => cancelBooking(b._id)}
                className="btn btn-danger btn-sm"
              >
                Cancel Booking
              </button>
            )}

          </div>

        </div>

      ))}

    </div>

  );

}

export default MyBookings;