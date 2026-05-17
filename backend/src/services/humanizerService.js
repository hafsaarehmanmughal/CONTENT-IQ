// CONTENT HUMANIZER SERVICE — Professional Grade
const { callGemini } = require("./geminiHelper");

async function analyzeHumanizer(text) {
  const prompt = `You are a professional content humanizer like Undetectable AI and QuillBot. Rewrite the content to sound completely natural and human-written.

ORIGINAL CONTENT:
"""
${text.substring(0, 2500)}
"""

Rules for humanization:
1. Vary sentence lengths dramatically — mix very short sentences with longer ones
2. Add natural contractions (don't, can't, it's, they're, I'm, you'll)
3. Remove ALL robotic transitions (Furthermore, Moreover, Additionally, In conclusion, It is important to note)
4. Add conversational phrases and natural flow
5. Include occasional informal expressions
6. Add personal perspective where appropriate
7. Use active voice instead of passive
8. Remove perfectly balanced paragraph structures
9. The result MUST pass AI detection tools
10. Preserve all original information and meaning

Respond ONLY with valid JSON:
{
  "score": <number 0-100, humanness quality of rewritten text>,
  "badge": "<Highly Human | Mostly Human | Partially Human>",
  "originalAIScore": <estimated AI probability of original 0-100>,
  "humanizedAIScore": <estimated AI probability of rewritten version 0-100, should be much lower>,
  "humanizedText": "<the complete fully rewritten human-sounding version>",
  "version2": "<an alternative rewrite with different tone — more casual>",
  "changesMade": [
    { "original": "<original phrase>", "changed": "<new phrase>", "reason": "<why this change helps>" },
    { "original": "<phrase>", "changed": "<new>", "reason": "<reason>" },
    { "original": "<phrase>", "changed": "<new>", "reason": "<reason>" }
  ],
  "techniquesUsed": [
    "<technique 1 applied>",
    "<technique 2>",
    "<technique 3>",
    "<technique 4>"
  ],
  "plagiarismRisk": "Very Low — completely rewritten in original voice",
  "toneApplied": "<conversational | professional | academic>",
  "insights": [
    { "label": "Original AI Probability", "value": "<percentage>%" },
    { "label": "Humanized AI Probability", "value": "<percentage>% (reduced by <reduction>%)" },
    { "label": "Humanness Score", "value": "<score>/100" },
    { "label": "Plagiarism Risk", "value": "Very Low" },
    { "label": "Tone Applied", "value": "<tone>" },
    { "label": "Changes Made", "value": "<number> significant rewrites" },
    { "label": "AI Patterns Removed", "value": "<number> robotic patterns eliminated" },
    { "label": "Will Pass AI Detectors", "value": "<Yes | Likely | Partially>" }
  ],
  "recommendations": [
    "<tip to further personalize>",
    "<tip 2>",
    "<tip 3>"
  ]
}`;

  try {
    const raw = await callGemini(prompt);
    const result = JSON.parse(raw);
    return { score: result.score || 85, badge: result.badge || "Mostly Human", color: "gold", icon: "✨", name: "Content Humanizer", ...result };
  } catch (err) {
    console.error("Humanizer Error:", err.message);
    return { score: 0, badge: "Error", color: "warn", icon: "✨", name: "Content Humanizer", insights: [{ label: "Error", value: err.message }], recommendations: ["Please check your GROQ_API_KEY and try again."] };
  }
}

module.exports = { analyzeHumanizer };