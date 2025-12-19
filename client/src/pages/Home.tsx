import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { TrendingUp, ArrowRight, DollarSign } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 overflow-hidden relative">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center z-10 max-w-3xl"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 mb-8"
        >
          <TrendingUp className="w-12 h-12 text-primary" />
        </motion.div>

        <h1 className="text-6xl md:text-8xl font-bold font-display tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
          10 Pitches
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
          You have <span className="text-emerald-400 font-bold">$100,000</span>.
          <br />
          10 Startups. 10 Decisions.
          <br />
          Can you spot the next unicorn?
        </p>

        <Link href="/game">
          <Button size="lg" className="text-lg px-12 py-8 rounded-full shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)] hover:shadow-[0_0_60px_-15px_rgba(59,130,246,0.6)] transition-all transform hover:scale-105">
            Start Investing <ArrowRight className="ml-2 w-6 h-6" />
          </Button>
        </Link>
      </motion.div>
      
      {/* Decorative footer */}
      <div className="absolute bottom-8 text-xs text-muted-foreground/50 uppercase tracking-widest font-mono">
        Simulation v1.0 • Built with OpenAI
      </div>
    </div>
  );
}
