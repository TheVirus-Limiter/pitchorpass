import { motion } from "framer-motion";
import { type Game } from "@shared/schema";
import { Trophy, TrendingUp, Zap, Target } from "lucide-react";

interface ArchetypeBadgeProps {
  archetype: string;
  score: number;
}

export function ArchetypeBadge({ archetype, score }: ArchetypeBadgeProps) {
  let Icon = Trophy;
  let color = "text-yellow-400";
  let bg = "bg-yellow-400/10";
  let border = "border-yellow-400/20";
  let description = "A balanced approach to the market.";

  if (archetype === "The Visionary") {
    Icon = Zap;
    color = "text-purple-400";
    bg = "bg-purple-400/10";
    border = "border-purple-400/20";
    description = "You spot the unicorns that change the world.";
  } else if (archetype === "The Conservative") {
    Icon = Target;
    color = "text-blue-400";
    bg = "bg-blue-400/10";
    border = "border-blue-400/20";
    description = "Steady growth beats risky bets.";
  } else if (archetype === "The Gambler") {
    Icon = TrendingUp;
    color = "text-pink-400";
    bg = "bg-pink-400/10";
    border = "border-pink-400/20";
    description = "High risk, high reward. What a rush!";
  } else if (archetype === "The Shark") {
    Icon = Trophy;
    color = "text-emerald-400";
    bg = "bg-emerald-400/10";
    border = "border-emerald-400/20";
    description = "Ruthless efficiency and massive returns.";
  }

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
      className={`flex flex-col items-center p-8 rounded-3xl border-2 ${border} ${bg} backdrop-blur-md max-w-md mx-auto text-center`}
    >
      <div className={`p-4 rounded-full bg-background border-2 ${border} mb-4 shadow-xl`}>
        <Icon className={`w-12 h-12 ${color}`} />
      </div>
      
      <h2 className={`text-3xl font-bold mb-2 ${color} font-display uppercase tracking-widest`}>
        {archetype}
      </h2>
      
      <div className="text-4xl font-mono font-bold text-white mb-4">
        ${score.toLocaleString()}
      </div>
      
      <p className="text-muted-foreground font-medium">
        {description}
      </p>
    </motion.div>
  );
}
