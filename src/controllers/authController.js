const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db"); // Adjust this based on your DB connection

// Register User
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Ensure role is either 'customer' or 'admin' (prevent invalid roles)
        const validRoles = ["customer", "admin"];
        const assignedRole = validRoles.includes(role) ? role : "customer"; // Default to 'customer' if invalid

        // Check if user already exists
        const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into the database
        await db.query(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
            [name, email, hashedPassword, assignedRole]
        );

        res.status(201).json({ message: "User registered successfully", role: assignedRole });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
