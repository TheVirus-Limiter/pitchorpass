import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { useGeneratePitch, useSaveResult } from "@/hooks/use-game-api";
import { PitchCard } from "@/components/game/PitchCard";
import { InvestControls } from "@/components/game/InvestControls";
import { ArchetypeBadge } from "@/components/game/ArchetypeBadge";
import { Button } from "@/components/ui/button";
import { Loader2, DollarSign, Wallet, RotateCcw, Home as HomeIcon } from "lucide-react";
import type { Pitch } from "@shared/routes";

type GameState = "loading" | "playing" | "revealing" | "finished";

type Investment = {
  pitch: Pitch;
  amount: number;
  outcome: number; // 0 if bust, or multiplier amount
  isWin: boolean;
};

export default function Game() {
  const [_, setLocation] = useLocation();
  const [gameState, setGameState] = useState<GameState>("loading");
  const [capital, setCapital] = useState(100000);
  const [round, setRound] = useState(1);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [currentPitch, setCurrentPitch] = useState<Pitch | null>(null);
  
  // Hooks
  const generatePitch = useGeneratePitch();
  const saveResult = useSaveResult();

  // Load first pitch on mount
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
        // Retry or show error - minimal handling for now
        setTimeout(loadNextPitch, 1000);
      }
    });
  };

  const handleDecision = (investAmount: number) => {
    if (!currentPitch) return;

    // Calculate outcome immediately but hide it
    // Logic: if random > risk, multiply by upside. Else 0.
    const isWin = Math.random() > currentPitch.startup.risk;
    const outcome = isWin ? investAmount * currentPitch.startup.upside : 0;

    const newInvestment: Investment = {
      pitch: currentPitch,
      amount: investAmount,
      outcome,
      isWin
    };

    setInvestments([...investments, newInvestment]);
    setCapital(prev => prev - investAmount); // Deduct immediately

    if (round < 10) {
      setRound(prev => prev + 1);
      loadNextPitch();
    } else {
      setGameState("revealing");
    }
  };

  // Reveal sequence logic
  const [revealIndex, setRevealIndex] = useState(0);
  const [displayedCapital, setDisplayedCapital] = useState(0); // For end game

  // Initialize displayed capital when entering reveal phase
  useEffect(() => {
    if (gameState === "revealing") {
      setDisplayedCapital(capital); // Start with remaining cash
      
      const interval = setInterval(() => {
        setRevealIndex(prev => {
          if (prev >= 9) { // 10 rounds (0-9)
            clearInterval(interval);
            setTimeout(() => finishGame(), 2000);
            return prev;
          }
          return prev + 1;
        });
      }, 2500); // Time per reveal

      return () => clearInterval(interval);
    }
  }, [gameState]);

  // Effect to update capital during reveal
  useEffect(() => {
    if (gameState === "revealing" && revealIndex < investments.length) {
      const inv = investments[revealIndex];
      // Add the outcome to displayed capital
      // We need to delay this slightly to match the animation of the card flip if we had one
      // For now, simple addition
      setDisplayedCapital(prev => prev + inv.outcome);
    }
  }, [revealIndex, gameState]);

  const finishGame = () => {
    // Calculate final stats
    const finalScore = investments.reduce((acc, inv) => acc + inv.outcome, capital);
    
    // Determine Archetype
    let archetype = "The Conservative";
    const totalInvested = investments.reduce((acc, inv) => acc + inv.amount, 0);
    const riskTakerScore = investments.filter(i => i.amount > 10000).length;
    
    if (finalScore > 500000) archetype = "The Visionary";
    else if (finalScore > 200000) archetype = "The Shark";
    else if (riskTakerScore > 5) archetype = "The Gambler";
    else if (finalScore < 50000) archetype = "The Bag Holder"; // funny fallback

    saveResult.mutate({
      score: Math.round(finalScore),
      archetype,
      details: JSON.stringify(investments.map(i => ({ name: i.pitch.startup.name, win: i.isWin, gain: i.outcome }))),
      createdAt: new Date().toISOString()
    });

    if (finalScore > 150000) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    setGameState("finished");
    setDisplayedCapital(finalScore); // Ensure consistency
  };

  // -- RENDER HELPERS --

  if (gameState === "loading" && !currentPitch) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground animate-pulse">Scouting deal flow...</p>
      </div>
    );
  }

  // HEADER (Always visible except maybe final screen)
  const Header = () => (
    <div className="fixed top-0 left-0 w-full p-4 z-50 flex justify-between items-center bg-background/80 backdrop-blur-md border-b border-white/5">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/20">
          <span className="font-bold text-primary text-sm">{round}/10</span>
        </div>
        <span className="hidden md:inline text-sm font-medium text-muted-foreground uppercase tracking-wider">Round</span>
      </div>
      
      <div className="flex items-center gap-3 bg-secondary/30 px-4 py-2 rounded-full border border-white/10">
        <Wallet className="w-4 h-4 text-emerald-400" />
        <span className="font-mono font-bold text-xl text-emerald-400">
          ${(gameState === "revealing" || gameState === "finished" ? displayedCapital : capital).toLocaleString()}
        </span>
      </div>
    </div>
  );

  // PLAYING STATE
  if (gameState === "loading" || gameState === "playing") {
    return (
      <div className="min-h-screen bg-background pt-24 pb-32 px-4 relative overflow-hidden">
        <Header />
        
        {/* Background blobs */}
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -z-10" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] -z-10" />

        <div className="max-w-2xl mx-auto relative min-h-[600px]">
          <AnimatePresence mode="wait">
            {gameState === "loading" ? (
               <motion.div 
                 key="loader"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 className="absolute inset-0 flex items-center justify-center z-20"
               >
                 <Loader2 className="w-16 h-16 text-primary animate-spin" />
               </motion.div>
            ) : (
              <motion.div
                key={currentPitch?.startup.name}
                initial={{ x: 300, opacity: 0, rotate: 5 }}
                animate={{ x: 0, opacity: 1, rotate: 0 }}
                exit={{ x: -300, opacity: 0, rotate: -5 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="w-full"
              >
                {currentPitch && <PitchCard pitch={currentPitch} round={round} />}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="fixed bottom-0 left-0 w-full p-4 z-50">
          <InvestControls 
            maxInvest={capital} 
            onInvest={handleDecision} 
            onPass={() => handleDecision(0)}
            disabled={gameState === "loading"}
          />
        </div>
      </div>
    );
  }

  // REVEAL STATE
  if (gameState === "revealing") {
    const currentReveal = investments[revealIndex];
    if (!currentReveal) return null; // Should not happen

    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Header />
        <motion.div 
          key={revealIndex}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-xl w-full"
        >
          <h2 className="text-sm text-muted-foreground uppercase tracking-widest mb-4">3 Years Later...</h2>
          <div className="bg-card border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
            {/* Background flash based on win/loss */}
            <div className={`absolute inset-0 opacity-10 ${currentReveal.isWin ? 'bg-emerald-500' : 'bg-red-500'}`} />
            
            <h3 className="text-3xl font-bold mb-2 font-display">{currentReveal.pitch.startup.name}</h3>
            <p className="text-muted-foreground mb-8">
              You invested <span className="text-white font-mono">${currentReveal.amount.toLocaleString()}</span>
            </p>

            <div className="py-8 border-t border-white/5 border-b mb-8">
              <div className="text-5xl font-bold font-mono tracking-tighter">
                {currentReveal.isWin ? (
                  <span className="text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]">
                    +${currentReveal.outcome.toLocaleString()}
                  </span>
                ) : (
                  <span className="text-red-400 drop-shadow-[0_0_15px_rgba(248,113,113,0.5)]">
                    $0
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm font-medium">
                {currentReveal.isWin 
                  ? "MASSIVE SUCCESS! IPO LAUNCHED." 
                  : currentReveal.amount === 0 
                    ? "You passed. (Good call?)" 
                    : "BANKRUPT. FOUNDER FLED COUNTRY."}
              </p>
            </div>
            
            <div className="flex justify-between text-xs text-muted-foreground uppercase">
              <span>{revealIndex + 1} / 10 Revealed</span>
              <span>Net Worth Updating...</span>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // FINISHED STATE
  if (gameState === "finished") {
    // We already calculated archetype in finishGame, but for simplicity let's rely on server response or recalculate slightly for display if needed. 
    // Since we called mutate, we could use data from there, but we have local state.
    // Let's reuse the local calc logic or just pass props.
    
    // Quick recalc for display
    let archetype = "The Conservative";
    const score = displayedCapital;
    if (score > 500000) archetype = "The Visionary";
    else if (score > 200000) archetype = "The Shark";
    else if (investments.some(i => i.amount > 10000)) archetype = "The Gambler";
    else if (score < 50000) archetype = "The Bag Holder";

    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Victory BG */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background pointer-events-none" />
        
        <ArchetypeBadge archetype={archetype} score={displayedCapital} />
        
        <div className="mt-12 flex gap-4">
          <Button variant="outline" size="lg" onClick={() => setLocation("/")}>
            <HomeIcon className="mr-2 w-5 h-5" /> Home
          </Button>
          <Button size="lg" onClick={() => window.location.reload()}>
            <RotateCcw className="mr-2 w-5 h-5" /> Play Again
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
