import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useMemo } from 'react';

interface ValuationGraphProps {
  currentValuation: number;
  riskProfile: number;
  upside: number;
}

export function ValuationGraph({ currentValuation, riskProfile, upside }: ValuationGraphProps) {
  // Generate realistic historical data (past 12 months)
  const generateHistoricalData = (valuation: number) => {
    const data = [];
    const startValue = valuation * 0.6; // Started 40% lower
    let value = startValue;
    
    for (let i = -12; i <= 0; i++) {
      if (i === 0) {
        value = valuation; // Ensure current month is accurate
      } else {
        const growthRate = 1.08 + (Math.random() * 0.08); // 8-16% monthly growth
        value = value * growthRate;
      }
      
      data.push({
        month: i === 0 ? 'Now' : `M${i}`,
        actual: Math.round(value),
        type: 'history'
      });
    }
    
    return data;
  };

  // Generate future projections
  const generateProjections = (valuation: number, risk: number) => {
    const baseVal = valuation;
    
    // Three scenarios
    const conservative = [];
    const realistic = [];
    const optimistic = [];
    
    for (let i = 1; i <= 12; i++) {
      const month = `M+${i}`;
      
      // Conservative: low growth
      const conservativeGrowth = 1.04 + (risk * 0.01);
      conservative.push({
        month,
        value: Math.round(baseVal * Math.pow(conservativeGrowth, i)),
        type: 'conservative'
      });
      
      // Realistic: moderate growth  
      const realisticGrowth = 1.10 + (risk * 0.04);
      realistic.push({
        month,
        value: Math.round(baseVal * Math.pow(realisticGrowth, i)),
        type: 'realistic'
      });
      
      // Optimistic: high growth - exponential for high risk
      let optimisticGrowth = 1.15 + (risk * 0.10);
      if (risk > 0.6) {
        // High risk moonshots - crazy upside
        optimisticGrowth = 1.30 + (risk * 0.40);
      }
      optimistic.push({
        month,
        value: Math.round(baseVal * Math.pow(optimisticGrowth, i)),
        type: 'optimistic'
      });
    }
    
    return { conservative, realistic, optimistic };
  };

  // Freeze graph data using useMemo - prevents recalculation on re-render
  const { historical, conservative, realistic, optimistic } = useMemo(() => {
    const hist = generateHistoricalData(currentValuation);
    const { conservative: cons, realistic: real, optimistic: opt } = generateProjections(currentValuation, riskProfile);
    return {
      historical: hist,
      conservative: cons,
      realistic: real,
      optimistic: opt
    };
  }, [currentValuation, riskProfile]);

  // Combine data for chart
  const chartData = [
    ...historical.map(d => ({
      month: d.month,
      actual: d.actual,
      conservative: undefined,
      realistic: undefined,
      optimistic: undefined
    })),
    ...realistic.map((d, idx) => ({
      month: d.month,
      actual: undefined,
      conservative: conservative[idx].value,
      realistic: d.value,
      optimistic: optimistic[idx].value
    }))
  ];

  const formatCurrency = (val: number | undefined) => {
    if (val === undefined || val === null) return '';
    if (val >= 1000000) {
      return `$${(val / 1000000).toFixed(1)}M`;
    }
    return `$${(val / 1000).toFixed(0)}k`;
  };

  return (
    <div className="w-full bg-white p-3 rounded-lg border border-gray-300" style={{opacity: 0.85}}>
      <p className="text-sm font-semibold text-gray-600 uppercase tracking-widest mb-3">Valuation Projection</p>
      
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="month" 
            fontSize={12}
            tick={{ fill: '#6b7280' }}
          />
          <YAxis 
            fontSize={12}
            tick={{ fill: '#6b7280' }}
            tickFormatter={(value) => formatCurrency(value)}
            domain={['dataMin * 0.9', 'dataMax * 1.1']}
          />
          <Tooltip 
            formatter={(value) => value ? formatCurrency(value) : null}
            labelFormatter={(label) => `Month: ${label}`}
            contentStyle={{ 
              backgroundColor: '#f9fafb', 
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              padding: '8px'
            }}
          />
          
          {/* Actual historical line */}
          <Line 
            type="monotone" 
            dataKey="actual" 
            stroke="#4b5563" 
            strokeWidth={1.5}
            dot={{ fill: '#4b5563', r: 2 }}
            isAnimationActive={false}
            name="Historical"
          />
          
          {/* Projection lines - dotted, muted colors */}
          <Line 
            type="monotone" 
            dataKey="conservative" 
            stroke="#6b8db8" 
            strokeWidth={1}
            strokeDasharray="4 4"
            dot={false}
            isAnimationActive={false}
            name="Conservative"
          />
          
          <Line 
            type="monotone" 
            dataKey="realistic" 
            stroke="#7a9b6e" 
            strokeWidth={1}
            strokeDasharray="4 4"
            dot={false}
            isAnimationActive={false}
            name="Realistic"
          />
          
          <Line 
            type="monotone" 
            dataKey="optimistic" 
            stroke="#a87070" 
            strokeWidth={1}
            strokeDasharray="4 4"
            dot={false}
            isAnimationActive={false}
            name="Optimistic"
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="mt-2 grid grid-cols-2 gap-2 text-xs opacity-70">
        <div className="flex items-center gap-2">
          <div className="w-3 h-px bg-gray-700" />
          <span className="text-gray-700 text-xs">Historical</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-px" style={{backgroundImage: 'repeating-linear-gradient(90deg, #6b8db8 0px, #6b8db8 4px, transparent 4px, transparent 8px)'}} />
          <span className="text-gray-700 text-xs">Conservative</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-px" style={{backgroundImage: 'repeating-linear-gradient(90deg, #7a9b6e 0px, #7a9b6e 4px, transparent 4px, transparent 8px)'}} />
          <span className="text-gray-700">Realistic</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-px" style={{backgroundImage: 'repeating-linear-gradient(90deg, #a87070 0px, #a87070 4px, transparent 4px, transparent 8px)'}} />
          <span className="text-gray-700 text-xs">Optimistic</span>
        </div>
      </div>
    </div>
  );
}
