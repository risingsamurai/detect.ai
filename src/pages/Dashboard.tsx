import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Database, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { LineChart, Line, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis } from 'recharts';
import { useAuditStore } from '../store/auditStore';

const mockTrendData = [
  { name: 'Mon', score: 72 },
  { name: 'Tue', score: 75 },
  { name: 'Wed', score: 73 },
  { name: 'Thu', score: 81 },
  { name: 'Fri', score: 85 },
  { name: 'Sat', score: 92 },
  { name: 'Sun', score: 94 },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { audits } = useAuditStore();
  const [loading, setLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-gray-400 mt-1">Overview of your AI fairness audits and metrics.</p>
        </div>
        <Button onClick={() => navigate('/audit/new')} className="gap-2 shadow-lg shadow-[#6C47FF]/20">
          <Plus className="w-5 h-5" /> Start New Audit
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Audits', value: audits.length || '3', icon: Database, color: 'text-blue-400' },
          { label: 'Avg Fairness Score', value: '84/100', icon: TrendingUp, color: 'text-[#22C55E]' },
          { label: 'Issues Found', value: '12', icon: AlertTriangle, color: 'text-[#FFB740]' },
          { label: 'Issues Fixed', value: '8', icon: CheckCircle2, color: 'text-[#00C2A8]' },
        ].map((stat, i) => (
          <Card key={i} className="flex items-center gap-4">
            {loading ? (
              <Skeleton className="w-12 h-12 rounded-lg" />
            ) : (
              <div className={`w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            )}
            <div>
              <p className="text-sm text-gray-400">{stat.label}</p>
              {loading ? (
                <Skeleton className="w-16 h-8 mt-1" />
              ) : (
                <p className="text-2xl font-bold">{stat.value}</p>
              )}
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Audits */}
        <Card className="lg:col-span-2 flex flex-col min-h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Recent Audits</h2>
            <Button variant="ghost" size="sm">View All</Button>
          </div>
          
          <div className="flex-1">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : audits.length > 0 ? (
              <div className="space-y-4">
                {audits.slice(0, 5).map((audit) => (
                  <div 
                    key={audit.id} 
                    onClick={() => navigate(`/audit/${audit.id}`)}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 cursor-pointer transition-colors"
                  >
                    <div>
                      <h4 className="font-medium">{audit.datasetName}</h4>
                      <p className="text-sm text-gray-400 mt-1">
                        {new Date(audit.createdAt).toLocaleDateString()} • {audit.rowCount.toLocaleString()} rows
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-medium">Score: {audit.fairnessScore}</div>
                        <Badge severity={audit.severity} className="mt-1" />
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-500" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-400">
                <Database className="w-12 h-12 mb-4 opacity-50" />
                <p>No audits yet. Start your first fairness analysis.</p>
                <Button onClick={() => navigate('/audit/new')} variant="outline" className="mt-4">
                  Upload Dataset
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Fairness Trend */}
        <Card className="flex flex-col">
          <h2 className="text-xl font-semibold mb-6">Fairness Trend (30d)</h2>
          <div className="flex-1 min-h-[300px]">
            {loading ? (
              <Skeleton className="w-full h-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockTrendData}>
                  <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#1A1A24', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#00C2A8' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#00C2A8" 
                    strokeWidth={3}
                    dot={{ fill: '#00C2A8', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
