// AI CONTENT DETECTION SERVICE — Professional Grade
const { callGroq } = require("./groqHelper");

async function analyzeAIDetection(text) {
  const prompt = `You are an expert AI content detection system like GPTZero and Originality.ai. Analyze if the text was written by AI or human.

CONTENT:
"""
${text.substring(0, 2500)}
"""

Analyze carefully for: uniform sentence structure, robotic transitions (Furthermore/Moreover/Additionally), lack of personal voice, perfect grammar, generic statements, no contractions, templated paragraphs, and unnatural flow.

Respond ONLY with valid JSON:
{
  "aiProbability": <number 0-100, where 100 = definitely AI>,
  "score": <same as aiProbability — the AI probability percentage>,
  "badge": "<Definitely Human | Likely Human | Mixed Content | Likely AI | Definitely AI>",
  "verdict": "<one clear sentence verdict>",
  "mixedContent": <true if both human and AI sections detected>,
  "sentenceAnalysis": [
    { "sentence": "<exact sentence from text>", "type": "<AI | Human | Mixed>", "reason": "<why>" },
    { "sentence": "<sentence>", "type": "<AI | Human | Mixed>", "reason": "<why>" },
    { "sentence": "<sentence>", "type": "<AI | Human | Mixed>", "reason": "<why>" }
  ],
  "aiIndicators": [
    { "indicator": "<specific AI pattern found>", "severity": "<High | Medium | Low>", "example": "<example from text>" },
    { "indicator": "<pattern>", "severity": "<High | Medium | Low>", "example": "<example>" },
    { "indicator": "<pattern>", "severity": "<High | Medium | Low>", "example": "<example>" }
  ],
  "humanIndicators": [
    "<element that seems human-written>",
    "<element 2>"
  ],
  "writingPatterns": {
    "sentenceVariety": "<High | Medium | Low>",
    "vocabularyRichness": "<High | Medium | Low>",
    "personalVoice": "<Present | Absent | Weak>",
    "emotionalDepth": "<Present | Absent | Weak>",
    "transitionWords": "<Natural | Robotic | Mixed>"
  },
  "insights": [
    { "label": "AI Probability", "value": "<percentage>% — <badge>" },
    { "label": "Verdict", "value": "<verdict>" },
    { "label": "Sentence Variety", "value": "<level>" },
    { "label": "Personal Voice", "value": "<present/absent>" },
    { "label": "AI Patterns Found", "value": "<number> patterns detected" },
    { "label": "Most Suspicious", "value": "<most AI-like sentence snippet>" },
    { "label": "Writing Style", "value": "<overall assessment>" },
    { "label": "Mixed Content", "value": "<yes/no with brief explanation>" }
  ],
  "recommendations": [
    "<specific fix to reduce AI detection>",
    "<fix 2>",
    "<fix 3>",
    "<fix 4>"
  ]
}`;

  try {
    const raw = await callGroq(prompt);
    const result = JSON.parse(raw);
    const aiProb = result.aiProbability || 50;
    return { score: aiProb, badge: result.badge || "Mixed Content", color: aiProb >= 60 ? "warn" : "green", icon: "🤖", name: "AI Content Detection", aiProbability: aiProb, humanScore: 100 - aiProb, ...result };
  } catch (err) {
    console.error("AI Detection Error:", err.message);
    return { score: 0, badge: "Error", color: "warn", icon: "🤖", name: "AI Content Detection", insights: [{ label: "Error", value: err.message }], recommendations: ["Please check your GROQ_API_KEY and try again."] };
  }
}

module.exports = { analyzeAIDetection };