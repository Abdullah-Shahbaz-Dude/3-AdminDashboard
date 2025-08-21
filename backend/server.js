require("dotenv").config({ path: __dirname + "/.env" }); // load env at entry point
const express = require("express");
const cors = require("cors");
const { port, connectDB } = require("./config"); // centralized config

// Routes
const adminRoutes = require("./routes/Alex/adminRoutes");
const workbookRoutes = require("./routes/Alex/workbookRoutes");
const newUserRoutes = require("./routes/Alex/newUserRoutes");
const userDashboardRoutes = require("./routes/Alex/userDashboardRoutes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// API Routes
app.use("/admin", adminRoutes);
app.use("/api/workbooks", workbookRoutes);
app.use("/api/user-dashboard/users", newUserRoutes);
app.use("/api/user-dashboard", userDashboardRoutes);

app.use(errorHandler);

// Start server after DB connection
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
