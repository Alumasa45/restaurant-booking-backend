const express = require("express");
const db = require("../config/db"); // Database connection
const router = express.Router();

// Get booking details by bookingId
router.get("/:bookingId", async (req, res) => {
  const { bookingId } = req.params;

  try {
    // Query to fetch booking details
    const [booking] = await db.execute(
      `SELECT b.id, b.date, b.time, b.guests, b.specialRequest, b.status, 
              u.name AS customer_name, u.email, u.phone, 
              t.table_number, t.capacity
       FROM bookings b
       JOIN users u ON b.user_id = u.id
       JOIN tables t ON b.table_id = t.id
       WHERE b.id = ?`,
      [bookingId]
    );

    if (booking.length === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json(booking[0]);
  } catch (err) {
    console.error("Error fetching booking details:", err);
    res.status(500).json({ error: "Failed to fetch booking details" });
  }
});

module.exports = router;