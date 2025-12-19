import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { useGeneratePitch, useSaveResult } from "@/hooks/use-game-api";
import { PitchCard } from "@/components/game/PitchCard";
import { InvestControls } from "@/components/game/InvestControls";
import { ArchetypeBadge } from "@/components/game/ArchetypeBadge";
import { Button } from "@/components/ui/button";
import { Loader2, Wallet, RotateCcw, Home as HomeIcon } from "lucide-react";
import type { Pitch } from "@shared/routes";

type GameState = "loading" | "playing" | "revealing" | "finished";

type Investment = {
  pitch: Pitch;
  amount: number;
  ownership: number; // percentage
  outcome: number;
  isWin: boolean;
  narrative: string;
};

export default function Game() {
  const [_, setLocation] = useLocation();
  const [gameState, setGameState] = useState<GameState>("loading");
  const [capital, setCapital] = useState(100000);
  const [round, setRound] = useState(1);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [currentPitch, setCurrentPitch] = useState<Pitch | null>(null);
  
  const generatePitch = useGeneratePitch();
  const saveResult = useSaveResult();

  useEffect(() => {
    loadNextPitch();
  }, []);

  const loadNextPitch = () => {
    setGameState("loading");
    generatePitch.mutate(undefined, {
      onSuccess: (data) => {
        setCurrentPitch(data);
        setGameState("playing");
      },
      onError: () => {
        setTimeout(loadNextPitch, 1000);
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

    setInvestments([...investments, newInvestment]);
    setCapital(prev => prev - investAmount);

    if (round < 10) {
      setRound(prev => prev + 1);
      loadNextPitch();
    } else {
      setGameState("revealing");
    }
  };

  const [revealIndex, setRevealIndex] = useState(0);
  const [displayedCapital, setDisplayedCapital] = useState(0);

  useEffect(() => {
    if (gameState === "revealing") {
      setDisplayedCapital(capital);
      
      const interval = setInterval(() => {
        setRevealIndex(prev => {
          if (prev >= investments.length - 1) {
            clearInterval(interval);
            setTimeout(() => finishGame(), 2000);
            return prev;
          }
          return prev + 1;
        });
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [gameState]);

  useEffect(() => {
    if (gameState === "revealing" && revealIndex < investments.length) {
      const inv = investments[revealIndex];
      setDisplayedCapital(prev => prev + inv.outcome);
    }
  }, [revealIndex, gameState]);

  const finishGame = () => {
    const finalScore = investments.reduce((acc, inv) => acc + inv.outcome, capital);
    
    let archetype = "The Angel Investor";
    const totalInvested = investments.reduce((acc, inv) => acc + inv.amount, 0);
    const wins = investments.filter(i => i.isWin).length;
    const avgOwnership = investments.length > 0 
      ? investments.reduce((sum, i) => sum + i.ownership, 0) / investments.length 
      : 0;
    
    if (finalScore > 500000) archetype = "The Visionary";
    else if (finalScore > 300000) archetype = "The Shark";
    else if (wins >= 5) archetype = "The Golden Touch";
    else if (avgOwnership > 10) archetype = "The Concentrated Player";
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

  const Header = () => (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-6 bg-gradient-to-b from-background to-transparent">
      <div className="flex items-center gap-3 bg-blue-100 px-4 py-2 rounded-full border border-blue-200">
        <span className="text-sm font-bold text-blue-700">{round}/10</span>
        <span className="text-xs font-medium text-blue-600 uppercase">Round</span>
      </div>
      
      <div className="flex items-center gap-2 bg-emerald-100 px-6 py-3 rounded-full border border-emerald-200">
        <Wallet className="w-5 h-5 text-emerald-600" />
        <span className="font-mono font-bold text-lg text-emerald-700">
          ${(gameState === "revealing" || gameState === "finished" ? displayedCapital : capital).toLocaleString()}
        </span>
      </div>
    </div>
  );

  if (gameState === "loading" || gameState === "playing") {
    return (
      <div className="min-h-screen bg-background pt-32 pb-32">
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
                {currentPitch && <PitchCard pitch={currentPitch} round={round} />}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="fixed bottom-0 left-0 w-full z-50 bg-gradient-to-t from-background to-transparent pt-8 pb-6 px-4">
          <InvestControls 
            maxInvest={capital} 
            pitch={currentPitch}
            onInvest={handleDecision} 
            onPass={() => handleDecision(0)}
            disabled={gameState === "loading"}
          />
        </div>
      </div>
    );
  }

  if (gameState === "revealing") {
    const currentReveal = investments[revealIndex];
    if (!currentReveal) return null;

    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 pt-32">
        <Header />
        <motion.div 
          key={revealIndex}
          initial={{ scale: 0.8, opacity: 0, rotateY: 90 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          transition={{ duration: 0.6 }}
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
              You invested <span className="font-bold text-foreground">${currentReveal.amount.toLocaleString()}</span>
              {currentReveal.ownership > 0 && (
                <> for {currentReveal.ownership.toFixed(2)}% equity</>
              )}
            </p>

            <div className="py-8 border-t border-t-black/10 border-b border-b-black/10 mb-8">
              <div className="text-6xl font-bold font-mono tracking-tighter mb-3">
                {currentReveal.isWin ? (
                  <span className="text-emerald-600">+${currentReveal.outcome.toLocaleString()}</span>
                ) : (
                  <span className="text-red-600">-${currentReveal.amount.toLocaleString()}</span>
                )}
              </div>
              <p className="text-sm font-semibold text-foreground">
                {currentReveal.narrative || (currentReveal.isWin 
                  ? "MASSIVE SUCCESS!" 
                  : currentReveal.amount === 0 
                    ? "Passed on this opportunity." 
                    : "The company failed to execute.")}
              </p>
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
    const avgOwnership = investments.length > 0 
      ? investments.reduce((sum, i) => sum + i.ownership, 0) / investments.length 
      : 0;
    
    if (score > 500000) archetype = "The Visionary";
    else if (score > 300000) archetype = "The Shark";
    else if (wins >= 5) archetype = "The Golden Touch";
    else if (avgOwnership > 10) archetype = "The Concentrated Player";
    else if (score < 50000) archetype = "The Learning Investor";

    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden pt-24">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background pointer-events-none" />
        
        <ArchetypeBadge archetype={archetype} score={displayedCapital} />
        
        <div className="mt-12 flex flex-col sm:flex-row gap-4">
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => setLocation("/")}
            className="border-2 border-foreground/20 hover:border-foreground/40 hover:bg-gray-100"
          >
            <HomeIcon className="mr-2 w-5 h-5" /> Home
          </Button>
          <Button 
            size="lg" 
            onClick={() => window.location.reload()}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            <RotateCcw className="mr-2 w-5 h-5" /> Play Again
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
