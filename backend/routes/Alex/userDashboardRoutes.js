const express = require("express");
const router = express.Router();
const {
  validateToken,
  getWorkbookByToken,
} = require("../../controllers/userDashboardController");

// Validate token route
// Now mounted under /api/user/validate/:token
router.get("/validate/:token", validateToken);

router.get("/workbook/:token/:workbookId", getWorkbookByToken);

module.exports = router;
