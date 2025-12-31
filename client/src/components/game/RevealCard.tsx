import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Newspaper, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { HandDrawnGraph } from "./HandDrawnGraph";

interface NewsClipping {
  source: string;
  headline: string;
}

interface RevealCardProps {
  companyName: string;
  investmentAmount: number;
  ownership: number;
  outcome: number;
  isWin: boolean;
  narrative: string;
  newsClippings: NewsClipping[];
  valuationHistory: number[];
  missedOpportunity: number;
  onNext: () => void;
  isLast: boolean;
  invested: boolean;
}

export function RevealCard({ 
  companyName, 
  investmentAmount, 
  ownership, 
  outcome, 
  isWin, 
  narrative, 
  newsClippings,
  valuationHistory,
  missedOpportunity,
  onNext, 
  isLast,
  invested
}: RevealCardProps) {
  const profit = outcome - investmentAmount;
  
  const formatMoney = (val: number) => {
    const absVal = Math.abs(val);
    if (absVal >= 1000000000) {
      return `$${(val / 1000000000).toFixed(1)}B`;
    }
    if (absVal >= 1000000) {
      return `$${(val / 1000000).toFixed(1)}M`;
    }
    if (absVal >= 1000) {
      return `$${(val / 1000).toFixed(0)}K`;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  const formatValuation = (val: number) => {
    if (val >= 1000000000) return `$${(val / 1000000000).toFixed(1)}B`;
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`;
    return `$${val}`;
  };

  const [buttonEnabled, setButtonEnabled] = useState(false);

  useEffect(() => {
    setButtonEnabled(false);
    const timer = setTimeout(() => setButtonEnabled(true), 400);
    return () => clearTimeout(timer);
  }, [companyName]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 overflow-auto py-8">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-100/95 via-stone-100/95 to-amber-50/95" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOCIgbnVtT2N0YXZlcz0iNCIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZSkiIG9wYWNpdHk9IjAuMDUiLz48L3N2Zz4=')] opacity-60" />
      
      <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-amber-300/40 rounded-tl-lg" />
      <div className="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-amber-300/40 rounded-tr-lg" />
      <div className="absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-amber-300/40 rounded-bl-lg" />
      <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-amber-300/40 rounded-br-lg" />
      
      <div className="absolute top-8 left-8 opacity-10">
        <div className="text-6xl font-bold text-amber-800" style={{ fontFamily: "'Caveat', cursive" }}>3 YEARS LATER</div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative max-w-2xl w-full mx-4"
      >
        <Card className="border-2 border-stone-300 shadow-2xl bg-white/95 backdrop-blur">
          <CardContent className="p-6 space-y-5">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-center"
            >
              <h1 
                style={{ fontFamily: "'Caveat', cursive" }}
                className="text-4xl font-bold text-gray-900"
              >
                {companyName}
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                {invested 
                  ? `Invested ${formatMoney(investmentAmount)} for ${ownership.toFixed(2)}% equity`
                  : "You passed on this deal"
                }
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.4, type: "spring" }}
              className="py-4 text-center"
            >
              {invested ? (
                <div className="space-y-1">
                  <div className={`text-5xl font-bold font-mono ${isWin ? 'text-green-700' : 'text-red-600'}`}>
                    {isWin ? '+' : ''}{formatMoney(profit)}
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    {isWin ? <TrendingUp className="w-4 h-4 text-green-600" /> : <TrendingDown className="w-4 h-4 text-red-500" />}
                    <span>{isWin ? `${((outcome / investmentAmount) || 1).toFixed(1)}x return` : 'Total loss'}</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {isWin && missedOpportunity > 0 ? (
                    <>
                      <div className="text-4xl font-bold font-mono text-amber-600">
                        {formatMoney(missedOpportunity)}
                      </div>
                      <div className="flex items-center justify-center gap-2 text-amber-700">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">Missed opportunity</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        If you'd invested, you could have made ~{formatMoney(missedOpportunity)}
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="text-4xl font-bold font-mono text-green-600">
                        $0 lost
                      </div>
                      <div className="flex items-center justify-center gap-2 text-green-700">
                        <TrendingDown className="w-4 h-4" />
                        <span className="text-sm font-medium">Smart pass - company failed</span>
                      </div>
                    </>
                  )}
                </div>
              )}
            </motion.div>

            {valuationHistory.length > 0 && (
              <HandDrawnGraph 
                valuationHistory={valuationHistory} 
                isWin={isWin} 
                invested={invested}
              />
            )}

            {narrative && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.3 }}
                className="bg-amber-50/50 border border-amber-200 rounded-lg p-4"
              >
                <p className="text-gray-800 text-sm leading-relaxed italic">
                  "{narrative}"
                </p>
              </motion.div>
            )}

            {newsClippings && newsClippings.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0, duration: 0.3 }}
                className="space-y-2"
              >
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  <Newspaper className="w-3 h-3" />
                  Recent Headlines
                </div>
                <div className="space-y-2">
                  {newsClippings.slice(0, 3).map((clip, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.1 + i * 0.1, duration: 0.2 }}
                      className="flex items-start gap-2 bg-white border border-stone-200 rounded p-2"
                    >
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide whitespace-nowrap min-w-[80px]">
                        {clip.source}
                      </span>
                      <span className="text-xs text-gray-700 leading-tight">
                        {clip.headline}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.3 }}
              className="pt-2"
            >
              <Button 
                onClick={onNext}
                size="lg"
                disabled={!buttonEnabled}
                className="w-full bg-stone-800 hover:bg-stone-900 text-white disabled:opacity-50"
                data-testid="button-next-reveal"
              >
                {isLast ? "See Final Results" : "Next Company"}
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
