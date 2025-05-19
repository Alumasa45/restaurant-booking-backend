const express = require("express");
const db = require("../config/db"); // Database connection
const router = express.Router();
const { authenticateToken, admin } = require("../middleware/authMiddleware");
const jwt = require("jsonwebtoken");

// Admin login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user with admin role instead of using a separate Admin model
    // Based on your logs, it seems you're using a single users table
    const [rows] = await db.execute(
      "SELECT * FROM users WHERE email = ? AND role = 'admin'",
      [email]
    );
    
    const admin = rows[0];
    
    if (!admin) {
      return res.status(401).json({ error: "Invalid email or admin credentials" });
    }
    
    // Verify password - adjust based on how passwords are stored
    // If using bcrypt:
    const bcrypt = require('bcrypt');
    const passwordMatch = await bcrypt.compare(password, admin.password);
    
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate a token with the admin's information
    const token = jwt.sign(
      { 
        userId: admin.id, 
        email: admin.email, 
        role: admin.role  // Ensure role is included
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ 
      token,
      user: {
        id: admin.id,
        email: admin.email,
        role: admin.role,
        name: admin.name
      }
    });
  } catch (err) {
    console.error("Error during admin login:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Protect a route with token authentication
router.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "You have access to this protected route." });
});

// Protect an admin-only route
router.get("/admin-only", authenticateToken, admin, (req, res) => {
  res.json({ message: "Welcome, Admin!" });
});

// Get all bookings
router.get("/bookings", authenticateToken, admin, async (req, res) => {
  try {
    const [bookings] = await db.execute(
      `SELECT b.id, b.customer_name, b.email, b.phone, b.date, b.time, b.guests, b.specialRequest, b.status, 
              t.table_number 
       FROM bookings b
       JOIN tables t ON b.table_id = t.id`
    );
    res.json(bookings);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ error: "Failed to fetch bookings." });
  }
});

// Get all users
router.get("/users", authenticateToken, admin, async (req, res) => {
  try {
    const [users] = await db.execute(`SELECT id, name, email, role FROM users`);
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users." });
  }
});

// Get all tables
router.get("/tables", authenticateToken, admin, async (req, res) => {
  try {
    const [tables] = await db.execute(`SELECT id, table_number, capacity, status FROM tables`);
    res.json(tables);
  } catch (err) {
    console.error("Error fetching tables:", err);
    res.status(500).json({ error: "Failed to fetch tables." });
  }
});

// Update booking status
router.put("/bookings/:id", authenticateToken, admin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const [result] = await db.execute(
      `UPDATE bookings SET status = ? WHERE id = ?`, 
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Booking not found." });
    }

    res.json({ message: "Booking status updated successfully." });
  } catch (err) {
    console.error("Error updating booking:", err);
    res.status(500).json({ error: "Failed to update booking." });
  }
});

// Delete a booking by ID
router.delete("/bookings/:id", authenticateToken, admin, async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.execute(`DELETE FROM bookings WHERE id = ?`, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Booking not found." });
    }

    res.json({ message: "Booking deleted successfully." });
  } catch (err) {
    console.error("Error deleting booking:", err);
    res.status(500).json({ error: "Failed to delete booking." });
  }
});

// Add a new table
router.post("/tables", authenticateToken, admin, async (req, res) => {
  const { table_number, capacity, status } = req.body;

  try {
    const [result] = await db.execute(
      `INSERT INTO tables (table_number, capacity, status) VALUES (?, ?, ?)`,
      [table_number, capacity, status || 'available']
    );
    
    res.status(201).json({ 
      message: "Table added successfully", 
      tableId: result.insertId 
    });
  } catch (err) {
    console.error("Error adding table:", err);
    res.status(500).json({ error: "Failed to add table." });
  }
});

// Update a table
router.put("/tables/:id", authenticateToken, admin, async (req, res) => {
  const { id } = req.params;
  const { table_number, capacity, status } = req.body;

  try {
    const [result] = await db.execute(
      `UPDATE tables SET table_number = ?, capacity = ?, status = ? WHERE id = ?`,
      [table_number, capacity, status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Table not found." });
    }

    res.json({ message: "Table updated successfully." });
  } catch (err) {
    console.error("Error updating table:", err);
    res.status(500).json({ error: "Failed to update table." });
  }
});

// Delete a table
router.delete("/tables/:id", authenticateToken, admin, async (req, res) => {
  const { id } = req.params;

  try {
    // Check if the table is used in any bookings
    const [bookings] = await db.execute(
      `SELECT COUNT(*) as count FROM bookings WHERE table_id = ?`,
      [id]
    );
    
    if (bookings[0].count > 0) {
      return res.status(400).json({ 
        error: "Cannot delete table that has bookings associated with it." 
      });
    }
    
    const [result] = await db.execute(
      `DELETE FROM tables WHERE id = ?`, 
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Table not found." });
    }

    res.json({ message: "Table deleted successfully." });
  } catch (err) {
    console.error("Error deleting table:", err);
    res.status(500).json({ error: "Failed to delete table." });
  }
});

module.exports = router;