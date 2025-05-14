import React, { useEffect, useState } from "react";
import io from "socket.io-client"; // Import the socket.io-client
import BookingForm from "../components/BookingForm";

const Booking = () => {
  const [newBooking, setNewBooking] = useState(null); // State to hold the new booking data

  useEffect(() => {
    // Connect to the Socket.io server
    const socket = io("http://localhost:5000"); // Update with your server URL if different

    // Listen for the "newBooking" event from the server
    socket.on("newBooking", (booking) => {
      console.log("New booking received:", booking);
      setNewBooking(booking); // Update the state with the new booking data
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.off("newBooking"); // Remove the listener on unmount
    };
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-beige px-6 py-12"
      style={{ backgroundImage: "url('/your-background-image.jpg')", backgroundSize: "cover" }}
    >
      <div className="max-w-3xl w-full bg-white shadow-lg rounded-2xl p-8">
        <p className="text-lg text-brown text-center mb-6">
          Reserve your spot at our luxurious restaurant and enjoy an unforgettable dining experience.
        </p>

        <BookingForm />

        {/* Optionally, display the new booking information */}
        {newBooking && (
          <div className="mt-8 bg-gray-100 p-4 rounded-xl">
            <h3 className="text-xl font-semibold text-brown">New Booking:</h3>
            <p className="text-sm text-gray-700">
              {`Booking ID: ${newBooking.bookingId} for ${newBooking.name}, Table: ${newBooking.tableId}, 
                Date: ${newBooking.date}, Time: ${newBooking.time}`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Booking;
