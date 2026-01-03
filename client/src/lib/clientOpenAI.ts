import OpenAI from 'openai';
import type { Pitch } from '@shared/schema';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

export const hasClientOpenAI = !!apiKey;

const openai = apiKey ? new OpenAI({
  apiKey,
  dangerouslyAllowBrowser: true
}) : null;

export async function generatePitchClient(phase: number): Promise<Pitch> {
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
  if (!openai) throw new Error('No OpenAI API key configured');

  const { pitch, invested, investmentAmount, equity, isWin } = params;
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
