const express = require("express");
const router = express.Router();
const {
  getAllWorkbooks,
  getWorkbooksById,
  submitWorkbook,
} = require("../../controllers/workbookController");
const csrf = require("csurf");

const csrfProtection = csrf({ cookie: true });

router.get("/", getAllWorkbooks);
router.get("/:id", getWorkbooksById);
router.post("/forms/:id/submit", csrfProtection, submitWorkbook);
module.exports = router;
