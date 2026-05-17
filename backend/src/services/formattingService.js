// FORMATTING ASSISTANCE SERVICE — Professional Grade
const { callGemini } = require("./geminiHelper");

async function analyzeFormatting(text) {
  const prompt = `You are a professional document formatting expert like Microsoft Editor and Notion. Analyze and improve the formatting and structure of the following content.

CONTENT:
"""
${text.substring(0, 2500)}
"""

Analyze structure, headings, paragraphs, academic formatting, and provide a professionally formatted version.

Respond ONLY with valid JSON:
{
  "score": <formatting quality score 0-100>,
  "badge": "<Excellent | Good | Needs Work | Poor>",
  "documentType": "<Blog Post | Academic Essay | Professional Report | Article | Other>",
  "currentStructure": "<assessment of current structure>",
  "formattingIssues": [
    { "issue": "<specific formatting problem>", "severity": "<High | Medium | Low>", "fix": "<how to fix it>" },
    { "issue": "<issue>", "severity": "<severity>", "fix": "<fix>" },
    { "issue": "<issue>", "severity": "<severity>", "fix": "<fix>" }
  ],
  "headingAnalysis": {
    "hasH1": <true | false>,
    "hasH2": <true | false>,
    "hasH3": <true | false>,
    "headingCount": <number>,
    "assessment": "<good structure | needs more headings | too many headings>",
    "suggestion": "<specific heading improvement>"
  },
  "paragraphAnalysis": {
    "avgParagraphLength": "<short | medium | long | too long>",
    "paragraphCount": <estimated number>,
    "assessment": "<well-structured | needs breaking up | too fragmented>",
    "suggestion": "<paragraph improvement>"
  },
  "formattedVersion": "<the complete content reformatted with proper H1/H2/H3 headings, proper paragraph breaks, bullet points where appropriate, and professional structure — use markdown formatting>",
  "contentHierarchy": [
    { "level": "H1", "suggested": "<main title suggestion>" },
    { "level": "H2", "suggested": "<section 1 heading>" },
    { "level": "H2", "suggested": "<section 2 heading>" },
    { "level": "H2", "suggested": "<section 3 heading>" }
  ],
  "tableOfContents": ["<section 1>", "<section 2>", "<section 3>", "<section 4>"],
  "citationStyle": "<APA | MLA | Chicago | Not applicable>",
  "mobileReadability": "<Good | Poor — explanation>",
  "academicCompliance": "<Compliant | Needs improvement — what specifically>",
  "insights": [
    { "label": "Formatting Score", "value": "<score>/100" },
    { "label": "Document Type", "value": "<type>" },
    { "label": "Heading Structure", "value": "<assessment>" },
    { "label": "Paragraph Structure", "value": "<assessment>" },
    { "label": "Formatting Issues", "value": "<number> issues found" },
    { "label": "Mobile Readability", "value": "<good/poor>" },
    { "label": "Academic Compliance", "value": "<compliant/needs work>" },
    { "label": "Content Hierarchy", "value": "<number> sections identified>" }
  ],
  "recommendations": [
    "<specific formatting action 1>",
    "<action 2>",
    "<action 3>",
    "<action 4>",
    "<action 5>"
  ]
}`;

  try {
    const raw = await callGemini(prompt);
    const result = JSON.parse(raw);
    return { score: result.score || 60, badge: result.badge || "Needs Work", color: result.score >= 70 ? "gold" : "warn", icon: "📐", name: "Formatting Assistance", ...result };
  } catch (err) {
    console.error("Formatting Error:", err.message);
    return { score: 0, badge: "Error", color: "warn", icon: "📐", name: "Formatting Assistance", insights: [{ label: "Error", value: err.message }], recommendations: ["Please check your GROQ_API_KEY and try again."] };
  }
}

module.exports = { analyzeFormatting };