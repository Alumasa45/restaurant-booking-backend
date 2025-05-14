const db = require("../config/db");

// Get all bookings
const getBookings = async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM bookings");
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single booking by ID
const getBookingById = async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM bookings WHERE id = ?", [req.params.id]);
    if (results.length === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Create a new booking with authenticated user
const createBooking = async (req, res) => {
  console.log("Incoming booking data:", req.body);
  const { customer_name, email, phone, date, time, guests, specialRequest, table_id } = req.body;

  if (!customer_name || !email || !phone || !date || !time || !guests || !table_id) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  

  try {
    const user_id = req.user.userId; // ✅ Extracted from JWT middleware

    const status = "pending";

    const [result] = await db.query(
      "INSERT INTO bookings (user_id, customer_name, email, phone, table_id, date, time, guests, special_request, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [user_id, customer_name, email, phone, table_id, date, time, guests, specialRequest || null, status]
    );

    const newBooking = {
      id: result.insertId,
      user_id,
      customer_name,
      email,
      phone,
      table_id,
      date,
      time,
      guests,
      special_request: specialRequest || null,
      status,
    };

    // 🔥 Emit real-time notification
    global.emitBookingEvent("new_booking", newBooking);

    res.status(201).json({
      message: "Booking created successfully",
      bookingId: result.insertId,
    });

  } catch (err) {
    console.error("Error creating booking:", err);
    res.status(500).json({ error: err.message });
  }
  console.log("Received Request Body:", req.body);

};

// Update a booking
const updateBooking = async (req, res) => {
  const { customer_name, table_id, date, time, status } = req.body;

  if (!customer_name || !table_id || !date || !time) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const [result] = await db.query(
      "UPDATE bookings SET customer_name = ?, table_id = ?, date = ?, time = ?, status = ? WHERE id = ?",
      [customer_name, table_id, date, time, status, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json({ message: "Booking updated successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a booking
const deleteBooking = async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM bookings WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.json({ message: "Booking deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Export all functions
module.exports = {
  getBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
};
