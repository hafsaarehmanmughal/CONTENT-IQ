// ============================================================
// AI CONTENT DETECTION SERVICE
// Powered by Google Gemini
// What it does:
//   - Accurately detects whether text was written by AI or human
//   - Highlights exactly which sentences/paragraphs are AI-written
//   - Gives confidence score and detailed reasoning
//   - Explains WHY it thinks it is AI or human
// ============================================================

const { callGemini } = require("./geminiHelper");

async function analyzeAIDetection(text) {
  const prompt = `You are an expert AI content detection system trained to identify AI-generated text. Analyze the following content carefully.

CONTENT TO ANALYZE:
"""
${text.substring(0, 3000)}
"""

Analyze this text for signs of AI generation. Look for:
- Overly formal or uniform sentence structures
- Repetitive use of transition words (Furthermore, Moreover, Additionally, In conclusion)
- Lack of personal voice, opinions, or emotions
- Too-perfect grammar and structure
- Generic statements without specific details
- Unnatural flow that feels templated
- Absence of contractions, colloquialisms, or natural speech patterns
- Suspiciously balanced paragraphs

Respond ONLY with a valid JSON object. No text before or after:
{
  "aiProbability": <number 0-100, where 100 = definitely AI written>,
  "score": <number 0-100, where higher = more human, so this is 100 minus aiProbability>,
  "badge": "<one of: Definitely Human, Likely Human, Mixed Content, Likely AI, Definitely AI>",
  "verdict": "<one clear sentence verdict>",
  "flaggedSentences": [
    "<exact sentence from the text that seems AI-written>",
    "<another flagged sentence>"
  ],
  "humanSentences": [
    "<sentence that seems naturally human-written>"
  ],
  "detectionReasons": [
    "<specific reason 1 why this seems AI or human>",
    "<specific reason 2>",
    "<specific reason 3>"
  ],
  "insights": [
    { "label": "AI Probability", "value": "<percentage>% — <badge>" },
    { "label": "Verdict", "value": "<one line verdict>" },
    { "label": "Writing Style", "value": "<assessment of writing style>" },
    { "label": "Sentence Structure", "value": "<uniform/varied/mixed assessment>" },
    { "label": "Personal Voice", "value": "<present/absent/weak>" },
    { "label": "Flagged Sections", "value": "<number> sentence(s) flagged as AI-written" }
  ],
  "recommendations": [
    "<specific advice to make this text less detectable as AI>",
    "<specific advice 2>",
    "<specific advice 3>",
    "<specific advice 4>"
  ]
}`;

  try {
    const raw = await callGemini(prompt);
    const result = JSON.parse(raw);

    const aiProb = result.aiProbability || 50;
    const humanScore = 100 - aiProb;

    return {
      score: humanScore,
      badge: result.badge || "Mixed Content",
      color: humanScore >= 60 ? "green" : "warn",
      icon: "🤖",
      name: "AI Content Detection",
      aiProbability: aiProb,
      verdict: result.verdict,
      flaggedSentences: result.flaggedSentences || [],
      humanSentences: result.humanSentences || [],
      detectionReasons: result.detectionReasons || [],
      insights: result.insights || [],
      recommendations: result.recommendations || [],
    };
  } catch (err) {
    console.error("AI Detection Error:", err.message);
    return errorResult("AI Content Detection", "🤖", err.message);
  }
}

function errorResult(name, icon, message) {
  return {
    score: 0, badge: "Error", color: "warn", icon, name,
    insights: [{ label: "Error", value: message }],
    recommendations: ["Please check your Gemini API key in the .env file and try again."],
  };
}

module.exports = { analyzeAIDetection };