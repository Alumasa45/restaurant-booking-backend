const express = require("express");
const db = require("../config/db");
const { getRestaurants, getRestaurantById } = require("../controllers/restaurantController");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
      const [rows] = await db.query("SELECT * FROM restaurants"); // Adjust table name if different
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

module.exports = router;
