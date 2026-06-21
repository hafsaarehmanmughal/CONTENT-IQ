// SEO OPTIMIZATION SERVICE — Fixed search volume display
const { callGroq } = require("./groqHelper");

async function analyzeSEO(text) {
  const shortText = text.trim().substring(0, 1500);

  const prompt = `You are a world-class SEO expert like Semrush. Analyze this content and provide professional SEO analysis.

CONTENT:
"""
${shortText}
"""

Return ONLY valid JSON, no extra text:
{
  "score": <number 0-100>,
  "badge": "<Excellent|Good|Needs Work|Poor>",
  "topic": "<main topic>",
  "searchIntent": "<Informational|Commercial|Transactional|Navigational>",
  "wordCount": <number>,
  "recommendedWordCount": "<e.g. 1500-2000 words>",
  "keywordDensity": "<e.g. 1.2% for primary keyword>",
  "metaTitle": "<suggested SEO title under 60 characters>",
  "metaDescription": "<suggested meta description under 160 characters>",
  "missingKeywords": ["<keyword1>", "<keyword2>", "<keyword3>", "<keyword4>", "<keyword5>"],
  "contentGaps": ["<gap1>", "<gap2>", "<gap3>"],
  "onPageIssues": ["<issue1>", "<issue2>", "<issue3>"],
  "suggestedKeywords": [
    { "keyword": "<keyword>", "searchVolume": "High", "difficulty": "Medium", "intent": "<why people search>", "priority": "Must Add" },
    { "keyword": "<keyword>", "searchVolume": "Medium", "difficulty": "Easy", "intent": "<intent>", "priority": "Should Add" },
    { "keyword": "<keyword>", "searchVolume": "Low", "difficulty": "Easy", "intent": "<intent>", "priority": "Optional" },
    { "keyword": "<keyword>", "searchVolume": "High", "difficulty": "Hard", "intent": "<intent>", "priority": "Must Add" },
    { "keyword": "<keyword>", "searchVolume": "Medium", "difficulty": "Medium", "intent": "<intent>", "priority": "Should Add" }
  ],
  "longTailKeywords": ["<phrase1>", "<phrase2>", "<phrase3>", "<phrase4>"],
  "seoOptimizedVersion": "<complete rewritten content with keywords integrated naturally>",
  "insights": [
    { "label": "SEO Score", "value": "<score>/100" },
    { "label": "Main Topic", "value": "<topic>" },
    { "label": "Search Intent", "value": "<intent>" },
    { "label": "Word Count", "value": "<count> words (recommended: <recommended>)" },
    { "label": "Keyword Density", "value": "<density>" },
    { "label": "Content Gaps", "value": "<number> gaps detected" },
    { "label": "Missing Keywords", "value": "<number> important keywords missing" },
    { "label": "Meta Title", "value": "<title>" }
  ],
  "recommendations": [
    "<specific SEO action 1>",
    "<specific SEO action 2>",
    "<specific SEO action 3>",
    "<specific SEO action 4>",
    "<specific SEO action 5>"
  ]
}`;

  try {
    const raw = await callGroq(prompt);
    const result = JSON.parse(raw);
    return {
      score: result.score || 50,
      badge: result.badge || "Needs Work",
      color: result.score >= 70 ? "gold" : "warn",
      icon: "📊",
      name: "SEO Optimization",
      ...result,
    };
  } catch (err) {
    console.error("SEO Error:", err.message);
    return {
      score: 0, badge: "Error", color: "warn", icon: "📊",
      name: "SEO Optimization",
      insights: [{ label: "Error", value: err.message }],
      recommendations: ["Please check your GROQ_API_KEY and try again."],
    };
  }
}

module.exports = { analyzeSEO };