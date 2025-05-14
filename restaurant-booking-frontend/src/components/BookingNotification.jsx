import React, { useState, useEffect, useRef } from 'react';
import { getSocket } from '../services/socketService';

const BookingNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationContainerRef = useRef(null);
  
  useEffect(() => {
    const socket = getSocket();
    
    if (socket) {
      // Listen for new booking events
      socket.on('new_booking', (bookingData) => {
        const newNotification = {
          id: Date.now(),
          message: `New booking: ${bookingData.name} for ${bookingData.guests} on ${formatDate(bookingData.date)} at ${bookingData.time}`,
          time: new Date().toLocaleTimeString(),
          read: false,
          data: bookingData
        };
        
        setNotifications(prev => [newNotification, ...prev].slice(0, 10)); // Keep only 10 most recent
        
        // Show browser notification if permission is granted
        if (Notification.permission === 'granted') {
          new Notification('New Table Booking', {
            body: newNotification.message,
            icon: '/logo.png' // Add your restaurant logo path here
          });
        }
      });
      
      // Listen for booking confirmation events
      socket.on('booking_confirmed', (data) => {
        const newNotification = {
          id: Date.now(),
          message: `Booking #${data.bookingId} has been confirmed!`,
          time: new Date().toLocaleTimeString(),
          read: false,
          type: 'confirmation',
          data
        };
        
        setNotifications(prev => [newNotification, ...prev].slice(0, 10));
      });
      
      // Listen for booking cancellation events
      socket.on('booking_cancelled', (data) => {
        const newNotification = {
          id: Date.now(),
          message: `Booking #${data.bookingId} has been cancelled.`,
          time: new Date().toLocaleTimeString(),
          read: false,
          type: 'cancellation',
          data
        };
        
        setNotifications(prev => [newNotification, ...prev].slice(0, 10));
      });
    }
    
    // Cleanup listeners when component unmounts
    return () => {
      if (socket) {
        socket.off('new_booking');
        socket.off('booking_confirmed');
        socket.off('booking_cancelled');
      }
    };
  }, []);
  
  // Format date to be more readable
  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Handle click outside to close notification panel
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationContainerRef.current && !notificationContainerRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };
  
  // Mark a single notification as read
  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };
  
  // Clear all notifications
  const clearAll = () => {
    setNotifications([]);
  };
  
  // Count unread notifications
  const unreadCount = notifications.filter(notif => !notif.read).length;
  
  return (
    <div className="relative" ref={notificationContainerRef}>
      {/* Notification Bell Button */}
      <button 
        className="fixed top-20 right-6 z-50 bg-brown text-white p-3 rounded-full shadow-lg hover:bg-[#8B4513] transition-all duration-300"
        onClick={() => setShowNotifications(!showNotifications)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        
        {/* Notification Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>
      
      {/* Notification Panel */}
      {showNotifications && (
        <div className="fixed top-36 right-6 w-80 md:w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[70vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-[#FFF5E1]">
            <h3 className="font-semibold text-lg text-brown">Notifications</h3>
            <div className="flex space-x-2">
              <button 
                onClick={markAllAsRead} 
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Mark all read
              </button>
              <button 
                onClick={clearAll} 
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Clear all
              </button>
            </div>
          </div>
          
          {/* Notification List */}
          <div className="overflow-y-auto max-h-[50vh]">
            {notifications.length > 0 ? (
              notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`border-b border-gray-100 p-4 hover:bg-gray-50 transition-colors duration-200 ${!notification.read ? 'bg-blue-50' : ''}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className={`text-sm ${!notification.read ? 'font-semibold' : ''}`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                    {!notification.read && (
                      <span className="bg-blue-500 h-2 w-2 rounded-full mt-1"></span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <p className="text-center">No notifications yet</p>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="p-3 border-t border-gray-200 text-center bg-[#FFF5E1]">
            <button 
              className="text-sm text-brown hover:text-[#8B4513] font-medium"
              onClick={() => setShowNotifications(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingNotification;