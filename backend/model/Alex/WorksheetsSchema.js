const mongoose = require("mongoose");
const questionModel = new mongoose.Schema(
  {
    title: { type: String },
    description: { type: String },
    link: { type: mongoose.Schema.Types.ObjectId, ref: "Workbooks" },
    questions: [
      {
        question: { type: String },
        answer: { type: String, default: "" },
      },
    ],
  },
  { timestamps: true }
);
module.exports = mongoose.model("Workbooks", questionModel);
