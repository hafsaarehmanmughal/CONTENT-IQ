// PLAGIARISM CHECKER SERVICE — Fixed missing reason field
const { callGroq } = require("./groqHelper");

async function analyzeSimilarity(text) {
  const shortText = text.trim().substring(0, 1500);

  const prompt = `You are a professional plagiarism detection expert like Turnitin. Analyze this content for plagiarism and originality.

CONTENT:
"""
${shortText}
"""

Return ONLY valid JSON, no extra text:
{
  "score": <originality score 0-100>,
  "badge": "<Highly Original|Mostly Original|Partially Original|High Plagiarism Risk>",
  "similarityPercentage": <number 0-100>,
  "originalityPercentage": <100 minus similarity>,
  "plagiarismRisk": "<Low|Medium|High|Critical>",
  "flaggedSections": [
    { "text": "<exact sentence>", "reason": "<why this is flagged — be specific>", "source": "<Wikipedia|Common template|Academic cliche|Web content>", "severity": "High", "suggestion": "<how to rewrite>" },
    { "text": "<sentence>", "reason": "<specific reason>", "source": "<source type>", "severity": "Medium", "suggestion": "<fix>" },
    { "text": "<sentence>", "reason": "<specific reason>", "source": "<source type>", "severity": "Low", "suggestion": "<fix>" }
  ],
  "duplicatePhrases": ["<repeated phrase1>", "<phrase2>"],
  "commonTemplates": ["<template phrase1>", "<template2>"],
  "citationNeeded": ["<statement needing citation>"],
  "originalSections": ["<genuinely original part>", "<part2>"],
  "insights": [
    { "label": "Originality Score", "value": "<score>%" },
    { "label": "Similarity Score", "value": "<percentage>%" },
    { "label": "Plagiarism Risk", "value": "<risk level>" },
    { "label": "Flagged Sections", "value": "<number> sections need attention" },
    { "label": "Common Templates Found", "value": "<number> template phrases detected" },
    { "label": "Citations Needed", "value": "<number> statements need citation" },
    { "label": "Internal Duplicates", "value": "<number> repeated phrases" },
    { "label": "Important Note", "value": "Structural analysis only — not web-indexed like Turnitin" }
  ],
  "recommendations": [
    "<specific rewriting instruction>",
    "<recommendation 2>",
    "<recommendation 3>",
    "<recommendation 4>",
    "Note: For academic submission, use Turnitin or iThenticate for full internet comparison"
  ]
}`;

  try {
    const raw = await callGroq(prompt);
    const result = JSON.parse(raw);
    return {
      score: result.score || 70,
      badge: result.badge || "Mostly Original",
      color: result.score >= 70 ? "green" : "warn",
      icon: "📄",
      name: "Plagiarism Checker",
      ...result,
    };
  } catch (err) {
    console.error("Plagiarism Error:", err.message);
    return {
      score: 0, badge: "Error", color: "warn", icon: "📄",
      name: "Plagiarism Checker",
      insights: [{ label: "Error", value: err.message }],
      recommendations: ["Please check your GROQ_API_KEY and try again."],
    };
  }
}

module.exports = { analyzeSimilarity };