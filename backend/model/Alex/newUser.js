const mongoose = require("mongoose");
const newUserSchema = new mongoose.Schema({
  email: { type: String },
  name: { type: String },
  password: { type: String },
  accessToken: { type: String },
  workbooks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Workbooks" }],
});

module.exports = mongoose.model("User", newUserSchema);
