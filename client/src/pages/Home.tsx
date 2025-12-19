import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { TrendingUp, ArrowRight, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col items-center justify-center p-4 overflow-hidden relative">
      {/* Subtle background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center z-10 max-w-3xl"
      >
        {/* Icon Badge */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="inline-flex items-center justify-center p-4 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 border-2 border-blue-300 mb-8"
        >
          <TrendingUp className="w-10 h-10 text-primary" />
        </motion.div>

        {/* Heading */}
        <h1 className="text-6xl md:text-7xl font-bold font-display tracking-tighter mb-6 text-foreground">
          10 Pitches
        </h1>
        
        {/* Subheading */}
        <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
          You have <span className="font-bold text-emerald-600">$100,000</span>.
          <br />
          10 Startup pitches. 10 Investment decisions.
          <br />
          <span className="text-primary font-bold">Can you build a unicorn portfolio?</span>
        </p>

        {/* CTA Button */}
        <Link href="/game">
          <Button size="lg" className="text-lg px-12 py-8 rounded-full bg-gradient-to-r from-primary to-purple-600 hover:shadow-2xl hover:shadow-primary/40 transition-all transform hover:scale-105 text-white border-0 font-bold">
            Start Investing <ArrowRight className="ml-2 w-6 h-6" />
          </Button>
        </Link>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-4xl mx-auto"
        >
          <div className="p-6 bg-white/70 backdrop-blur-sm rounded-2xl border-2 border-blue-200 shadow-lg">
            <Zap className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-bold text-foreground mb-2">AI-Generated Pitches</h3>
            <p className="text-sm text-muted-foreground">Each founder brings a unique opportunity. Will you recognize the next big thing?</p>
          </div>

          <div className="p-6 bg-white/70 backdrop-blur-sm rounded-2xl border-2 border-emerald-200 shadow-lg">
            <TrendingUp className="w-8 h-8 text-emerald-600 mb-3" />
            <h3 className="font-bold text-foreground mb-2">Real-Time Outcomes</h3>
            <p className="text-sm text-muted-foreground">See how your portfolio performs over 3 years with realistic startup success rates.</p>
          </div>

          <div className="p-6 bg-white/70 backdrop-blur-sm rounded-2xl border-2 border-purple-200 shadow-lg">
            <TrendingUp className="w-8 h-8 text-purple-600 mb-3" />
            <h3 className="font-bold text-foreground mb-2">Investor Archetypes</h3>
            <p className="text-sm text-muted-foreground">Discover your investor archetype based on your decisions and portfolio performance.</p>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Footer */}
      <div className="absolute bottom-6 text-xs text-muted-foreground/60 uppercase tracking-widest font-mono">
        Simulation v2.0 • Built with AI • Silicon Valley Edition
      </div>
    </div>
  );
}
