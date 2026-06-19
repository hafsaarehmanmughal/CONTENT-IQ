// SEO OPTIMIZATION SERVICE — Professional Grade
const { callGroq } = require("./groqHelper");

async function analyzeSEO(text) {
  const prompt = `You are a world-class SEO expert like SEMrush or Ahrefs. Analyze the following content and provide a comprehensive professional SEO analysis.

CONTENT:
"""
${text.substring(0, 2500)}
"""

Respond ONLY with valid JSON. No text before or after:
{
  "score": <number 0-100>,
  "badge": "<Excellent | Good | Needs Work | Poor>",
  "topic": "<main topic detected>",
  "searchIntent": "<Informational | Commercial | Transactional | Navigational>",
  "wordCount": <number>,
  "recommendedWordCount": "<e.g. 1500-2000 words>",
  "keywordDensity": "<current primary keyword density>",
  "missingKeywords": ["<keyword 1>", "<keyword 2>", "<keyword 3>", "<keyword 4>", "<keyword 5>"],
  "suggestedKeywords": [
    { "keyword": "<keyword>", "searchVolume": "<High | Medium | Low>", "difficulty": "<Easy | Medium | Hard>", "intent": "<search intent>", "priority": "<Must Add | Should Add | Optional>" },
    { "keyword": "<keyword>", "searchVolume": "<High | Medium | Low>", "difficulty": "<Easy | Medium | Hard>", "intent": "<intent>", "priority": "<priority>" },
    { "keyword": "<keyword>", "searchVolume": "<High | Medium | Low>", "difficulty": "<Easy | Medium | Hard>", "intent": "<intent>", "priority": "<priority>" },
    { "keyword": "<keyword>", "searchVolume": "<High | Medium | Low>", "difficulty": "<Easy | Medium | Hard>", "intent": "<intent>", "priority": "<priority>" },
    { "keyword": "<keyword>", "searchVolume": "<High | Medium | Low>", "difficulty": "<Easy | Medium | Hard>", "intent": "<intent>", "priority": "<priority>" }
  ],
  "longTailKeywords": ["<phrase 1>", "<phrase 2>", "<phrase 3>", "<phrase 4>"],
  "metaTitle": "<suggested SEO title under 60 characters>",
  "metaDescription": "<suggested meta description under 160 characters>",
  "headingStructure": "<assessment of heading usage>",
  "contentGaps": ["<topic gap 1>", "<gap 2>", "<gap 3>"],
  "onPageIssues": ["<issue 1>", "<issue 2>", "<issue 3>"],
  "seoOptimizedVersion": "<complete rewritten content with SEO keywords naturally integrated and proper structure>",
  "insights": [
    { "label": "SEO Score", "value": "<score>/100" },
    { "label": "Main Topic", "value": "<topic>" },
    { "label": "Search Intent", "value": "<intent>" },
    { "label": "Word Count", "value": "<count> words (recommended: <recommended>)" },
    { "label": "Keyword Density", "value": "<density>" },
    { "label": "Content Gaps", "value": "<number> gaps detected" },
    { "label": "Missing Keywords", "value": "<number> important keywords missing" },
    { "label": "Meta Title", "value": "<suggested title>" }
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
    return { score: result.score || 50, badge: result.badge || "Needs Work", color: result.score >= 70 ? "gold" : "warn", icon: "📊", name: "SEO Optimization", ...result };
  } catch (err) {
    console.error("SEO Error:", err.message);
    return { score: 0, badge: "Error", color: "warn", icon: "📊", name: "SEO Optimization", insights: [{ label: "Error", value: err.message }], recommendations: ["Please check your GROQ_API_KEY and try again."] };
  }
}

module.exports = { analyzeSEO };