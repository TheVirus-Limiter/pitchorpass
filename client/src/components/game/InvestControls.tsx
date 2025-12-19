import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { DollarSign, X, Check } from "lucide-react";

interface InvestControlsProps {
  maxInvest: number;
  onInvest: (amount: number) => void;
  onPass: () => void;
  disabled: boolean;
}

export function InvestControls({ maxInvest, onInvest, onPass, disabled }: InvestControlsProps) {
  const [amount, setAmount] = useState(5000);

  // Reset amount when component mounts or maxInvest changes slightly (new round)
  useEffect(() => {
    setAmount(5000);
  }, [maxInvest]);

  const formatMoney = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <motion.div 
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="w-full max-w-2xl mx-auto bg-card/90 backdrop-blur-xl border-t border-white/10 p-6 sm:p-8 rounded-t-3xl sm:rounded-3xl shadow-2xl z-20"
    >
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Investment Amount</label>
            <span className="text-2xl font-bold font-mono text-primary">
              {formatMoney(amount)}
            </span>
          </div>
          <Slider
            value={[amount]}
            onValueChange={(val) => setAmount(val[0])}
            max={20000}
            min={1000}
            step={1000}
            disabled={disabled}
            className="py-4"
          />
          <div className="flex justify-between text-xs text-muted-foreground font-mono">
            <span>$1k</span>
            <span>$10k</span>
            <span>$20k</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button 
            variant="pass" 
            size="lg" 
            onClick={onPass}
            disabled={disabled}
            className="w-full"
          >
            <X className="mr-2 h-5 w-5" />
            PASS
          </Button>
          
          <Button 
            variant="invest" 
            size="lg" 
            onClick={() => onInvest(amount)}
            disabled={disabled}
            className="w-full relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <span className="relative flex items-center">
              <Check className="mr-2 h-5 w-5" />
              INVEST
            </span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
