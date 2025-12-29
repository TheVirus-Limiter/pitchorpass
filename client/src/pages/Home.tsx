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
      <div className="absolute top-10 left-5 opacity-20 pointer-events-none">
        <div className="sticky-note-news w-32 h-32 transform -rotate-12" />
      </div>
      <div className="absolute bottom-20 right-8 opacity-15 pointer-events-none">
        <div className="sticky-note-news w-40 h-40 transform rotate-6" />
      </div>
      <div className="absolute top-1/3 right-12 opacity-10 pointer-events-none">
        <div className="sticky-note-news w-24 h-24 transform rotate-12" />
      </div>
      <div className="absolute bottom-1/4 left-1/4 opacity-10 pointer-events-none">
        <div className="sticky-note-news w-28 h-28 transform -rotate-8" />
      </div>
      {/* Subtle background elements - sketches, doodles, money, scribbles */}
      <div className="absolute top-20 right-1/4 text-9xl font-black opacity-3 pointer-events-none transform -rotate-12 text-gray-400">$</div>
      <div className="absolute top-1/2 left-10 text-8xl font-black opacity-2 pointer-events-none transform rotate-6 text-gray-400">€</div>
      <div className="absolute bottom-32 right-20 text-7xl opacity-3 pointer-events-none transform -rotate-3 text-gray-400">£</div>
      <div className="absolute top-2/3 right-1/3 text-6xl opacity-2 pointer-events-none transform rotate-12 text-gray-400">↑</div>
      {/* Faint doodles and sketches */}
      <div className="absolute top-1/4 left-1/3 w-24 h-24 border-2 border-gray-300 rounded opacity-10 pointer-events-none transform rotate-45" />
      <div className="absolute bottom-40 right-1/4 text-4xl opacity-3 pointer-events-none transform -rotate-6 text-gray-500">≈ ≈ ≈</div>
      <div className="absolute top-1/3 right-1/5 text-5xl opacity-2 pointer-events-none transform rotate-12 text-gray-400">/ / /</div>
      <div className="absolute bottom-1/3 left-20 text-3xl opacity-2 pointer-events-none text-gray-400">• • • •</div>
      <div className="absolute top-2/3 left-1/4 text-6xl font-bold opacity-3 pointer-events-none text-gray-300">10x</div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center z-10 max-w-4xl relative"
      >
        {/* Heading with hand-drawn style */}
        <h1 className="text-5xl md:text-6xl font-bold font-display tracking-tighter mb-4 text-amber-900" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.1)'}}>Pitch or Pass?</h1>
        
        {/* Subheading */}
        <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
          You have <span className="inline-block bg-white text-green-900 font-bold px-4 py-2 rounded border-2 border-green-600 text-sm">$100,000</span>.
          <br />
          10 Startup pitches. 10 Investment decisions.
          <br />
          Can you call the shots?
        </p>

        {/* CTA Button - Simple and clear */}
        <Link href="/game">
          <Button className="px-8 py-3 text-lg h-auto bg-primary hover:bg-primary/90 text-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            Let's go
          </Button>
        </Link>

        {/* Feature Sticky Notes - Verbatim copy */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-5xl mx-auto relative"
        >
          {/* Sticky Note 1 */}
          <div className="sticky-note-news p-6 transform -rotate-6 shadow-xl" style={{backgroundColor: 'linear-gradient(135deg, #fefce8 0%, #fef08a 100%)'}}>
            <p style={{fontFamily: "'Caveat', cursive"}} className="text-gray-800 text-2xl mb-4">
              <b>Some founders are right.</b>
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              <u>A lot of them aren’t.</u>
              <br /><br />
              You’ll see the pitch, the traction,
              and <u>the valuation.</u>
              <br /><br />
              From there, it’s up to you
              to <u>decide if it’s worth backing.</u>
            </p>
          </div>

          {/* Sticky Note 2 */}
          <div className="sticky-note-news p-6 transform rotate-3 shadow-xl -mt-6" style={{backgroundColor: 'linear-gradient(135deg, #fefce8 0%, #fef08a 100%)'}}>
            <p style={{fontFamily: "'Caveat', cursive"}} className="text-gray-800 text-2xl mb-4">
              <b>Three years pass in just a few minutes.</b>
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              Some companies <u>grow steadily.</u>
              <br />
              Some never really get going.
              <br />
              A few turn out <u>better than expected.</u>
              <br /><br />
              You’ll see which bets <u>paid off</u>
              and which ones didn’t.
            </p>
          </div>

          {/* Sticky Note 3 */}
          <div className="sticky-note-news p-6 transform -rotate-4 shadow-xl" style={{backgroundColor: 'linear-gradient(135deg, #fefce8 0%, #fef08a 100%)'}}>
            <p style={{fontFamily: "'Caveat', cursive"}} className="text-gray-800 text-2xl mb-4">
              <b>By the end, you’ll have a sense of the kind of investor you are.</b>
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              <u>Careful. Bold. Risk-taking. Lucky.</u>
              <br />
              Or somewhere in between.
              <br /><br />
              Your choices <u>start to add up</u>
              and a pattern begins to show.
            </p>
          </div>
        </motion.div>

        {/* Creator Credit */}
        <div className="mt-12 opacity-40 hover:opacity-70 transition-opacity" style={{fontFamily: "'Caveat', cursive"}}>
          <p className="text-gray-600 text-lg">made by rehan raj</p>
        </div>
      </motion.div>
    </div>
  );
}
