const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

dotenv.config();

const authRoutes = require("./src/routes/authRoutes");
const analysisRoutes = require("./src/routes/analysisRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// ─── MIDDLEWARE ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

// ─── FRONTEND PATH ────────────────────────────────────────────────────────────
// frontend folder is inside backend/ folder
const frontendPath = path.join(__dirname, "frontend");
console.log(`📁 Frontend path: ${frontendPath}`);
console.log(`📁 Frontend exists: ${fs.existsSync(frontendPath)}`);

app.use(express.static(frontendPath));

// ─── API ROUTES ────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/analyze", analysisRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "ContentIQ server is running." });
});

// ─── FRONTEND PAGE ROUTES ──────────────────────────────────────────────────────
const pages = [
  ["/",              "landing.html"],
  ["/login",         "login.html"],
  ["/register",      "register.html"],
  ["/dashboard",     "dashboard.html"],
  ["/uploadcontent", "uploadcontent.html"],
  ["/selectservices","selectservices.html"],
  ["/analyzing",     "analyzing.html"],
  ["/result",        "result.html"],
  ["/reporthistory", "reporthistory.html"],
  ["/profile",       "profile.html"],
];

pages.forEach(([route, file]) => {
  app.get(route, (req, res) => {
    res.sendFile(path.join(frontendPath, file));
  });
});

// ─── GLOBAL ERROR HANDLER ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error." });
});

// ─── START ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 ContentIQ server running at http://localhost:${PORT}`);
  console.log(`📁 Serving frontend from: ${frontendPath}`);
  console.log(`🔗 API available at: http://localhost:${PORT}/api\n`);
});