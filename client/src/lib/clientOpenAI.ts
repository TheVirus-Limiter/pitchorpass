import OpenAI from 'openai';
import type { Pitch } from '@shared/schema';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

export const hasClientOpenAI = !!apiKey;

const openai = apiKey ? new OpenAI({
  apiKey,
  dangerouslyAllowBrowser: true
}) : null;

// Lumora Sleep easter egg (5% chance in Phase 1)
const LUMORA_SLEEP_PITCH: Pitch = {
  founder: {
    name: "Rehan & Ben",
    photo: "https://thevirus-limiter.github.io/filestorage/IMG_3945.png",
    country: "United States",
    gender: "male",
    credentials: ["Sleep technology enthusiasts", "Product designers"],
    conviction: "Calm, data-backed"
  },
  startup: {
    name: "Lumora Sleep",
    pitch: "Lumora Sleep reimagines rest through a luxury sleep mask designed to solve modern sleep disruptions. By addressing overheating, noise, and harsh wake-ups, Lumora integrates adaptive thermal control, bone-conduction audio, and a gentle sunrise wake light into a personalized sleep ritual. Built for comfort, sustainability, and everyday use, Lumora turns better sleep into an intentional lifestyle choice rather than a nightly struggle.",
    market: "Health Tech",
    traction: {
      users: 3200,
      monthlyGrowth: 22,
      revenue: 28000
    },
    risk: 0.2,
    upside: 12,
    valuation: 200000
  },
  ask: 50000,
  equityPercentage: 25,
  whiteboardNotes: [
    "Premium positioning in crowded sleep market",
    "Strong retention metrics - users become habitual",
    "Hardware + wellness hybrid could attract acquirers",
    "Unit economics look solid at current price point"
  ],
  news: [
    "Sleep tech market projected to reach $32B by 2027",
    "Wearable wellness devices see 40% YoY growth"
  ],
  isEasterEgg: true
};

export const LUMORA_SUCCESS_NARRATIVES = [
  "Lumora became a staple for people who took sleep seriously, turning nightly routines into a premium habit.",
  "What started as a sleep mask evolved into a daily ritual, with retention driven by comfort and habit, not hype.",
  "Lumora's blend of hardware and wellness features resonated with users looking for better sleep without pills or gimmicks.",
  "Lumora's loyal user base and proprietary sleep tech made it an attractive acquisition in the premium wellness space."
];

// Track if Lumora has already appeared in this session
let lumoraTriggeredThisSession = false;

export function getLumoraPitch(): Pitch {
  // Random upside between 4x and 20x
  const randomUpside = 4 + Math.random() * 16;
  return { 
    ...LUMORA_SLEEP_PITCH,
    startup: {
      ...LUMORA_SLEEP_PITCH.startup,
      upside: Math.round(randomUpside * 10) / 10
    }
  };
}

export function shouldTriggerLumoraEasterEgg(phase: number): boolean {
  // Only trigger in Phase 1, with 5% chance, and only once per session
  if (phase !== 1 || lumoraTriggeredThisSession) {
    return false;
  }
  const shouldTrigger = Math.random() < 0.05;
  if (shouldTrigger) {
    lumoraTriggeredThisSession = true;
  }
  return shouldTrigger;
}

export function resetLumoraEasterEgg(): void {
  lumoraTriggeredThisSession = false;
}

export async function generatePitchClient(phase: number): Promise<Pitch> {
  // 5% chance for Lumora Sleep easter egg in Phase 1
  if (shouldTriggerLumoraEasterEgg(phase)) {
    return getLumoraPitch();
  }

  if (!openai) throw new Error('No OpenAI API key configured');

  const isEarlyStage = phase === 1;
  // Phase 1: ask must be $30k-$60k (to meet $30k minimum in rounds 1-2)
  // Phase 2: ask $100k-$500k for later stage
  const valuationRange = isEarlyStage ? '$100k-$400k' : '$2M-$15M';
  const askRange = isEarlyStage ? '$30k-$60k' : '$100k-$500k';
  const exampleAsk = isEarlyStage ? 35000 : 150000;
  const exampleValuation = isEarlyStage ? 150000 : 5000000;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are a startup pitch generator for an investment simulation game. Generate realistic, diverse startup pitches. Each pitch MUST have a unique company name - never repeat names like EcoPack.`
      },
      {
        role: 'user',
        content: `Generate a ${isEarlyStage ? 'early-stage' : 'later-stage'} startup pitch.
        
IMPORTANT: The ask amount MUST be between ${askRange}. Valuation should be ${valuationRange}.

Return JSON with this exact structure:
{
  "founder": {
    "name": "Full Name",
    "photo": "",
    "country": "Country",
    "gender": "male or female (matching the name)",
    "credentials": ["credential1", "credential2"]
  },
  "startup": {
    "name": "Startup Name",
    "pitch": "2-3 sentence pitch",
    "market": "Industry/Market",
    "traction": {
      "users": 1000,
      "monthlyGrowth": 15,
      "revenue": 5000
    },
    "risk": 0.4,
    "upside": 3.5,
    "valuation": ${exampleValuation}
  },
  "ask": ${exampleAsk},
  "equityPercentage": 16.67,
  "whiteboardNotes": ["note1", "note2", "note3"]
}`
      }
    ],
    response_format: { type: 'json_object' }
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('No response from OpenAI');
  
  return JSON.parse(content) as Pitch;
}

// Helper to generate valuation history
function generateValuationHistory(initial: number, final: number, isWin: boolean): number[] {
  const points: number[] = [initial];
  if (isWin) {
    const growthRate = Math.pow(final / initial, 1/3);
    for (let i = 1; i <= 3; i++) {
      const base = initial * Math.pow(growthRate, i);
      const variation = base * (0.9 + Math.random() * 0.2);
      points.push(Math.round(variation));
    }
    points[3] = final;
  } else {
    const peakMultiple = 1.5 + Math.random() * 1.5;
    points.push(Math.round(initial * peakMultiple));
    points.push(Math.round(initial * peakMultiple * 0.5));
    points.push(0);
  }
  return points;
}

export async function generateOutcomeClient(params: {
  pitch: Pitch;
  invested: boolean;
  investmentAmount: number;
  equity: number;
  isWin: boolean;
}): Promise<{
  narrative: string;
  newsClippings: { source: string; headline: string }[];
  valuationHistory: number[];
  missedOpportunity: number;
}> {
  const { pitch, invested, investmentAmount, equity, isWin } = params;
  
  // Handle Lumora Sleep easter egg - always success
  if (pitch.isEasterEgg && pitch.startup.name === "Lumora Sleep") {
    const lumoraMultiple = pitch.startup.upside || 12;
    const lumoraInitialValuation = pitch.startup.valuation || 200000;
    const lumoraFinalValuation = lumoraInitialValuation * lumoraMultiple;
    const lumoraValuationHistory = generateValuationHistory(lumoraInitialValuation, lumoraFinalValuation, true);
    const lumoraNarrative = LUMORA_SUCCESS_NARRATIVES[Math.floor(Math.random() * LUMORA_SUCCESS_NARRATIVES.length)];
    const lumoraAskAmount = pitch.ask || 50000;
    const lumoraMissedOpportunity = !invested ? Math.round(lumoraAskAmount * lumoraMultiple) : 0;
    
    return {
      narrative: lumoraNarrative,
      newsClippings: [
        { source: "TechCrunch", headline: "Lumora Sleep raises Series A to expand luxury sleep mask line" },
        { source: "Forbes", headline: "How Lumora turned better sleep into a $2.4M exit" },
        { source: "Fast Company", headline: "The sleep tech startup that grew through habit, not hype" }
      ],
      valuationHistory: lumoraValuationHistory,
      missedOpportunity: lumoraMissedOpportunity
    };
  }

  if (!openai) throw new Error('No OpenAI API key configured');

  const startupName = pitch.startup.name;
  const valuation = pitch.startup.valuation;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You generate 3-year outcome narratives for startup investments in a simulation game. Be creative and realistic.`
      },
      {
        role: 'user',
        content: `Generate the 3-year outcome for ${startupName} (valued at $${valuation?.toLocaleString()}).
        
Player ${invested ? `invested $${investmentAmount.toLocaleString()} for ${equity.toFixed(1)}% equity` : 'passed on this opportunity'}.
Outcome: ${isWin ? 'SUCCESS' : 'FAILURE'}

Return JSON:
{
  "narrative": "2-3 paragraph story of what happened over 3 years",
  "newsClippings": [
    {"source": "TechCrunch", "headline": "Headline about this startup"},
    {"source": "Forbes", "headline": "Another headline"}
  ],
  "valuationHistory": [${valuation}, year1Val, year2Val, year3Val],
  "missedOpportunity": ${invested ? 0 : 'estimated profit if they had invested'}
}`
      }
    ],
    response_format: { type: 'json_object' }
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('No response from OpenAI');
  
  return JSON.parse(content);
}

export async function askFounderClient(question: string, pitch: Pitch): Promise<string> {
  if (!openai) throw new Error('No OpenAI API key configured');

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are ${pitch.founder.name}, founder of ${pitch.startup.name}. ${pitch.startup.pitch} Answer investor questions authentically.`
      },
      {
        role: 'user',
        content: question
      }
    ]
  });

  return response.choices[0]?.message?.content || "I'd be happy to discuss that further.";
}
