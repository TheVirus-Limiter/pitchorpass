import { OpenAI } from "openai";

// Use custom API key from user if provided, otherwise use Replit AI Integrations
const apiKey = process.env.OPENAI_API_KEY || process.env.AI_INTEGRATIONS_OPENAI_API_KEY;
const baseURL = process.env.OPENAI_API_BASE || process.env.AI_INTEGRATIONS_OPENAI_BASE_URL;

const openai = new OpenAI({
  apiKey,
  baseURL,
});

const STARTUP_IDEAS = [
  { idea: "hyperlocal meals", description: "Ghost kitchen delivering restaurant-quality meals in 15 mins", market: "Food Tech", riskProfile: "medium" },
  { idea: "sleep tech", description: "AI sleep coach that optimizes your bedroom environment", market: "Health Tech", riskProfile: "low" },
  { idea: "micro-mobility", description: "Electric scooter sharing with ML-based station placement", market: "Mobility", riskProfile: "medium" },
  { idea: "influencer marketplace", description: "Automated brand partnerships for micro-influencers", market: "E-Commerce", riskProfile: "medium" },
  { idea: "API analytics", description: "Real-time monitoring and optimization for API performance", market: "Enterprise SaaS", riskProfile: "low" },
  { idea: "vertical farming automation", description: "Robotics + AI for indoor crop management at scale", market: "AgriTech", riskProfile: "high" },
  { idea: "instant checkout", description: "Cashierless payment for retail using computer vision", market: "FinTech", riskProfile: "high" },
  { idea: "autonomous delivery", description: "Sidewalk robots for last-mile food and package delivery", market: "Logistics", riskProfile: "high" },
  { idea: "precision meditation", description: "Meditation app using biometric feedback (heart rate, breathing)", market: "HealthTech", riskProfile: "low" },
  { idea: "web3 gaming", description: "Play-to-earn with real-world tournament prizes in crypto", market: "Gaming", riskProfile: "high" },
  { idea: "recruiter AI", description: "AI that finds hidden talent for hard-to-fill tech roles", market: "Enterprise SaaS", riskProfile: "medium" },
  { idea: "sustainable packaging", description: "Edible, compostable packaging that dissolves in water", market: "Fashion Tech", riskProfile: "high" },
  { idea: "flying taxi", description: "Urban air mobility for next-gen commuting", market: "Mobility", riskProfile: "high" },
  { idea: "carbon credit trading", description: "Blockchain-based marketplace for verified carbon offsets", market: "Enterprise SaaS", riskProfile: "high" },
  { idea: "cultured meat", description: "Lab-grown meat at price parity with conventional beef", market: "Food Tech", riskProfile: "high" },
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
  
  const convictionTraits = [
    "Brilliant but defensive",
    "Vision-first, details later",
    "Calm, but evasive on numbers",
    "Deeply technical, poor communicator",
    "Overconfident, dismissive of risks",
    "Quietly impressive, under-selling",
    "Data-driven, measured expectations",
    "Visionary but scattered",
    "Humble yet sharp",
    "Aggressive on timeline, optimistic on runway"
  ];
  
  const prompt = `
    Generate a realistic startup pitch for an investment game. Create a JSON response ONLY.
    
    Startup idea: "${idea.idea}"
    Description: "${idea.description}"
    Founder location: ${location}
    Market: ${idea.market}
    Risk profile: ${idea.riskProfile}
    
    For ${idea.riskProfile}-risk startups:
    - LOW-RISK: conservative metrics, steady growth (2-8x upside)
    - MEDIUM-RISK: balanced growth, moderate opportunity (8-20x upside)
    - HIGH-RISK: moonshot potential, high failure rate (30x+ upside but 60%+ failure chance)
    
    Return ONLY valid JSON (no markdown):
    {
      "founder": {
        "name": "First Last (name matching ${location})",
        "country": "United States",
        "gender": "male|female",
        "conviction": "${convictionTraits[Math.floor(Math.random() * convictionTraits.length)]}",
        "credentials": ["Short line 1", "Short line 2"]
      },
      "startup": {
        "name": "Creative startup name (NOT generic)",
        "pitch": "2-3 compelling sentences with specific details",
        "market": "${idea.market}",
        "traction": {
          "users": (integer, scale to risk: low=10k-50k, medium=50k-200k, high=1k-100k),
          "monthlyGrowth": (integer 2-60%, correlate to risk),
          "revenue": (integer, 0-150000, or 0 for some high-risk startups)
        },
        "risk": (${idea.riskProfile === 'low' ? '0.15-0.35' : idea.riskProfile === 'medium' ? '0.35-0.60' : '0.60-0.85'}),
        "upside": (${idea.riskProfile === 'low' ? '2-8' : idea.riskProfile === 'medium' ? '8-20' : '25-100'}),
        "valuation": (random between 100000 and 400000 - THIS IS SEED STAGE)
      },
      "ask": (random 10% to 25% of valuation),
      "news": ["headline1", "headline2", "headline3"],
      "whiteboardNotes": ["Sentence 1", "Sentence 2", "Sentence 3", "Sentence 4"]
    }
    
    Rules:
    - Valuation MUST be $100k-$400k (not higher - this is seed/pre-seed)
    - Traction must match risk level
    - Ask should be 10-25% of valuation
    - News should be 2-3 short snippets
    - Credentials: Mix of elite (Harvard, Google) and humble (Self-taught, unknown startups)
    - WhiteboardNotes: 3-4 short sentences. At least one MUST be negative/skeptical. High risk startups have more skeptical lines. Practical observations.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a creative game engine generating realistic startup pitches. Return ONLY valid JSON. Generate creative, memorable startup names that sound like real companies." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 600
    });

    const content = response.choices[0].message.content || "{}";
    const data = JSON.parse(content);

    // Add photo URL
    const gender = data.founder.gender || "male";
    const randomId = Math.floor(Math.random() * 99);
    data.founder.photo = `https://randomuser.me/api/portraits/${gender === 'female' ? 'women' : 'men'}/${randomId}.jpg`;

    // Ensure news array exists
    data.news = data.news || [];

    return data;
  } catch (error) {
    console.error("Pitch generation error:", error);
    throw error;
  }
}

// Generate outcome narratives based on company data
export async function generateOutcome(pitch: any, invested: boolean, investmentAmount: number, equity: number, isWin: boolean) {
  if (!invested || investmentAmount === 0) {
    return "You passed on this deal.";
  }

  const exitValue = isWin ? investmentAmount * pitch.startup.upside : 0;
  const payout = isWin ? Math.round(exitValue * (equity / 100)) : 0;
  const loss = isWin ? 0 : investmentAmount;

  const prompt = `
    Generate a 1-sentence case-specific outcome for a startup investment outcome.
    
    Company: ${pitch.startup.name} (${pitch.startup.market})
    Risk: ${pitch.startup.risk > 0.6 ? "HIGH" : pitch.startup.risk > 0.35 ? "MEDIUM" : "LOW"}
    Success: ${isWin}
    Invested: $${investmentAmount.toLocaleString()} for ${equity.toFixed(1)}% equity
    ${isWin ? `Exit value: $${exitValue.toLocaleString()}, Your payout: $${payout.toLocaleString()}` : "Total loss: $" + investmentAmount.toLocaleString()}
    
    Create a specific, realistic outcome. Mix of: acquisition, down-round, pivot success, regulatory block, viral then churn, etc.
    Examples:
    - "Acquired by DoorDash for $80M. Great exit."
    - "Series B at lower valuation, down-round. Investors diluted."
    - "Market saturation + high churn. Shut down after Series A."
    - "Regulatory approval blocked in EU. Pivoted to B2B, survived."
    
    Return ONLY the short narrative (1 sentence, no quotes, no explanation).
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a startup storyteller. Generate specific, realistic 1-sentence outcomes." },
        { role: "user", content: prompt }
      ],
      max_completion_tokens: 100
    });

    return response.choices[0].message.content?.trim() || (isWin ? "Successful exit!" : "Failed to execute.");
  } catch (error) {
    console.error("Outcome generation error:", error);
    return isWin ? "Successful exit!" : "Failed to execute.";
  }
}

// Answer investor questions about the startup
export async function answerFounderQuestion(pitch: any, question: string) {
  const prompt = `
    You are a founder answering an investor's question during a pitch meeting.
    
    Company: ${pitch.startup.name}
    Market: ${pitch.startup.market}
    Pitch: "${pitch.startup.pitch}"
    Users: ${pitch.startup.traction.users.toLocaleString()}
    Monthly Growth: ${pitch.startup.traction.monthlyGrowth}%
    MRR: $${pitch.startup.traction.revenue.toLocaleString()}
    
    Investor question: "${question}"
    
    Respond as the founder would - authentic, confident, and specific to the startup's actual metrics.
    Keep it to 1-2 sentences. Be direct and address the question head-on.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a startup founder responding authentically to investor questions. Keep responses concise and data-driven." },
        { role: "user", content: prompt }
      ],
      max_completion_tokens: 150
    });

    return response.choices[0].message.content?.trim() || "Great question - we're excited about the potential here.";
  } catch (error) {
    console.error("Question answer error:", error);
    return "We're focused on execution and expect strong results soon.";
  }
}
