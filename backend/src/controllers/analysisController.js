// ============================================================
// ANALYSIS CONTROLLER
// Runs services ONE BY ONE with delay between each
// Prevents hitting Groq free tier rate limit (12,000 tokens/min)
// ============================================================

const { PrismaClient } = require("@prisma/client");
const { analyzeSEO }         = require("../services/seoService");
const { analyzeGrammar }     = require("../services/grammarService");
const { analyzeKeywords }    = require("../services/keywordService");
const { analyzeAIDetection } = require("../services/aiDetectionService");
const { analyzeSimilarity }  = require("../services/similarityService");
const { analyzeHumanizer }   = require("../services/humanizerService");

const prisma = new PrismaClient();

const SERVICE_MAP = {
  seo_optimization:     analyzeSEO,
  grammar_readability:  analyzeGrammar,
  keyword_analysis:     analyzeKeywords,
  ai_content_detection: analyzeAIDetection,
  plagiarism_checker:   analyzeSimilarity,
  content_humanizer:    analyzeHumanizer,
};

// Wait function — pauses between API calls
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function analyzeContent(req, res) {
  const { text, services } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({ message: "Content text is required." });
  }
  if (!services || !Array.isArray(services) || services.length === 0) {
    return res.status(400).json({ message: "At least one service must be selected." });
  }

  // Limit text to 2000 chars to reduce token usage per call
  const trimmedText = text.trim().substring(0, 2000);

  try {
    const upload = await prisma.contentUpload.create({
      data: {
        userId: req.user.id,
        mode: "text",
        originalText: trimmedText,
      },
    });

    const report = await prisma.report.create({
      data: {
        uploadId: upload.id,
        userId: req.user.id,
        services: JSON.stringify(services),
        status: "processing",
      },
    });

    // ── Run services ONE BY ONE ───────────────────────────────
    // 8 second delay between each call
    // With 6 services: takes about 60 seconds total
    // This keeps token usage well under the 12,000/min limit
    const validServices = services.filter(s => SERVICE_MAP[s]);
    const results = [];

    for (let i = 0; i < validServices.length; i++) {
      const key = validServices[i];

      console.log(`Running service ${i + 1}/${validServices.length}: ${key}`);

      try {
        const result = await SERVICE_MAP[key](trimmedText);
        results.push(result);
      } catch (serviceErr) {
        console.error(`Service ${key} failed:`, serviceErr.message);
        // Push error result so other services still show
        results.push({
          score: 0,
          badge: "Error",
          color: "warn",
          icon: "⚠",
          name: key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
          insights: [{ label: "Error", value: serviceErr.message }],
          recommendations: ["This service failed. Please try again in a few minutes."],
        });
      }

      // Wait 8 seconds between each service call
      // Prevents hitting Groq rate limit
      if (i < validServices.length - 1) {
        console.log(`Waiting 8 seconds before next service...`);
        await wait(8000);
      }
    }

    await prisma.report.update({
      where: { id: report.id },
      data: {
        status: "completed",
        results: JSON.stringify(results),
        completedAt: new Date(),
      },
    });

    await prisma.systemLog.create({
      data: {
        userId: req.user.id,
        action: "analyze",
        detail: `Services: ${services.join(", ")}`,
      },
    });

    return res.status(200).json({
      message: "Analysis complete.",
      reportId: report.id,
      results,
    });

  } catch (err) {
    console.error("Analysis error:", err);
    return res.status(500).json({ message: "Error during analysis. Please try again." });
  }
}

async function getReport(req, res) {
  const { id } = req.params;
  try {
    const report = await prisma.report.findUnique({
      where: { id: parseInt(id) },
      include: { upload: true },
    });

    if (!report) return res.status(404).json({ message: "Report not found." });
    if (report.userId !== req.user.id) return res.status(403).json({ message: "Access denied." });

    return res.status(200).json({
      report: {
        id: report.id,
        status: report.status,
        services: JSON.parse(report.services),
        results: report.results ? JSON.parse(report.results) : null,
        createdAt: report.createdAt,
        completedAt: report.completedAt,
        upload: {
          mode: report.upload.mode,
          fileName: report.upload.fileName,
        },
      },
    });
  } catch (err) {
    console.error("Get report error:", err);
    return res.status(500).json({ message: "Server error." });
  }
}

async function getReportHistory(req, res) {
  try {
    const reports = await prisma.report.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
      include: { upload: true },
    });

    const formatted = reports.map(r => ({
      id: r.id,
      status: r.status,
      services: JSON.parse(r.services),
      fileName: r.upload.fileName || "Pasted text",
      mode: r.upload.mode,
      createdAt: r.createdAt,
      completedAt: r.completedAt,
    }));

    const total      = reports.length;
    const completed  = reports.filter(r => r.status === "completed").length;
    const processing = reports.filter(r => r.status === "processing").length;
    const successRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return res.status(200).json({
      reports: formatted,
      stats: { total, completed, processing, successRate },
    });
  } catch (err) {
    console.error("Get history error:", err);
    return res.status(500).json({ message: "Server error." });
  }
}

async function deleteReport(req, res) {
  const { id } = req.params;
  try {
    const report = await prisma.report.findUnique({ where: { id: parseInt(id) } });
    if (!report) return res.status(404).json({ message: "Report not found." });
    if (report.userId !== req.user.id) return res.status(403).json({ message: "Access denied." });

    await prisma.contentUpload.delete({ where: { id: report.uploadId } });
    return res.status(200).json({ message: "Report deleted." });
  } catch (err) {
    console.error("Delete error:", err);
    return res.status(500).json({ message: "Server error." });
  }
}

module.exports = { analyzeContent, getReport, getReportHistory, deleteReport };