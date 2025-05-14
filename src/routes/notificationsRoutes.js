const express = require("express");
const { authenticateToken, admin } = require("../middleware/authMiddleware");
const db = require("../config/db");
const notificationController = require('../controllers/notificationsController');

module.exports = function(io) {
  const router = express.Router();

  router.get('/admin/notifications', authenticateUser, admin, notificationController.getAdminNotifications);

  // Get all notifications (admin only)
  router.get("/", authenticateToken, async (req, res) => {
    try {
      // Check if user is admin
      const [adminCheck] = await db.execute(
        "SELECT is_admin FROM users WHERE id = ?",
        [req.user.id]
      );

      if (!adminCheck.length || !adminCheck[0].is_admin) {
        return res.status(403).json({ error: "Not authorized" });
      }
      
      // Get all notifications with related data
      const [notifications] = await db.execute(`
        SELECT n.*, 
               b.customer_name, b.date, b.time, b.guests, b.status as booking_status,
               u.name as user_name, u.email as user_email
        FROM notifications n
        LEFT JOIN bookings b ON n.booking_id = b.id
        LEFT JOIN users u ON n.user_id = u.id
        ORDER BY n.created_at DESC
      `);
      
      res.json(notifications);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  });

  // Mark notification as read
  router.put("/:id/read", authenticateToken, async (req, res) => {
    const { id } = req.params;
    
    try {
      // Check if user is admin
      const [adminCheck] = await db.execute(
        "SELECT is_admin FROM users WHERE id = ?",
        [req.user.id]
      );

      if (!adminCheck.length || !adminCheck[0].is_admin) {
        return res.status(403).json({ error: "Not authorized" });
      }
      
      await db.execute(
        "UPDATE notifications SET read_status = 1 WHERE id = ?",
        [id]
      );
      
      res.json({ message: "Notification marked as read" });
    } catch (err) {
      console.error("Error updating notification:", err);
      res.status(500).json({ error: "Failed to update notification" });
    }
  });

  // Mark all notifications as read
  router.put("/read-all", authenticateToken, async (req, res) => {
    try {
      // Check if user is admin
      const [adminCheck] = await db.execute(
        "SELECT is_admin FROM users WHERE id = ?",
        [req.user.id]
      );

      if (!adminCheck.length || !adminCheck[0].is_admin) {
        return res.status(403).json({ error: "Not authorized" });
      }
      
      await db.execute("UPDATE notifications SET read_status = 1");
      
      // Emit event to update other admin clients
      io.emit('allNotificationsRead');
      
      res.json({ message: "All notifications marked as read" });
    } catch (err) {
      console.error("Error updating notifications:", err);
      res.status(500).json({ error: "Failed to update notifications" });
    }
  });

  return router;
};