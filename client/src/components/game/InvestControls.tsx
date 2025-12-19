import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { DollarSign, X, Check } from "lucide-react";
import type { Pitch } from "@shared/routes";

interface InvestControlsProps {
  maxInvest: number;
  pitch: Pitch | null;
  onInvest: (amount: number) => void;
  onPass: () => void;
  disabled: boolean;
}

export function InvestControls({ maxInvest, pitch, onInvest, onPass, disabled }: InvestControlsProps) {
  const [amount, setAmount] = useState(5000);
  const minimumInvest = pitch?.minimumInvestment || 1000;
  const maxAllowed = Math.min(maxInvest, 50000);
  const company_valuation = pitch?.startup.valuation || 1000000;
  const ownership = (amount / company_valuation) * 100;

  useEffect(() => {
    setAmount(Math.max(minimumInvest, 5000));
  }, [pitch, minimumInvest]);

  const formatMoney = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  const canInvest = amount >= minimumInvest && amount <= maxInvest;

  return (
    <motion.div 
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="w-full max-w-4xl mx-auto bg-white/95 backdrop-blur-xl border-t-2 border-gray-200 p-6 sm:p-8 rounded-t-2xl sm:rounded-3xl shadow-2xl z-20"
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-bold text-foreground uppercase tracking-wider">Investment Amount</label>
            <span className="text-3xl font-bold font-mono text-primary">
              {formatMoney(amount)}
            </span>
          </div>
          <Slider
            value={[amount]}
            onValueChange={(val) => setAmount(val[0])}
            max={maxAllowed}
            min={minimumInvest}
            step={1000}
            disabled={disabled}
            className="py-4"
          />
          <div className="flex justify-between text-xs text-muted-foreground font-mono">
            <span>{formatMoney(minimumInvest)}</span>
            <span>{formatMoney(maxAllowed / 2)}</span>
            <span>{formatMoney(maxAllowed)}</span>
          </div>
        </div>

        {/* Info Row - Equity & Funds Available */}
        <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Your Equity</p>
            <p className="text-xl font-bold text-primary">{ownership.toFixed(2)}%</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Funds Available</p>
            <p className="text-xl font-bold text-emerald-600">{formatMoney(maxInvest)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">MRR</p>
            <p className="text-xl font-bold text-blue-600">{formatMoney(pitch?.startup.traction.revenue || 0)}</p>
            <p className="text-xs text-muted-foreground">Monthly Recurring Revenue</p>
          </div>
        </div>

        {minimumInvest > 1000 && (
          <div className="bg-yellow-50 border border-yellow-300 p-3 rounded-lg">
            <p className="text-sm text-yellow-800 font-medium">
              ⚠️ Minimum investment required: {formatMoney(minimumInvest)}
            </p>
          </div>
        )}

        {!canInvest && (
          <div className="bg-red-50 border border-red-300 p-3 rounded-lg">
            <p className="text-sm text-red-800 font-medium">
              ⚠️ Investment amount must be between {formatMoney(minimumInvest)} and {formatMoney(maxInvest)}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Button 
            size="lg" 
            onClick={onPass}
            disabled={disabled}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 border-0 font-bold"
          >
            <X className="mr-2 h-5 w-5" />
            PASS
          </Button>
          
          <Button 
            size="lg" 
            onClick={() => onInvest(amount)}
            disabled={disabled || !canInvest}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:shadow-lg hover:shadow-emerald-500/30 text-white border-0 font-bold"
          >
            <Check className="mr-2 h-5 w-5" />
            INVEST
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
