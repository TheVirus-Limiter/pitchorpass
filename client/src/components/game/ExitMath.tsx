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
    <div className="sticky-note-news p-4 space-y-2 text-sm transform -rotate-1">
      <p style={{fontFamily: "'Caveat', cursive"}} className="text-gray-800 font-bold text-base">
        If exit hits $10M →
      </p>
      <p style={{fontFamily: "'Caveat', cursive"}} className="text-gray-800 font-bold text-xl">
        Your take ≈ {formatMoney(take)}
      </p>
      <p className="text-gray-600 text-sm italic mt-2">
        ({ownership.toFixed(2)}% equity)
      </p>
    </div>
  );
}
