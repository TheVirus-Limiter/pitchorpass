import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Target, Zap, Shield, Lightbulb, Star, Circle } from "lucide-react";
import { useMemo } from "react";

interface Investment {
  pitch: { startup: { name: string } };
  amount: number;
  outcome: number;
  isWin: boolean;
}

interface ArchetypeBadgeProps {
  archetype: string;
  score: number;
  investments: Investment[];
}

const archetypeDetails: Record<string, { icon: any; stampColor: string; description: string }> = {
  "The Mogul": {
    icon: Star,
    stampColor: "text-amber-700",
    description: "High conviction, concentrated bets."
  },
  "The Visionary": {
    icon: Lightbulb,
    stampColor: "text-amber-600",
    description: "Strong portfolio, smart timing."
  },
  "The Shark": {
    icon: TrendingUp,
    stampColor: "text-blue-700",
    description: "Aggressive but calculated."
  },
  "The Golden Touch": {
    icon: Zap,
    stampColor: "text-emerald-700",
    description: "Exceptional winner-picking."
  },
  "The Diversifier": {
    icon: Target,
    stampColor: "text-teal-700",
    description: "Balanced, risk-managed portfolio."
  },
  "The Concentrated Player": {
    icon: Target,
    stampColor: "text-purple-700",
    description: "High conviction, all-in approach."
  },
  "The Angel Investor": {
    icon: Shield,
    stampColor: "text-stone-600",
    description: "Balanced approach across deals."
  },
  "The Optimist": {
    icon: Zap,
    stampColor: "text-green-700",
    description: "Mostly winners."
  },
  "The Cautious Investor": {
    icon: Shield,
    stampColor: "text-orange-700",
    description: "Conservative, measured bets."
  },
  "The Learning Investor": {
    icon: Lightbulb,
    stampColor: "text-red-700",
    description: "Early stage lessons."
  }
};

const formatMoney = (val: number) => {
  const absVal = Math.abs(val);
  if (absVal >= 1000000000) {
    return `$${(val / 1000000000).toFixed(2)}B`;
  }
  if (absVal >= 1000000) {
    return `$${(val / 1000000).toFixed(2)}M`;
  }
  if (absVal >= 1000) {
    return `$${(val / 1000).toFixed(0)}K`;
  }
  return `$${val.toLocaleString()}`;
};

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function ArchetypeBadge({ archetype, score, investments }: ArchetypeBadgeProps) {
  const details = archetypeDetails[archetype] || archetypeDetails["The Angel Investor"];
  const Icon = details.icon;

  const multiplier = Math.round((score / 100000) * 100) / 100;
  const profit = score - 100000;

  const invested = investments.filter(i => i.amount > 0);
  const wins = invested.filter(i => i.isWin);
  const losses = invested.filter(i => !i.isWin);
  const passes = investments.filter(i => i.amount === 0);
  const missedWins = passes.filter(i => i.isWin);

  const biggestWin = wins.length > 0 
    ? wins.reduce((max, inv) => inv.outcome > max.outcome ? inv : max, wins[0])
    : null;

  const marginNotes = useMemo(() => {
    const notes: { text: string; position: 'left' | 'right'; top: number }[] = [];
    const seed = score + investments.length;
    
    if (biggestWin && biggestWin.outcome > score * 0.4) {
      notes.push({ text: "big bet paid off", position: 'right', top: 15 + seededRandom(seed) * 10 });
    }
    if (missedWins.length >= 2) {
      notes.push({ text: "too cautious here?", position: 'left', top: 35 + seededRandom(seed + 1) * 10 });
    }
    if (losses.length >= 3) {
      notes.push({ text: "rough stretch", position: 'right', top: 55 + seededRandom(seed + 2) * 10 });
    }
    if (passes.length >= 4) {
      notes.push({ text: "selective", position: 'left', top: 70 + seededRandom(seed + 3) * 8 });
    }
    if (multiplier > 2.5) {
      notes.push({ text: "strong finish", position: 'right', top: 80 + seededRandom(seed + 4) * 8 });
    }
    
    return notes.slice(0, 3);
  }, [score, investments, biggestWin, missedWins.length, losses.length, passes.length, multiplier]);

  const getPlaystyleSummary = () => {
    if (biggestWin && biggestWin.outcome > score * 0.5) {
      return "A few big decisions shaped everything.";
    }
    if (missedWins.length >= 2 && losses.length <= 1) {
      return "Caution cost more than the risks.";
    }
    if (wins.length >= 4 && losses.length <= 2) {
      return "Strong instincts, well rewarded.";
    }
    if (losses.length >= 3 && wins.length >= 2) {
      return "Risk paid off, but timing mattered.";
    }
    if (passes.length >= 4 && multiplier > 1.5) {
      return "Patience beat instincts.";
    }
    if (multiplier > 3) {
      return "Consistency beat luck.";
    }
    if (multiplier < 0.5) {
      return "The startup world is tougher than it looks.";
    }
    if (invested.length >= 7) {
      return "Volume over conviction.";
    }
    return "A mixed bag. Some wins, some lessons.";
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, rotateY: 180 }}
      animate={{ scale: 1, opacity: 1, rotateY: 0 }}
      transition={{ duration: 0.8, type: "spring" }}
      className="w-full max-w-xl"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOCIgbnVtT2N0YXZlcz0iNCIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZSkiIG9wYWNpdHk9IjAuMDMiLz48L3N2Zz4=')] rounded-lg" />
        
        {marginNotes.map((note, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 1.2 + i * 0.2 }}
            className={`absolute ${note.position === 'left' ? '-left-2 -translate-x-full pr-3' : '-right-2 translate-x-full pl-3'} hidden md:block`}
            style={{ top: `${note.top}%` }}
          >
            <span 
              className="text-[10px] text-stone-500 whitespace-nowrap"
              style={{ 
                fontFamily: "'Caveat', cursive",
                transform: `rotate(${note.position === 'left' ? -2 : 2}deg)`
              }}
            >
              {note.text}
            </span>
          </motion.div>
        ))}
        
        <Card className="border-2 border-stone-300 bg-amber-50/80 shadow-xl overflow-hidden relative">
          <CardContent className="p-0">
            <div className="bg-stone-100 border-b-2 border-stone-300 p-6 text-center relative">
              <div className="absolute top-2 right-2 opacity-30">
                <div className={`border-2 ${details.stampColor} border-current rounded-full p-2 rotate-12`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 150 }}
              >
                <p className="text-xs uppercase tracking-widest text-stone-500 mb-2">Your Investor Profile</p>
                <h2 
                  className={`text-4xl font-bold ${details.stampColor}`}
                  style={{ fontFamily: "'Caveat', cursive" }}
                >
                  {archetype}
                </h2>
                <p className="text-sm text-stone-600 mt-2">{details.description}</p>
              </motion.div>
            </div>

            <div className="p-6 space-y-5">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-center"
              >
                <p className="text-xs uppercase tracking-widest text-stone-500 mb-1">Final Portfolio Value</p>
                <p className="text-xs text-stone-400 mb-3">Started with $100,000</p>
                <div 
                  className="text-5xl font-bold text-stone-800"
                  style={{ fontFamily: "'Caveat', cursive" }}
                >
                  {formatMoney(score)}
                </div>
              </motion.div>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-stone-300">
                <div className="text-center">
                  <p className="text-xs uppercase tracking-widest text-stone-500 mb-1">Return</p>
                  <p className="text-2xl font-bold text-stone-700" style={{ fontFamily: "'Caveat', cursive" }}>
                    {multiplier.toFixed(1)}x
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs uppercase tracking-widest text-stone-500 mb-1">Profit</p>
                  <div className="flex items-center justify-center gap-1">
                    {profit >= 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-700" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-700" />
                    )}
                    <p 
                      className={`text-2xl font-bold ${profit >= 0 ? 'text-green-700' : 'text-red-700'}`}
                      style={{ fontFamily: "'Caveat', cursive" }}
                    >
                      {profit >= 0 ? '+' : ''}{formatMoney(profit)}
                    </p>
                  </div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="space-y-4"
              >
                <p className="text-xs uppercase tracking-widest text-stone-500 text-center">Portfolio Breakdown</p>
                
                <div className="flex justify-center gap-1">
                  {investments.map((inv, i) => {
                    const isPhase2 = i >= 5;
                    const height = inv.amount > 0 
                      ? Math.max(12, Math.min(40, (inv.outcome / (score || 1)) * 100)) 
                      : 8;
                    const color = inv.amount === 0 
                      ? "bg-stone-300" 
                      : inv.isWin 
                        ? "bg-green-500" 
                        : "bg-red-400";
                    return (
                      <motion.div 
                        key={i}
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ delay: 0.7 + i * 0.05 }}
                        className="flex flex-col items-center gap-1"
                        style={{ originY: 1 }}
                      >
                        <div 
                          className={`w-4 rounded-t ${color}`}
                          style={{ height: `${height}px` }}
                        />
                        <div className={`w-3 h-0.5 ${isPhase2 ? 'bg-stone-400' : 'bg-stone-300'}`} />
                      </motion.div>
                    );
                  })}
                </div>
                
                <div className="flex justify-center gap-4 text-[10px] text-stone-500">
                  <span className="flex items-center gap-1">
                    <Circle className="w-2 h-2 fill-green-500 text-green-500" /> wins
                  </span>
                  <span className="flex items-center gap-1">
                    <Circle className="w-2 h-2 fill-red-400 text-red-400" /> losses
                  </span>
                  <span className="flex items-center gap-1">
                    <Circle className="w-2 h-2 fill-stone-300 text-stone-300" /> passes
                  </span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="grid grid-cols-3 gap-3 text-center"
              >
                <div className="bg-white/60 border border-stone-200 rounded p-2">
                  <p className="text-lg font-bold text-green-700" style={{ fontFamily: "'Caveat', cursive" }}>
                    {wins.length}
                  </p>
                  <p className="text-[10px] text-stone-500 uppercase">Big wins</p>
                </div>
                <div className="bg-white/60 border border-stone-200 rounded p-2">
                  <p className="text-lg font-bold text-red-600" style={{ fontFamily: "'Caveat', cursive" }}>
                    {losses.length}
                  </p>
                  <p className="text-[10px] text-stone-500 uppercase">Losses</p>
                </div>
                <div className="bg-white/60 border border-stone-200 rounded p-2">
                  <p className="text-lg font-bold text-amber-600" style={{ fontFamily: "'Caveat', cursive" }}>
                    {missedWins.length}
                  </p>
                  <p className="text-[10px] text-stone-500 uppercase">Missed</p>
                </div>
              </motion.div>

              {biggestWin && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="text-center text-xs text-stone-500"
                >
                  Most impactful: <span className="font-medium text-stone-700">{biggestWin.pitch.startup.name}</span>
                  {" "}({formatMoney(biggestWin.outcome)} return)
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0 }}
                className="bg-white/50 border border-stone-200 rounded p-4"
              >
                <p 
                  className="text-stone-700 text-center text-xl"
                  style={{ fontFamily: "'Caveat', cursive" }}
                >
                  {getPlaystyleSummary()}
                </p>
              </motion.div>

              <div className="flex justify-center gap-6 text-[10px] text-stone-400 pt-2">
                <span>Early Stage (1-5)</span>
                <span className="text-stone-300">|</span>
                <span>Later Stage (6-10)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
