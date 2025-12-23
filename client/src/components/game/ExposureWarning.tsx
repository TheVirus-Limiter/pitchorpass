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
    <div className="px-5 py-4 space-y-3 text-sm transform -rotate-0.5 bg-white border-l-4 border-red-400">
      <p className="text-xs font-bold text-red-700 uppercase tracking-widest">Exposure Warning</p>
      <p style={{fontFamily: "'Caveat', cursive"}} className="text-gray-800 text-lg font-semibold leading-relaxed border-b-2 border-red-300 pb-3">
        {getWarning()}
      </p>
    </div>
  );
}
