// ============================================================
// PLAGIARISM CHECKER SERVICE
// Powered by Google Gemini
// What it does:
//   - Detects sentences/phrases that appear copied or plagiarized
//   - Identifies common phrases that match known web content
//   - Flags sentences that look like direct copies from sources
//   - Gives an originality score
//   - Suggests how to rewrite plagiarized sections
// NOTE: Cannot check live internet (requires Turnitin database)
//       But accurately identifies copied phrasing patterns,
//       well-known quotes, and common template text
// ============================================================

const { callGemini } = require("./geminiHelper");

async function analyzeSimilarity(text) {
  const prompt = `You are a professional plagiarism detection expert. Analyze the following text for plagiarism and originality.

CONTENT TO ANALYZE:
"""
${text.substring(0, 3000)}
"""

Carefully examine this text for:
1. Sentences or phrases that appear to be copied from well-known sources, books, websites, or common templates
2. Generic phrases that are widely used across the internet
3. Text that matches common academic or professional writing templates
4. Famous quotes or well-known statements used without citation
5. Overly common expressions that reduce originality
6. Sections that sound like they were copied from Wikipedia or similar sources

Important: Be specific about which sentences look plagiarized and why.

Respond ONLY with a valid JSON object. No text before or after:
{
  "originalityScore": <number 0-100, where 100 = completely original>,
  "score": <same as originalityScore>,
  "badge": "<one of: Highly Original, Mostly Original, Partially Original, High Plagiarism Risk>",
  "plagiarismRisk": "<Low / Medium / High>",
  "flaggedSections": [
    {
      "text": "<exact sentence or phrase from the content>",
      "reason": "<why this seems plagiarized or copied>",
      "suggestion": "<how to rewrite this to make it original>"
    }
  ],
  "originalSections": [
    "<sentence or phrase that appears genuinely original>"
  ],
  "commonPhrases": [
    "<common phrase found that reduces originality>"
  ],
  "insights": [
    { "label": "Originality Score", "value": "<score>% — <badge>" },
    { "label": "Plagiarism Risk", "value": "<risk level>" },
    { "label": "Flagged Sections", "value": "<number> section(s) need attention" },
    { "label": "Common Phrases", "value": "<number> generic phrases detected" },
    { "label": "Original Content", "value": "<percentage>% appears genuinely original" },
    { "label": "Recommendation", "value": "<main action to take>" }
  ],
  "recommendations": [
    "<specific recommendation to improve originality>",
    "<recommendation 2>",
    "<recommendation 3>",
    "<important note about limitations of this check vs Turnitin>"
  ]
}`;

  try {
    const raw = await callGemini(prompt);
    const result = JSON.parse(raw);

    return {
      score: result.originalityScore || result.score || 70,
      badge: result.badge || "Mostly Original",
      color: (result.originalityScore >= 70) ? "green" : "warn",
      icon: "📄",
      name: "Plagiarism Checker",
      plagiarismRisk: result.plagiarismRisk,
      flaggedSections: result.flaggedSections || [],
      originalSections: result.originalSections || [],
      commonPhrases: result.commonPhrases || [],
      insights: result.insights || [],
      recommendations: result.recommendations || [],
    };
  } catch (err) {
    console.error("Plagiarism Error:", err.message);
    return errorResult("Plagiarism Checker", "📄", err.message);
  }
}

function errorResult(name, icon, message) {
  return {
    score: 0, badge: "Error", color: "warn", icon, name,
    insights: [{ label: "Error", value: message }],
    recommendations: ["Please check your Gemini API key in the .env file and try again."],
  };
}

module.exports = { analyzeSimilarity };