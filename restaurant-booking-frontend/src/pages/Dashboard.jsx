import React, { useEffect, useState } from 'react';
import { getSocket } from '../services/socketService';

function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Fetch initial bookings
  useEffect(() => {
    const fetchTodayBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        const today = new Date().toISOString().split('T')[0];
        
        const response = await fetch(`http://localhost:5000/api/bookings/date/${today}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }
        
        const data = await response.json();
        setBookings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTodayBookings();
  }, []);
  
  // Set up Socket.io listeners
  useEffect(() => {
    const socket = getSocket();
    
    // Listen for new bookings
    socket.on('newBooking', (booking) => {
      console.log('New booking received:', booking);
      setBookings(prevBookings => [booking, ...prevBookings]);
      
      // Show notification
      if (Notification.permission === 'granted') {
        new Notification('New Booking', {
          body: `${booking.customer_name} booked for ${booking.guests} at ${booking.time}`
        });
      }
    });
    
    // Listen for booking status updates
    socket.on('bookingStatusUpdated', (update) => {
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === update.id 
            ? { ...booking, status: update.status } 
            : booking
        )
      );
    });
    
    // Clean up listeners when component unmounts
    return () => {
      socket.off('newBooking');
      socket.off('bookingStatusUpdated');
    };
  }, []);
  
  // Handle status update
  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update status');
      }
      
      // The update will come back through the socket
    } catch (err) {
      console.error(err);
      alert('Failed to update booking status');
    }
  };
  
  if (isLoading) return <div>Loading bookings...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div className="dashboard-container">
      <h1>Bookings Dashboard</h1>
      
      <div className="bookings-list">
        {bookings.length === 0 ? (
          <p>No bookings for today</p>
        ) : (
          bookings.map(booking => (
            <div key={booking.id} className={`booking-card status-${booking.status}`}>
              <div className="booking-header">
                <h3>{booking.customer_name}</h3>
                <span className="booking-status">{booking.status}</span>
              </div>
              
              <div className="booking-details">
                <p><strong>Date:</strong> {booking.date}</p>
                <p><strong>Time:</strong> {booking.time}</p>
                <p><strong>Guests:</strong> {booking.guests}</p>
                <p><strong>Phone:</strong> {booking.phone || 'N/A'}</p>
                {booking.specialRequest && (
                  <p><strong>Special Request:</strong> {booking.specialRequest}</p>
                )}
              </div>
              
              <div className="booking-actions">
                {booking.status !== 'confirmed' && (
                  <button 
                    className="confirm-btn"
                    onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                  >
                    Confirm
                  </button>
                )}
                
                {booking.status !== 'cancelled' && (
                  <button 
                    className="cancel-btn"
                    onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;