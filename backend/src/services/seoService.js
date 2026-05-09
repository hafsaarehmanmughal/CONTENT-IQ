// ============================================================
// SEO OPTIMIZATION SERVICE
// Powered by Google Gemini
// What it does:
//   - Analyzes existing content for SEO weaknesses
//   - Suggests high-ranked keywords relevant to the topic
//   - Shows keyword density and volume estimates
//   - Rewrites the content with SEO improvements applied
//   - Gives actionable recommendations
// ============================================================

const { callGemini } = require("./geminiHelper");

async function analyzeSEO(text) {
  const prompt = `You are a professional SEO expert. Analyze the following content and provide a complete SEO analysis.

CONTENT TO ANALYZE:
"""
${text.substring(0, 3000)}
"""

Your task:
1. Identify the main topic of this content
2. Find SEO weaknesses in the current text
3. Suggest 8-10 high-ranking keywords relevant to this topic that should be added
4. Rewrite the content with those keywords naturally integrated (keep the same meaning but improve SEO)
5. Give specific recommendations

Respond ONLY with a valid JSON object. No text before or after. Exactly this structure:
{
  "score": <number 0-100 representing current SEO score>,
  "badge": "<one of: Excellent, Good, Needs Work, Poor>",
  "topic": "<detected main topic of the content>",
  "currentKeywordDensity": "<e.g. '1.2% - too low'>",
  "wordCount": <number of words in original>,
  "improvedContent": "<the full rewritten content with SEO keywords naturally added>",
  "suggestedKeywords": [
    { "keyword": "<keyword>", "estimatedVolume": "<e.g. High / Medium / Low>", "difficulty": "<Easy / Medium / Hard>", "relevance": "<why this keyword fits>" },
    { "keyword": "<keyword>", "estimatedVolume": "<High / Medium / Low>", "difficulty": "<Easy / Medium / Hard>", "relevance": "<why>" },
    { "keyword": "<keyword>", "estimatedVolume": "<High / Medium / Low>", "difficulty": "<Easy / Medium / Hard>", "relevance": "<why>" },
    { "keyword": "<keyword>", "estimatedVolume": "<High / Medium / Low>", "difficulty": "<Easy / Medium / Hard>", "relevance": "<why>" },
    { "keyword": "<keyword>", "estimatedVolume": "<High / Medium / Low>", "difficulty": "<Easy / Medium / Hard>", "relevance": "<why>" }
  ],
  "insights": [
    { "label": "SEO Score", "value": "<score>/100" },
    { "label": "Main Topic", "value": "<topic>" },
    { "label": "Word Count", "value": "<count> words (<good/needs improvement>)" },
    { "label": "Keyword Density", "value": "<current density assessment>" },
    { "label": "Top Suggested Keyword", "value": "<best keyword to add>" },
    { "label": "Content Quality", "value": "<brief assessment>" }
  ],
  "recommendations": [
    "<specific actionable SEO recommendation 1>",
    "<specific actionable SEO recommendation 2>",
    "<specific actionable SEO recommendation 3>",
    "<specific actionable SEO recommendation 4>"
  ]
}`;

  try {
    const raw = await callGemini(prompt);
    const result = JSON.parse(raw);

    return {
      score: result.score || 50,
      badge: result.badge || "Needs Work",
      color: (result.score >= 70) ? "gold" : "warn",
      icon: "📊",
      name: "SEO Optimization",
      topic: result.topic,
      improvedContent: result.improvedContent,
      suggestedKeywords: result.suggestedKeywords || [],
      insights: result.insights || [],
      recommendations: result.recommendations || [],
    };
  } catch (err) {
    console.error("SEO Service Error:", err.message);
    return errorResult("SEO Optimization", "📊", err.message);
  }
}

function errorResult(name, icon, message) {
  return {
    score: 0, badge: "Error", color: "warn", icon, name,
    insights: [{ label: "Error", value: message }],
    recommendations: ["Please check your Gemini API key in the .env file and try again."],
  };
}

module.exports = { analyzeSEO };