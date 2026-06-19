// TEXT SUMMARIZATION SERVICE — Professional Grade
const { callGroq } = require("./groqHelper");

async function analyzeSummarization(text) {
  const wordCount = text.trim().split(/\s+/).length;

  const prompt = `You are a professional content summarizer like QuillBot Summarizer and Scholarcy. Create a comprehensive summary of the following content.

CONTENT:
"""
${text.substring(0, 2500)}
"""

Original word count: ${wordCount} words

Provide multiple summary formats as professional tools do.

Respond ONLY with valid JSON:
{
  "score": <content quality score 0-100>,
  "badge": "<Excellent | Good | Average | Poor>",
  "mainTopic": "<main topic>",
  "tone": "<Formal | Informal | Academic | Conversational | Technical>",
  "executiveSummary": "<3-4 sentence professional executive summary capturing the complete essence>",
  "shortSummary": "<1-2 sentence very brief summary>",
  "detailedSummary": "<comprehensive 6-8 sentence summary covering all major points>",
  "bulletSummary": [
    "<key point 1 — complete sentence>",
    "<key point 2>",
    "<key point 3>",
    "<key point 4>",
    "<key point 5>",
    "<key point 6>"
  ],
  "keyFacts": [
    "<important fact or statistic from the content>",
    "<fact 2>",
    "<fact 3>"
  ],
  "mainArgument": "<the central argument or message of the content>",
  "targetAudience": "<who this content is written for>",
  "studyNotes": [
    "<study note 1 for academic use>",
    "<note 2>",
    "<note 3>",
    "<note 4>"
  ],
  "originalWordCount": ${wordCount},
  "executiveSummaryWordCount": <word count of executive summary>,
  "compressionRatio": "<e.g. 85% shorter>",
  "insights": [
    { "label": "Main Topic", "value": "<topic>" },
    { "label": "Content Tone", "value": "<tone>" },
    { "label": "Target Audience", "value": "<audience>" },
    { "label": "Original Length", "value": "${wordCount} words" },
    { "label": "Summary Length", "value": "<executive summary word count> words" },
    { "label": "Compression", "value": "<compression ratio>" },
    { "label": "Key Points", "value": "<number> main points extracted" },
    { "label": "Content Quality", "value": "<score>/100" }
  ],
  "recommendations": [
    "<suggestion about the original content>",
    "<suggestion 2>",
    "<suggestion about using this summary>"
  ]
}`;

  try {
    const raw = await callGroq(prompt);
    const result = JSON.parse(raw);
    return { score: result.score || 75, badge: result.badge || "Good", color: "gold", icon: "📋", name: "Text Summarization", originalWordCount: wordCount, ...result };
  } catch (err) {
    console.error("Summarization Error:", err.message);
    return { score: 0, badge: "Error", color: "warn", icon: "📋", name: "Text Summarization", insights: [{ label: "Error", value: err.message }], recommendations: ["Please check your GROQ_API_KEY and try again."] };
  }
}

module.exports = { analyzeSummarization };