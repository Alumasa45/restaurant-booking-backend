import React from "react";
import LoginForm from "../components/LoginForm";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-beige px-6 py-12"
    style={{ backgroundImage: "url('/login.jpg')", backgroundSize: "cover" }}>
      <div className="max-w-3xl w-full bg-white shadow-lg rounded-2xl p-8">
        <p className="text-lg text-brown text-center mb-6">
        Welcome Back!
        </p>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
