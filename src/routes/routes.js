const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authMiddleware"); // Authentication middleware
const db = require("../config/db"); // Import MySQL connection pool

// Secure route to fetch users
router.get("/users", authenticateUser, async (req, res) => {
    try {
        const [users] = await db.query("SELECT * FROM users");
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Error fetching users" });
    }
});

// Secure route to create a booking
router.post("/bookings", authenticateUser, async (req, res) => {
    const { user_id, table_id, date, time } = req.body;
    try {
        const sql = "INSERT INTO bookings (user_id, table_id, date, time) VALUES (?, ?, ?, ?)";
        const [result] = await db.query(sql, [user_id, table_id, date, time]);
        res.json({ message: "Booking created successfully", bookingId: result.insertId });
    } catch (error) {
        console.error("Error creating booking:", error);
        res.status(500).json({ error: "Error creating booking" });
    }
});

// Secure route to fetch user bookings
router.get("/bookings", authenticateUser, async (req, res) => {
    try {
        const [bookings] = await db.query("SELECT * FROM bookings");
        res.json(bookings);
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({ error: "Error fetching bookings" });
    }
});

// Export the router
module.exports = router;
