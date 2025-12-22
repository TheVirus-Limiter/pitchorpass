import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ValuationGraphProps {
  currentValuation: number;
  riskProfile: number;
  upside: number;
}

export function ValuationGraph({ currentValuation, riskProfile, upside }: ValuationGraphProps) {
  // Generate realistic historical data (past 12 months)
  const generateHistoricalData = () => {
    const data = [];
    const startValue = currentValuation * 0.6; // Started 40% lower
    let value = startValue;
    
    for (let i = -12; i <= 0; i++) {
      if (i === 0) {
        value = currentValuation; // Ensure current month is accurate
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
  const generateProjections = () => {
    const baseVal = currentValuation;
    
    // Three scenarios
    const conservative = [];
    const realistic = [];
    const optimistic = [];
    
    for (let i = 1; i <= 12; i++) {
      const month = `M+${i}`;
      
      // Conservative: low growth
      const conservativeGrowth = 1.04 + (riskProfile * 0.01);
      conservative.push({
        month,
        value: Math.round(baseVal * Math.pow(conservativeGrowth, i)),
        type: 'conservative'
      });
      
      // Realistic: moderate growth  
      const realisticGrowth = 1.10 + (riskProfile * 0.04);
      realistic.push({
        month,
        value: Math.round(baseVal * Math.pow(realisticGrowth, i)),
        type: 'realistic'
      });
      
      // Optimistic: high growth - exponential for high risk
      let optimisticGrowth = 1.15 + (riskProfile * 0.10);
      if (riskProfile > 0.6) {
        // High risk moonshots - crazy upside
        optimisticGrowth = 1.30 + (riskProfile * 0.40);
      }
      optimistic.push({
        month,
        value: Math.round(baseVal * Math.pow(optimisticGrowth, i)),
        type: 'optimistic'
      });
    }
    
    return { conservative, realistic, optimistic };
  };

  const historical = generateHistoricalData();
  const { conservative, realistic, optimistic } = generateProjections();

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
    <div className="w-full bg-white p-4 rounded-lg border-2 border-gray-200">
      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Company Valuation Projection</p>
      
      <ResponsiveContainer width="100%" height={250}>
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
            stroke="#2563eb" 
            strokeWidth={2.5}
            dot={{ fill: '#2563eb', r: 3 }}
            isAnimationActive={false}
            name="Historical"
          />
          
          {/* Projection lines - dotted */}
          <Line 
            type="monotone" 
            dataKey="conservative" 
            stroke="#ef4444" 
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            isAnimationActive={false}
            name="Conservative"
          />
          
          <Line 
            type="monotone" 
            dataKey="realistic" 
            stroke="#f59e0b" 
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            isAnimationActive={false}
            name="Realistic"
          />
          
          <Line 
            type="monotone" 
            dataKey="optimistic" 
            stroke="#10b981" 
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            isAnimationActive={false}
            name="Optimistic"
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-blue-500" />
          <span className="text-gray-700">Historical</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-red-500" style={{backgroundImage: 'repeating-linear-gradient(90deg, currentColor 0px, currentColor 5px, transparent 5px, transparent 10px)'}} />
          <span className="text-gray-700">Conservative</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-amber-500" style={{backgroundImage: 'repeating-linear-gradient(90deg, currentColor 0px, currentColor 5px, transparent 5px, transparent 10px)'}} />
          <span className="text-gray-700">Realistic</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-emerald-500" style={{backgroundImage: 'repeating-linear-gradient(90deg, currentColor 0px, currentColor 5px, transparent 5px, transparent 10px)'}} />
          <span className="text-gray-700">Optimistic</span>
        </div>
      </div>
    </div>
  );
}
