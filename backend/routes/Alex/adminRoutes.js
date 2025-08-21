const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  loginAdmin,
  verifyAdmin,
  validateToken,
  deleteUserByAdmin,
} = require("../../controllers/adminController");
const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit to 5 requests per window
  message: "Too many login attempts, please try again later.",
});

router.post("/login", loginLimiter, loginAdmin);
router.get("/validate", validateToken);
router.get("/users", verifyAdmin, getAllUsers);
router.delete("/users/:id", verifyAdmin, deleteUserByAdmin);

module.exports = router;
