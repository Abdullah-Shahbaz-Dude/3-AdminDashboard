const express = require("express");
const router = express.Router();
const {
  createUser,
  assignWorkbooks,
  deleteUser,
  getUserById,
} = require("../../controllers/newUserController");
const csrf = require("csurf");

const csrfProtection = csrf({ cookie: true });

router.post("/", csrfProtection, createUser);
router.patch("/:id/assign-workbooks", csrfProtection, assignWorkbooks);
router.delete("/:id", csrfProtection, deleteUser);
router.get("/:id", getUserById);

module.exports = router;
