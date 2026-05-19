const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const authRoutes = require("./routes/authRoutes");
const api = require("./routes/api");
const profileRoutes = require("./routes/profileRoutes");
const db = require("./models");

const app = express();

// ========== DATABASE SYNC ==========
const { seedMoreCourses } = require("./utils/seed_more");
db.sequelize.sync({ alter: true }).then(() => {
  seedMoreCourses();
}).catch(err => {
  console.error("❌ Lỗi đồng bộ database:", err);
  process.exit(1);
});

// ========== MIDDLEWARE ==========
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS - Cho phép các request từ client
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// ========== ROUTES ==========
const homeController = require("./controllers/homeController");
app.get("/api/home-data", homeController.getHomePageData);

app.use("/api", api);
app.use("/api/profile", profileRoutes);

// Route kiểm tra server
app.get("/", (req, res) => {
  res.json({
    message: "HELLO_FROM_ANTIGRAVITY",
    version: "1.0.0",
    status: "running",
  });
});

// ========== ERROR HANDLING ==========
app.use((err, req, res, next) => {
  console.error("Error:", err);

  const status = err.status || 500;
  const message = err.message || "Lỗi server nội bộ";

  res.status(status).json({
    success: false,
    message: message,
    ...(process.env.NODE_ENV === "development" && { error: err.message }),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint không tồn tại",
  });
});

// ========== START SERVER ==========
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════╗
  ║   API Server đang chạy trên cổng ${PORT}    ║
  ║   URL: http://localhost:${PORT}        ║
  ╚══════════════════════════════════════════╝
  `);
  console.log("✓ CORS được bật");
  console.log("✓ JSON parser được kích hoạt");
  console.log(`✓ Chế độ: ${process.env.NODE_ENV || "development"}`);
});

module.exports = app;
