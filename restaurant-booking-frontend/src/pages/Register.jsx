import React from "react";
import { Link } from "react-router-dom";  // Import Link component for navigation
import RegisterForm from "../components/RegisterForm";  // Import RegisterForm component

const Register = () => {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-beige px-6 py-12"
      style={{ backgroundImage: "url('/register.jpg')", backgroundSize: "cover" }}
    >
      <div className="max-w-3xl w-full bg-white shadow-lg rounded-2xl p-8">
        <p className="text-lg text-brown text-center mb-6 font-bold">
          Welcome!
        </p>
        <RegisterForm />

        <p className="mt-4 text-center">
          Already have an account?{" "}
         <Link to="/login" className="text-blue-500 hover:text-blue-700 font-bold" style={{ color: 'blue', textDecoration: 'underline' }}>
          Log in here
        </Link>
      </p>
   </div>
  </div>
  );
};

export default Register;
