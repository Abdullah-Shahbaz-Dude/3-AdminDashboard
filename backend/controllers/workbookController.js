const Workbook = require("../model/Alex/WorksheetsSchema");
const sendWorkbookEmail = require("../services/emailService");

exports.getAllWorkbooks = async (req, res) => {
  try {
    const workbooks = await Workbook.find();
    res.json(workbooks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getWorkbooksById = async (req, res) => {
  try {
    const workbook = await Workbook.findById(req.params.id);
    if (!workbook)
      return res.status(404).json({ message: "Workbook not found" });
    res.json(workbook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.submitWorkbook = async (req, res) => {
  const { answers, userName } = req.body;
  const workbookId = req.params.id;

  // console.log("📥 Submit route hit with ID:", workbookId); // ✅ req exists here

  try {
    await sendWorkbookEmail(workbookId, answers, userName);
    res.json({ success: true, message: "Form sent" });
  } catch (err) {
    console.error("❌ Error submitting workbook:", err.message);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
};
