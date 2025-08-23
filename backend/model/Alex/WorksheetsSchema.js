const mongoose = require("mongoose");
const WorkbookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    questions: [
      {
        question: { type: String, required: true },
        answerType: { type: String, enum: ["text", "number"], default: "text" },
        answer: { type: String, default: "" },
      },
    ],
  },
  { timestamps: true }
);
module.exports = mongoose.model("Workbook", WorkbookSchema);
