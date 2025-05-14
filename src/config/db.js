require("dotenv").config(); // Load environment variables from .env
const mysql = require("mysql2");

// Create a connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "NewPassword123!",
    database: process.env.DB_NAME || "restaurant_booking",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Promisify the pool for async/await support
const promisePool = pool.promise();

// Test database connection
promisePool.getConnection()
    .then((connection) => {
        console.log("✅ Connected to MySQL Database");
        connection.release(); // Release connection after testing
    })
    .catch((err) => {
        console.error("❌ Database connection failed:", err.message);
    });

module.exports = promisePool;
