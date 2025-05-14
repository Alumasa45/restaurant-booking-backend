import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { initSocket } from './services/socketService';
import BookingNotification from './components/BookingNotification';
import Register from "./pages/Register";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Contact from "./pages/Contact";
import Booking from "./pages/Booking";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import AdminDashboard from './pages/AdminDashboard';

function App() {
  useEffect(() => {
    const socket = initSocket();
    
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
    
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Navbar for navigation */}
        <Navbar />
        
        {/* BookingNotification floats on top of content */}
        <BookingNotification />
        
        {/* Main content area */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        
        {/* You could add a Footer component here if needed */}
      </div>
    </Router>
  );
}

export default App;