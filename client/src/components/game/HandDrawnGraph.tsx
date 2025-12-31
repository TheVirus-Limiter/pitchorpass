import { motion } from "framer-motion";

interface HandDrawnGraphProps {
  valuationHistory: number[];
  isWin: boolean;
  invested: boolean;
}

export function HandDrawnGraph({ valuationHistory, isWin, invested }: HandDrawnGraphProps) {
  if (!valuationHistory || valuationHistory.length < 2) return null;

  const width = 300;
  const height = 100;
  const padding = { top: 15, right: 40, bottom: 25, left: 10 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  const maxVal = Math.max(...valuationHistory);
  const minVal = Math.min(...valuationHistory.filter(v => v > 0), 0);
  const range = maxVal - minVal || 1;

  const addJitter = (val: number, amount: number = 2) => {
    return val + (Math.random() - 0.5) * amount;
  };

  const points = valuationHistory.map((val, i) => {
    const x = padding.left + (i / (valuationHistory.length - 1)) * graphWidth;
    const normalizedVal = val === 0 ? 0 : (val - minVal) / range;
    const y = padding.top + graphHeight - (normalizedVal * graphHeight);
    return { x: addJitter(x, 1), y: addJitter(y, 2), originalY: y, val };
  });

  const createHandDrawnPath = () => {
    if (points.length < 2) return "";
    
    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      
      const midX = (prev.x + curr.x) / 2 + addJitter(0, 3);
      const midY = (prev.y + curr.y) / 2 + addJitter(0, 4);
      
      path += ` Q ${midX} ${midY}, ${curr.x} ${curr.y}`;
    }
    
    return path;
  };

  const formatVal = (val: number) => {
    if (val >= 1000000000) return `$${(val / 1000000000).toFixed(0)}B`;
    if (val >= 1000000) return `$${(val / 1000000).toFixed(0)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`;
    return `$${val}`;
  };

  const getEndAnnotation = () => {
    if (!invested && isWin) return "this was the one";
    if (!invested && !isWin) return "dodged it";
    if (isWin) {
      const annotations = ["finally took off", "acquired quietly", "big exit"];
      return annotations[Math.floor(Math.random() * annotations.length)];
    } else {
      const annotations = ["ran out of runway", "couldn't scale", "shut down"];
      return annotations[Math.floor(Math.random() * annotations.length)];
    }
  };

  const strokeColor = isWin ? "#16a34a" : "#dc2626";
  const lastPoint = points[points.length - 1];
  const annotation = getEndAnnotation();

  const peakIndex = points.reduce((maxIdx, p, idx) => 
    p.originalY < points[maxIdx].originalY ? idx : maxIdx, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.4 }}
      className="bg-stone-50 rounded-lg p-3 border border-stone-200"
    >
      <div className="flex items-center justify-between mb-2">
        <span 
          className="text-xs font-medium text-gray-600"
          style={{ fontFamily: "'Caveat', cursive" }}
        >
          3-Year Journey
        </span>
        <span className="text-xs text-gray-500">
          {formatVal(valuationHistory[0])} → {formatVal(valuationHistory[valuationHistory.length - 1])}
        </span>
      </div>
      
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        <defs>
          <filter id="pencil">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" result="noise"/>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1" xChannelSelector="R" yChannelSelector="G"/>
          </filter>
        </defs>

        <line 
          x1={padding.left} 
          y1={height - padding.bottom + 2} 
          x2={width - padding.right} 
          y2={height - padding.bottom + addJitter(2, 1)}
          stroke="#a8a29e"
          strokeWidth="1"
          strokeDasharray="3,3"
        />

        {["Start", "Y1", "Y2", "Y3"].map((label, i) => {
          const x = padding.left + (i / 3) * graphWidth;
          return (
            <text
              key={label}
              x={addJitter(x, 2)}
              y={height - 5}
              textAnchor="middle"
              className="text-[9px] fill-stone-400"
              style={{ fontFamily: "'Caveat', cursive" }}
            >
              {label}
            </text>
          );
        })}

        <motion.path
          d={createHandDrawnPath()}
          fill="none"
          stroke={strokeColor}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#pencil)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />

        {points.map((p, i) => (
          <motion.circle
            key={i}
            cx={p.x}
            cy={p.originalY}
            r={i === points.length - 1 ? 4 : 2}
            fill={strokeColor}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8 + i * 0.15 }}
          />
        ))}

        {!isWin && peakIndex > 0 && peakIndex < points.length - 1 && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <circle
              cx={points[peakIndex].x}
              cy={points[peakIndex].originalY - 10}
              r={8}
              fill="none"
              stroke="#dc2626"
              strokeWidth={1}
              strokeDasharray="2,2"
            />
            <text
              x={points[peakIndex].x}
              y={points[peakIndex].originalY - 22}
              textAnchor="middle"
              className="text-[8px] fill-red-600"
              style={{ fontFamily: "'Caveat', cursive" }}
            >
              peak
            </text>
          </motion.g>
        )}

        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
        >
          <line
            x1={lastPoint.x + 5}
            y1={lastPoint.originalY}
            x2={lastPoint.x + 15}
            y2={lastPoint.originalY - 5}
            stroke={strokeColor}
            strokeWidth={1.5}
          />
          <polygon
            points={`${lastPoint.x + 12},${lastPoint.originalY - 8} ${lastPoint.x + 18},${lastPoint.originalY - 5} ${lastPoint.x + 14},${lastPoint.originalY - 2}`}
            fill={strokeColor}
          />
          <text
            x={lastPoint.x + 22}
            y={lastPoint.originalY - 3}
            className="text-[9px]"
            style={{ fontFamily: "'Caveat', cursive", fill: strokeColor }}
          >
            {annotation}
          </text>
        </motion.g>
      </svg>
    </motion.div>
  );
}
