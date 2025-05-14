import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi"; // Importing icons for the menu

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-beige p-4 text-white" style={{ backgroundColor: "#F5F5DC" }}>
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        {/* Header with brown text */}
        <h1 className="text-xl font-bold" style={{ color: "#8B4513" }}>
          Restaurant Booking
        </h1>

        {/* Mobile Menu Button */}
        <div className="md:hidden z-50">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX size={30} color="#8B4513" /> : <FiMenu size={30} color="#8B4513" />}
          </button>
        </div>

        {/* Desktop Navbar Links */}
        <ul className="hidden md:flex gap-6 text-brown" style={{ color: "#8B4513" }}>
          <li><Link to="/" className="font-bold hover:text-gold">Home</Link></li>
          <li><Link to="/menu" className="font-bold hover:text-gold">Menu</Link></li>
          <li><Link to="/booking" className="font-bold hover:text-gold">Booking</Link></li>
          <li><Link to="/contact" className="font-bold hover:text-gold">Contact</Link></li>
          <li><Link to="/admin" className="font-bold hover:text-gold">Admin</Link></li>
          <li><Link to="/register" className="font-bold hover:text-gold">Register</Link></li> {/* Added Register link */}
        </ul>

        {/* Mobile Menu */}
        <div
          className={`fixed top-0 left-0 w-full h-full bg-white bg-opacity-95 flex flex-col items-center justify-center transition-transform ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          } md:hidden z-40`}
        >
          <button
            className="absolute top-6 right-6 text-3xl text-brown"
            onClick={() => setMenuOpen(false)}
          >
            <FiX />
          </button>
          <ul className="text-brown text-2xl space-y-6" style={{ color: "#8B4513" }}>
            <li><Link to="/" onClick={() => setMenuOpen(false)} className="font-bold hover:text-gold">Home</Link></li>
            <li><Link to="/menu" onClick={() => setMenuOpen(false)} className="font-bold hover:text-gold">Menu</Link></li>
            <li><Link to="/booking" onClick={() => setMenuOpen(false)} className="font-bold hover:text-gold">Booking</Link></li>
            <li><Link to="/contact" onClick={() => setMenuOpen(false)} className="font-bold hover:text-gold">Contact</Link></li>
            <li><Link to="/admin" className="font-bold hover:text-gold">Admin</Link></li>
            <li><Link to="/register" onClick={() => setMenuOpen(false)} className="font-bold hover:text-gold">Register</Link></li> {/* Added Register link */}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
