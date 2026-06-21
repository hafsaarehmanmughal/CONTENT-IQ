// GRAMMAR & READABILITY SERVICE — Fixed JSON truncation issue
const { callGroq } = require("./groqHelper");

async function analyzeGrammar(text) {
  // Limit text to 1500 chars to prevent JSON truncation
  const shortText = text.trim().substring(0, 1500);

  const prompt = `You are a professional grammar expert like Grammarly. Analyze and correct the following text.

TEXT:
"""
${shortText}
"""

Find ALL grammar, spelling, punctuation errors. Return ONLY valid JSON, no extra text:
{
  "score": <number 0-100>,
  "badge": "<Excellent|Good|Needs Work|Poor>",
  "totalErrors": <number>,
  "grammarErrors": [
    { "original": "<wrong>", "corrected": "<fixed>", "type": "<error type>", "explanation": "<why>" },
    { "original": "<wrong>", "corrected": "<fixed>", "type": "<type>", "explanation": "<why>" }
  ],
  "spellingErrors": [
    { "original": "<misspelled>", "corrected": "<correct>" }
  ],
  "styleIssues": [
    { "issue": "<problem>", "suggestion": "<fix>" }
  ],
  "readabilityScore": <number 0-100>,
  "readabilityLevel": "<Very Easy|Easy|Standard|Difficult|Very Difficult>",
  "gradeLevel": "<e.g. Grade 8>",
  "toneAssessment": "<Formal|Informal|Academic|Conversational>",
  "passiveVoiceCount": <number>,
  "correctedText": "<complete corrected version of the entire text with ALL errors fixed>",
  "insights": [
    { "label": "Grammar Score", "value": "<score>/100" },
    { "label": "Total Errors Found", "value": "<number> errors corrected" },
    { "label": "Grammar Errors", "value": "<number>" },
    { "label": "Spelling Errors", "value": "<number>" },
    { "label": "Readability Score", "value": "<score>/100 — <level>" },
    { "label": "Grade Level", "value": "<grade>" },
    { "label": "Tone", "value": "<tone>" },
    { "label": "Passive Voice", "value": "<number> instances found" }
  ],
  "recommendations": [
    "<specific grammar tip>",
    "<readability tip>",
    "<style tip>",
    "<vocabulary tip>"
  ]
}`;

  try {
    const raw = await callGroq(prompt);
    const result = JSON.parse(raw);
    return {
      score: result.score || 70,
      badge: result.badge || "Good",
      color: result.score >= 60 ? "gold" : "warn",
      icon: "📝",
      name: "Grammar & Readability",
      ...result,
    };
  } catch (err) {
    console.error("Grammar Error:", err.message);
    return {
      score: 0, badge: "Error", color: "warn", icon: "📝",
      name: "Grammar & Readability",
      insights: [{ label: "Error", value: err.message }],
      recommendations: ["Please try again with shorter text (under 1500 characters)."],
    };
  }
}

module.exports = { analyzeGrammar };