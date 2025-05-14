const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db"); // No need for db.promise() here

// Export a function that accepts io
module.exports = function(io) {
  // User Registration
  const registerUser = async (req, res) => {
    // ✅ Log the incoming data
    console.log("📥 Incoming registration data:", req.body);

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      console.log("❌ Missing required registration fields");
      return res.status(400).json({ message: "All fields are required" });
    }

    try {
      // Check if the user already exists
      const [existingUser] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
      if (existingUser.length > 0) {
        console.log("❗ User already exists with email:", email);
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash Password
      const hashedPassword = await bcrypt.hash(password, 10);
      const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

      const [result] = await db.execute(sql, [name, email, hashedPassword]);
      const userId = result.insertId;
      
      console.log("✅ User registered successfully:", email);

      // Create notification for admins about new user
      try {
        // Check if the notifications table exists first
        const [tables] = await db.execute(
          "SHOW TABLES LIKE 'notifications'"
        );
        
        if (tables.length > 0) {
          await db.execute(
            "INSERT INTO notifications (type, user_id, read_status, created_at) VALUES (?, ?, ?, NOW())",
            ["new_user", userId, 0]
          );

          // Emit new user notification to admins via Socket.io
          io.emit('newUser', {
            id: userId,
            name,
            email,
            created_at: new Date()
          });
          
          console.log("✅ Notification created for new user registration");
        } else {
          console.log("⚠️ Notifications table doesn't exist, skipping notification creation");
        }
      } catch (notifErr) {
        console.error("❌ Error creating user notification:", notifErr);
        // Continue execution even if notification creation fails
      }

      res.status(201).json({ 
        message: "User registered successfully",
        userId: userId
      });

    } catch (error) {
      console.error("❌ Error in registerUser:", error);
      res.status(500).json({ message: "Database error", error: error.message });
    }
  };

  // User Login
  const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    try {
      const sql = "SELECT * FROM users WHERE email = ?";
      const [results] = await db.execute(sql, [email]);

      if (results.length === 0) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Generate JWT Token
      const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600000, // 1 hour
      });

      res.json({ 
        message: "Login successful", 
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          isAdmin: user.is_admin === 1
        }
      });

    } catch (error) {
      console.error("❌ Error in loginUser:", error);
      res.status(500).json({ message: "Database error", error: error.message });
    }
  };

  // Get All Users
  const getAllUsers = async (req, res) => {
    try {
      const [users] = await db.execute("SELECT id, name, email FROM users");
      res.json(users);
    } catch (error) {
      console.error("❌ Error in getAllUsers:", error);
      res.status(500).json({ message: "Database error", error: error.message });
    }
  };

  // Get User by ID
  const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
      const [user] = await db.execute("SELECT id, name, email FROM users WHERE id = ?", [id]);

      if (user.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user[0]);
    } catch (error) {
      console.error("❌ Error in getUserById:", error);
      res.status(500).json({ message: "Database error", error: error.message });
    }
  };

  // Delete User
  const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
      const [result] = await db.execute("DELETE FROM users WHERE id = ?", [id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("❌ Error in deleteUser:", error);
      res.status(500).json({ message: "Database error", error: error.message });
    }
  };

  return {
    registerUser,
    loginUser,
    getAllUsers,
    getUserById,
    deleteUser
  };
};