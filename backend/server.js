require("dotenv").config({ path: __dirname + "/.env" }); // load env at entry point
const express = require("express");
const cors = require("cors");
const { port, connectDB } = require("./config"); // centralized config
const cookieParser = require("cookie-parser");
const csrf = require("csurf");

// Routes
const adminRoutes = require("./routes/Alex/adminRoutes");
const workbookRoutes = require("./routes/Alex/workbookRoutes");
const newUserRoutes = require("./routes/Alex/newUserRoutes");
const userDashboardRoutes = require("./routes/Alex/userDashboardRoutes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// CSRF protection middleware
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  },
});

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(express.json());
app.use(cookieParser());

// Apply CSRF protection to all POST/PATCH/DELETE routes
app.use(csrfProtection);

app.get("/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// API Routes
app.use("/admin", adminRoutes);
app.use("/api/workbooks", workbookRoutes);
app.use("/api/user-dashboard/users", newUserRoutes);
app.use("/api/user-dashboard", userDashboardRoutes);

// Logout route (no CSRF protection needed)
app.post("/admin/logout", (req, res) => {
  res.clearCookie("auth_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.json({ success: true, message: "Logged out successfully" });
});

// Validate token route
app.get("/admin/validate", (req, res) => {
  const token = req.cookies.auth_token;
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ success: true, token, email: decoded.email });
  } catch (error) {
    res.clearCookie("auth_token");
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
});

app.use(errorHandler);

// Start server after DB connection
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
