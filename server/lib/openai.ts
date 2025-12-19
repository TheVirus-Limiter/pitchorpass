import { OpenAI } from "openai";

// Uses Replit AI Integrations (env vars are auto-injected)
const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function generatePitch() {
  const prompt = `
    Generate a realistic, fictional startup pitch for an investing game.
    Return ONLY valid JSON.
    Structure:
    {
      "founder": {
        "name": "Full Name",
        "country": "Country Name",
        "gender": "male|female" 
      },
      "startup": {
        "name": "Startup Name",
        "pitch": "3-4 sentence elevator pitch. Compelling but maybe flawed.",
        "market": "Industry (e.g. Fintech, AI, BioTech)",
        "traction": {
          "users": number (100-1M),
          "monthlyGrowth": number (percentage 5-100),
          "revenue": number (0-500k monthly)
        },
        "risk": number (0.1 to 0.9, where 0.9 is very risky),
        "upside": number (0 to 100, multiplier for return)
      },
      "ask": number (fixed at 500000 to 2000000)
    }
    
    Make the "upside" and "risk" correlated but with variance. High risk can have high upside OR 0 upside (scam/failure).
    Ensure diverse founders and industries.
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-5.1",
    messages: [
      { role: "system", content: "You are a creative game engine generating startup pitches." },
      { role: "user", content: prompt }
    ],
    response_format: { type: "json_object" }
  });

  const content = response.choices[0].message.content || "{}";
  const data = JSON.parse(content);

  // Augment with a photo URL from Random User API structure
  // We can't call external APIs easily from here without 'fetch', but we can generate the URL string.
  // Actually, we'll let the frontend fetch the image or generate a consistent URL based on gender/id.
  // Let's generate a gender-based ID for randomuser.me
  const gender = data.founder.gender || "male";
  const randomId = Math.floor(Math.random() * 99);
  data.founder.photo = `https://randomuser.me/api/portraits/${gender === 'female' ? 'women' : 'men'}/${randomId}.jpg`;
  
  return data;
}
