// PLAGIARISM CHECKER SERVICE — Professional Grade
const { callGroq } = require("./groqHelper");

async function analyzeSimilarity(text) {
  const prompt = `You are a professional plagiarism detection expert like Turnitin and Grammarly. Analyze the content for plagiarism, copied sentences, and originality issues.

CONTENT:
"""
${text.substring(0, 2500)}
"""

Check for: copied phrases, common templates, Wikipedia-style sentences, academic clichés, duplicate internal phrases, and unoriginal expressions. Be very specific about what looks copied and why.

Respond ONLY with valid JSON:
{
  "score": <originality score 0-100, where 100 = fully original>,
  "badge": "<Highly Original | Mostly Original | Partially Original | High Plagiarism Risk>",
  "similarityPercentage": <estimated similarity percentage 0-100>,
  "originalityPercentage": <100 minus similarity>,
  "plagiarismRisk": "<Low | Medium | High | Critical>",
  "flaggedSections": [
    { "text": "<exact copied/suspicious sentence from content>", "issue": "<why this is flagged>", "source": "<likely source type e.g. Wikipedia, common template, academic cliché>", "severity": "<High | Medium | Low>", "suggestion": "<how to rewrite this>" },
    { "text": "<sentence>", "issue": "<issue>", "source": "<source>", "severity": "<severity>", "suggestion": "<fix>" },
    { "text": "<sentence>", "issue": "<issue>", "source": "<source>", "severity": "<severity>", "suggestion": "<fix>" }
  ],
  "duplicatePhrases": ["<repeated phrase 1 found internally>", "<phrase 2>"],
  "commonTemplates": ["<template phrase 1 found>", "<template 2>"],
  "citationNeeded": ["<statement that needs a citation>", "<statement 2>"],
  "originalSections": ["<genuinely original part 1>", "<part 2>"],
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
    "<specific rewriting instruction for flagged section>",
    "<recommendation 2>",
    "<recommendation 3>",
    "<recommendation 4>",
    "Note: For academic submission, use Turnitin or iThenticate for full internet comparison"
  ]
}`;

  try {
    const raw = await callGroq(prompt);
    const result = JSON.parse(raw);
    return { score: result.score || 70, badge: result.badge || "Mostly Original", color: result.score >= 70 ? "green" : "warn", icon: "📄", name: "Plagiarism Checker", ...result };
  } catch (err) {
    console.error("Plagiarism Error:", err.message);
    return { score: 0, badge: "Error", color: "warn", icon: "📄", name: "Plagiarism Checker", insights: [{ label: "Error", value: err.message }], recommendations: ["Please check your GROQ_API_KEY and try again."] };
  }
}

module.exports = { analyzeSimilarity };