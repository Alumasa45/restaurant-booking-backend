import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

// Create socket connection with proper error handling
let socket;
try {
  socket = io('http://localhost:5000'); // Your backend address
  console.log('Socket connection attempt initiated');
} catch (error) {
  console.error('Socket connection failed:', error);
}

const AdminDashboard = () => {
  const [notifications, setNotifications] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Socket connection status logging
  useEffect(() => {
    if (!socket) return;

    const onConnect = () => {
      console.log('Socket connected successfully:', socket.id);
    };

    const onDisconnect = (reason) => {
      console.log('Socket disconnected:', reason);
    };

    const onConnectError = (error) => {
      console.error('Socket connection error:', error);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);

    // If already connected, log it
    if (socket.connected) {
      console.log('Socket already connected:', socket.id);
    }

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
    };
  }, []);

  // Fetch bookings on component mount
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        console.log('Fetching bookings from API...');
        setIsLoading(true);
        const response = await fetch('http://localhost:5000/api/bookings');
        
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Bookings fetched successfully:', data);
        setBookings(data);
      } catch (err) {
        console.error('Failed to fetch bookings:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Socket event listeners for notifications
  useEffect(() => {
    if (!socket) return;
    
    // Listen for both event name formats - check which one your backend uses
    const handleNewBooking = (data) => {
      console.log('📥 New booking received:', data);
      
      // Add to notifications
      setNotifications((prev) => [
        { type: 'New Booking', timestamp: new Date().toLocaleString(), ...data },
        ...prev
      ]);
      
      // Also update bookings list if needed
      setBookings((prev) => [data, ...prev]);
    };

    const handleBookingConfirmed = (data) => {
      console.log('✅ Booking confirmed:', data);
      setNotifications((prev) => [
        { type: 'Booking Confirmed', timestamp: new Date().toLocaleString(), ...data },
        ...prev
      ]);
      
      // Update the booking in the list
      setBookings((prev) => 
        prev.map(booking => 
          booking.id === data.id ? { ...booking, status: 'confirmed' } : booking
        )
      );
    };

    const handleBookingCancelled = (data) => {
      console.log('❌ Booking cancelled:', data);
      setNotifications((prev) => [
        { type: 'Booking Cancelled', timestamp: new Date().toLocaleString(), ...data },
        ...prev
      ]);
      
      // Update the booking in the list
      setBookings((prev) => 
        prev.map(booking => 
          booking.id === data.id ? { ...booking, status: 'cancelled' } : booking
        )
      );
    };

    // Listen for original event names
    socket.on('new_booking', handleNewBooking);
    socket.on('booking_confirmed', handleBookingConfirmed);
    socket.on('booking_cancelled', handleBookingCancelled);
    
    // Also listen for alternative event names (in case backend uses different naming)
    socket.on('newBooking', handleNewBooking);
    socket.on('bookingConfirmed', handleBookingConfirmed);
    socket.on('bookingCancelled', handleBookingCancelled);

    // Add a test notification after 3 seconds (remove in production)
    const testTimeout = setTimeout(() => {
      console.log('Adding test notification');
      const testData = {
        id: 'test123',
        customer_name: 'Test Customer',
        email: 'test@example.com',
        date: '2025-04-15',
        time: '19:00',
        guests: 4,
        status: 'pending'
      };
      
      handleNewBooking(testData);
    }, 3000);

    return () => {
      socket.off('new_booking', handleNewBooking);
      socket.off('booking_confirmed', handleBookingConfirmed);
      socket.off('booking_cancelled', handleBookingCancelled);
      socket.off('newBooking', handleNewBooking);
      socket.off('bookingConfirmed', handleBookingConfirmed);
      socket.off('bookingCancelled', handleBookingCancelled);
      clearTimeout(testTimeout);
    };
  }, []);

  // Handle booking status change
  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error(`Error updating booking: ${response.status}`);
      }

      const updatedBooking = await response.json();
      
      // Update bookings list
      setBookings((prev) => 
        prev.map(booking => 
          booking.id === bookingId ? updatedBooking : booking
        )
      );
      
      // Add notification
      setNotifications((prev) => [
        { 
          type: `Booking ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`,
          timestamp: new Date().toLocaleString(),
          ...updatedBooking 
        },
        ...prev,
      ]);
      
    } catch (err) {
      console.error('Failed to update booking status:', err);
      setError(err.message);
    }
  };

  // Handle booking deletion
  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) {
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Error deleting booking: ${response.status}`);
      }

      // Remove from bookings list
      setBookings((prev) => prev.filter(booking => booking.id !== bookingId));
      
      // Add notification
      setNotifications((prev) => [
        { 
          type: 'Booking Deleted',
          timestamp: new Date().toLocaleString(),
          id: bookingId
        },
        ...prev,
      ]);
      
    } catch (err) {
      console.error('Failed to delete booking:', err);
      setError(err.message);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">📣 Admin Notifications</h2>

      {notifications.length === 0 ? (
        <p>No notifications yet...</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((notif, index) => (
            <li
              key={index}
              className="bg-white p-4 rounded-xl shadow border border-yellow-100"
            >
              <strong className="text-yellow-600">{notif.type}</strong>
              <div className="text-sm text-gray-700">
                Customer: {notif.customer_name} <br />
                Email: {notif.email} <br />
                Date: {notif.date} at {notif.time} <br />
                Guests: {notif.guests}
                {notif.timestamp && (
                  <div className="text-xs text-gray-500 mt-1">
                    {notif.timestamp}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Booking Management Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">📋 Booking Management</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        {isLoading ? (
          <p className="text-gray-600">Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <p className="text-gray-600">No bookings found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Customer</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Time</th>
                  <th className="px-4 py-2 text-left">Guests</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{booking.customer_name}</td>
                    <td className="px-4 py-3">{booking.date}</td>
                    <td className="px-4 py-3">{booking.time}</td>
                    <td className="px-4 py-3">{booking.guests}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        booking.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : booking.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.status || 'pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={booking.status || 'pending'}
                        onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                        className="mr-2 p-1 text-sm border rounded"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirm</option>
                        <option value="cancelled">Cancel</option>
                      </select>
                      <button
                        onClick={() => handleDeleteBooking(booking.id)}
                        className="bg-red-500 hover:bg-red-600 text-white text-sm px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;