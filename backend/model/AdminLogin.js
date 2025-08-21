const mongoose = require("mongoose");

const AdminLoginSchema = new mongoose.Schema({
  email: String,
  password: String,
});

module.exports = mongoose.model("Admin", AdminLoginSchema);
