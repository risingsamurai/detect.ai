import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

interface DistributionChartProps {
  attribute: string;
  data: Array<{ group: string; rate: number }>;
}

export function DistributionChart({ attribute, data }: DistributionChartProps) {
  // Find max rate for Y axis domain
  const maxRate = Math.max(...data.map(d => d.rate));
  const avgRate = data.reduce((acc, curr) => acc + curr.rate, 0) / data.length;
  
  return (
    <div className="h-64 w-full">
      <h4 className="text-sm font-medium text-gray-400 mb-4 capitalize">{attribute} Distribution</h4>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis 
            dataKey="group" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#9CA3AF', fontSize: 12 }} 
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#9CA3AF', fontSize: 12 }} 
            domain={[0, Math.ceil(maxRate * 1.2)]}
            tickFormatter={(val) => `${(val * 100).toFixed(0)}%`}
          />
          <Tooltip
            cursor={{ fill: 'rgba(255,255,255,0.02)' }}
            contentStyle={{ backgroundColor: '#1A1A24', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
            formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, 'Approval Rate']}
          />
          
          <ReferenceLine y={avgRate} stroke="#6C47FF" strokeDasharray="3 3" opacity={0.5} />
          
          <Bar dataKey="rate" radius={[4, 4, 0, 0]} maxBarSize={60}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={index === 0 ? '#6C47FF' : '#00C2A8'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
