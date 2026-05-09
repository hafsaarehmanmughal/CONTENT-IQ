// ============================================================
// GRAMMAR & READABILITY SERVICE
// Powered by Google Gemini
// What it does:
//   - Finds ALL grammar, spelling, punctuation errors
//   - Returns the fully corrected version of the text
//   - Shows exactly what was wrong and what was fixed
//   - Improves readability and sentence structure
//   - Gives a readability grade level
// ============================================================

const { callGemini } = require("./geminiHelper");

async function analyzeGrammar(text) {
  const prompt = `You are a professional grammar expert and editor. Analyze and correct the following text.

CONTENT TO ANALYZE:
"""
${text.substring(0, 3000)}
"""

Your tasks:
1. Find ALL grammar mistakes (subject-verb agreement, tense errors, etc.)
2. Find ALL spelling mistakes
3. Find ALL punctuation errors
4. Fix awkward or unclear sentences
5. Improve overall readability
6. Return the fully corrected version

Respond ONLY with a valid JSON object. No text before or after:
{
  "score": <number 0-100 grammar quality of ORIGINAL text>,
  "badge": "<one of: Excellent, Good, Needs Work, Poor>",
  "correctedText": "<the complete corrected version of the entire text with ALL errors fixed>",
  "totalErrors": <total number of errors found>,
  "grammarErrors": [
    { "original": "<exact wrong text>", "corrected": "<corrected version>", "explanation": "<what was wrong>" },
    { "original": "<wrong>", "corrected": "<fixed>", "explanation": "<why>" }
  ],
  "spellingErrors": [
    { "original": "<misspelled word>", "corrected": "<correct spelling>" }
  ],
  "readabilityLevel": "<e.g. Grade 8, College Level, Easy, etc.>",
  "readabilityScore": <Flesch reading ease score 0-100>,
  "insights": [
    { "label": "Grammar Score", "value": "<score>/100" },
    { "label": "Total Errors Found", "value": "<number> error(s) corrected" },
    { "label": "Grammar Errors", "value": "<number> grammar mistake(s)" },
    { "label": "Spelling Errors", "value": "<number> spelling mistake(s)" },
    { "label": "Readability Level", "value": "<level>" },
    { "label": "Overall Quality", "value": "<brief assessment>" }
  ],
  "recommendations": [
    "<specific grammar improvement tip>",
    "<readability improvement tip>",
    "<style improvement tip>",
    "<general writing advice>"
  ]
}`;

  try {
    const raw = await callGemini(prompt);
    const result = JSON.parse(raw);

    return {
      score: result.score || 70,
      badge: result.badge || "Good",
      color: (result.score >= 60) ? "gold" : "warn",
      icon: "📝",
      name: "Grammar & Readability",
      correctedText: result.correctedText,
      totalErrors: result.totalErrors || 0,
      grammarErrors: result.grammarErrors || [],
      spellingErrors: result.spellingErrors || [],
      readabilityLevel: result.readabilityLevel,
      readabilityScore: result.readabilityScore,
      insights: result.insights || [],
      recommendations: result.recommendations || [],
    };
  } catch (err) {
    console.error("Grammar Error:", err.message);
    return errorResult("Grammar & Readability", "📝", err.message);
  }
}

function errorResult(name, icon, message) {
  return {
    score: 0, badge: "Error", color: "warn", icon, name,
    insights: [{ label: "Error", value: message }],
    recommendations: ["Please check your Gemini API key in the .env file and try again."],
  };
}

module.exports = { analyzeGrammar };