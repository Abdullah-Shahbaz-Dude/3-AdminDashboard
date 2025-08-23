const crypto = require("crypto");
const User = require("../model/Alex/newUser");
const Workbooks = require("../model/Alex/WorksheetsSchema");
const mongoose = require("mongoose");
const { check, validationResult } = require("express-validator");

exports.createUser = async (req, res) => {
  await Promise.all([
    check("email").isEmail().withMessage("Invalid email format").run(req),
    check("name").notEmpty().withMessage("Name is required").run(req),
  ]);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ success: false, message: errors.array()[0].msg });
  }

  const { email, name } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({
        success: false,
        message: "User already exists",
        user: existingUser,
      });
    }

    const accessToken = crypto.randomBytes(16).toString("hex");
    const newUser = new User({ email, name, accessToken });
    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.assignWorkbooks = async (req, res) => {
  await Promise.all([
    check("id").isMongoId().withMessage("Invalid user ID").run(req),
    check("workbookIds")
      .isArray({ min: 1 })
      .withMessage("workbookIds must be a non-empty array")
      .run(req),
    check("workbookIds.*")
      .isMongoId()
      .withMessage("Invalid workbook ID")
      .run(req),
  ]);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ success: false, message: errors.array()[0].msg });
  }

  try {
    const { id } = req.params;
    const { workbookIds } = req.body;

    const existingWorkbooks = await Workbooks.find({
      _id: { $in: workbookIds },
    }).select("_id");

    const validIds = existingWorkbooks.map((wb) => wb._id.toString());
    if (validIds.length !== workbookIds.length) {
      return res.status(400).json({
        success: false,
        message: "Some workbook IDs are invalid",
      });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { $set: { workbooks: validIds } },
      { new: true }
    ).populate("workbooks");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "Workbooks assigned", user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  await check("id").isMongoId().withMessage("Invalid user ID").run(req);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ success: false, message: errors.array()[0].msg });
  }

  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    await User.findByIdAndDelete(id);
    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  await check("id").isMongoId().withMessage("Invalid user ID").run(req);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ success: false, message: errors.array()[0].msg });
  }

  try {
    const user = await User.findById(req.params.id).populate("workbooks");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
