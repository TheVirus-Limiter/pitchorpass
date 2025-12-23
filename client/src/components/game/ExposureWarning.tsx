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
    <div className="px-4 py-3 space-y-2 text-sm transform -rotate-0.5">
      <p style={{fontFamily: "'Caveat', cursive"}} className="text-gray-800 font-semibold mb-2">
        Your Exposure
      </p>
      <p style={{fontFamily: "'Caveat', cursive"}} className="text-gray-700 text-base border-b-2 border-red-300 pb-2">
        {getWarning()}
      </p>
    </div>
  );
}
