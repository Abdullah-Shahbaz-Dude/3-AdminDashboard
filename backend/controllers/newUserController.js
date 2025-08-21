const crypto = require("crypto");
const User = require("../model/Alex/newUser");
const Workbooks = require("../model/Alex/WorksheetsSchema"); // <-- make sure you have this model
const mongoose = require("mongoose");

// Create User
exports.createUser = async (req, res) => {
  const { email, name } = req.body;
  try {
    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({
        success: false, // indicates failure
        message: "User already present!",
        user: existingUser,
      });
    }

    // generate random token
    const accessToken = crypto.randomBytes(16).toString("hex");

    // create new user
    const newUser = new User({ email, name, accessToken });
    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: newUser,
    });
    console.log(newUser);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Assign Workbooks
exports.assignWorkbooks = async (req, res) => {
  try {
    const { id } = req.params;
    const { workbookIds } = req.body; // 👈 id = userId, workbookIds = array of IDs

    if (!Array.isArray(workbookIds) || workbookIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "workbookIds must be a non-empty array",
      });
    }

    // 1. Validate IDs exist in Workbooks collection
    const existingWorkbooks = await Workbooks.find({
      _id: { $in: workbookIds },
    }).select("_id"); // only fetch _id

    const validIds = existingWorkbooks.map((wb) => wb._id.toString());

    if (validIds.length !== workbookIds.length) {
      return res.status(400).json({
        success: true,
        message: "Some workbook IDs are invalid",
        validIds,
      });
    }

    // 2. Assign valid workbooks to user
    const user = await User.findByIdAndUpdate(
      id,
      { $set: { workbooks: validIds } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Workbooks assigned", user, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  console.log(req.params);
  const { id } = req.params;

  // Validate MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid user ID" });
  }

  try {
    // Find the user first
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Delete the user
    await User.findByIdAndDelete(id);

    res.json({
      message: "User and their workbooks deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("workbooks");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
