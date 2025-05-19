import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminPage = () => {
  const [bookings, setBookings] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Token:", token); // Debugging log
        const headers = { Authorization: `Bearer ${token}` };

        const [bookingsRes, statisticsRes, usersRes] = await Promise.all([
          axios.get("http://localhost:5000/api/admin/bookings", { headers }),
          axios.get("http://localhost:5000/api/admin/statistics", { headers }),
          axios.get("http://localhost:5000/api/admin/users", { headers }),
        ]);

        console.log("Bookings Response:", bookingsRes.data); // Debugging log
        console.log("Statistics Response:", statisticsRes.data); // Debugging log
        console.log("Users Response:", usersRes.data); // Debugging log

        setBookings(bookingsRes.data);
        setStatistics(statisticsRes.data);
      } catch (err) {
        console.error("Error fetching admin data:", err);
        setError("Failed to load admin data. Please try again.");
      }
    };

    fetchAdminData();
  }, []);

  const handleDeleteBooking = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this booking?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      await axios.delete(`http://localhost:5000/api/admin/bookings/${id}`, { headers });

      setBookings((prevBookings) => prevBookings.filter((booking) => booking.id !== id));
      alert("Booking deleted successfully.");
    } catch (err) {
      console.error("Error deleting booking:", err);
      alert("Failed to delete booking. Please try again.");
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Bookings</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">ID</th>
              <th className="border border-gray-300 p-2">Customer Name</th>
              <th className="border border-gray-300 p-2">Date</th>
              <th className="border border-gray-300 p-2">Time</th>
              <th className="border border-gray-300 p-2">Guests</th>
              <th className="border border-gray-300 p-2">Table</th>
              <th className="border border-gray-300 p-2">Status</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td className="border border-gray-300 p-2">{booking.id}</td>
                <td className="border border-gray-300 p-2">{booking.customer_name}</td>
                <td className="border border-gray-300 p-2">{booking.date}</td>
                <td className="border border-gray-300 p-2">{booking.time}</td>
                <td className="border border-gray-300 p-2">{booking.guests}</td>
                <td className="border border-gray-300 p-2">{booking.table_number}</td>
                <td className="border border-gray-300 p-2">{booking.status}</td>
                <td className="border border-gray-300 p-2">
                  <button
                    onClick={() => handleDeleteBooking(booking.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default AdminPage;