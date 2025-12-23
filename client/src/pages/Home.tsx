import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { TrendingUp, ArrowRight, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-amber-100 to-orange-50 flex flex-col items-center justify-center p-4 overflow-hidden relative">
      {/* Wood desk background */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="wood-pattern absolute inset-0" />
      </div>

      {/* Scattered papers/sticky notes background */}
      <div className="absolute top-10 left-5 opacity-40 pointer-events-none">
        <div className="sticky-note-news w-32 h-32 transform -rotate-12" />
      </div>
      <div className="absolute bottom-20 right-8 opacity-40 pointer-events-none">
        <div className="sticky-note-news w-40 h-40 transform rotate-6" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center z-10 max-w-3xl relative"
      >
        {/* Stamp-style icon badge */}
        <motion.div 
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="inline-flex items-center justify-center p-4 rounded-full bg-yellow-100 border-2 border-yellow-400 mb-8 shadow-lg transform -rotate-3"
        >
          <TrendingUp className="w-10 h-10 text-yellow-700" />
        </motion.div>

        {/* Heading with hand-drawn style */}
        <h1 className="text-6xl md:text-7xl font-bold font-display tracking-tighter mb-6 text-amber-900 hand-drawn" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.1)'}}>
          10 Pitches
        </h1>
        
        {/* Subheading */}
        <p className="text-lg md:text-xl text-amber-800 mb-12 max-w-2xl mx-auto leading-relaxed font-serif">
          You have <span className="font-bold text-emerald-700 bg-yellow-100 px-2 py-1 rounded">$100,000</span>.
          <br />
          10 Startup pitches. 10 Investment decisions.
          <br />
          <span className="text-orange-700 font-bold">Can you call the shots on 10 startups?</span>
        </p>

        {/* CTA Button - Wood styled */}
        <Link href="/game">
          <Button size="lg" className="text-lg px-12 py-8 rounded-lg bg-gradient-to-b from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 hover:shadow-2xl shadow-lg text-white border-2 border-amber-900 font-bold transform hover:scale-105 transition-all">
            Start Investing <ArrowRight className="ml-2 w-6 h-6" />
          </Button>
        </Link>

        {/* Feature Sticky Notes - Redesigned */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-5xl mx-auto"
        >
          {/* Sticky Note 1 */}
          <div className="sticky-note-news p-5 transform -rotate-3 shadow-lg">
            <p style={{fontFamily: "'Caveat', cursive"}} className="text-gray-800 text-base font-bold leading-tight mb-3">
              Every founder thinks their startup is special.
            </p>
            <p style={{fontFamily: "'Caveat', cursive"}} className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
              {`Some are right.
Most are wrong.

You'll see the pitch, the traction, the valuation —
and decide whether it deserves your money.`}
            </p>
          </div>

          {/* Sticky Note 2 */}
          <div className="sticky-note-news p-5 transform rotate-2 shadow-lg -mt-2">
            <p style={{fontFamily: "'Caveat', cursive"}} className="text-gray-800 text-base font-bold leading-tight mb-3">
              Real Outcomes
            </p>
            <p style={{fontFamily: "'Caveat', cursive"}} className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
              {`Three years pass in minutes.

Some companies quietly succeed.
Some flame out.
A few surprise everyone.

Your returns depend on equity, timing,
and how much risk you were willing to take.`}
            </p>
          </div>

          {/* Sticky Note 3 */}
          <div className="sticky-note-news p-5 transform -rotate-2 shadow-lg -mt-2">
            <p style={{fontFamily: "'Caveat', cursive"}} className="text-gray-800 text-base font-bold leading-tight mb-3">
              Investor Archetypes
            </p>
            <p style={{fontFamily: "'Caveat', cursive"}} className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
              {`At the end, you don't just see a number.

You see what kind of investor you are —
careful, bold, reckless, lucky,
or something in between.`}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
