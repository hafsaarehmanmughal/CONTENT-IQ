// ============================================================
// AI API HELPER — Powered by Groq (Llama 3.3 70B)
// FREE — no credit card, no quota issues
// Free tier: 14,400 requests/day
// Sign up: https://console.groq.com
// NOTE: File is named geminiHelper.js so all 6 services
//       can import it without any changes
// ============================================================

const https = require("https");

async function callGemini(prompt) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey || apiKey === "gsk_your_key_here") {
    throw new Error("GROQ_API_KEY is not set in your .env file. Get a free key at https://console.groq.com");
  }

  const postData = JSON.stringify({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: "You are a professional content analysis expert. You always respond with valid JSON only. Never include any text before or after the JSON. Never use markdown code fences."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.4,
    max_tokens: 2048,
  });

  return new Promise((resolve, reject) => {
    const options = {
      hostname: "api.groq.com",
      path: "/openai/v1/chat/completions",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "Content-Length": Buffer.byteLength(postData),
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);

          if (parsed.error) {
            return reject(new Error(`Groq API error: ${parsed.error.message}`));
          }

          const content = parsed?.choices?.[0]?.message?.content;
          if (!content) {
            return reject(new Error("Empty response from Groq"));
          }

          const clean = content
            .replace(/```json\n?/g, "")
            .replace(/```\n?/g, "")
            .trim();

          resolve(clean);
        } catch (e) {
          reject(new Error("Failed to parse Groq response: " + e.message));
        }
      });
    });

    req.on("error", reject);
    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error("Groq request timed out after 30 seconds"));
    });

    req.write(postData);
    req.end();
  });
}

module.exports = { callGemini };