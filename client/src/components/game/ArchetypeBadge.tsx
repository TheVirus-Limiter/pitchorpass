import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, TrendingUp, Zap, Target } from "lucide-react";

interface ArchetypeBadgeProps {
  archetype: string;
  score: number;
}

const archetypeDetails: Record<string, { icon: any; color: string; description: string }> = {
  "The Visionary": {
    icon: Trophy,
    color: "from-yellow-400 to-orange-500",
    description: "You have the golden touch. Your portfolio strategy paid off handsomely."
  },
  "The Shark": {
    icon: TrendingUp,
    color: "from-blue-500 to-indigo-600",
    description: "Aggressive but calculated. You know how to spot winners and close deals."
  },
  "The Golden Touch": {
    icon: Zap,
    color: "from-emerald-400 to-teal-500",
    description: "Your winner-picking ratio is exceptional. Most of your bets paid off."
  },
  "The Concentrated Player": {
    icon: Target,
    color: "from-purple-500 to-pink-500",
    description: "You bet big on select opportunities. High conviction investor."
  },
  "The Angel Investor": {
    icon: Target,
    color: "from-gray-400 to-blue-400",
    description: "Balanced approach. You spread risk across diverse opportunities."
  },
  "The Learning Investor": {
    icon: Zap,
    color: "from-red-400 to-orange-400",
    description: "Early stage lessons learned. The startup world is tougher than it looks!"
  }
};

export function ArchetypeBadge({ archetype, score }: ArchetypeBadgeProps) {
  const details = archetypeDetails[archetype] || archetypeDetails["The Angel Investor"];
  const Icon = details.icon;

  const multiplier = Math.round((score / 100000) * 10) / 10;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, rotateY: 180 }}
      animate={{ scale: 1, opacity: 1, rotateY: 0 }}
      transition={{ duration: 0.8, type: "spring" }}
      className="w-full max-w-2xl"
    >
      <Card className="border-3 border-foreground/10 bg-white shadow-2xl overflow-hidden">
        <CardContent className="p-0">
          {/* Gradient Header */}
          <div className={`bg-gradient-to-r ${details.color} p-12 text-white text-center relative overflow-hidden`}>
            <div className="absolute inset-0 opacity-20 bg-pattern" />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 150 }}
              className="relative z-10"
            >
              <Icon className="w-16 h-16 mx-auto mb-4" />
              <h2 className="text-4xl font-bold font-display mb-2">{archetype}</h2>
            </motion.div>
          </div>

          {/* Content */}
          <div className="p-12 text-center">
            <p className="text-muted-foreground mb-8 text-lg">{details.description}</p>

            {/* Score Display */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-6"
            >
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-2">Final Net Worth</p>
                <div className="text-6xl font-bold font-mono text-primary">
                  ${score.toLocaleString()}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 py-6 border-y border-gray-200">
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-2">Return Multiple</p>
                  <p className="text-3xl font-bold text-foreground">{multiplier}x</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-2">Profit</p>
                  <p className={`text-3xl font-bold ${score >= 100000 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {score >= 100000 ? '+' : ''}{Math.round((score - 100000) / 1000)}k
                  </p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground italic">
                {score > 500000 && "Legendary performance. You've mastered the art of venture investing."}
                {score > 300000 && score <= 500000 && "Exceptional results. You know how to spot and nurture winners."}
                {score > 150000 && score <= 300000 && "Strong performance. Your portfolio strategy is paying off."}
                {score > 100000 && score <= 150000 && "Positive returns. You're building investor experience."}
                {score <= 100000 && "Better luck next round. Every investor has tough rounds. That's how you learn!"}
              </p>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
