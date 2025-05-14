const rateLimit = require("express-rate-limit");

// Define rate limits for different routes
const bookingLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // Allow only 5 requests per 10 minutes per IP
  message: { error: "Too many requests, please try again later." },
});

module.exports = { bookingLimiter };
