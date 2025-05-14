const jwt = require("jsonwebtoken");

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWNoaW13YXppcmlAZ21haWwuY29tIiwiaWF0IjoxNzQyNzI0NDU1LCJleHAiOjE3NDI3MjgwNTV9.HCTXzAw6dtdp4RMeQDogzlVSjft4lkxbsWTp82a1XZY";

try {
    const decoded = jwt.verify(token, "NewPassword123!");
    console.log("Token is valid ✅", decoded);
} catch (err) {
    console.error("Invalid token ❌", err.message);
}
