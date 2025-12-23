interface ExposureWarningProps {
  investAmount: number;
  remainingCapital: number;
}

export function ExposureWarning({ investAmount, remainingCapital }: ExposureWarningProps) {
  const exposurePercent = (investAmount / remainingCapital) * 100;

  const getWarning = () => {
    if (exposurePercent < 15) {
      return "Diversified enough to survive misses.";
    } else if (exposurePercent < 35) {
      return `This would put ${exposurePercent.toFixed(0)}% of your remaining capital into one bet.`;
    } else if (exposurePercent < 55) {
      return "High concentration — one failure hurts.";
    } else {
      return "You're betting the fund on this.";
    }
  };

  return (
    <div className="px-5 py-4 space-y-3 text-sm transform -rotate-0.5 bg-amber-50 border border-amber-300 rounded">
      <p className="text-xs font-bold text-amber-800 uppercase tracking-widest">Pro Tip</p>
      <p style={{fontFamily: "'Caveat', cursive"}} className="text-gray-800 text-lg font-semibold leading-relaxed">
        {getWarning()}
      </p>
    </div>
  );
}
