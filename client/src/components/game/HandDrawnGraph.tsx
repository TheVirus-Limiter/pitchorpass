import { motion } from "framer-motion";
import { useMemo } from "react";

type OutcomeType = 'big-win' | 'acqui-hire' | 'shutdown' | 'missed' | 'dodged' | 'flat';

interface HandDrawnGraphProps {
  valuationHistory: number[];
  isWin: boolean;
  invested: boolean;
  outcomeLabel?: string;
}

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function HandDrawnGraph({ valuationHistory, isWin, invested, outcomeLabel }: HandDrawnGraphProps) {
  if (!valuationHistory || valuationHistory.length < 2) return null;

  const graphData = useMemo(() => {
    const width = 260;
    const height = 80;
    const padding = { top: 8, right: 12, bottom: 18, left: 12 };
    const graphWidth = width - padding.left - padding.right;
    const graphHeight = height - padding.top - padding.bottom;

    const data = valuationHistory.slice(0, 3);
    while (data.length < 3) data.push(data[data.length - 1] || 0);

    const maxVal = Math.max(...data);
    const minVal = Math.min(...data.filter(v => v > 0), 0);
    const range = maxVal - minVal || 1;

    const seed = data.reduce((a, b) => a + b, 0);
    const jitter = (val: number, amount: number, idx: number) => {
      return val + (seededRandom(seed + idx * 17) - 0.5) * amount;
    };

    const rawPoints = data.map((val, i) => {
      const x = padding.left + (i / 2) * graphWidth;
      const normalizedVal = val === 0 ? 0 : (val - minVal) / range;
      const y = padding.top + graphHeight - (normalizedVal * graphHeight);
      return { x, y, val };
    });

    const points = rawPoints.map((p, i) => ({
      x: jitter(p.x, 2, i),
      y: jitter(p.y, 3, i + 100),
      val: p.val
    }));

    const endVal = data[data.length - 1];
    const startVal = data[0];
    const peakVal = Math.max(...data);
    const peakIdx = data.indexOf(peakVal);
    
    let outcomeType: OutcomeType = 'flat';
    if (endVal === 0 || endVal < startVal * 0.1) {
      outcomeType = invested ? 'shutdown' : 'dodged';
    } else if (!invested && isWin) {
      outcomeType = 'missed';
    } else if (isWin && endVal > startVal * 3) {
      outcomeType = 'big-win';
    } else if (isWin && peakIdx === 1 && endVal < peakVal * 0.5) {
      outcomeType = 'acqui-hire';
    }

    const createBezierPath = () => {
      if (points.length < 2) return "";
      let path = `M ${points[0].x} ${points[0].y}`;
      
      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const cpx1 = prev.x + (curr.x - prev.x) * 0.4 + jitter(0, 4, i * 50);
        const cpy1 = prev.y + jitter(0, 3, i * 60);
        const cpx2 = curr.x - (curr.x - prev.x) * 0.4 + jitter(0, 4, i * 70);
        const cpy2 = curr.y + jitter(0, 3, i * 80);
        path += ` C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${curr.x} ${curr.y}`;
      }
      return path;
    };

    return {
      width,
      height,
      padding,
      graphWidth,
      graphHeight,
      points,
      pathD: createBezierPath(),
      outcomeType,
      peakIdx,
      jitter,
      seed
    };
  }, [valuationHistory, isWin, invested]);

  const { width, height, padding, graphWidth, points, pathD, outcomeType, peakIdx, jitter, seed } = graphData;

  const getStrokeStyle = () => {
    switch (outcomeType) {
      case 'big-win':
        return { color: '#16a34a', width: 2.5, dasharray: 'none' };
      case 'missed':
        return { color: '#16a34a', width: 1.5, dasharray: '4,3' };
      case 'shutdown':
        return { color: '#dc2626', width: 1.5, dasharray: 'none' };
      case 'dodged':
        return { color: '#9ca3af', width: 1.5, dasharray: 'none' };
      case 'acqui-hire':
        return { color: '#d97706', width: 1.5, dasharray: '6,4' };
      default:
        return { color: '#9ca3af', width: 1.5, dasharray: 'none' };
    }
  };

  const strokeStyle = getStrokeStyle();
  const years = ["Y1", "Y2", "Y3"];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="relative"
    >
      {outcomeLabel && (
        <div 
          className="text-[11px] text-stone-500 mb-1 pl-1"
          style={{ fontFamily: "'Caveat', cursive" }}
        >
          {outcomeLabel}
        </div>
      )}
      
      <div className={`relative rounded ${outcomeType === 'shutdown' ? 'bg-red-50/30' : 'bg-stone-50/40'}`}>
        {outcomeType === 'shutdown' && (
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
            <svg width="100%" height="100%" className="absolute inset-0">
              <pattern id="cracks" patternUnits="userSpaceOnUse" width="60" height="60">
                <path d="M10 0 L15 30 L5 60" stroke="#8b4513" strokeWidth="0.5" fill="none" opacity="0.3"/>
                <path d="M40 0 L35 25 L45 60" stroke="#8b4513" strokeWidth="0.5" fill="none" opacity="0.2"/>
              </pattern>
              <rect width="100%" height="100%" fill="url(#cracks)" />
            </svg>
          </div>
        )}
        
        <svg 
          width="100%" 
          height={height} 
          viewBox={`0 0 ${width} ${height}`}
          style={{ pointerEvents: 'none' }}
          className="overflow-visible"
        >
          <defs>
            <filter id="pencil-texture">
              <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="3" result="noise"/>
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.5" xChannelSelector="R" yChannelSelector="G"/>
            </filter>
          </defs>

          {[0, 1].map(i => {
            const y = padding.top + (i / 1) * (height - padding.top - padding.bottom);
            return (
              <line
                key={`grid-${i}`}
                x1={padding.left}
                y1={jitter(y, 0.5, i * 200)}
                x2={width - padding.right}
                y2={jitter(y, 0.5, i * 201)}
                stroke="#d6d3d1"
                strokeWidth="0.3"
                strokeDasharray="1,4"
                opacity={0.6}
              />
            );
          })}

          {years.map((label, i) => {
            const x = padding.left + (i / 2) * graphWidth;
            return (
              <text
                key={label}
                x={jitter(x, 1.5, i * 300)}
                y={height - 4}
                textAnchor="middle"
                className="text-[8px] fill-stone-400"
                style={{ fontFamily: "'Caveat', cursive" }}
              >
                {label}
              </text>
            );
          })}

          <path
            d={pathD}
            fill="none"
            stroke={strokeStyle.color}
            strokeWidth={strokeStyle.width}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={strokeStyle.dasharray}
            filter="url(#pencil-texture)"
            opacity={outcomeType === 'missed' ? 0.6 : 1}
          />

          <circle
            cx={points[0].x}
            cy={points[0].y}
            r={2}
            fill={strokeStyle.color}
            opacity={0.7}
          />

          {peakIdx > 0 && peakIdx < points.length - 1 && (
            <circle
              cx={points[peakIdx].x}
              cy={points[peakIdx].y}
              r={1.5}
              fill={strokeStyle.color}
              opacity={0.5}
            />
          )}

          <circle
            cx={points[points.length - 1].x}
            cy={points[points.length - 1].y}
            r={outcomeType === 'big-win' ? 4 : outcomeType === 'missed' ? 3 : 2.5}
            fill={outcomeType === 'missed' ? 'none' : strokeStyle.color}
            stroke={outcomeType === 'missed' ? strokeStyle.color : 'none'}
            strokeWidth={1}
            strokeDasharray={outcomeType === 'missed' ? '2,2' : 'none'}
            opacity={outcomeType === 'missed' ? 0.5 : 0.9}
          />

          {outcomeType === 'big-win' && (
            <circle
              cx={points[points.length - 1].x}
              cy={points[points.length - 1].y}
              r={8}
              fill="#16a34a"
              opacity={0.1}
            />
          )}

          {outcomeType === 'shutdown' && (
            <g opacity={0.4}>
              <line
                x1={points[points.length - 1].x - 6}
                y1={points[points.length - 1].y - 6}
                x2={points[points.length - 1].x + 6}
                y2={points[points.length - 1].y + 6}
                stroke="#dc2626"
                strokeWidth={1.5}
                strokeLinecap="round"
              />
              <line
                x1={points[points.length - 1].x + 6}
                y1={points[points.length - 1].y - 6}
                x2={points[points.length - 1].x - 6}
                y2={points[points.length - 1].y + 6}
                stroke="#dc2626"
                strokeWidth={1.5}
                strokeLinecap="round"
              />
            </g>
          )}

          {outcomeType === 'acqui-hire' && (
            <text
              x={points[points.length - 1].x + 8}
              y={points[points.length - 1].y + 3}
              className="text-[7px] fill-amber-600"
              style={{ fontFamily: "'Caveat', cursive" }}
            >
              acquired
            </text>
          )}
        </svg>
      </div>
    </motion.div>
  );
}
