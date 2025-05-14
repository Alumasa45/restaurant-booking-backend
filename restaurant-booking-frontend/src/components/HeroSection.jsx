import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div className="relative h-[80vh] flex items-center justify-center bg-cover bg-center" 
      style={{ backgroundImage: "url('/restaurant-hero.jpg')" }}>

      {/* Overlay for better text visibility */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Content */}
      <div className="relative text-center text-white z-10">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gold">Welcome to Our Restaurant!</h1>
        <p className="text-lg md:text-xl mb-6 text-beige">Experience the best dining in town. </p>
        <Link to="/Menu">
  <button className="bg-[#FFD700] text-brown px-6 py-3 rounded-lg font-bold text-lg hover:bg-[#FFF5E1] hover:text-[#DAA520] transition">
    Browse our menu Here.
  </button>
  <br></br>
  <br></br>
</Link>
        <Link to="/Register">
  <button className="bg-[#FFD700] text-brown px-6 py-3 rounded-lg font-bold text-lg hover:bg-[#FFF5E1] hover:text-[#DAA520] transition">
    Register User.
  </button>
</Link>

      </div>
    </div>
  );
};

export default HeroSection;
