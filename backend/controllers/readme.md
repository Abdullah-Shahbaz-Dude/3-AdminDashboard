const Admin = require("../model/AdminLogin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../middlewares/asyncHandler");

const loginAdmin = async (req, res) => {
console.log(req.body); // Add this
const { email, password } = req.body;

try {
// const existedAdmin = await Admin.findOne({ email });
const existedAdmin = await Admin.findOne({ email });

    if (!existedAdmin)
      return res
        .status(400)
        .json({ message: "Admin not found in your data base" });

    const hashedPassword = existedAdmin.password;
    const comparePassword = await bcrypt.compare(password, hashedPassword);
    if (!comparePassword)
      return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: existedAdmin._id }, "SECRET_KEY", {
      expiresIn: "1h",
    });
    res.json({ token, email: existedAdmin.email });

} catch (error) {
res.status(500).json({ message: error.message });
}
};
module.exports = loginAdmin;

## WorkbookRoutes

const express = require("express");
const router = express.Router();
const Workbook = require("../../model/Alex/WorksheetsSchema");
const nodemailer = require("nodemailer");
require("dotenv").config();

// Get all workbooks
router.get("/", async (req, res) => {
try {
const workbooks = await Workbook.find();
res.json(workbooks);
} catch (err) {
res.status(500).json({ message: err.message });
}
});

// Get workbook by ID
router.get("/:id", async (req, res) => {
try {
const workbook = await Workbook.findById(req.params.id);
if (!workbook) {
return res.status(404).json({ message: "Workbook not found" });
}
res.json(workbook);
} catch (err) {
res.status(500).json({ message: err.message });
}
});

module.exports = router;
