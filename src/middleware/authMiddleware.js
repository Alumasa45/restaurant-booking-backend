const jwt = require("jsonwebtoken");

exports.authenticateToken = (req, res, next) => {
    // Extract token from the Authorization header
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    // Debugging: log the token
    console.log("Received Token:", token);

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        console.log("JWT_SECRET:", process.env.JWT_SECRET); // Log the JWT secret for debugging
        if (err) {
            // Debugging: log the error
            console.error("JWT Verification Error:", err);
            return res.status(403).json({ error: "Invalid token." });
        }

        console.log("Decoded User:", user); 
        req.user = user;
        
        // Debugging: log the user info (can be removed after debugging)
        console.log("Verified User:", user);

        next(); // This should only be called once
    });
};

exports.admin = (req, res, next) => {
    // First check if user exists on the request object
    if (!req.user) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    // Check if user has admin role
    if (req.user.role !== 'admin') {
        console.log("Access denied: User is not an admin. User role:", req.user.role);
        return res.status(403).json({ error: "Access denied. Admin privileges required." });
    }

    // User is admin, proceed
    console.log("Admin access granted for user:", req.user.id);
    next();
};