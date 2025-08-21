const bcrypt = require("bcrypt");
const Admin = require("../model/AdminLogin");
const { default: mongoose } = require("mongoose");
require("dotenv").config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    const findAdmin = await Admin.findOne({ email });
    if (findAdmin) {
      console.log("admin is existed");
      return;
    }

    const salRounds = 10;
    const hashedPassword = await bcrypt.hash(password, salRounds);
    const newAdmin = new Admin({
      email,
      password: hashedPassword,
    });

    await newAdmin.save();
    console.log("Admin user created");
  } catch (error) {
    console.log("Error creating admin:", error);
  } finally {
    await mongoose.disconnect();
  }
};
createAdmin();
