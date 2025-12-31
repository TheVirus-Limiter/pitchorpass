import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Stamp, TrendingUp, TrendingDown, Target, Zap, Shield, Lightbulb, Star } from "lucide-react";

interface ArchetypeBadgeProps {
  archetype: string;
  score: number;
}

const archetypeDetails: Record<string, { icon: any; stampColor: string; description: string; reflection: string }> = {
  "The Mogul": {
    icon: Star,
    stampColor: "text-amber-700",
    description: "High conviction, concentrated bets.",
    reflection: "A few big decisions made all the difference."
  },
  "The Visionary": {
    icon: Lightbulb,
    stampColor: "text-amber-600",
    description: "Strong portfolio, smart timing.",
    reflection: "You concentrated capital early and stayed patient."
  },
  "The Shark": {
    icon: TrendingUp,
    stampColor: "text-blue-700",
    description: "Aggressive but calculated.",
    reflection: "You leaned into risk when others wouldn't."
  },
  "The Golden Touch": {
    icon: Zap,
    stampColor: "text-emerald-700",
    description: "Exceptional winner-picking.",
    reflection: "Most of your bets paid off. That's rare."
  },
  "The Diversifier": {
    icon: Target,
    stampColor: "text-teal-700",
    description: "Balanced, risk-managed portfolio.",
    reflection: "Steady spreading across opportunities. Smart."
  },
  "The Concentrated Player": {
    icon: Target,
    stampColor: "text-purple-700",
    description: "High conviction, all-in approach.",
    reflection: "You bet big on select opportunities."
  },
  "The Angel Investor": {
    icon: Shield,
    stampColor: "text-stone-600",
    description: "Balanced approach across deals.",
    reflection: "Spread risk across diverse opportunities."
  },
  "The Optimist": {
    icon: Zap,
    stampColor: "text-green-700",
    description: "Mostly winners.",
    reflection: "You spotted potential before others did."
  },
  "The Cautious Investor": {
    icon: Shield,
    stampColor: "text-orange-700",
    description: "Conservative, measured bets.",
    reflection: "Not all wins, but stable returns."
  },
  "The Learning Investor": {
    icon: Lightbulb,
    stampColor: "text-red-700",
    description: "Early stage lessons.",
    reflection: "The startup world is tougher than it looks. That's how you learn."
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

export function ArchetypeBadge({ archetype, score }: ArchetypeBadgeProps) {
  const details = archetypeDetails[archetype] || archetypeDetails["The Angel Investor"];
  const Icon = details.icon;

  const multiplier = Math.round((score / 100000) * 100) / 100;
  const profit = score - 100000;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, rotateY: 180 }}
      animate={{ scale: 1, opacity: 1, rotateY: 0 }}
      transition={{ duration: 0.8, type: "spring" }}
      className="w-full max-w-xl"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOCIgbnVtT2N0YXZlcz0iNCIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZSkiIG9wYWNpdHk9IjAuMDMiLz48L3N2Zz4=')] rounded-lg" />
        
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

            <div className="p-6 space-y-6">
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
                transition={{ delay: 0.7 }}
                className="bg-white/50 border border-stone-200 rounded p-4"
              >
                <p 
                  className="text-stone-600 text-center italic text-lg"
                  style={{ fontFamily: "'Caveat', cursive" }}
                >
                  "{details.reflection}"
                </p>
              </motion.div>

              <p className="text-xs text-center text-stone-400">
                Based on outcomes from 10 investments
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
