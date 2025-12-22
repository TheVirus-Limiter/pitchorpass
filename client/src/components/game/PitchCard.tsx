import { motion } from "framer-motion";
import { type Pitch } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Users, TrendingUp, DollarSign, MapPin, Zap, Check, X } from "lucide-react";
import { useState, useEffect } from "react";
import { ValuationGraph } from "./ValuationGraph";

interface PitchCardProps {
  pitch: Pitch;
  round: number;
  maxInvest: number;
  onInvest: (amount: number) => void;
  onPass: () => void;
  disabled: boolean;
}

export function PitchCard({ pitch, round, maxInvest, onInvest, onPass, disabled }: PitchCardProps) {
  const { founder, startup, ask } = pitch;
  const [investAmount, setInvestAmount] = useState(5000);
  const [askedQuestion, setAskedQuestion] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const maxAllowed = Math.min(maxInvest, 50000);
  const company_valuation = pitch.startup.valuation || 100000;
  let ownership = (investAmount / company_valuation) * 100;
  // Cap equity offered at 49%
  ownership = Math.min(ownership, 49);
  const canInvest = investAmount <= maxInvest && investAmount > 0;

  useEffect(() => {
    setInvestAmount(Math.min(5000, maxInvest));
  }, [pitch, maxInvest]);

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
    if (question.trim()) {
      try {
        const res = await fetch("/api/game/answer-question", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pitch, question })
        });
        const data = await res.json();
        setAnswer(data.answer || "We're focused on execution and expect strong results soon.");
        setAskedQuestion(true);
      } catch (error) {
        console.error("Failed to get answer:", error);
        setAnswer("We're focused on execution and expect strong results soon.");
        setAskedQuestion(true);
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
                <div className="absolute -bottom-3 -right-3 bg-primary rounded-full p-3 border-4 border-white shadow-lg">
                  <Zap className="w-5 h-5 text-white" />
                </div>
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
            </motion.div>

            {/* Traction Metrics */}
            <motion.div variants={item} className="mt-8 space-y-4 flex-1">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Traction</p>
              
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-700 font-mono">{startup.traction.users.toLocaleString()}</div>
                <div className="text-xs text-blue-600 font-medium">Active Users</div>
              </div>

              <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                <div className="text-2xl font-bold text-emerald-700 font-mono">+{startup.traction.monthlyGrowth}%</div>
                <div className="text-xs text-emerald-600 font-medium">MoM Growth</div>
              </div>

              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <div className="text-2xl font-bold text-purple-700 font-mono">${(startup.traction.revenue / 1000).toFixed(0)}k</div>
                <div className="text-xs text-purple-600 font-medium">MRR</div>
              </div>

              {/* Recent News - Always Visible */}
              {pitch.news && pitch.news.length > 0 && (
                <motion.div variants={item} className="sticky-note-news space-y-2 mt-4">
                  <p className="text-xs font-bold text-gray-700 uppercase">Recent News</p>
                  {pitch.news.map((snippet, idx) => (
                    <p key={idx} className="text-xs text-gray-600 italic border-b border-yellow-300 pb-1 last:border-0">
                      "{snippet}"
                    </p>
                  ))}
                </motion.div>
              )}

              {/* One Question Mechanic */}
              {!askedQuestion && (
                <motion.div variants={item} className="mt-4 space-y-2">
                  <input
                    type="text"
                    placeholder="Ask one question..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && askQuestion()}
                    className="w-full px-3 py-2 text-xs border border-gray-400 rounded bg-white text-foreground placeholder-muted-foreground"
                  />
                  <Button
                    size="sm"
                    onClick={askQuestion}
                    disabled={!question.trim()}
                    className="w-full text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white border-0"
                  >
                    Ask
                  </Button>
                </motion.div>
              )}

              {/* Answer Display */}
              {answer && (
                <motion.div 
                  variants={item}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded text-xs text-gray-700"
                >
                  <p className="font-semibold text-blue-900 mb-1">Founder responds:</p>
                  <p>{answer}</p>
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
        <Card className="overflow-hidden shadow-lg flex-1 flex flex-col border-2 border-blue-300 wood-card-center">
          <CardContent className="p-8 flex flex-col flex-1">
            {/* Header */}
            <motion.div variants={item} className="mb-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Round {round}/10</p>
                  <h2 className="text-4xl font-bold font-display text-foreground">{startup.name}</h2>
                </div>
              </div>
              <Badge className="bg-blue-600 text-white border-0 text-base py-2 px-4">
                Seeking ${ask.toLocaleString()}
              </Badge>
            </motion.div>

            {/* Pitch Text */}
            <motion.p variants={item} className="text-lg leading-relaxed text-foreground mb-8 italic flex-1">
              "{startup.pitch}"
            </motion.p>

            {/* Market & Risk */}
            <motion.div variants={item} className="space-y-4">
              <div className="bg-white p-4 rounded-xl border-2 border-gray-200">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Market Opportunity</p>
                <p className="text-foreground font-medium">{startup.market}</p>
              </div>

              <div className={`p-4 rounded-xl border-2 ${riskColor}`}>
                <p className="text-xs font-bold uppercase tracking-wider mb-2">Risk Assessment</p>
                <p className="font-bold">{riskLevel}</p>
              </div>

              {/* Valuation Graph */}
              <ValuationGraph 
                currentValuation={startup.valuation}
                riskProfile={startup.risk}
                upside={startup.upside}
              />
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
        <Card className="overflow-hidden shadow-lg flex-1 flex flex-col border-2 border-emerald-300 wood-card-right">
          <CardContent className="p-6 flex flex-col flex-1">
            {/* Ask Amount */}
            <motion.div variants={item} className="mb-8">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">They're Asking</p>
              <div className="text-4xl font-bold font-mono text-emerald-600">
                ${ask.toLocaleString()}
              </div>
            </motion.div>

            {/* Company Valuation */}
            <motion.div variants={item} className="mb-6 bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Valuation</p>
              <p className="text-2xl font-bold font-mono text-foreground">
                ${(startup.valuation ? (startup.valuation / 1000).toFixed(0) : "100") }k
              </p>
            </motion.div>

            {/* Upside Potential */}
            <motion.div variants={item} className="mb-6 bg-gradient-to-r from-yellow-100 to-orange-100 p-4 rounded-lg border-2 border-yellow-300">
              <p className="text-xs font-bold text-yellow-800 uppercase tracking-widest mb-2">Upside Potential</p>
              <p className="text-2xl font-bold text-yellow-800">
                {startup.upside.toFixed(1)}x
              </p>
            </motion.div>

            {/* Investment Slider */}
            <motion.div variants={item} className="mb-6 space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-foreground uppercase tracking-widest">Invest</label>
                <span className="text-2xl font-bold font-mono text-primary">{formatMoney(investAmount)}</span>
              </div>
              <Slider
                value={[investAmount]}
                onValueChange={(val) => setInvestAmount(val[0])}
                max={maxAllowed}
                min={1000}
                step={1000}
                disabled={disabled}
              />
              <div className="text-xs text-muted-foreground font-mono text-center">
                $1,000 — {formatMoney(maxAllowed)}
              </div>
            </motion.div>

            {/* Equity Display */}
            <motion.div variants={item} className="mb-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-1">Your Equity</p>
              <p className="text-xl font-bold text-blue-700">{ownership.toFixed(2)}%</p>
              {ownership === 49 && <p className="text-xs text-blue-600 mt-1">Max equity capped at 49%</p>}
            </motion.div>

            {/* Error States */}
            {!canInvest && (
              <div className="mb-4 bg-red-50 border border-red-300 p-2 rounded-lg text-xs text-red-800 font-medium">
                Invalid amount
              </div>
            )}

            {/* Action Buttons */}
            <motion.div variants={item} className="grid grid-cols-2 gap-3 mt-auto">
              <Button 
                size="sm"
                onClick={onPass}
                disabled={disabled}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 border-0 font-bold text-xs"
              >
                <X className="w-4 h-4 mr-1" />
                PASS
              </Button>
              
              <Button 
                size="sm"
                onClick={() => onInvest(investAmount)}
                disabled={disabled || !canInvest}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:shadow-lg hover:shadow-emerald-500/30 text-white border-0 font-bold text-xs"
              >
                <Check className="w-4 h-4 mr-1" />
                INVEST
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
