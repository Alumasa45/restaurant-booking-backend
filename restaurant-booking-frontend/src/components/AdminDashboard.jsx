import { useEffect, useState, useCallback } from "react";
import io from "socket.io-client";
import BookingManagementTable from "../components/BookingManagementTable";

// Base API URL to avoid repetition and make it easier to change
const API_BASE_URL = "http://localhost:5000";

const AdminDashboard = () => {
  const [notifications, setNotifications] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);

  // Fetch all bookings - moved to a callback for better reusability
  const fetchBookings = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/bookings`);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      setBookings(data);
      setError(null);
    } catch (err) {
      setError(`Failed to fetch bookings: ${err.message}`);
      console.error("Failed to fetch bookings:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize socket connection
  useEffect(() => {
    // Create socket connection
    const newSocket = io(API_BASE_URL);
    setSocket(newSocket);

    // Fetch initial data
    fetchBookings();

    // Cleanup on unmount
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [fetchBookings]);

  // Add notification helper
  const addNotification = useCallback((message) => {
    setNotifications((prev) => [
      {
        message,
        timestamp: new Date().toLocaleString(),
      },
      ...prev,
    ]);
  }, []);

  // Handle socket events
  useEffect(() => {
    if (!socket) return;

    // Listen for new bookings
    const handleNewBooking = (bookingData) => {
      console.log("📩 New Booking Notification:", bookingData);
      
      // Add to notifications
      addNotification(`🛎️ New booking by ${bookingData.customer_name} for ${bookingData.date} at ${bookingData.time}`);
      
      // Update bookings list - ensure we don't duplicate entries
      setBookings((prev) => {
        // Check if booking already exists
        const exists = prev.some(booking => booking.id === bookingData.id);
        if (exists) {
          // Update existing booking
          return prev.map(booking => 
            booking.id === bookingData.id ? bookingData : booking
          );
        }
        // Add new booking
        return [bookingData, ...prev];
      });
    };
    
    // Listen for booking updates
    const handleBookingUpdated = (updatedBooking) => {
      console.log("🔄 Booking Updated:", updatedBooking);
      
      addNotification(`📝 Booking #${updatedBooking.id} was updated`);
      
      // Update the booking in the list
      setBookings((prev) => 
        prev.map(booking => 
          booking.id === updatedBooking.id ? updatedBooking : booking
        )
      );
    };
    
    // Listen for booking cancellations
    const handleBookingCancelled = (bookingId) => {
      console.log("❌ Booking Cancelled:", bookingId);
      
      addNotification(`❌ Booking #${bookingId} was cancelled`);
      
      // Remove the booking from the list
      setBookings((prev) => 
        prev.filter(booking => booking.id !== bookingId)
      );
    };

    // Register event listeners
    socket.on("newBooking", handleNewBooking);
    socket.on("bookingUpdated", handleBookingUpdated);
    socket.on("bookingCancelled", handleBookingCancelled);

    // Handle reconnection
    socket.on("reconnect", () => {
      console.log("Socket reconnected, refreshing data...");
      fetchBookings();
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
      setError(`Socket connection error: ${err.message}`);
    });

    // Cleanup on unmount or socket change
    return () => {
      socket.off("newBooking", handleNewBooking);
      socket.off("bookingUpdated", handleBookingUpdated);
      socket.off("bookingCancelled", handleBookingCancelled);
      socket.off("reconnect");
      socket.off("connect_error");
    };
  }, [socket, addNotification, fetchBookings]);

  // Handle booking status change
  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}`, {
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
      addNotification(`✅ Booking #${bookingId} status changed to ${newStatus}`);
      
    } catch (err) {
      console.error("Failed to update booking status:", err);
      setError(`Failed to update booking: ${err.message}`);
    }
  };

  // Handle booking deletion
  const handleDeleteBooking = async (bookingId) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try {
        setError(null);
        const response = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error(`Error deleting booking: ${response.status}`);
        }

        // Remove booking from list
        setBookings((prev) => prev.filter(booking => booking.id !== bookingId));
        
        // Add notification
        addNotification(`🗑️ Booking #${bookingId} was deleted`);
        
      } catch (err) {
        console.error("Failed to delete booking:", err);
        setError(`Failed to delete booking: ${err.message}`);
      }
    }
  };

  // Handle retry when there's an error
  const handleRetry = () => {
    setError(null);
    fetchBookings();
  };

  return (
    <div className="admin-dashboard p-6">
      <h1 className="text-3xl font-bold mb-6">👨‍🍳 Admin Dashboard</h1>
      
      {/* Display error if exists */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
          <div>
            <strong>Error:</strong> {error}
          </div>
          <button 
            onClick={handleRetry}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
          >
            Retry
          </button>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 🔔 Real-Time Notifications Section */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-3">🔔 Notifications</h2>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-gray-500 italic">No notifications yet...</p>
            ) : (
              <ul className="space-y-2">
                {notifications.map((note, idx) => (
                  <li key={idx} className="border-b pb-2">
                    <p className="font-medium">{note.message}</p>
                    <p className="text-sm text-gray-500">{note.timestamp}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        
        {/* 📋 Booking Management Section */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-3">📋 Booking Management</h2>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-pulse text-lg">Loading bookings...</div>
            </div>
          ) : (
            <BookingManagementTable 
              bookings={bookings}
              onStatusChange={handleStatusChange}
              onDeleteBooking={handleDeleteBooking}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;