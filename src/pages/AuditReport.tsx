import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Share2, Sparkles, AlertTriangle } from 'lucide-react';
import { useAuditStore } from '../store/auditStore';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';

// Charts
import { FairnessGauge } from '../components/charts/FairnessGauge';
import { BiasHeatmap } from '../components/charts/BiasHeatmap';
import { DistributionChart } from '../components/charts/DistributionChart';
import { MetricCard } from '../components/audit/MetricCard';
import { MitigationCard } from '../components/audit/MitigationCard';
import { ComplianceChecker } from '../components/audit/ComplianceChecker';

import { AIChat } from '../components/ai/AIChat';
import { InsightCard } from '../components/ai/InsightCard';

export default function AuditReport() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { audits } = useAuditStore();
  const [loading, setLoading] = useState(true);
  
  const audit = audits.find(a => a.id === id);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <div className="grid grid-cols-2 gap-6">
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!audit) {
    return (
      <div className="text-center py-20">
        <AlertTriangle className="w-12 h-12 text-[#FF4D6D] mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Audit Not Found</h2>
        <p className="text-gray-400 mb-6">The requested audit report does not exist or you don't have access.</p>
        <Button onClick={() => navigate('/dashboard')}>Return to Dashboard</Button>
      </div>
    );
  }

  // Mock recommendations for UI structure
  const recommendations = [
    {
      id: '1',
      title: 'Apply Reweighing Algorithm',
      description: 'Modify the weights of training examples to ensure fairness before model training. This addresses the disparate impact observed in the Gender attribute.',
      effort: 'low' as const,
      expectedImprovement: 12
    },
    {
      id: '2',
      title: 'Calibrated Equalized Odds',
      description: 'Post-processing technique that optimizes over calibrated classifier score outputs to find probabilities with which to change output labels.',
      effort: 'medium' as const,
      expectedImprovement: 8
    }
  ];

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">{audit.datasetName} Report</h1>
              <Badge severity={audit.severity} />
            </div>
            <p className="text-gray-400 text-sm mt-1">
              Analyzed {audit.rowCount.toLocaleString()} rows • Target: <span className="text-white font-medium">{audit.targetColumn}</span>
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 text-sm"><Share2 className="w-4 h-4" /> Share</Button>
          <Button variant="outline" className="gap-2 text-sm"><Download className="w-4 h-4" /> Export PDF</Button>
        </div>
      </div>

      {/* AI Narrative */}
      <InsightCard metrics={audit.metrics} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Fairness Score */}
        <Card className="flex flex-col items-center justify-center text-center">
          <h3 className="text-lg font-semibold mb-6 w-full text-left">Overall Fairness</h3>
          <FairnessGauge score={audit.fairnessScore} />
        </Card>

        {/* Bias Heatmap */}
        <Card className="lg:col-span-2">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            Intersectional Bias Map
            <Sparkles className="w-4 h-4 text-[#00C2A8]" />
          </h3>
          <BiasHeatmap metrics={audit.metrics} />
        </Card>
      </div>

      {/* Deep Dive Metrics */}
      <div>
        <h2 className="text-xl font-bold mb-6 mt-12 border-b border-white/5 pb-2">Protected Attribute Breakdown</h2>
        
        {audit.protectedAttributes.map((attr) => {
          const metrics = audit.metrics[attr];
          if (!metrics) return null;

          return (
            <div key={attr} className="mb-12">
              <h3 className="text-lg font-semibold capitalize mb-4 text-[#6C47FF]">{attr} Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <MetricCard 
                  title="Disparate Impact" 
                  value={metrics.disparateImpact} 
                  threshold={[0.8, 1.25]}
                  description="Ratio of favorable outcomes for unprivileged vs privileged group. Below 0.8 is considered biased (4/5ths rule)."
                />
                <MetricCard 
                  title="Statistical Parity" 
                  value={metrics.statParityDiff} 
                  threshold={[-0.1, 0.1]}
                  description="Difference in probability of favorable outcomes between groups. Ideal is 0."
                />
                <MetricCard 
                  title="Equal Opportunity" 
                  value={metrics.equalOppDiff} 
                  threshold={[-0.1, 0.1]}
                  description="Difference in true positive rates between groups. Ideal is 0."
                />
                <MetricCard 
                  title="Average Odds Diff" 
                  value={metrics.avgOddsDiff} 
                  threshold={[-0.1, 0.1]}
                  description="Average difference in false positive and true positive rates. Ideal is 0."
                />
              </div>

              {/* Distribution Chart (Mock data) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <DistributionChart 
                    attribute={attr} 
                    data={[
                      { group: 'Male (Privileged)', rate: 0.73 },
                      { group: 'Female (Unprivileged)', rate: 0.52 }
                    ]} 
                  />
                </Card>
                <Card className="bg-gradient-to-br from-[#12121A] to-[#6C47FF]/5">
                   <h4 className="font-semibold mb-4 text-sm">Regulatory Compliance Tracker</h4>
                   <ComplianceChecker />
                </Card>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mitigation Strategies & AI Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8 border-t border-white/5">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#6C47FF]" /> 
            AI Mitigation Plan
          </h2>
          {recommendations.map((rec, i) => (
            <MitigationCard key={rec.id} recommendation={rec} index={i} />
          ))}
        </div>
        
        <div className="flex flex-col">
          <h2 className="text-xl font-bold mb-6">Ask FairLens AI</h2>
          <div className="flex-1 min-h-[400px]">
             <AIChat />
          </div>
        </div>
      </div>
    </div>
  );
}
