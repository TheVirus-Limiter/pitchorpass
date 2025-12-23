import { type Pitch } from "@shared/schema";

interface FounderConvictionProps {
  pitch: Pitch;
}

export function FounderConviction({ pitch }: FounderConvictionProps) {
  const { founder, startup } = pitch;

  // Generate conviction assessment based on pitch characteristics
  const generateConviction = () => {
    const convictions = [
      {
        label: "Calm, precise, confident",
        style: "from-blue-50 to-blue-100 text-blue-900 border-blue-300"
      },
      {
        label: "Overconfident, buzzword-heavy",
        style: "from-red-50 to-red-100 text-red-900 border-red-300"
      },
      {
        label: "Honest but uncertain",
        style: "from-amber-50 to-amber-100 text-amber-900 border-amber-300"
      },
      {
        label: "Knows the problem deeply",
        style: "from-emerald-50 to-emerald-100 text-emerald-900 border-emerald-300"
      },
      {
        label: "Hand-wavy on scale, optimistic",
        style: "from-purple-50 to-purple-100 text-purple-900 border-purple-300"
      },
      {
        label: "Data-driven, measured expectations",
        style: "from-indigo-50 to-indigo-100 text-indigo-900 border-indigo-300"
      }
    ];

    // Select based on pitch characteristics
    const pitchLength = startup.pitch.length;
    const hasMetrics = startup.traction.revenue > 50000;
    const highGrowth = startup.traction.monthlyGrowth > 30;
    const highRisk = startup.risk > 0.6;

    let index = 0;
    if (hasMetrics && !highRisk) index = 5; // Data-driven
    else if (highRisk && highGrowth) index = 1; // Overconfident
    else if (hasMetrics && startup.traction.users < 50000) index = 2; // Honest but uncertain
    else if (pitchLength > 200) index = 3; // Knows the problem
    else if (highRisk) index = 4; // Hand-wavy
    else index = 0; // Calm and confident

    return convictions[index];
  };

  const conviction = generateConviction();
  
  const convictionColors = {
    "Calm, precise, confident": "bg-green-100 border-green-400",
    "Overconfident, buzzword-heavy": "bg-red-100 border-red-400",
    "Honest but uncertain": "bg-yellow-100 border-yellow-400",
    "Knows the problem deeply": "bg-green-100 border-green-400",
    "Hand-wavy on scale, optimistic": "bg-red-100 border-red-400",
    "Data-driven, measured expectations": "bg-green-100 border-green-400"
  };
  
  const bgColor = convictionColors[conviction.label as keyof typeof convictionColors] || "bg-yellow-100 border-yellow-400";

  return (
    <div className={`text-left space-y-2 p-4 rounded border-2 ${bgColor}`}>
      <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">Founder Conviction</p>
      <p style={{fontFamily: "'Caveat', cursive"}} className="text-lg text-gray-800 italic font-semibold leading-relaxed">
        {conviction.label}
      </p>
    </div>
  );
}
