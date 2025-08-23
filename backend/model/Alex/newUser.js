const mongoose = require("mongoose");
const newUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  accessToken: { type: String, required: true, unique: true },
  workbooks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Workbook" }],
});
module.exports = mongoose.model("User", newUserSchema);
