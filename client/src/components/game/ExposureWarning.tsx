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
    <div className="sticky-note-warning p-3 space-y-1 text-xs transform rotate-1 border-2 border-amber-300 bg-amber-50">
      <p style={{fontFamily: "'Caveat', cursive"}} className="text-gray-800 font-bold">
        Your Exposure
      </p>
      <p style={{fontFamily: "'Caveat', cursive"}} className="text-gray-700 text-sm">
        {getWarning()}
      </p>
    </div>
  );
}
