const mongoose = require("mongoose");
const todoListSchema = new mongoose.Schema({
  text: String,
});
module.exports = mongoose.model("ToDoSchema", todoListSchema);
