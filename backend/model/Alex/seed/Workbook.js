// models/Workbook.js
const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: String,
  answer: String,
});

const workbookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  link: String,
  questions: [questionSchema],
});

module.exports = mongoose.model("Workbook", workbookSchema);
