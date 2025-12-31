import { motion } from "framer-motion";

interface HandDrawnGraphProps {
  valuationHistory: number[];
  isWin: boolean;
}

export function HandDrawnGraph({ valuationHistory, isWin }: HandDrawnGraphProps) {
  if (!valuationHistory || valuationHistory.length < 2) return null;

  const width = 280;
  const height = 100;
  const padding = { top: 12, right: 15, bottom: 22, left: 15 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  const data = valuationHistory.slice(0, 3);
  while (data.length < 3) data.push(data[data.length - 1] || 0);

  const maxVal = Math.max(...data);
  const minVal = Math.min(...data.filter(v => v > 0), 0);
  const range = maxVal - minVal || 1;

  const points = data.map((val, i) => {
    const x = padding.left + (i / 2) * graphWidth;
    const normalizedVal = val === 0 ? 0 : (val - minVal) / range;
    const y = padding.top + graphHeight - (normalizedVal * graphHeight);
    return { x, y, val };
  });

  const peakIndex = points.reduce((maxIdx, p, idx) => 
    p.y < points[maxIdx].y ? idx : maxIdx, 0);
  
  const endValue = data[data.length - 1];
  const startValue = data[0];
  const isMeh = Math.abs(endValue - startValue) / startValue < 0.3;
  
  let strokeColor = "#9ca3af";
  if (!isMeh) {
    strokeColor = isWin ? "#16a34a" : "#dc2626";
  }

  const pathD = points.map((p, i) => 
    `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
  ).join(' ');

  const years = ["Year 1", "Year 2", "Year 3"];

  const keyPointIndices = new Set([0, peakIndex, 2]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-stone-50/50 rounded p-3"
    >
      <svg 
        width="100%" 
        height={height} 
        viewBox={`0 0 ${width} ${height}`}
        style={{ pointerEvents: 'none' }}
      >
        {[0, 1, 2].map(i => {
          const y = padding.top + (i / 2) * graphHeight;
          return (
            <line
              key={`grid-${i}`}
              x1={padding.left}
              y1={y}
              x2={width - padding.right}
              y2={y}
              stroke="#e7e5e4"
              strokeWidth="0.5"
              strokeDasharray="2,4"
            />
          );
        })}

        {years.map((label, i) => {
          const x = padding.left + (i / 2) * graphWidth;
          return (
            <text
              key={label}
              x={x}
              y={height - 6}
              textAnchor="middle"
              className="text-[9px] fill-stone-400"
              style={{ fontFamily: "'Caveat', cursive" }}
            >
              {label}
            </text>
          );
        })}

        <path
          d={pathD}
          fill="none"
          stroke={strokeColor}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {points.map((p, i) => {
          if (!keyPointIndices.has(i)) return null;
          return (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={2.5}
              fill={strokeColor}
            />
          );
        })}
      </svg>
    </motion.div>
  );
}
