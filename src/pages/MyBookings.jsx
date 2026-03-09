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

    <div className="p-10">

      <h2 className="text-2xl font-bold mb-6">
        My Bookings
      </h2>

      {bookings.length === 0 && (
        <p>No bookings found</p>
      )}

      {bookings.map((b) => (

        <div key={b._id} className="border p-4 mb-3 rounded">

          <p><b>Hospital:</b> {b.hospital}</p>

          <p><b>Status:</b> {b.status}</p>

          {/* Cancel Button */}
          {b.status !== "cancelled" && (
            <button
              onClick={() => cancelBooking(b._id)}
              className="bg-red-500 text-white px-3 py-1 mt-2 rounded"
            >
              Cancel Booking
            </button>
          )}

        </div>

      ))}

    </div>

  );

}

export default MyBookings;