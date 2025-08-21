const connectDB = require("./db");

module.exports = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || "default_secret",
  connectDB, // export DB connection function
};
