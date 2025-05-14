const express = require('express');
const router = express.Router();
const db = require('../config/db'); // adjust path based on your setup

// POST /api/contact
router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const sql = 'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)';
    await db.query(sql, [name, email, message]);

    res.status(200).json({ success: true, message: 'Message received!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
