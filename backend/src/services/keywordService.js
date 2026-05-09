// ============================================================
// KEYWORD ANALYSIS SERVICE
// Powered by Google Gemini
// What it does:
//   - Identifies what people search for related to this content
//   - Extracts existing keywords from the text
//   - Suggests new keywords to target for better search visibility
//   - Shows keyword difficulty and search intent
//   - Explains how to use each keyword
// ============================================================

const { callGemini } = require("./geminiHelper");

async function analyzeKeywords(text) {
  const prompt = `You are a professional SEO keyword research expert. Analyze the following content and provide comprehensive keyword analysis.

CONTENT TO ANALYZE:
"""
${text.substring(0, 3000)}
"""

Your tasks:
1. Identify the main topic and search intent of this content
2. Extract keywords already present in the text
3. Suggest new high-value keywords this content should target
4. Identify long-tail keyword opportunities
5. Analyze keyword density of existing keywords
6. Suggest how to incorporate missing keywords

Respond ONLY with a valid JSON object. No text before or after:
{
  "score": <number 0-100 keyword optimization score>,
  "badge": "<one of: Highly Optimized, Well Optimized, Needs Optimization, Poor>",
  "mainTopic": "<the main topic of the content>",
  "searchIntent": "<what users are searching for — Informational / Commercial / Transactional / Navigational>",
  "existingKeywords": [
    { "keyword": "<keyword already in text>", "frequency": <how many times>, "density": "<percentage>%", "assessment": "<good/overused/underused>" }
  ],
  "suggestedKeywords": [
    { "keyword": "<keyword to add>", "searchVolume": "<High/Medium/Low>", "difficulty": "<Easy/Medium/Hard>", "intent": "<why users search this>", "howToUse": "<where/how to add this keyword>" },
    { "keyword": "<keyword>", "searchVolume": "<High/Medium/Low>", "difficulty": "<Easy/Medium/Hard>", "intent": "<why>", "howToUse": "<where>" },
    { "keyword": "<keyword>", "searchVolume": "<High/Medium/Low>", "difficulty": "<Easy/Medium/Hard>", "intent": "<why>", "howToUse": "<where>" },
    { "keyword": "<keyword>", "searchVolume": "<High/Medium/Low>", "difficulty": "<Easy/Medium/Hard>", "intent": "<why>", "howToUse": "<where>" },
    { "keyword": "<keyword>", "searchVolume": "<High/Medium/Low>", "difficulty": "<Easy/Medium/Hard>", "intent": "<why>", "howToUse": "<where>" }
  ],
  "longTailKeywords": [
    "<long tail keyword phrase 1>",
    "<long tail keyword phrase 2>",
    "<long tail keyword phrase 3>"
  ],
  "insights": [
    { "label": "Keyword Score", "value": "<score>/100" },
    { "label": "Main Topic", "value": "<topic>" },
    { "label": "Search Intent", "value": "<intent>" },
    { "label": "Existing Keywords", "value": "<number> keywords found in text" },
    { "label": "Top Suggested Keyword", "value": "<best keyword to add>" },
    { "label": "Long-tail Opportunities", "value": "<number> long-tail phrases identified" }
  ],
  "recommendations": [
    "<specific keyword recommendation 1>",
    "<recommendation 2>",
    "<recommendation 3>",
    "<recommendation 4>"
  ]
}`;

  try {
    const raw = await callGemini(prompt);
    const result = JSON.parse(raw);

    return {
      score: result.score || 60,
      badge: result.badge || "Needs Optimization",
      color: "gold",
      icon: "🔑",
      name: "Keyword Analysis",
      mainTopic: result.mainTopic,
      searchIntent: result.searchIntent,
      existingKeywords: result.existingKeywords || [],
      suggestedKeywords: result.suggestedKeywords || [],
      longTailKeywords: result.longTailKeywords || [],
      insights: result.insights || [],
      recommendations: result.recommendations || [],
    };
  } catch (err) {
    console.error("Keyword Error:", err.message);
    return errorResult("Keyword Analysis", "🔑", err.message);
  }
}

function errorResult(name, icon, message) {
  return {
    score: 0, badge: "Error", color: "warn", icon, name,
    insights: [{ label: "Error", value: message }],
    recommendations: ["Please check your Gemini API key in the .env file and try again."],
  };
}

module.exports = { analyzeKeywords };