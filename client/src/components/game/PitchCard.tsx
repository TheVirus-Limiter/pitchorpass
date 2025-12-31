import { motion } from "framer-motion";
import { type Pitch } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Users, TrendingUp, DollarSign, MapPin, Zap, Check, X } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { ValuationGraph } from "./ValuationGraph";
import { FounderConviction } from "./FounderConviction";
import { ExitMath } from "./ExitMath";
import { ExposureWarning } from "./ExposureWarning";

interface PitchCardProps {
  pitch: Pitch;
  round: number;
  phase: number;
  maxInvest: number;
  onInvest: (amount: number) => void;
  onPass: () => void;
  disabled: boolean;
  canInvestMore: boolean;
  totalInvestments: number;
  phase2StartingCapital?: number;
}

export function PitchCard({ pitch, round, phase, maxInvest, onInvest, onPass, disabled, canInvestMore, totalInvestments, phase2StartingCapital }: PitchCardProps) {
  // Lock pitch data with useMemo to prevent immutability issues
  const lockedPitch = useMemo(() => pitch, [pitch.startup.name]);
  const { founder, startup, ask } = lockedPitch;
  
  // Game Balance: Phase 1 - first 2 rounds = 30k min, last 3 = 20k min to force at least one pass
  // Phase 2 - dynamic minimums that sum to 120% of starting capital, forcing at least one pass
  // Distribution: 28%, 26%, 24%, 22%, 20% = 120% total, guaranteeing at least one forced pass
  const getPhase2Minimum = () => {
    const C = phase2StartingCapital || 150000;
    const phaseRound = round - 5; // 1-5 for phase 2
    // Distribute minimums: 28% + 26% + 24% + 22% + 20% = 120% of phase 2 capital
    // This guarantees at least one forced pass in Phase 2
    const percentages = [0.28, 0.26, 0.24, 0.22, 0.20];
    const percentage = percentages[phaseRound - 1] || 0.23;
    return Math.round(C * percentage);
  };
  
  const requestedMin = phase === 1 
    ? (round <= 2 ? 30000 : 20000)
    : getPhase2Minimum();
  // Phase 2: minimum is never clamped - must invest the full required amount
  // If ask < requestedMin, the startup is still asking for less but minimum stays enforced
  // This ensures forced-pass math works (totaling 120% = at least one pass)
  const minInvestment = phase === 1 
    ? Math.min(requestedMin, ask) 
    : requestedMin;
  
  // Show capital squeeze warning for Phase 2 when player can't afford minimum
  const capitalSqueeze = phase === 2 && requestedMin > maxInvest;
  
  // In Phase 2, if you can't afford the minimum, you must pass
  const forcedPass = phase === 2 && maxInvest < requestedMin;
  
  const [investAmount, setInvestAmount] = useState(minInvestment);
  const [askedQuestion, setAskedQuestion] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [answering, setAnswering] = useState(false);
  
  const maxAllowed = Math.min(maxInvest, ask);
  const company_valuation = startup.valuation || 100000;
  let ownership = (investAmount / company_valuation) * 100;
  // Cap equity offered at 49%
  ownership = Math.min(ownership, 49);
  // In Phase 2, must have enough capital to meet minimum; Phase 1 can invest up to ask
  const canInvest = !forcedPass && investAmount <= maxInvest && investAmount >= minInvestment;

  useEffect(() => {
    setInvestAmount(Math.max(minInvestment, Math.min(minInvestment + 2000, maxInvest)));
  }, [maxInvest, minInvestment]);

  const container = {
    hidden: { opacity: 0, scale: 0.95 },
    show: {
      opacity: 1,
      scale: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const riskLevel = startup.risk > 0.6 ? "High Risk" : startup.risk > 0.3 ? "Medium Risk" : "Low Risk";
  const riskColor = startup.risk > 0.6 ? "bg-red-100 text-red-800" : startup.risk > 0.3 ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800";

  const formatMoney = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  const askQuestion = async () => {
    if (question.trim() && !answering) {
      setAnswering(true);
      try {
        const res = await fetch("/api/game/answer-question", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pitch: lockedPitch, question })
        });
        const data = await res.json();
        setAnswer(data.answer || "We're focused on execution and expect strong results soon.");
        setAskedQuestion(true);
      } catch (error) {
        console.error("Failed to get answer:", error);
        setAnswer("We're focused on execution and expect strong results soon.");
        setAskedQuestion(true);
      } finally {
        setAnswering(false);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-auto lg:min-h-[600px]">
      {/* Left Sidebar - Founder Profile */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="lg:col-span-1 flex flex-col"
      >
        <Card className="overflow-hidden shadow-lg flex-1 flex flex-col border-2 border-gray-300 wood-card">
          <CardContent className="p-6 flex flex-col flex-1">
            {/* Founder Photo */}
            <motion.div variants={item} className="mb-6">
              <div className="relative mb-4">
                <img 
                  src={founder.photo} 
                  alt={founder.name}
                  className="w-full aspect-square rounded-2xl object-cover border-4 border-primary/20"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&q=80";
                  }}
                />
              </div>
            </motion.div>

            {/* Founder Info */}
            <motion.div variants={item} className="space-y-2">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Founder</p>
              <h3 className="text-2xl font-bold text-foreground font-display">{founder.name}</h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                {founder.country}
              </div>

              {/* Founder Credentials */}
              {founder.credentials && founder.credentials.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Credentials</p>
                  <ul className="space-y-1">
                    {founder.credentials.map((cred, i) => (
                      <li key={i} className="text-sm text-gray-700 leading-tight flex items-start gap-2">
                        <span className="mt-1.5 w-1 h-1 bg-gray-400 rounded-full flex-shrink-0" />
                        {cred}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>

            {/* Traction Metrics */}
            <motion.div variants={item} className="mt-8 space-y-6 flex-1">
              <p className="text-sm font-semibold text-foreground uppercase tracking-widest">Traction</p>
              
              <div className="paper-note p-4 rounded">
                <div className="text-3xl font-bold text-foreground font-mono">{startup.traction.users.toLocaleString()}</div>
                <div className="text-sm text-gray-700 font-medium mt-1">Active Users</div>
              </div>

              <div className="paper-note p-4 rounded">
                <div className="text-3xl font-bold text-foreground font-mono">+{startup.traction.monthlyGrowth}%</div>
                <div className="text-sm text-gray-700 font-medium mt-1">MoM Growth</div>
              </div>

              <div className="paper-note p-4 rounded relative">
                <div className="text-3xl font-bold text-foreground font-mono">
                  {startup.traction.revenue >= 1000000 
                    ? `$${(startup.traction.revenue / 1000000).toFixed(1)}M`
                    : `$${(startup.traction.revenue / 1000).toFixed(0)}k`}
                  {startup.traction.revenue === 0 && (
                    <span className="absolute -top-3 -right-3 text-red-600 text-5xl font-bold transform rotate-12" style={{fontFamily: "'Caveat', cursive"}}>!!!</span>
                  )}
                </div>
                <div className="text-sm text-gray-700 font-medium mt-1">Monthly Recurring Revenue</div>
              </div>

              {/* Recent News - Always Visible */}
              {pitch.news && pitch.news.length > 0 && (
                <motion.div variants={item} className="sticky-note-news space-y-3 mt-4">
                  <p className="text-sm font-bold text-gray-800 uppercase">Recent News</p>
                  {pitch.news.map((snippet, idx) => (
                    <p key={idx} className="text-sm text-gray-700 italic border-b border-yellow-300 pb-2 last:border-0">
                      "{snippet}"
                    </p>
                  ))}
                </motion.div>
              )}

              {/* One Question Mechanic */}
              {!askedQuestion && (
                <motion.div variants={item} className="mt-4 space-y-3">
                  <input
                    type="text"
                    placeholder="Ask the founder one question..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !answering && askQuestion()}
                    disabled={answering}
                    className="w-full px-3 py-3 text-sm border border-gray-400 rounded bg-white text-foreground placeholder-muted-foreground disabled:opacity-50"
                  />
                  <Button
                    size="sm"
                    onClick={askQuestion}
                    disabled={!question.trim() || answering}
                    className="w-full text-sm font-bold bg-gray-600 hover:bg-gray-700 text-white border-0"
                  >
                    {answering ? "Waiting..." : "Ask"}
                  </Button>
                </motion.div>
              )}

              {/* Answer Display */}
              {answer && (
                <motion.div 
                  variants={item}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-amber-50 border-2 border-amber-300 rounded text-sm text-gray-700 relative"
                >
                  <div className="stamp stamp-answered absolute -top-2 -right-2">
                    ANSWERED
                  </div>
                  <p className="font-semibold text-gray-900 mb-2">Founder responds:</p>
                  <p className="text-gray-700 leading-relaxed">{answer}</p>
                </motion.div>
              )}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
      {/* Center - Pitch Card */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="lg:col-span-2"
      >
        <Card className="overflow-hidden shadow-lg flex-1 flex flex-col border-2 border-gray-300 wood-card-center">
          <CardContent className="p-8 flex flex-col flex-1">
            {/* Header */}
            <motion.div variants={item} className="mb-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="inline-block bg-white border border-gray-400 px-3 py-1.5 rounded text-xs font-semibold text-gray-700 mb-2 transform -rotate-1">
                    Round {round}/10
                  </div>
                  <h2 className="text-4xl font-bold font-display text-foreground">{startup.name}</h2>
                </div>
              </div>
              <Badge className="bg-gray-700 text-white border-0 text-base py-2 px-4">
                Seeking ${ask.toLocaleString()}
              </Badge>
            </motion.div>

            {/* Pitch Text */}
            <motion.p variants={item} className="text-xl leading-relaxed text-foreground mb-8 italic flex-1">
              "{startup.pitch}"
            </motion.p>

            {/* Market & Risk */}
            <motion.div variants={item} className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-gray-300">
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">Market Opportunity</p>
                <p className="text-lg text-foreground font-medium">{startup.market}</p>
              </div>

              <div className={`p-4 rounded-xl border border-gray-300 ${startup.risk > 0.6 ? 'bg-red-50' : startup.risk > 0.3 ? 'bg-yellow-50' : 'bg-green-50'}`}>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">Risk Assessment</p>
                <p className={`text-lg font-medium ${startup.risk > 0.6 ? 'text-red-800' : startup.risk > 0.3 ? 'text-amber-800' : 'text-green-800'}`}>{riskLevel}</p>
              </div>

              {/* Valuation Graph */}
              <ValuationGraph 
                currentValuation={startup.valuation || 100000}
                riskProfile={startup.risk}
                upside={startup.upside}
              />

              {/* Whiteboard Notes */}
              <div className="mt-4 p-5 border-2 border-dashed border-gray-400 rounded-lg relative overflow-hidden bg-white/60">
                <p style={{fontFamily: "'Caveat', cursive"}} className="text-gray-500 text-sm mb-2 uppercase tracking-tighter">Whiteboard Notes</p>
                <div className="space-y-3">
                  {useMemo(() => {
                    if (lockedPitch.whiteboardNotes && lockedPitch.whiteboardNotes.length > 0) {
                      return lockedPitch.whiteboardNotes.map((note, i) => (
                        <p key={i} style={{fontFamily: "'Caveat', cursive"}} className="text-gray-800 text-xl leading-tight">
                          - {note}
                        </p>
                      ));
                    }
                    
                    const id = startup.name.length;
                    const earlyNotes = [
                      "Customer acquisition seems expensive",
                      "Strong growth, unclear margins",
                      "Depends heavily on partnerships",
                      "Tech risk is high but timing could be right",
                      "Solid team, crowded space",
                      "Viral potential but defensibility?",
                      "Burn rate looks manageable",
                      "Niche market, high retention"
                    ];
                    const lateNotes = [
                      "Unit economics finally working",
                      "Path to profitability is clear",
                      "Market leader in their niche",
                      "Enterprise contracts add stability",
                      "Growth slowing but margins improving",
                      "Acquisition target for big players",
                      "IPO potential in 2-3 years",
                      "Strong recurring revenue base"
                    ];
                    const notes = phase === 2 ? lateNotes : earlyNotes;
                    // Pick 2 random notes based on startup id to keep stable
                    return [notes[id % notes.length], notes[(id + 3) % notes.length]].map((note, i) => (
                      <p key={i} style={{fontFamily: "'Caveat', cursive"}} className="text-gray-800 text-xl leading-tight">
                        - {note}
                      </p>
                    ));
                  }, [startup.name, lockedPitch.whiteboardNotes])}
                </div>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
      {/* Right Sidebar - Investment Controls */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="lg:col-span-1 flex flex-col"
      >
        <Card className="overflow-hidden shadow-lg flex-1 flex flex-col border-2 border-gray-300 wood-card-right">
          <CardContent className="p-6 flex flex-col flex-1">
            {/* Ask Amount */}
            <motion.div variants={item} className="mb-6 paper-note p-4 rounded transform -rotate-1">
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">They're Asking</p>
              <div className="text-3xl font-bold font-mono text-foreground">
                ${ask.toLocaleString()}
              </div>
            </motion.div>

            {/* Company Valuation */}
            <motion.div variants={item} className="mb-6 paper-note p-4 rounded transform rotate-0.5">
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">Valuation</p>
              <p className="text-3xl font-bold font-mono text-foreground">
                {startup.valuation && startup.valuation >= 1000000 
                  ? `$${(startup.valuation / 1000000).toFixed(1)}M`
                  : `$${((startup.valuation || 100000) / 1000).toFixed(0)}k`}
              </p>
            </motion.div>

            {/* Upside Potential */}
            <motion.div variants={item} className="mb-6 paper-note p-4 rounded transform -rotate-0.5">
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">Upside potential</p>
              <p className="text-3xl font-bold text-foreground">
                {startup.upside.toFixed(1)}x
              </p>
            </motion.div>

            {/* Investment Slider */}
            <motion.div variants={item} className="mb-6 space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-foreground uppercase tracking-widest">Invest</label>
                <span className="text-3xl font-bold font-mono text-foreground">{formatMoney(investAmount)}</span>
              </div>
              <Slider
                value={[investAmount]}
                onValueChange={(val) => setInvestAmount(val[0])}
                max={maxAllowed}
                min={minInvestment}
                step={1000}
                disabled={disabled || !canInvestMore}
              />
              <div className="text-sm text-gray-600 font-mono text-center">
                {formatMoney(minInvestment)} — {formatMoney(maxAllowed)}
              </div>
            </motion.div>

            {/* Equity Display */}
            <motion.div variants={item} className="mb-6 paper-note p-4 rounded transform rotate-1">
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">Your Equity</p>
              <p className="text-3xl font-bold text-foreground">{ownership.toFixed(2)}%</p>
              {ownership === 49 && <p className="text-sm text-gray-600 mt-2">Capped at 49%</p>}
            </motion.div>

            {/* Founder Conviction - standalone sticky note */}
            <motion.div variants={item} className="mb-4">
              <FounderConviction pitch={pitch} />
            </motion.div>

            {/* Exit Math */}
            <motion.div variants={item} className="mb-4">
              <ExitMath investAmount={investAmount} valuation={startup.valuation || 100000} phase={phase} />
            </motion.div>

            {/* Exposure Warning */}
            <motion.div variants={item} className="mb-4">
              <ExposureWarning investAmount={investAmount} remainingCapital={maxInvest} />
            </motion.div>

            {/* Error States */}
            {forcedPass && (
              <div className="mb-4 bg-red-100 border-2 border-red-400 p-3 rounded text-sm text-red-900" style={{fontFamily: "'Caveat', cursive"}}>
                <p className="font-bold text-base mb-1">Cannot afford minimum</p>
                <p>You need {formatMoney(requestedMin)} to invest in this round. You only have {formatMoney(maxInvest)}. Must pass.</p>
              </div>
            )}
            {capitalSqueeze && !forcedPass && (
              <div className="mb-4 bg-amber-100 border-2 border-amber-400 p-3 rounded text-sm text-amber-900" style={{fontFamily: "'Caveat', cursive"}}>
                <p className="font-bold text-base mb-1">Capital squeeze</p>
                <p>You don't have enough to back every late-stage deal. Concentration is now a requirement.</p>
              </div>
            )}
            {!canInvestMore && (
              <div className="mb-4 bg-amber-50 border border-amber-300 p-3 rounded text-sm text-amber-900 font-medium" style={{fontFamily: "'Caveat', cursive"}}>
                You've reached your investment limit. Choose wisely.
              </div>
            )}
            {investAmount < minInvestment && !capitalSqueeze && (
              <div className="mb-4 bg-red-50 border border-red-300 p-2 rounded text-xs text-red-800 font-medium">
                Minimum check is {formatMoney(minInvestment)}
              </div>
            )}

            {/* Action Buttons - clean and decisive */}
            <motion.div variants={item} className="grid grid-cols-2 gap-3 mt-8 pt-0">
              <button 
                onClick={onPass}
                disabled={disabled}
                className="py-2 px-3 text-sm font-medium uppercase rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300 bg-[#cf8080] hover:bg-[#a55555] text-white"
                style={{fontFamily: "'Caveat', cursive"}}
              >
                PASS
              </button>
              
              <button 
                onClick={() => onInvest(investAmount)}
                disabled={disabled || !canInvestMore || !canInvest || forcedPass}
                className="py-3 px-3 text-sm font-bold uppercase text-white bg-green-700 hover:bg-green-800 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                style={{fontFamily: "'Caveat', cursive"}}
              >
                INVEST
              </button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
