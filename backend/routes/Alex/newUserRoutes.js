const express = require("express");
const router = express.Router();
const {
  createUser,
  assignWorkbooks,
  deleteUser,
  getUserById,
} = require("../../controllers/newUserController");

// Create a new user
router.post("/", createUser);

// Assign workbooks to an existing user
router.patch("/:id/assign-workbooks", assignWorkbooks);

router.delete("/:id", deleteUser);

router.get("/:id", getUserById);

module.exports = router;
