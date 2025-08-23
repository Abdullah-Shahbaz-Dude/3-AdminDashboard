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
const csrf = require("csurf");

const csrfProtection = csrf({ cookie: true });

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Reduced to 5 attempts
  message: "Too many login attempts, please try again later.",
});

router.post("/login", loginLimiter, csrfProtection, loginAdmin);
router.get("/validate", validateToken);
router.get("/users", verifyAdmin, getAllUsers);
router.delete("/users/:id", verifyAdmin, csrfProtection, deleteUserByAdmin);

module.exports = router;
