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
      <div className="absolute top-10 left-5 opacity-30 pointer-events-none">
        <div className="sticky-note-news w-32 h-32 transform -rotate-12" />
      </div>
      <div className="absolute bottom-20 right-8 opacity-25 pointer-events-none">
        <div className="sticky-note-news w-40 h-40 transform rotate-6" />
      </div>
      <div className="absolute top-1/3 right-12 opacity-20 pointer-events-none">
        <div className="sticky-note-news w-24 h-24 transform rotate-12" />
      </div>
      <div className="absolute bottom-1/4 left-1/4 opacity-20 pointer-events-none">
        <div className="sticky-note-news w-28 h-28 transform -rotate-8" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center z-10 max-w-4xl relative"
      >
        {/* Heading with hand-drawn style */}
        <h1 className="text-5xl md:text-6xl font-bold font-display tracking-tighter mb-4 text-amber-900" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.1)'}}>
          10 Pitches
        </h1>
        
        {/* Subheading */}
        <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
          You have <span className="inline-block bg-green-200 text-green-900 font-bold px-3 py-1 rounded">$100,000</span>.
          <br />
          10 Startup pitches. 10 Investment decisions.
          <br />
          Can you call the shots?
        </p>

        {/* CTA Button - Strong affordance */}
        <Link href="/game">
          <div className="inline-block p-8 transform -rotate-2 cursor-pointer border-4 border-yellow-400 shadow-2xl hover:shadow-4xl transition-all hover:-rotate-1 active:shadow-xl active:scale-95" style={{backgroundColor: 'linear-gradient(135deg, #fefce8 0%, #fef08a 100%)', backgroundClip: 'padding-box'}}>
            <p className="text-5xl text-gray-800 font-bold tracking-tight" style={{letterSpacing: '-0.02em'}}>
              Take a seat
            </p>
            <p className="text-2xl text-gray-700 mt-3 font-semibold">
              Let's hear the first pitch
            </p>
          </div>
        </Link>

        {/* Feature Sticky Notes - Redesigned */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-5xl mx-auto relative"
        >
          {/* Sticky Note 1 */}
          <div className="sticky-note-news p-6 transform -rotate-6 shadow-xl" style={{backgroundColor: 'linear-gradient(135deg, #fefce8 0%, #fef08a 100%)'}}>
            <p className="text-gray-800 text-2xl font-black leading-snug mb-4">
              <strong>Every founder thinks their startup is special.</strong>
            </p>
            <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
              {`Some are right.
Most are wrong.

You'll see the pitch, the traction,
the valuation — and decide if it
deserves your money.`}
            </p>
          </div>

          {/* Sticky Note 2 */}
          <div className="sticky-note-news p-6 transform rotate-3 shadow-xl -mt-6" style={{backgroundColor: 'linear-gradient(135deg, #fefce8 0%, #fef08a 100%)'}}>
            <p className="text-gray-800 text-2xl font-black leading-snug mb-4">
              <strong>Every investment looks obvious in hindsight.</strong>
            </p>
            <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
              {`Three years pass in minutes.

Some quietly succeed.
Some flame out.
A few surprise everyone.

You'll know which bets
paid off and which didn't.`}
            </p>
          </div>

          {/* Sticky Note 3 */}
          <div className="sticky-note-news p-6 transform -rotate-4 shadow-xl" style={{backgroundColor: 'linear-gradient(135deg, #fefce8 0%, #fef08a 100%)'}}>
            <p className="text-gray-800 text-2xl font-black leading-snug mb-4">
              <strong>Your choices define your investor profile.</strong>
            </p>
            <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
              {`By the end, you'll see
exactly what kind of investor you are.

Careful. Bold. Reckless. Lucky.
Or something in between.

The pattern emerges
from your decisions.`}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
