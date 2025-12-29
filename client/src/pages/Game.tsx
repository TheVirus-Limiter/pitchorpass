import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { useGeneratePitch, useSaveResult } from "@/hooks/use-game-api";
import { PitchCard } from "@/components/game/PitchCard";
import { ArchetypeBadge } from "@/components/game/ArchetypeBadge";
import { Button } from "@/components/ui/button";
import { Loader2, Wallet, RotateCcw, Home as HomeIcon } from "lucide-react";
import type { Pitch } from "@shared/schema";

type GameState = "loading" | "playing" | "revealing" | "finished";

type Investment = {
  pitch: Pitch;
  amount: number;
  ownership: number;
  outcome: number;
  isWin: boolean;
  narrative: string;
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
  
  const generatePitch = useGeneratePitch();
  const saveResult = useSaveResult();

  useEffect(() => {
    loadNextPitch(1);
  }, []);

  const loadNextPitch = (currentPhase: number = phase) => {
    setGameState("loading");
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

    const isWin = Math.random() > currentPitch.startup.risk;
    const outcome = isWin ? investAmount * currentPitch.startup.upside : 0;
    const ownership = currentPitch.startup.valuation 
      ? (investAmount / currentPitch.startup.valuation) * 100 
      : 0;

    const newInvestment: Investment = {
      pitch: currentPitch,
      amount: investAmount,
      ownership: Math.round(ownership * 100) / 100,
      outcome,
      isWin,
      narrative: ""
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
      const endIndex = phase === 1 ? 5 : 10;
      setRevealIndex(startIndex);

      const interval = setInterval(() => {
        setRevealIndex(prev => {
          if (prev >= endIndex - 1) {
            clearInterval(interval);
            setTimeout(() => {
              if (phase === 1 && isTransitioning) {
                // Moving to Phase 2 - carry over the updated capital from phase 1 reveals
                const phase1Outcomes = investments.slice(0, 5).reduce((sum, inv) => sum + inv.outcome, 0);
                const newCapital = capital + phase1Outcomes;
                setCapital(newCapital);
                setDisplayedCapital(newCapital);
                setPhase(2);
                setRound(6);
                setIsTransitioning(false);
                setGameState("loading");
                loadNextPitch(2);
              } else {
                finishGame();
              }
            }, 2000);
            return prev;
          }
          return prev + 1;
        });
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [gameState, phase, isTransitioning]);

  useEffect(() => {
    if (phase === 2 && round === 6 && gameState === "loading" && !currentPitch) {
       loadNextPitch(2);
    }
  }, [phase, round, gameState, currentPitch]);

  useEffect(() => {
    if (gameState === "revealing" && revealIndex < investments.length) {
      const inv = investments[revealIndex];
      setDisplayedCapital(prev => prev + inv.outcome);
    }
  }, [revealIndex, gameState]);

  const finishGame = () => {
    const finalScore = displayedCapital;
    
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
    if (!currentReveal) return null;

    // Calculate what opportunity cost would have been (if passed)
    const missedGain = currentReveal.amount === 0 
      ? (currentReveal.pitch.startup.valuation || 100000) * currentReveal.pitch.startup.upside * 0.1 
      : 0;

    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 pt-32">
        <Header />
        <motion.div 
          key={revealIndex}
          initial={{ scale: 0.8, opacity: 0, rotateY: 90 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="text-center max-w-2xl w-full"
        >
          <h2 className="text-sm text-muted-foreground uppercase tracking-widest mb-8 font-bold">3 Years Later...</h2>
          
          <div className={`p-12 rounded-2xl border-2 ${
            currentReveal.isWin 
              ? 'bg-emerald-50 border-emerald-300' 
              : 'bg-red-50 border-red-300'
          }`}>
            <h3 className="text-4xl font-bold mb-2 text-foreground">{currentReveal.pitch.startup.name}</h3>
            <p className="text-muted-foreground mb-8">
              You {currentReveal.amount === 0 ? "passed on" : "invested"} <span className="font-bold text-foreground">${currentReveal.amount.toLocaleString()}</span>
              {currentReveal.ownership > 0 && (
                <> for {currentReveal.ownership.toFixed(2)}% equity</>
              )}
            </p>

            <div className="py-8 border-t border-t-black/10 border-b border-b-black/10 mb-8">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-6xl font-bold font-mono tracking-tighter mb-3"
              >
                {currentReveal.isWin ? (
                  <span className="text-emerald-600">+${currentReveal.outcome.toLocaleString()}</span>
                ) : currentReveal.amount === 0 ? (
                  <span className="text-yellow-600">${missedGain.toLocaleString()}</span>
                ) : (
                  <span className="text-red-600">-${currentReveal.amount.toLocaleString()}</span>
                )}
              </motion.div>
              <p className="text-sm font-semibold text-foreground">
                {currentReveal.narrative || (currentReveal.isWin 
                  ? "MASSIVE SUCCESS!" 
                  : currentReveal.amount === 0 
                    ? "Passed on this opportunity." 
                    : "The company failed to execute.")}
              </p>
              {currentReveal.amount === 0 && missedGain > 0 && (
                <p className="text-xs text-yellow-700 mt-4 italic">
                  Missed opportunity: If you'd invested $10k, you'd have made ~${(missedGain * 0.1).toLocaleString()}
                </p>
              )}
            </div>
            
            <div className="flex justify-between text-xs text-muted-foreground uppercase font-bold">
              <span>{revealIndex + 1} / {investments.length} Revealed</span>
              <span>Portfolio Updating...</span>
            </div>
          </div>
        </motion.div>
      </div>
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
        <ArchetypeBadge archetype={archetype} score={displayedCapital} />
        
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
