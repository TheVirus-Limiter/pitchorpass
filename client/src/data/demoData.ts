export interface DemoStartup {
  name: string;
  tagline: string;
  industry: string;
  stage: string;
  traction: string;
  askAmount: number;
  valuation: number;
  founderName: string;
  founderBackground: string;
  pitch: string;
  convictionLevel: 'low' | 'medium' | 'high';
}

export interface DemoOutcome {
  success: boolean;
  multiplier: number;
  narrative: string;
  newsClippings: { source: string; headline: string }[];
  valuationHistory: number[];
}

export interface DemoPitch {
  startup: DemoStartup;
  outcome: DemoOutcome;
}

const earlyStageData: DemoPitch[] = [
  {
    startup: {
      name: "Petwise",
      tagline: "AI-powered pet health monitoring",
      industry: "Pet Tech",
      stage: "Pre-seed",
      traction: "2,400 beta users, 78% weekly retention",
      askAmount: 35000,
      valuation: 150000,
      founderName: "Sarah Chen",
      founderBackground: "Former veterinarian, 8 years clinical experience",
      pitch: "Every pet owner worries about their furry friend's health. Petwise uses computer vision to detect early signs of illness through daily photo check-ins. We've got 2,400 beta users who check in almost every day.",
      convictionLevel: 'high'
    },
    outcome: {
      success: true,
      multiplier: 8.5,
      narrative: "Petwise caught the attention of pet insurance companies looking to reduce claims through early detection. After Series A, they partnered with three major insurers and expanded to cats.",
      newsClippings: [
        { source: "TechCrunch", headline: "Petwise raises $12M Series A to expand AI pet diagnostics" },
        { source: "VentureBeat", headline: "How one startup is changing preventive pet care" }
      ],
      valuationHistory: [150000, 800000, 4200000]
    }
  },
  {
    startup: {
      name: "CarbonTrace",
      tagline: "Supply chain emissions tracking",
      industry: "Climate Tech",
      stage: "Seed",
      traction: "3 enterprise pilots, $180K ARR",
      askAmount: 40000,
      valuation: 280000,
      founderName: "Marcus Webb",
      founderBackground: "Ex-McKinsey sustainability practice, MIT MBA",
      pitch: "Companies are under pressure to report Scope 3 emissions but have no way to track them. We integrate with ERP systems to automatically calculate supply chain carbon footprint.",
      convictionLevel: 'medium'
    },
    outcome: {
      success: false,
      multiplier: 0,
      narrative: "Despite strong early interest, CarbonTrace struggled with enterprise sales cycles. When EU regulations were delayed, their runway ran out before they could close enough contracts.",
      newsClippings: [
        { source: "CleanTech", headline: "Carbon accounting startup CarbonTrace shuts down amid funding crunch" }
      ],
      valuationHistory: [280000, 420000, 0]
    }
  },
  {
    startup: {
      name: "Moodly",
      tagline: "Emotion tracking for remote teams",
      industry: "HR Tech",
      stage: "Pre-seed",
      traction: "800 daily active users across 12 companies",
      askAmount: 30000,
      valuation: 120000,
      founderName: "Priya Patel",
      founderBackground: "Psychologist turned product manager at Slack",
      pitch: "Remote work made it harder to read the room. Moodly gives managers a daily pulse on team sentiment without intrusive surveys. Quick emoji check-ins that take 5 seconds.",
      convictionLevel: 'low'
    },
    outcome: {
      success: true,
      multiplier: 3.2,
      narrative: "Moodly found its niche with mid-size remote-first companies. They were acquired by a larger HR platform looking to add engagement features to their suite.",
      newsClippings: [
        { source: "HR Dive", headline: "Culture Amp acquires Moodly to bolster engagement toolkit" }
      ],
      valuationHistory: [120000, 280000, 380000]
    }
  },
  {
    startup: {
      name: "FreshRoute",
      tagline: "Last-mile grocery optimization",
      industry: "Logistics",
      stage: "Seed",
      traction: "$45K MRR, 8 grocery chains on platform",
      askAmount: 35000,
      valuation: 200000,
      founderName: "David Kim",
      founderBackground: "10 years at Amazon logistics, built their fresh delivery routing",
      pitch: "Grocery delivery has a spoilage problem. Our routing algorithm prioritizes temperature-sensitive items and reduces waste by 23%. We're already working with 8 regional chains.",
      convictionLevel: 'high'
    },
    outcome: {
      success: false,
      multiplier: 0,
      narrative: "FreshRoute gained traction but couldn't compete when major delivery platforms built similar features in-house. Their grocery partners consolidated to larger providers.",
      newsClippings: [
        { source: "Grocery Dive", headline: "Small grocery tech players struggle as giants build in-house" }
      ],
      valuationHistory: [200000, 350000, 0]
    }
  },
  {
    startup: {
      name: "TinyLegal",
      tagline: "AI contract review for small businesses",
      industry: "Legal Tech",
      stage: "Pre-seed",
      traction: "1,200 contracts reviewed, 4.8 star rating",
      askAmount: 30000,
      valuation: 180000,
      founderName: "Jennifer Walsh",
      founderBackground: "Former small business attorney, frustrated by access gap",
      pitch: "Small businesses sign contracts they don't understand because lawyers are too expensive. TinyLegal uses GPT to flag risky clauses and explain terms in plain English. $29/month unlimited reviews.",
      convictionLevel: 'medium'
    },
    outcome: {
      success: true,
      multiplier: 15.4,
      narrative: "TinyLegal rode the AI wave perfectly. As GPT models improved, their product got dramatically better. They expanded to lease reviews and became the default tool for solo entrepreneurs.",
      newsClippings: [
        { source: "Forbes", headline: "This AI startup is democratizing legal review for small business" },
        { source: "TechCrunch", headline: "TinyLegal hits $5M ARR with AI-powered contract analysis" }
      ],
      valuationHistory: [180000, 1200000, 12500000]
    }
  }
];

const laterStageData: DemoPitch[] = [
  {
    startup: {
      name: "Stellarize",
      tagline: "Developer productivity analytics",
      industry: "DevTools",
      stage: "Series A",
      traction: "$2.1M ARR, 340 enterprise customers",
      askAmount: 180000,
      valuation: 8500000,
      founderName: "Alex Torres",
      founderBackground: "Staff engineer at Google, built internal dev metrics",
      pitch: "Engineering managers fly blind. They don't know if their teams are stuck, burning out, or shipping fast. Stellarize analyzes git, Jira, and Slack to surface actionable insights without surveillance vibes.",
      convictionLevel: 'high'
    },
    outcome: {
      success: true,
      multiplier: 4.8,
      narrative: "The developer productivity space heated up. Stellarize's privacy-first approach resonated with engineering leaders, and they were acquired by GitLab to enhance their platform analytics.",
      newsClippings: [
        { source: "The Information", headline: "GitLab acquires Stellarize for $185M" },
        { source: "VentureBeat", headline: "Developer analytics consolidation continues with GitLab-Stellarize deal" }
      ],
      valuationHistory: [8500000, 22000000, 42000000]
    }
  },
  {
    startup: {
      name: "HomeChef AI",
      tagline: "Personalized meal planning with smart pantry",
      industry: "Consumer App",
      stage: "Series A",
      traction: "890K downloads, 12% paid conversion",
      askAmount: 150000,
      valuation: 6200000,
      founderName: "Maria Santos",
      founderBackground: "Former Blue Apron head of product",
      pitch: "Meal planning apps fail because they ignore what's already in your fridge. HomeChef AI scans your pantry, learns your taste, and generates recipes that minimize waste. Our users cook 3x more at home.",
      convictionLevel: 'medium'
    },
    outcome: {
      success: false,
      multiplier: 0,
      narrative: "Consumer app economics proved brutal. Despite good retention, customer acquisition costs kept rising. When their Series B fell through, they couldn't sustain marketing spend.",
      newsClippings: [
        { source: "TechCrunch", headline: "HomeChef AI joins list of consumer app casualties in funding winter" }
      ],
      valuationHistory: [6200000, 8100000, 0]
    }
  },
  {
    startup: {
      name: "Quantum Shield",
      tagline: "Post-quantum encryption for enterprises",
      industry: "Cybersecurity",
      stage: "Series A",
      traction: "$3.8M ARR, DOD pilot contract",
      askAmount: 220000,
      valuation: 12000000,
      founderName: "Dr. Nathan Park",
      founderBackground: "PhD quantum computing Stanford, NSA contractor",
      pitch: "Quantum computers will break current encryption within 10 years. Enterprises need to start migrating now. We're the only solution with a DOD pilot and we're 3x faster than competitors.",
      convictionLevel: 'high'
    },
    outcome: {
      success: true,
      multiplier: 7.2,
      narrative: "When major breaches made quantum threats feel real, Quantum Shield's early positioning paid off. They became the standard for government contractors and expanded into financial services.",
      newsClippings: [
        { source: "WSJ", headline: "Pentagon mandates quantum-safe encryption for contractors" },
        { source: "Wired", headline: "The race to quantum-proof the internet is accelerating" }
      ],
      valuationHistory: [12000000, 45000000, 95000000]
    }
  },
  {
    startup: {
      name: "Verdant",
      tagline: "Indoor farming automation",
      industry: "AgTech",
      stage: "Series A",
      traction: "14 facilities using platform, $1.9M ARR",
      askAmount: 200000,
      valuation: 9800000,
      founderName: "James Liu",
      founderBackground: "Founder sold previous AgTech startup to John Deere",
      pitch: "Indoor farms are the future but they're too expensive to operate. Our AI optimizes lighting, nutrients, and harvest timing to cut operating costs 40%. We're already in 14 facilities.",
      convictionLevel: 'medium'
    },
    outcome: {
      success: true,
      multiplier: 2.1,
      narrative: "Verdant grew steadily but the indoor farming market consolidated. They merged with a larger competitor rather than risk a down round, giving investors a modest return.",
      newsClippings: [
        { source: "AgFunder", headline: "Verdant merges with AppHarvest in indoor farming consolidation" }
      ],
      valuationHistory: [9800000, 14500000, 18200000]
    }
  },
  {
    startup: {
      name: "Lexicon",
      tagline: "Real-time language translation for video calls",
      industry: "Enterprise SaaS",
      stage: "Series A",
      traction: "$4.2M ARR, Zoom partnership announced",
      askAmount: 250000,
      valuation: 15000000,
      founderName: "Yuki Tanaka",
      founderBackground: "Led Google Translate ML team for 6 years",
      pitch: "Global teams waste hours on language barriers. Lexicon provides real-time dubbing for video calls with lip sync. We just announced our Zoom partnership and have 200 enterprises on the waitlist.",
      convictionLevel: 'high'
    },
    outcome: {
      success: true,
      multiplier: 12.5,
      narrative: "The Zoom partnership unlocked massive distribution. Lexicon became the default translation layer for enterprise video, and they IPO'd as part of the AI infrastructure boom.",
      newsClippings: [
        { source: "Bloomberg", headline: "Lexicon IPO prices above range as AI translation demand surges" },
        { source: "Fortune", headline: "How Lexicon became the Babel fish for business" }
      ],
      valuationHistory: [15000000, 85000000, 380000000]
    }
  }
];

export const demoPitches: DemoPitch[] = [...earlyStageData, ...laterStageData];

export function calculateDemoOutcome(pitch: DemoPitch, investmentAmount: number, ownership: number) {
  const { outcome } = pitch;
  
  if (!outcome.success || outcome.multiplier === 0) {
    return {
      outcome: 0,
      isWin: false,
      profit: -investmentAmount
    };
  }
  
  const finalValuation = outcome.valuationHistory[outcome.valuationHistory.length - 1];
  const exitValue = finalValuation * (ownership / 100);
  
  return {
    outcome: Math.round(exitValue),
    isWin: exitValue > investmentAmount,
    profit: Math.round(exitValue - investmentAmount)
  };
}

export function getMissedOpportunity(pitch: DemoPitch, askAmount: number, valuation: number) {
  if (!pitch.outcome.success) return 0;
  
  const potentialOwnership = Math.min((askAmount / valuation) * 100, 49);
  const finalValuation = pitch.outcome.valuationHistory[pitch.outcome.valuationHistory.length - 1];
  return Math.round(finalValuation * (potentialOwnership / 100));
}
