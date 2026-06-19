// KEYWORD ANALYSIS SERVICE — Professional Grade
const { callGroq } = require("./groqHelper");

async function analyzeKeywords(text) {
  const prompt = `You are a professional keyword research expert like Google Keyword Planner and SEMrush Keyword Magic Tool. Analyze the content and provide complete keyword intelligence.

CONTENT:
"""
${text.substring(0, 2500)}
"""

Provide comprehensive keyword analysis as a professional SEO tool would.

Respond ONLY with valid JSON:
{
  "score": <keyword optimization score 0-100>,
  "badge": "<Highly Optimized | Well Optimized | Needs Optimization | Poor>",
  "mainTopic": "<detected main topic>",
  "searchIntent": "<Informational | Commercial | Transactional | Navigational>",
  "primaryKeyword": "<the most important keyword in the content>",
  "primaryKeywordDensity": "<percentage>",
  "existingKeywords": [
    { "keyword": "<keyword in text>", "frequency": <number>, "density": "<percentage>", "assessment": "<Good | Overused | Underused>", "searchVolume": "<High | Medium | Low>" },
    { "keyword": "<keyword>", "frequency": <number>, "density": "<percentage>", "assessment": "<assessment>", "searchVolume": "<volume>" },
    { "keyword": "<keyword>", "frequency": <number>, "density": "<percentage>", "assessment": "<assessment>", "searchVolume": "<volume>" }
  ],
  "suggestedKeywords": [
    { "keyword": "<keyword to add>", "searchVolume": "<High | Medium | Low>", "difficulty": "<Easy | Medium | Hard>", "cpc": "<Low | Medium | High>", "intent": "<why users search this>", "trend": "<Rising | Stable | Declining>", "howToUse": "<where and how to add this keyword>" },
    { "keyword": "<keyword>", "searchVolume": "<volume>", "difficulty": "<difficulty>", "cpc": "<cpc>", "intent": "<intent>", "trend": "<trend>", "howToUse": "<how>" },
    { "keyword": "<keyword>", "searchVolume": "<volume>", "difficulty": "<difficulty>", "cpc": "<cpc>", "intent": "<intent>", "trend": "<trend>", "howToUse": "<how>" },
    { "keyword": "<keyword>", "searchVolume": "<volume>", "difficulty": "<difficulty>", "cpc": "<cpc>", "intent": "<intent>", "trend": "<trend>", "howToUse": "<how>" },
    { "keyword": "<keyword>", "searchVolume": "<volume>", "difficulty": "<difficulty>", "cpc": "<cpc>", "intent": "<intent>", "trend": "<trend>", "howToUse": "<how>" }
  ],
  "longTailKeywords": [
    { "phrase": "<long tail phrase>", "searchVolume": "<Low | Very Low>", "difficulty": "<Easy | Very Easy>", "opportunity": "<High | Medium>" },
    { "phrase": "<phrase>", "searchVolume": "<volume>", "difficulty": "<difficulty>", "opportunity": "<opportunity>" },
    { "phrase": "<phrase>", "searchVolume": "<volume>", "difficulty": "<difficulty>", "opportunity": "<opportunity>" }
  ],
  "questionKeywords": ["<question people ask about this topic>", "<question 2>", "<question 3>"],
  "semanticKeywords": ["<semantically related keyword>", "<keyword 2>", "<keyword 3>", "<keyword 4>"],
  "keywordClusters": [
    { "cluster": "<cluster name>", "keywords": ["<keyword 1>", "<keyword 2>", "<keyword 3>"] },
    { "cluster": "<cluster>", "keywords": ["<keyword>", "<keyword>"] }
  ],
  "contentIdeas": ["<content idea based on keyword gap 1>", "<idea 2>", "<idea 3>"],
  "insights": [
    { "label": "Keyword Score", "value": "<score>/100" },
    { "label": "Primary Keyword", "value": "<keyword> (<density>%)" },
    { "label": "Search Intent", "value": "<intent>" },
    { "label": "Keywords Found", "value": "<number> keywords in content" },
    { "label": "Top Opportunity", "value": "<best keyword to add>" },
    { "label": "Long-tail Opportunities", "value": "<number> phrases identified" },
    { "label": "Question Keywords", "value": "<number> questions to target" },
    { "label": "Keyword Clusters", "value": "<number> topic clusters detected" }
  ],
  "recommendations": [
    "<specific keyword action 1>",
    "<action 2>",
    "<action 3>",
    "<action 4>",
    "<action 5>"
  ]
}`;

  try {
    const raw = await callGroq(prompt);
    const result = JSON.parse(raw);
    return { score: result.score || 60, badge: result.badge || "Needs Optimization", color: "gold", icon: "🔑", name: "Keyword Analysis", ...result };
  } catch (err) {
    console.error("Keyword Error:", err.message);
    return { score: 0, badge: "Error", color: "warn", icon: "🔑", name: "Keyword Analysis", insights: [{ label: "Error", value: err.message }], recommendations: ["Please check your GROQ_API_KEY and try again."] };
  }
}

module.exports = { analyzeKeywords };