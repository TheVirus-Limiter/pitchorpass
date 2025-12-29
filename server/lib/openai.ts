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

export async function generatePitch(phase: number = 1) {
  const ideaIndex = Math.floor(Math.random() * STARTUP_IDEAS.length);
  const idea = STARTUP_IDEAS[ideaIndex];
  const location = FOUNDER_LOCATIONS[Math.floor(Math.random() * FOUNDER_LOCATIONS.length)];
  
  const convictionTraitsByRisk: Record<string, string[]> = {
    high: [
      "Overconfident, buzzword-heavy",
      "Charismatic, light on details",
      "Vision-driven, execution unclear",
      "Confident, avoids hard questions",
      "Aggressive, dismissive of risks",
      "Optimistic, hand-wavy projections",
      "Polished, says all the right things",
      "Big ideas, small evidence",
      "Sounds smart, says little",
      "More pitch than plan"
    ],
    medium: [
      "Measured, cautiously optimistic",
      "Thoughtful, still figuring things out",
      "Understands the problem, unsure on scale",
      "Honest, limited experience",
      "Technical, poor communicator",
      "Energetic, unfocused pitch",
      "Clear product, fuzzy go-to-market",
      "Reasonable assumptions, early days",
      "Smart, but stretching the story",
      "Knows the space, not the path"
    ],
    low: [
      "Calm, data-backed",
      "Grounded, realistic expectations",
      "Understated, quietly confident",
      "Clear strategy, disciplined thinking",
      "Knows the numbers cold",
      "Careful, conservative assumptions",
      "Direct, transparent about risks",
      "Strong fundamentals, no hype",
      "Focused, execution-oriented",
      "Lets the data do the talking"
    ]
  };
  
  const convictionTraits = convictionTraitsByRisk[idea.riskProfile] || convictionTraitsByRisk.medium;

  const valuationRange = phase === 1 
    ? "between 100000 and 400000 - THIS IS SEED STAGE" 
    : "between 2000000 and 15000000 - THIS IS SERIES A/B LATER STAGE";
  
  const prompt = `
    Generate a realistic startup pitch for an investment game. Create a JSON response ONLY.
    
    Startup idea: "${idea.idea}"
    Description: "${idea.description}"
    Founder location: ${location}
    Market: ${idea.market}
    Risk profile: ${idea.riskProfile}
    Game Phase: ${phase} (${phase === 1 ? 'Early Stage' : 'Later Stage'})
    
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
          "users": (integer, scale to risk and phase: low=10k-50k, medium=50k-200k, high=1k-100k for phase 1. Multiply by 10-50 for phase 2),
          "monthlyGrowth": (integer 2-60%, correlate to risk),
          "revenue": (integer, phase 1: 0-150k, phase 2: 500k-5M)
        },
        "risk": (${idea.riskProfile === 'low' ? '0.15-0.35' : idea.riskProfile === 'medium' ? '0.35-0.60' : '0.60-0.85'}),
        "upside": (${idea.riskProfile === 'low' ? '2-8' : idea.riskProfile === 'medium' ? '8-20' : '25-100'}),
        "valuation": (random ${valuationRange})
      },
      "ask": (random 10% to 25% of valuation),
      "news": ["headline1", "headline2", "headline3"],
      "whiteboardNotes": ["Sentence 1", "Sentence 2", "Sentence 3", "Sentence 4"]
    }
    
    Rules:
    - Valuation MUST match the phase description.
    - Traction must match risk level and phase.
    - Ask should be 10-25% of valuation.
    - News: 2-3 short snippets.
    - Credentials: ONLY 30% elite (Stanford/Google), 70% non-name/regional (ASU, local agency, freelancer, self-taught).
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

// Varied outcome templates for when AI is unavailable
const SUCCESS_OUTCOMES = [
  "Acquired by {acquirer} for ${amount}M after explosive growth.",
  "IPO'd at ${amount}M valuation. Early investors made {multiple}x.",
  "Strategic acquisition by {acquirer}. Clean exit.",
  "Series C at ${amount}M valuation. Your stake worth ${payout}.",
  "Profitable and growing. Secondary sale at {multiple}x your investment.",
  "Market leader in {market}. Acquired for ${amount}M.",
  "Unicorn status achieved. Your {equity}% now worth ${payout}.",
  "Sold to private equity for ${amount}M. Solid return.",
  "Merger with competitor created market giant. {multiple}x exit.",
  "Global expansion succeeded. Acquired by {acquirer} for ${amount}M."
];

const FAILURE_OUTCOMES = [
  "Ran out of runway after Series A. Assets liquidated.",
  "Regulatory changes killed the business model.",
  "Key competitor launched first. Lost market window.",
  "Co-founder conflict led to company dissolution.",
  "Customer acquisition costs never came down. Shut down.",
  "Pivoted twice, burned through cash. Acqui-hired for talent only.",
  "Market timing was wrong. Idea ahead of its time.",
  "Unit economics never worked. Investors wrote it off.",
  "Failed to raise Series B. Wound down operations.",
  "Supply chain issues proved insurmountable. Closed.",
  "Viral growth but zero retention. Users churned out.",
  "Tech worked, but couldn't find product-market fit.",
  "Founder burnout led to shutdown despite traction.",
  "Down-round wiped out early investors. Zombie company."
];

const ACQUIRERS = ["Google", "Amazon", "Microsoft", "Meta", "Apple", "Salesforce", "Shopify", "Uber", "DoorDash", "Stripe", "Block", "Airbnb"];

// Generate outcome narratives based on company data
export async function generateOutcome(pitch: any, invested: boolean, investmentAmount: number, equity: number, isWin: boolean) {
  if (!invested || investmentAmount === 0) {
    return "You passed on this deal.";
  }

  const exitValue = isWin ? investmentAmount * pitch.startup.upside : 0;
  const multiple = pitch.startup.upside || 5;
  const acquirer = ACQUIRERS[Math.floor(Math.random() * ACQUIRERS.length)];
  const amount = Math.max(1, Math.round((investmentAmount * multiple) / 1000000));
  const payout = "$" + Math.round(exitValue).toLocaleString();

  const prompt = `
    Generate a 1-sentence specific outcome for a startup investment. Be creative and realistic.
    
    Company: ${pitch.startup.name} (${pitch.startup.market})
    Risk Level: ${pitch.startup.risk > 0.6 ? "HIGH" : pitch.startup.risk > 0.35 ? "MEDIUM" : "LOW"}
    Outcome: ${isWin ? "SUCCESS" : "FAILURE"}
    Investment: $${investmentAmount.toLocaleString()} for ${equity.toFixed(1)}% equity
    ${isWin ? `Exit multiple: ${multiple}x, Your payout: $${payout}` : "Total loss: $" + investmentAmount.toLocaleString()}
    
    SUCCESS examples (use variety):
    - "Acquired by Shopify for $180M after dominating the vertical."
    - "IPO'd at $2.4B. Your stake multiplied 47x."
    - "Strategic merger created category leader. 12x return."
    - "Profitable bootstrap pivot. Sold to PE firm for $90M."
    - "Series D unicorn. Secondary sale netted you $1.2M."
    
    FAILURE examples (use variety):
    - "Regulatory crackdown killed the business overnight."
    - "Ran hot for 18 months, then users churned. Shut down."
    - "Down-round at 80% haircut. Wiped out early investors."
    - "Co-founder left with the IP. Lawsuits drained remaining cash."
    - "Supply chain issues proved fatal. Liquidated assets."
    - "Market window closed. Acqui-hired for pennies."
    - "Pivoted 3x, never found PMF. Wound down."
    
    Return ONLY a short, punchy 1-sentence narrative. No quotes.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a startup outcomes generator. Create specific, realistic 1-sentence outcomes with real company names and dollar amounts when relevant. Be direct and punchy." },
        { role: "user", content: prompt }
      ],
      max_completion_tokens: 80
    });

    return response.choices[0].message.content?.trim() || getFallbackOutcome(isWin, acquirer, amount, multiple, payout, equity, pitch.startup.market);
  } catch (error) {
    console.error("Outcome generation error:", error);
    return getFallbackOutcome(isWin, acquirer, amount, multiple, payout, equity, pitch.startup.market);
  }
}

function getFallbackOutcome(isWin: boolean, acquirer: string, amount: number, multiple: number, payout: string, equity: number, market: string): string {
  if (isWin) {
    const template = SUCCESS_OUTCOMES[Math.floor(Math.random() * SUCCESS_OUTCOMES.length)];
    return template
      .replace("{acquirer}", acquirer)
      .replace("{amount}", String(amount))
      .replace("{multiple}", String(Math.round(multiple)))
      .replace("{payout}", payout)
      .replace("{equity}", equity.toFixed(1))
      .replace("{market}", market);
  } else {
    return FAILURE_OUTCOMES[Math.floor(Math.random() * FAILURE_OUTCOMES.length)];
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
