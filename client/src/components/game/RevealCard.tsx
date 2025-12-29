import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface RevealCardProps {
  companyName: string;
  investmentAmount: number;
  ownership: number;
  outcome: number;
  isWin: boolean;
  narrative: string;
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
  onNext, 
  isLast,
  invested
}: RevealCardProps) {
  const profit = outcome - investmentAmount;
  
  const formatMoney = (val: number) => {
    const absVal = Math.abs(val);
    if (absVal >= 1000000) {
      return `$${(val / 1000000).toFixed(1)}M`;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  const getFlavorNote = () => {
    if (!invested) return null;
    if (isWin && profit > investmentAmount * 5) return "Massive win.";
    if (isWin && profit > investmentAmount * 2) return "Risk paid off.";
    if (isWin) return "Good timing.";
    if (!isWin && investmentAmount > 0) return "It happens.";
    return null;
  };

  const flavorNote = getFlavorNote();

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-amber-50/95 to-stone-100/95 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOCIgbnVtT2N0YXZlcz0iNCIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZSkiIG9wYWNpdHk9IjAuMDMiLz48L3N2Zz4=')] opacity-50" />
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/10 pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative max-w-lg w-full mx-4"
      >
        <Card className="border-2 border-gray-300 shadow-2xl bg-white/90 backdrop-blur">
          <CardContent className="p-8 text-center space-y-6">
            {/* Company Name */}
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              style={{ fontFamily: "'Caveat', cursive" }}
              className="text-4xl font-bold text-gray-900"
            >
              {companyName}
            </motion.h1>

            {/* Context Line */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              className="text-gray-600 text-lg"
            >
              {invested 
                ? `You invested ${formatMoney(investmentAmount)} for ${ownership.toFixed(2)}% equity`
                : "You passed on this deal"
              }
            </motion.p>

            {/* Outcome Number */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.4, type: "spring" }}
              className="py-6"
            >
              {invested ? (
                <div className={`text-5xl font-bold font-mono ${isWin ? 'text-green-700' : 'text-red-600'}`}>
                  {isWin ? '+' : ''}{formatMoney(profit)}
                </div>
              ) : (
                <div className="text-3xl font-bold text-gray-400">
                  --
                </div>
              )}
            </motion.div>

            {/* Narrative */}
            {invested && narrative && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.3 }}
                className="text-gray-700 text-lg italic leading-relaxed"
              >
                "{narrative}"
              </motion.p>
            )}

            {/* Flavor Note */}
            {flavorNote && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0, duration: 0.3 }}
                style={{ fontFamily: "'Caveat', cursive" }}
                className="text-gray-500 text-xl"
              >
                {flavorNote}
              </motion.p>
            )}

            {/* Next Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.3 }}
              className="pt-4"
            >
              <Button 
                onClick={onNext}
                size="lg"
                className="bg-gray-800 hover:bg-gray-900 text-white px-8"
                data-testid="button-next-reveal"
              >
                {isLast ? "See Results" : "Next"}
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
