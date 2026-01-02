import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { useGeneratePitch, useSaveResult, useGenerateOutcome } from "@/hooks/use-game-api";
import { useDemoMode, isStaticMode, useClientAI } from "@/hooks/use-demo-mode";
import { generatePitchClient, generateOutcomeClient } from "@/lib/clientOpenAI";
import { PitchCard } from "@/components/game/PitchCard";
import { RevealCard } from "@/components/game/RevealCard";
import { ArchetypeBadge } from "@/components/game/ArchetypeBadge";
import { Button } from "@/components/ui/button";
import { Loader2, Wallet, RotateCcw, Home as HomeIcon } from "lucide-react";
import type { Pitch } from "@shared/schema";

type GameState = "loading" | "playing" | "revealing" | "finished";

type NewsClipping = {
  source: string;
  headline: string;
};

type Investment = {
  pitch: Pitch;
  amount: number;
  ownership: number;
  outcome: number;
  isWin: boolean;
  narrative: string;
  newsClippings: NewsClipping[];
  valuationHistory: number[];
  missedOpportunity: number;
};

export default function Game() {
  const [_, setLocation] = useLocation();
  const [gameState, setGameState] = useState<GameState>("loading");
  const [capital, setCapital] = useState(100000);
  const [round, setRound] = useState(1);
  const [phase, setPhase] = useState(1);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [currentPitch, setCurrentPitch] = useState<Pitch | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [phase2StartingCapital, setPhase2StartingCapital] = useState(0);
  
  const generatePitch = useGeneratePitch();
  const saveResult = useSaveResult();
  const generateOutcome = useGenerateOutcome();
  const demoMode = useDemoMode();
  const [loadingOutcomes, setLoadingOutcomes] = useState(false);

  useEffect(() => {
    loadNextPitch(1);
  }, []);

  const loadNextPitch = async (currentPhase: number = phase) => {
    setGameState("loading");
    
    if (isStaticMode && !useClientAI) {
      setTimeout(() => {
        const demoPitch = demoMode.getNextPitch(currentPhase);
        setCurrentPitch(demoPitch);
        setGameState("playing");
      }, 300);
      return;
    }
    
    if (useClientAI) {
      try {
        const pitch = await generatePitchClient(currentPhase);
        setCurrentPitch(pitch);
        setGameState("playing");
      } catch (error) {
        console.error("Client AI pitch generation failed:", error);
        const demoPitch = demoMode.getNextPitch(currentPhase);
        setCurrentPitch(demoPitch);
        setGameState("playing");
      }
      return;
    }
    
    generatePitch.mutate(currentPhase, {
      onSuccess: (data) => {
        setCurrentPitch(data);
        setGameState("playing");
      },
      onError: () => {
        setTimeout(() => loadNextPitch(currentPhase), 1000);
      }
    });
  };

  const handleDecision = (investAmount: number) => {
    if (!currentPitch) return;

    const ownership = currentPitch.startup.valuation 
      ? (investAmount / currentPitch.startup.valuation) * 100 
      : 0;

    let isWin: boolean;
    let outcome: number;
    let narrative = "";
    let newsClippings: NewsClipping[] = [];
    let valuationHistory: number[] = [];
    let missedOpportunity = 0;

    if (isStaticMode && !useClientAI) {
      const demoResult = demoMode.calculateOutcome(currentPitch.startup.name, investAmount, ownership);
      const demoOutcome = demoMode.getDemoOutcome(currentPitch.startup.name, investAmount > 0, investAmount, ownership);
      isWin = demoResult.isWin;
      outcome = investAmount > 0 ? demoResult.outcome : 0;
      narrative = demoOutcome.narrative;
      newsClippings = demoOutcome.newsClippings;
      valuationHistory = demoOutcome.valuationHistory;
      missedOpportunity = demoOutcome.missedOpportunity;
    } else {
      isWin = Math.random() > currentPitch.startup.risk;
      outcome = isWin ? investAmount * currentPitch.startup.upside : 0;
    }

    const newInvestment: Investment = {
      pitch: currentPitch,
      amount: investAmount,
      ownership: Math.round(ownership * 100) / 100,
      outcome,
      isWin,
      narrative,
      newsClippings,
      valuationHistory,
      missedOpportunity
    };

    setInvestments(prev => [...prev, newInvestment]);
    setCapital(prev => prev - investAmount);

    if (round === 5 && phase === 1) {
      // End of Phase 1 - Transition to revealing Phase 1 results
      setIsTransitioning(true);
      setGameState("revealing");
    } else if (round === 10) {
      // End of Game
      setGameState("revealing");
    } else {
      setRound(prev => prev + 1);
      loadNextPitch(phase);
    }
  };

  const activeInvestments = investments.filter(i => i.amount > 0).length;
  const canStillInvest = phase === 1 ? activeInvestments < 5 : activeInvestments < 10;

  const [revealIndex, setRevealIndex] = useState(0);
  const [displayedCapital, setDisplayedCapital] = useState(0);

  useEffect(() => {
    if (gameState === "revealing") {
      setDisplayedCapital(capital);
      const startIndex = phase === 1 ? 0 : 5;
      setRevealIndex(startIndex);
      
      if (isStaticMode && !useClientAI) {
        setLoadingOutcomes(false);
        return;
      }
      
      if (useClientAI) {
        const fetchClientOutcomes = async () => {
          setLoadingOutcomes(true);
          const endIndex = phase === 1 ? 5 : investments.length;
          
          for (let i = startIndex; i < endIndex; i++) {
            const inv = investments[i];
            if (!inv.narrative) {
              try {
                const outcomeData = await generateOutcomeClient({
                  pitch: inv.pitch,
                  invested: inv.amount > 0,
                  investmentAmount: inv.amount,
                  equity: inv.ownership,
                  isWin: inv.isWin
                });
                
                setInvestments(prev => prev.map((item, idx) => 
                  idx === i ? {
                    ...item,
                    narrative: outcomeData.narrative,
                    newsClippings: outcomeData.newsClippings || [],
                    valuationHistory: outcomeData.valuationHistory || [],
                    missedOpportunity: outcomeData.missedOpportunity || 0
                  } : item
                ));
              } catch (error) {
                console.error("Client AI outcome generation failed:", error);
              }
            }
          }
          setLoadingOutcomes(false);
        };
        
        fetchClientOutcomes();
        return;
      }
      
      const fetchOutcomes = async () => {
        setLoadingOutcomes(true);
        const endIndex = phase === 1 ? 5 : investments.length;
        
        for (let i = startIndex; i < endIndex; i++) {
          const inv = investments[i];
          if (!inv.narrative) {
            try {
              const outcomeData = await generateOutcome.mutateAsync({
                pitch: inv.pitch,
                invested: inv.amount > 0,
                investmentAmount: inv.amount,
                equity: inv.ownership,
                isWin: inv.isWin
              });
              
              setInvestments(prev => prev.map((item, idx) => 
                idx === i ? {
                  ...item,
                  narrative: outcomeData.narrative,
                  newsClippings: outcomeData.newsClippings || [],
                  valuationHistory: outcomeData.valuationHistory || [],
                  missedOpportunity: outcomeData.missedOpportunity || 0
                } : item
              ));
            } catch (error) {
              console.error("Failed to fetch outcome for investment", i, error);
            }
          }
        }
        setLoadingOutcomes(false);
      };
      
      fetchOutcomes();
    }
  }, [gameState, phase]);

  const handleNextReveal = () => {
    const endIndex = phase === 1 ? 5 : investments.length;
    const currentInv = investments[revealIndex];
    
    // Calculate the updated capital synchronously
    const nextDisplayedCapital = displayedCapital + (currentInv?.outcome || 0);
    setDisplayedCapital(nextDisplayedCapital);
    
    if (revealIndex >= endIndex - 1) {
      // All reveals done for this phase
      if (phase === 1 && isTransitioning) {
        // Moving to Phase 2
        const phase1Outcomes = investments.slice(0, 5).reduce((sum, inv) => sum + inv.outcome, 0);
        const newCapital = capital + phase1Outcomes;
        setCapital(newCapital);
        setDisplayedCapital(newCapital);
        setPhase2StartingCapital(newCapital);
        setPhase(2);
        setRound(6);
        setIsTransitioning(false);
        setGameState("loading");
        loadNextPitch(2);
      } else {
        // Pass the final calculated capital to finishGame
        finishGame(nextDisplayedCapital);
      }
    } else {
      setRevealIndex(prev => prev + 1);
    }
  };

  useEffect(() => {
    if (phase === 2 && round === 6 && gameState === "loading" && !currentPitch) {
       loadNextPitch(2);
    }
  }, [phase, round, gameState, currentPitch]);


  const finishGame = (finalCapital?: number) => {
    const finalScore = finalCapital ?? displayedCapital;
    
    let archetype = "The Angel Investor";
    const totalInvested = investments.reduce((acc, inv) => acc + inv.amount, 0);
    const wins = investments.filter(i => i.isWin).length;
    const losses = investments.filter(i => !i.isWin && i.amount > 0).length;
    const avgOwnership = investments.length > 0 
      ? investments.reduce((sum, i) => sum + i.ownership, 0) / investments.length 
      : 0;
    const winRate = investments.length > 0 ? (wins / investments.filter(i => i.amount > 0).length) * 100 : 0;
    
    if (finalScore > 1000000) archetype = "The Mogul";
    else if (finalScore > 500000) archetype = "The Visionary";
    else if (finalScore > 300000 && avgOwnership > 15) archetype = "The Shark";
    else if (winRate > 60 && wins >= 4) archetype = "The Golden Touch";
    else if (winRate > 50 && finalScore > 150000) archetype = "The Optimist";
    else if (avgOwnership > 12 && losses <= 3) archetype = "The Concentrated Player";
    else if (avgOwnership < 8 && losses <= 2) archetype = "The Diversifier";
    else if (finalScore > 120000 && losses <= 2) archetype = "The Cautious Investor";
    else if (finalScore < 50000) archetype = "The Learning Investor";

    if (!isStaticMode) {
      saveResult.mutate({
        score: Math.round(finalScore),
        archetype,
        details: JSON.stringify(investments.map(i => ({ 
          name: i.pitch.startup.name, 
          win: i.isWin, 
          gain: i.outcome,
          invested: i.amount
        }))),
        createdAt: new Date().toISOString()
      });
    }

    if (finalScore > 150000) {
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.5 }
      });
    }

    setGameState("finished");
    setDisplayedCapital(finalScore);
  };

  if (gameState === "loading" && !currentPitch) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground animate-pulse">Analyzing opportunity...</p>
      </div>
    );
  }

  const Header = () => {
    const phaseRound = phase === 1 ? round : round - 5;
    return (
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-6 bg-gradient-to-b from-background to-transparent">
        <div className="flex flex-col gap-1">
          <div className="inline-block bg-white border border-gray-400 px-3 py-1.5 rounded text-xs font-semibold text-gray-700 transform -rotate-1">
            Round {phaseRound}/5
          </div>
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
            Phase {phase}: {phase === 1 ? "Early Stage" : "Later Stage"}
          </div>
        </div>
        
        <div className="inline-block bg-white text-green-900 font-bold px-4 py-2 rounded border-2 border-green-600 text-sm">
          ${(gameState === "revealing" || gameState === "finished" ? displayedCapital : capital).toLocaleString()}
        </div>
      </div>
    );
  };

  if (gameState === "loading" || gameState === "playing") {
    return (
      <div className="min-h-screen bg-background pt-32 pb-6">
        <Header />
        
        <div className="max-w-7xl mx-auto px-4">
          <AnimatePresence mode="wait">
            {gameState === "loading" ? (
              <motion.div 
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center h-96"
              >
                <Loader2 className="w-16 h-16 text-primary animate-spin" />
              </motion.div>
            ) : (
              <motion.div
                key={currentPitch?.startup.name}
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                {currentPitch && (
                  <PitchCard 
                    pitch={currentPitch} 
                    round={round}
                    phase={phase}
                    maxInvest={capital}
                    onInvest={handleDecision}
                    onPass={() => handleDecision(0)}
                    disabled={false}
                    canInvestMore={canStillInvest}
                    totalInvestments={activeInvestments}
                    phase2StartingCapital={phase2StartingCapital}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  if (gameState === "revealing") {
    const currentReveal = investments[revealIndex];
    
    if (!currentReveal || loadingOutcomes && !currentReveal.narrative) {
      return (
        <div className="fixed inset-0 bg-gradient-to-br from-amber-100/95 via-stone-100/95 to-amber-50/95 flex flex-col items-center justify-center z-50">
          <Loader2 className="w-12 h-12 text-stone-600 animate-spin mb-4" />
          <p className="text-stone-600 font-medium" style={{ fontFamily: "'Caveat', cursive" }}>
            Gathering market intelligence...
          </p>
        </div>
      );
    }

    const endIndex = phase === 1 ? 5 : investments.length;
    const isLastReveal = revealIndex >= endIndex - 1;

    return (
      <RevealCard
        key={revealIndex}
        companyName={currentReveal.pitch.startup.name}
        investmentAmount={currentReveal.amount}
        ownership={currentReveal.ownership}
        outcome={currentReveal.outcome}
        isWin={currentReveal.isWin}
        narrative={currentReveal.narrative || (currentReveal.isWin 
          ? "The company executed well and found its market."
          : currentReveal.amount === 0 
            ? "" 
            : "The company struggled to find product-market fit.")}
        newsClippings={currentReveal.newsClippings || []}
        valuationHistory={currentReveal.valuationHistory || []}
        missedOpportunity={currentReveal.missedOpportunity || 0}
        onNext={handleNextReveal}
        isLast={isLastReveal && phase === 2}
        invested={currentReveal.amount > 0}
      />
    );
  }

  if (gameState === "finished") {
    let archetype = "The Angel Investor";
    const score = displayedCapital;
    const wins = investments.filter(i => i.isWin).length;
    const losses = investments.filter(i => !i.isWin && i.amount > 0).length;
    const avgOwnership = investments.length > 0 
      ? investments.reduce((sum, i) => sum + i.ownership, 0) / investments.length 
      : 0;
    const totalGain = investments.reduce((sum, i) => sum + i.outcome, 0);
    const winRate = investments.length > 0 ? (wins / investments.filter(i => i.amount > 0).length) * 100 : 0;
    
    if (score > 1000000) archetype = "The Mogul";
    else if (score > 500000) archetype = "The Visionary";
    else if (score > 300000 && avgOwnership > 15) archetype = "The Shark";
    else if (winRate > 60 && wins >= 4) archetype = "The Golden Touch";
    else if (winRate > 50 && score > 150000) archetype = "The Optimist";
    else if (avgOwnership > 12 && losses <= 3) archetype = "The Concentrated Player";
    else if (avgOwnership < 8 && losses <= 2) archetype = "The Diversifier";
    else if (score > 120000 && losses <= 2) archetype = "The Cautious Investor";
    else if (score < 50000) archetype = "The Learning Investor";

    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden pt-24">
        <ArchetypeBadge archetype={archetype} score={displayedCapital} investments={investments} />
        
        <div className="mt-16 flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => setLocation("/")}
            className="px-6 py-3 text-base font-semibold uppercase text-gray-700 border border-gray-400 rounded hover:bg-gray-100 transition-colors"
            style={{fontFamily: "'Caveat', cursive"}}
          >
            Home
          </button>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 text-base font-bold uppercase text-white bg-green-700 hover:bg-green-800 rounded transition-colors"
            style={{fontFamily: "'Caveat', cursive"}}
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return null;
}
