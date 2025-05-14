import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterForm = () => {
  const [name, setName] = useState("");         // ✅ Add name state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = { name, email, password }; // ✅ Include name in the data

    try {
      const response = await axios.post("http://localhost:5000/api/users/register", formData);
      if (response.status === 200 || response.status === 201) {
        alert("Registration successful! Redirecting to login...");
        navigate("/login");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6 text-brown">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ✅ Name Field */}
          <div>
            <label className="block text-sm font-semibold text-brown">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-brown">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-brown">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>

          <button
            type="submit"
            className="bg-[#FFD700] text-brown px-6 py-3 rounded-lg font-bold text-lg hover:bg-[#FFF5E1] hover:text-[#DAA520] transition"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
