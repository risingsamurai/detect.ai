export interface User {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  createdAt?: string;
  auditCount?: number;
}

export type Severity = 'critical' | 'high' | 'moderate' | 'minor' | 'fair';

export interface Audit {
  id: string;
  userId: string;
  datasetName: string;
  createdAt: string;
  status: 'pending' | 'analyzing' | 'complete' | 'error';
  rowCount: number;
  columnCount: number;
  targetColumn: string;
  protectedAttributes: string[];
  fairnessScore: number;
  severity: Severity;
  metrics: Record<string, AttributeMetrics>;
  aiNarrative?: string;
  recommendations?: Recommendation[];
}

export interface AttributeMetrics {
  disparateImpact: number;
  statParityDiff: number;
  equalOppDiff: number;
  avgOddsDiff: number;
  theilIndex: number;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  effort: 'low' | 'medium' | 'high';
  expectedImprovement: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
