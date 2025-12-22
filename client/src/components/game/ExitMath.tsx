interface ExitMathProps {
  investAmount: number;
  valuation: number;
}

export function ExitMath({ investAmount, valuation }: ExitMathProps) {
  // Calculate ownership percentage
  const ownership = Math.min((investAmount / valuation) * 100, 49);
  
  // Realistic exit at $10M
  const exitValue = 10000000;
  
  // Their potential take
  const take = Math.round(exitValue * (ownership / 100));

  const formatMoney = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="sticky-note-news p-3 space-y-1 text-xs transform -rotate-1">
      <p style={{fontFamily: "'Comic Sans MS', cursive"}} className="text-gray-700 font-bold">
        If exit hits $10M →
      </p>
      <p style={{fontFamily: "'Comic Sans MS', cursive"}} className="text-gray-800 font-bold text-sm">
        Your take ≈ {formatMoney(take)}
      </p>
      <p className="text-gray-600 text-xs italic mt-2">
        ({ownership.toFixed(2)}% equity)
      </p>
    </div>
  );
}
