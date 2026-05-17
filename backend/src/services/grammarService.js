// GRAMMAR & READABILITY SERVICE — Professional Grade
const { callGemini } = require("./geminiHelper");

async function analyzeGrammar(text) {
  const prompt = `You are a professional grammar expert like Grammarly and ProWritingAid. Find and fix ALL grammar, spelling, punctuation errors and improve readability.

CONTENT:
"""
${text.substring(0, 2500)}
"""

Be extremely thorough — find every single error. Also analyze readability, tone, and writing quality.

Respond ONLY with valid JSON:
{
  "score": <grammar quality score 0-100>,
  "badge": "<Excellent | Good | Needs Work | Poor>",
  "totalErrors": <total number of all errors found>,
  "grammarErrors": [
    { "original": "<wrong text>", "corrected": "<fixed text>", "type": "<Subject-Verb Agreement | Tense Error | Article Error | Preposition Error | Other>", "explanation": "<clear explanation>" },
    { "original": "<wrong>", "corrected": "<fixed>", "type": "<type>", "explanation": "<why>" }
  ],
  "spellingErrors": [
    { "original": "<misspelled>", "corrected": "<correct spelling>", "position": "<where in text>" }
  ],
  "punctuationErrors": [
    { "original": "<wrong punctuation>", "corrected": "<fixed>", "explanation": "<why>" }
  ],
  "styleIssues": [
    { "issue": "<style problem>", "example": "<from text>", "suggestion": "<how to fix>" },
    { "issue": "<issue>", "example": "<example>", "suggestion": "<fix>" }
  ],
  "passiveVoiceInstances": ["<passive voice sentence 1>", "<sentence 2>"],
  "hardToReadSentences": ["<complex sentence 1>", "<sentence 2>"],
  "repeatedWords": ["<repeated word 1>", "<word 2>"],
  "toneAssessment": "<Formal | Informal | Academic | Conversational | Professional>",
  "toneConsistency": "<Consistent | Inconsistent — explanation>",
  "readabilityScore": <Flesch reading ease 0-100>,
  "readabilityLevel": "<Very Easy | Easy | Standard | Difficult | Very Difficult>",
  "gradeLevel": "<e.g. Grade 8 | College Level>",
  "correctedText": "<the complete corrected version of the entire text with ALL errors fixed and readability improved>",
  "insights": [
    { "label": "Grammar Score", "value": "<score>/100" },
    { "label": "Total Errors Found", "value": "<number> errors corrected" },
    { "label": "Grammar Errors", "value": "<number>" },
    { "label": "Spelling Errors", "value": "<number>" },
    { "label": "Punctuation Errors", "value": "<number>" },
    { "label": "Readability Score", "value": "<score>/100 — <level>" },
    { "label": "Grade Level", "value": "<grade>" },
    { "label": "Tone", "value": "<tone> (<consistent/inconsistent>)" }
  ],
  "recommendations": [
    "<specific grammar improvement>",
    "<readability improvement>",
    "<style improvement>",
    "<vocabulary suggestion>",
    "<tone improvement>"
  ]
}`;

  try {
    const raw = await callGemini(prompt);
    const result = JSON.parse(raw);
    return { score: result.score || 70, badge: result.badge || "Good", color: result.score >= 60 ? "gold" : "warn", icon: "📝", name: "Grammar & Readability", ...result };
  } catch (err) {
    console.error("Grammar Error:", err.message);
    return { score: 0, badge: "Error", color: "warn", icon: "📝", name: "Grammar & Readability", insights: [{ label: "Error", value: err.message }], recommendations: ["Please check your GROQ_API_KEY and try again."] };
  }
}

module.exports = { analyzeGrammar };