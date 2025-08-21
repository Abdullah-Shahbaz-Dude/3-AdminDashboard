const express = require("express");
const router = express.Router();
const workbookController = require("../../controllers/workbookController");

router.get("/", workbookController.getAllWorkbooks);

router.get("/:id", workbookController.getWorkbooksById);
console.log("✅ workbookRoutes loaded");
router.post("/forms/:id/submit", workbookController.submitWorkbook);
// console.log("📥 Submit hit:", req.params.id);

module.exports = router;
