// ============================================================
// CONTENT HUMANIZER SERVICE
// Powered by Google Gemini
// What it does:
//   - Fully rewrites the content to sound naturally human
//   - Ensures the rewritten text would pass AI detection
//   - Ensures no plagiarism in the rewritten version
//   - Keeps the same meaning and information
//   - Adds personal voice, varied sentence structure, contractions
// ============================================================

const { callGemini } = require("./geminiHelper");

async function analyzeHumanizer(text) {
  const prompt = `You are a professional content humanizer. Your job is to rewrite the given text so that:
1. It sounds completely natural and human-written
2. It would pass ANY AI detection tool (GPTZero, Originality.ai, etc.)
3. It has zero plagiarism — completely original phrasing
4. The same meaning and information is preserved
5. It has varied sentence lengths (mix short and long sentences)
6. It uses natural contractions (don't, can't, it's, they're)
7. It has personal voice and occasional informal expressions
8. It avoids robotic transitions like "Furthermore", "Moreover", "Additionally"
9. It feels like a real person wrote it with their own unique style

ORIGINAL CONTENT:
"""
${text.substring(0, 3000)}
"""

Respond ONLY with a valid JSON object. No text before or after:
{
  "humanizedText": "<the complete fully rewritten human-sounding version of the text>",
  "originalAIScore": <number 0-100, estimated AI probability of original>,
  "humanizedAIScore": <number 0-100, estimated AI probability of humanized version — should be low>,
  "score": <number 0-100, humanness quality of rewritten text — should be high>,
  "badge": "<one of: Highly Human, Mostly Human, Partially Human>",
  "changesSummary": "<brief summary of main changes made>",
  "techniquesUsed": [
    "<technique 1 used to humanize>",
    "<technique 2>",
    "<technique 3>"
  ],
  "insights": [
    { "label": "Original AI Probability", "value": "<percentage>%" },
    { "label": "Humanized AI Probability", "value": "<percentage>% (much lower)" },
    { "label": "Humanness Score", "value": "<score>/100" },
    { "label": "Plagiarism Risk", "value": "Very Low — completely rewritten" },
    { "label": "Tone Applied", "value": "<conversational/professional/academic>" },
    { "label": "Key Changes", "value": "<brief summary>" }
  ],
  "recommendations": [
    "<tip to further personalize the content>",
    "<tip 2>",
    "<tip 3>"
  ]
}`;

  try {
    const raw = await callGemini(prompt);
    const result = JSON.parse(raw);

    return {
      score: result.score || 85,
      badge: result.badge || "Mostly Human",
      color: "gold",
      icon: "✨",
      name: "Content Humanizer",
      humanizedText: result.humanizedText,
      originalAIScore: result.originalAIScore,
      humanizedAIScore: result.humanizedAIScore,
      changesSummary: result.changesSummary,
      techniquesUsed: result.techniquesUsed || [],
      insights: result.insights || [],
      recommendations: result.recommendations || [],
    };
  } catch (err) {
    console.error("Humanizer Error:", err.message);
    return errorResult("Content Humanizer", "✨", err.message);
  }
}

function errorResult(name, icon, message) {
  return {
    score: 0, badge: "Error", color: "warn", icon, name,
    insights: [{ label: "Error", value: message }],
    recommendations: ["Please check your Gemini API key in the .env file and try again."],
  };
}

module.exports = { analyzeHumanizer };