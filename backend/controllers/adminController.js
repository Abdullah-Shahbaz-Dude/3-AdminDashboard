const Admin = require("../model/AdminLogin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../middlewares/asyncHandler");
const User = require("../model/Alex/newUser");
const { check, validationResult } = require("express-validator");

const loginAdmin = asyncHandler(async (req, res) => {
  console.log(req.body); // Add this

  await Promise.all([
    check("email").isEmail().withMessage("Invalid email format").run(req),
    check("password").notEmpty().withMessage("Password is required").run(req),
  ]);

  // await check("email").isEmail().withMessage("Invalid email format").run(req);

  // // Validate password
  // await check("password")
  //   .notEmpty()
  //   .withMessage("Password is required")
  //   .run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new Error("Validation failed");
    err.statusCode = 400;
    err.errors = errors.array();
    throw err;
  }

  const { email, password } = req.body;

  const existedAdmin = await Admin.findOne({ email });

  if (!existedAdmin) {
    const err = new Error("Invalid credentials");
    err.statusCode = 401;
    throw err;
  }

  // Compare password

  const hashedPassword = existedAdmin.password;
  const isPasswordValid = await bcrypt.compare(password, hashedPassword);
  if (!isPasswordValid) {
    const err = new Error("Invalid credentials => password");
    err.statusCode = 401;
    throw err;
  }

  const token = jwt.sign({ id: existedAdmin._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.json({ token, email: existedAdmin.email });
});

const verifyAdmin = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    const err = new Error("No token provided");
    err.statusCode = 401;
    throw err;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      const err = new Error("Admin not found");
      err.statusCode = 401;
      throw err;
    }
    req.admin = admin;
    next();
  } catch (error) {
    const err = new Error("Invalid token");
    err.statusCode = 401;
    throw err;
  }
});

const validateToken = asyncHandler(async (req, res) => {
  console.log("validateToken: Request received for /admin/validate-token");
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    const err = new Error("No token provided");
    err.statusCode = 401;
    throw err;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select("email");
    if (!admin) {
      const err = new Error("Admin not found");
      err.statusCode = 401;
      throw err;
    }
    res.status(200).json({ valid: true, email: admin.email });
  } catch (error) {
    console.error("Validate token error:", error);
    const err = new Error("Invalid or expired token");
    err.statusCode = 401;
    throw err;
  }
});
// Get all users
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

const deleteUserByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    res.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  loginAdmin,
  getAllUsers,
  verifyAdmin,
  validateToken,
  deleteUserByAdmin,
};
