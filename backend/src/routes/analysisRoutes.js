// src/routes/analysisRoutes.js

const express = require("express");
const router = express.Router();
const {
  analyzeContent,
  getReport,
  getReportHistory,
  deleteReport,
} = require("../controllers/analysisController");
const authMiddleware = require("../middleware/authMiddleware");

// All analysis routes require authentication
router.post("/", authMiddleware, analyzeContent);              // POST /api/analyze
router.get("/history", authMiddleware, getReportHistory);      // GET  /api/analyze/history
router.get("/:id", authMiddleware, getReport);                 // GET  /api/analyze/:id
router.delete("/:id", authMiddleware, deleteReport);           // DELETE /api/analyze/:id

module.exports = router;
