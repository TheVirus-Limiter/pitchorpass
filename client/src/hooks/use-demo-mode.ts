import { useState, useCallback } from 'react';
import { demoPitches, calculateDemoOutcome, getMissedOpportunity, type DemoPitch } from '@/data/demoData';
import type { Pitch } from '@shared/schema';

export const isStaticMode = import.meta.env.VITE_STATIC_MODE === 'true' || 
  (typeof window !== 'undefined' && window.location.protocol === 'file:');

function demoPitchToGamePitch(demo: DemoPitch, phase: number): Pitch {
  const tractionParts = demo.startup.traction.split(',');
  const users = parseInt(tractionParts[0]?.match(/\d+/)?.[0] || '1000') || 1000;
  
  return {
    founder: {
      name: demo.startup.founderName,
      photo: '',
      country: 'USA',
      credentials: [demo.startup.founderBackground]
    },
    startup: {
      name: demo.startup.name,
      pitch: demo.startup.pitch,
      market: demo.startup.industry,
      traction: {
        users: users,
        monthlyGrowth: 15,
        revenue: demo.startup.askAmount * 2
      },
      risk: demo.outcome.success ? 0.3 : 0.7,
      upside: demo.outcome.multiplier,
      valuation: demo.startup.valuation
    },
    ask: demo.startup.askAmount,
    equityPercentage: Math.min((demo.startup.askAmount / demo.startup.valuation) * 100, 49),
    whiteboardNotes: [demo.startup.tagline, demo.startup.stage, demo.startup.traction]
  };
}

export function useDemoMode() {
  const [pitchIndex, setPitchIndex] = useState({ phase1: 0, phase2: 0 });

  const getNextPitch = useCallback((phase: number): Pitch => {
    const phaseData = phase === 1 ? demoPitches.slice(0, 5) : demoPitches.slice(5, 10);
    const currentIndex = phase === 1 ? pitchIndex.phase1 : pitchIndex.phase2;
    const demo = phaseData[currentIndex % phaseData.length];
    
    if (phase === 1) {
      setPitchIndex(prev => ({ ...prev, phase1: prev.phase1 + 1 }));
    } else {
      setPitchIndex(prev => ({ ...prev, phase2: prev.phase2 + 1 }));
    }
    
    return demoPitchToGamePitch(demo, phase);
  }, [pitchIndex]);

  const getDemoOutcome = useCallback((
    pitchName: string, 
    invested: boolean, 
    investmentAmount: number, 
    ownership: number
  ) => {
    const demo = demoPitches.find(p => p.startup.name === pitchName);
    if (!demo) {
      return {
        narrative: "The company's journey was unremarkable.",
        newsClippings: [],
        valuationHistory: [100000, 100000, 100000],
        missedOpportunity: 0
      };
    }

    const missedOpp = !invested ? getMissedOpportunity(demo, demo.startup.askAmount, demo.startup.valuation) : 0;

    return {
      narrative: demo.outcome.narrative,
      newsClippings: demo.outcome.newsClippings,
      valuationHistory: demo.outcome.valuationHistory,
      missedOpportunity: missedOpp
    };
  }, []);

  const calculateOutcome = useCallback((pitchName: string, investmentAmount: number, ownership: number) => {
    const demo = demoPitches.find(p => p.startup.name === pitchName);
    if (!demo) {
      return { outcome: 0, isWin: false };
    }
    return calculateDemoOutcome(demo, investmentAmount, ownership);
  }, []);

  return {
    isStatic: isStaticMode,
    getNextPitch,
    getDemoOutcome,
    calculateOutcome
  };
}
