const Admin = require("../model/AdminLogin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../middlewares/asyncHandler");
const User = require("../model/Alex/newUser");
const { check, validationResult } = require("express-validator");

const loginAdmin = asyncHandler(async (req, res) => {
  await Promise.all([
    check("email").isEmail().withMessage("Invalid email format").run(req),
    check("password").notEmpty().withMessage("Password is required").run(req),
  ]);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ success: false, message: errors.array()[0].msg });
  }

  const { email, password } = req.body;

  const existedAdmin = await Admin.findOne({ email });
  if (!existedAdmin) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  }

  const isPasswordValid = await bcrypt.compare(password, existedAdmin.password);
  if (!isPasswordValid) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: existedAdmin._id, email: existedAdmin.email },
    process.env.JWT_SECRET,
    {
      expiresIn: "15m", // Reduced to 15 minutes for better security
    }
  );

  res.cookie("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.json({ success: true, email: existedAdmin.email });
});

const verifyAdmin = asyncHandler(async (req, res, next) => {
  const token = req.cookies.auth_token;
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res
        .status(401)
        .json({ success: false, message: "Admin not found" });
    }
    req.admin = admin;
    req.token = token; // Attach token for validateToken
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
});

const validateToken = asyncHandler(async (req, res) => {
  const token = req.cookies.auth_token;
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select("email");
    if (!admin) {
      return res
        .status(401)
        .json({ success: false, message: "Admin not found" });
    }
    res.status(200).json({ success: true, token, email: admin.email });
  } catch (error) {
    res.clearCookie("auth_token");
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
});

const getAllUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const users = await User.find()
    .select("-accessToken")
    .populate("workbooks", "title")
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments();

  res.status(200).json({
    success: true,
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});

const deleteUserByAdmin = asyncHandler(async (req, res) => {
  await check("id").isMongoId().withMessage("Invalid user ID").run(req);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ success: false, message: errors.array()[0].msg });
  }

  const { id } = req.params;
  const deletedUser = await User.findByIdAndDelete(id);
  if (!deletedUser) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  res.json({ success: true, message: "User deleted successfully" });
});

module.exports = {
  loginAdmin,
  getAllUsers,
  verifyAdmin,
  validateToken,
  deleteUserByAdmin,
};
