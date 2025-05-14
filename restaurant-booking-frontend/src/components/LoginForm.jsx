import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = { email, password };

    try {
      const response = await axios.post("http://localhost:5000/api/users/login", formData);

      if (response.status === 200) {
        const token = response.data.token;

        // ✅ Save the token in localStorage
        localStorage.setItem("token", token);

        alert("Login successful! Redirecting to booking...");
        navigate("/booking"); // Or wherever you want
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div className="login-form">
      <h2 className="text-center text-2xl text-brown font-bold mb-6">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-brown font-bold mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-brown rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
        <div>
          <label className="block text-brown font-bold mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-brown rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
        <button
          type="submit"
          className="bg-[#FFD700] text-brown px-6 py-3 rounded-lg font-bold text-lg hover:bg-[#FFF5E1] hover:text-[#DAA520] transition flex justify-center"
        >
          Login
        </button>
        <p className="text-sm text-center mt-4 text-brown">
          Don’t have an account?{" "}
          <a href="/register" className="text-gold font-semibold hover:underline">
            Register here
          </a>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
