const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const api = require("./routes/api");
const profileRoutes = require("./routes/profileRoutes");
const db = require("./models");

const app = express();

// ========== DATABASE SYNC ==========
const cleanAndSyncDb = async () => {
  try {
    // Drop old course tables if they exist to keep the database clean
    await db.sequelize.query("SET FOREIGN_KEY_CHECKS = 0;");
    await db.sequelize.query("DROP TABLE IF EXISTS course_objectives, course_outcomes, course_reasons, course_targets, lessons, sections, reviews, courses;");
    await db.sequelize.query("SET FOREIGN_KEY_CHECKS = 1;");
    console.log("✓ Đã dọn dẹp các bảng khóa học cũ.");

    await db.sequelize.sync({ alter: true });
    console.log("✓ Đồng bộ database thành công.");

    const { seedProducts } = require("./utils/seed_products");
    await seedProducts();
  } catch (err) {
    console.error("❌ Lỗi đồng bộ/khởi tạo database:", err);
    process.exit(1);
  }
};

cleanAndSyncDb();

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
