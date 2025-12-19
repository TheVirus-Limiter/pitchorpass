import { OpenAI } from "openai";

// Use custom API key from user if provided, otherwise use Replit AI Integrations
const apiKey = process.env.OPENAI_API_KEY || process.env.AI_INTEGRATIONS_OPENAI_API_KEY;
const baseURL = process.env.OPENAI_API_BASE || process.env.AI_INTEGRATIONS_OPENAI_BASE_URL;

const openai = new OpenAI({
  apiKey,
  baseURL,
});

const STARTUP_IDEAS = [
  { name: "food delivery", description: "An on-demand food delivery platform", market: "Food Tech" },
  { name: "fitness tracking wearable", description: "Smart device for workout monitoring", market: "Health Tech" },
  { name: "ride sharing", description: "Peer-to-peer transportation network", market: "Mobility" },
  { name: "social commerce", description: "Buy products directly from social streams", market: "E-Commerce" },
  { name: "AI customer service", description: "Automated support with natural language", market: "AI/SaaS" },
  { name: "vertical farming", description: "Indoor automated crop production", market: "AgriTech" },
  { name: "crypto payment", description: "Blockchain-based payment system", market: "FinTech" },
  { name: "drone logistics", description: "Autonomous last-mile delivery", market: "Logistics" },
  { name: "mental health app", description: "AI-powered therapy and meditation", market: "HealthTech" },
  { name: "gaming NFT platform", description: "Play-to-earn gaming ecosystem", market: "Gaming" },
  { name: "HR software", description: "AI recruitment and talent management", market: "Enterprise SaaS" },
  { name: "sustainable fashion", description: "Eco-friendly clothing marketplace", market: "Fashion Tech" },
  { name: "autonomous vehicles", description: "Self-driving car technology", market: "Mobility" },
  { name: "data analytics", description: "Real-time business intelligence dashboard", market: "Enterprise SaaS" },
  { name: "plant-based meat", description: "Alternative protein manufacturing", market: "Food Tech" },
];

const FOUNDER_LOCATIONS = [
  "San Francisco, CA", "Los Angeles, CA", "New York, NY", "Seattle, WA",
  "Austin, TX", "Denver, CO", "Boston, MA", "Miami, FL",
  "Chicago, IL", "San Diego, CA", "Portland, OR", "Dallas, TX"
];

export async function generatePitch() {
  const ideaIndex = Math.floor(Math.random() * STARTUP_IDEAS.length);
  const idea = STARTUP_IDEAS[ideaIndex];
  const location = FOUNDER_LOCATIONS[Math.floor(Math.random() * FOUNDER_LOCATIONS.length)];
  const hasMinInvestment = Math.random() > 0.7; // 30% have minimums
  
  const prompt = `
    Generate a realistic startup pitch for a game. Create a JSON response ONLY.
    
    Startup idea: "${idea.description}"
    Founder location: ${location}
    
    Return ONLY valid JSON (no markdown, no explanation):
    {
      "founder": {
        "name": "First Last (realistic name matching location culture)",
        "country": "United States",
        "gender": "male|female"
      },
      "startup": {
        "name": "${idea.name.toUpperCase().replace(/\s/g, "")}",
        "pitch": "2-3 sentence compelling pitch. Make it sound like a real startup pitch.",
        "market": "${idea.market}",
        "traction": {
          "users": 5000 to 500000,
          "monthlyGrowth": 5 to 50,
          "revenue": 0 to 200000
        },
        "risk": 0.2 to 0.8,
        "upside": 2 to 50,
        "valuation": 500000 to 20000000
      },
      "ask": 100000 to 3000000,
      "minimumInvestment": ${hasMinInvestment ? '50000 to 500000' : 0}
    }
    
    Rules:
    - High upside (>30) should correlate with high risk (>0.6)
    - Low upside (<5) should be lower risk (<0.3)
    - If revenue is high (>100k), upside should be reasonable (5-15)
    - Names should sound real and fit the location
    - Make the pitch compelling and specific
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5.1",
      messages: [
        { role: "system", content: "You are a creative game engine generating realistic startup pitches. Return ONLY valid JSON." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 500
    });

    const content = response.choices[0].message.content || "{}";
    const data = JSON.parse(content);

    // Add photo URL
    const gender = data.founder.gender || "male";
    const randomId = Math.floor(Math.random() * 99);
    data.founder.photo = `https://randomuser.me/api/portraits/${gender === 'female' ? 'women' : 'men'}/${randomId}.jpg`;

    return data;
  } catch (error) {
    console.error("Pitch generation error:", error);
    throw error;
  }
}

// Generate outcome narratives based on company data
export async function generateOutcome(pitch: any, invested: boolean, outcome: number, isWin: boolean) {
  if (!invested) {
    return "You passed on this deal. Smart move or missed opportunity?";
  }

  const prompt = `
    Generate a 1-sentence outcome narrative for a startup game.
    
    Company: ${pitch.startup.name} (${pitch.startup.market})
    Risk Level: ${pitch.startup.risk > 0.6 ? "High" : pitch.startup.risk > 0.3 ? "Medium" : "Low"}
    Outcome: ${isWin ? "SUCCESS" : "FAILURE"}
    Return amount: $${outcome.toLocaleString()}
    
    Create a fun, realistic narrative outcome. Be specific and creative.
    Examples:
    - SUCCESS: "Acquired by Google for $50M. You made 10x!"
    - SUCCESS: "Series C funding at 5x valuation. Strong growth trajectory."
    - FAILURE: "Pivot didn't work. Shut down after burning through runway."
    - FAILURE: "CEO drama. Founder conflict tanked investor confidence."
    
    Return ONLY the narrative sentence (no JSON, no quotes, no explanation).
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5.1",
      messages: [
        { role: "system", content: "You are a storyteller. Generate 1-sentence startup outcomes. Be creative and realistic." },
        { role: "user", content: prompt }
      ],
      max_completion_tokens: 100
    });

    return response.choices[0].message.content?.trim() || (isWin ? "Great success!" : "Things didn't work out.");
  } catch (error) {
    console.error("Outcome generation error:", error);
    return isWin ? "Great success!" : "Things didn't work out.";
  }
}
