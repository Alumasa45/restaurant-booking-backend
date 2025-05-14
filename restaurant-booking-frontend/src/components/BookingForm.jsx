import React, { useState, useEffect } from 'react';
import axios from "axios"; 
import { getSocket } from '../services/socketService';
import { useNavigate } from 'react-router-dom';

const BookingForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: "1 guest", // Ensure this is a string
    specialRequest: "",
    table_id: 1, // Default to a table ID (you can adjust this dynamically later)
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();
  const socket = getSocket();
  
  useEffect(() => {
    // Set up socket event listeners when component mounts
    if (socket) {
      socket.on('booking_confirmed', (data) => {
        setSuccess(`Booking confirmed! Booking ID: ${data.bookingId}`);
        setLoading(false);
      });

      socket.on('booking_error', (data) => {
        setError(`Booking error: ${data.message}`);
        setLoading(false);
      });
    }

    // Clean up event listeners when component unmounts
    return () => {
      if (socket) {
        socket.off('booking_confirmed');
        socket.off('booking_error');
      }
    };
  }, [socket]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const token = localStorage.getItem("token"); // 🔐 Your saved JWT

    if (!token) {
      setError("You must be logged in to make a booking.");
      setLoading(false);
      navigate('/login');
      return;
    }

    try {
      // First, make the HTTP request
      const response = await axios.post(
        "http://localhost:5000/api/bookings",
        {
          customer_name: formData.name,
    email: formData.email,
    phone: formData.phone,
    date: formData.date,
    time: formData.time,
    guests: formData.guests,
    specialRequest: formData.specialRequest,
    table_id: formData.table_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Then emit socket event to notify about the new booking
      if (socket) {
        socket.emit('new_booking', {
          bookingId: response.data.bookingId || 'unknown',
          userId: response.data.userId || 'unknown',
          name: formData.name,
          date: formData.date,
          time: formData.time,
          guests: formData.guests
        });
      }

      setSuccess(response.data.message || "Booking successful!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        guests: "1 guest", // Resetting guests to default
        specialRequest: "",
        table_id: 1, // Resetting table_id
      });
    } catch (err) {
      console.error("Booking error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to submit booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-xl p-6 my-10 border-4 border-brown">
      <h2 className="text-3xl font-bold text-center text-brown mb-4">Book a Table</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
          required
        />
        <div className="flex gap-4">
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-1/2 p-3 border rounded-lg"
            required
          />
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="w-1/2 p-3 border rounded-lg"
            required
          />
        </div>
        <select
          name="guests"
          value={formData.guests}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
        >
          {[...Array(10).keys()].map((num) => (
            <option key={num + 1} value={`${num + 1} guest${num > 0 ? "s" : ""}`}>
              {num + 1} Guest{num > 0 ? "s" : ""}
            </option>
          ))}
        </select>
        <textarea
          name="specialRequest"
          placeholder="Special Requests (optional)"
          value={formData.specialRequest}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
          rows="3"
        ></textarea>

        {/* Hidden input for table_id */}
        <input 
          type="hidden" 
          name="table_id" 
          value={formData.table_id} 
        />

        <div className="flex justify-center">
          <button 
            className="bg-[#FFD700] text-brown px-6 py-3 rounded-lg font-bold text-lg hover:bg-[#FFF5E1] hover:text-[#DAA520] transition"
            disabled={loading}
          >
            {loading ? "Processing..." : "Confirm Booking"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;