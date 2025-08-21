// controllers/userWorkbookController.js
const User = require("../model/Alex/newUser");
const Workbooks = require("../model/Alex/WorksheetsSchema");

// ✅ Validate token & return user + workbooks
exports.validateToken = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({ accessToken: token }).populate(
      "workbooks"
    );
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
    }

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Get workbook details by token + workbookId
exports.getWorkbookByToken = async (req, res) => {
  const { token, workbookId } = req.params;

  try {
    // 1. Find user by token
    const user = await User.findOne({ accessToken: token });
    if (!user) {
      return res.status(404).json({ success: false, message: "Invalid token" });
    }

    // 2. Check if workbookId exists in user’s assigned workbooks
    const hasWorkbook = user.workbooks.some(
      (wbId) => wbId.toString() === workbookId
    );

    if (!hasWorkbook) {
      return res.status(403).json({
        success: false,
        message: "Workbook not assigned to this user",
      });
    }

    // 3. Fetch workbook content
    const workbook = await Workbooks.findById(workbookId);
    console.log(workbook);
    if (!workbook) {
      return res
        .status(404)
        .json({ success: false, message: "Workbook not found" });
    }

    res.json({ success: true, workbook });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
