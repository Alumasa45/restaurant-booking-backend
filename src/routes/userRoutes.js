const express = require("express");

module.exports = (io) => {
  const router = express.Router();
  const {
    registerUser,
    loginUser,
    getAllUsers,
    getUserById,
    deleteUser,
  } = require("../controllers/userController")(io); // call with io ✅

  // Routes
  router.post("/register", registerUser);
  router.post("/login", loginUser);
  router.get("/", getAllUsers);
  router.get("/:id", getUserById);
  router.delete("/:id", deleteUser);

  return router; // <-- ✅ return the router!
};
