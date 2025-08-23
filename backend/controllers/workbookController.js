const Workbook = require("../model/Alex/WorksheetsSchema");
const { check, validationResult } = require("express-validator");
const sendWorkbookEmail = require("../services/emailService");

exports.getAllWorkbooks = async (req, res) => {
  try {
    const workbooks = await Workbook.find();
    res.json({ success: true, workbooks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getWorkbooksById = async (req, res) => {
  await check("id").isMongoId().withMessage("Invalid workbook ID").run(req);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ success: false, message: errors.array()[0].msg });
  }

  try {
    const workbook = await Workbook.findById(req.params.id);
    if (!workbook) {
      return res
        .status(404)
        .json({ success: false, message: "Workbook not found" });
    }
    res.json({ success: true, workbook });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.submitWorkbook = async (req, res) => {
  await Promise.all([
    check("id").isMongoId().withMessage("Invalid workbook ID").run(req),
    check("answers")
      .isArray({ min: 1 })
      .withMessage("Answers must be a non-empty array")
      .run(req),
    check("userName").notEmpty().withMessage("User name is required").run(req),
  ]);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ success: false, message: errors.array()[0].msg });
  }

  const { answers, userName } = req.body;
  const workbookId = req.params.id;

  try {
    await sendWorkbookEmail(workbookId, answers, userName);
    res.json({ success: true, message: "Form submitted successfully" });
  } catch (error) {
    console.error("Error submitting workbook:", error.message);
    res.status(500).json({ success: false, message: "Failed to submit form" });
  }
};
