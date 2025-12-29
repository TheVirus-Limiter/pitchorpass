interface ExitMathProps {
  investAmount: number;
  valuation: number;
  phase: number;
}

export function ExitMath({ investAmount, valuation, phase }: ExitMathProps) {
  // Calculate ownership percentage
  const ownership = Math.min((investAmount / valuation) * 100, 49);
  
  // Phase 1: $10M exit, Phase 2: $100M exit
  const exitValue = phase === 2 ? 100000000 : 10000000;
  const exitLabel = phase === 2 ? "$100M" : "$10M";
  
  // Their potential take
  const take = Math.round(exitValue * (ownership / 100));

  const formatMoney = (val: number) => {
    if (val >= 1000000) {
      return `$${(val / 1000000).toFixed(1)}M`;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="sticky-note-news p-5 space-y-3 text-sm transform -rotate-1 border-l-4 border-green-600">
      <p style={{fontFamily: "'Caveat', cursive"}} className="text-gray-800 font-bold text-base">
        If exit hits {exitLabel} →
      </p>
      <p style={{fontFamily: "'Caveat', cursive"}} className="text-green-800 font-bold text-2xl border-b-2 border-green-700 pb-2 inline-block">
        Your take ≈ {formatMoney(take)}
      </p>
      <p className="text-gray-600 text-sm italic mt-2">
        ({ownership.toFixed(2)}% equity)
      </p>
    </div>
  );
}
