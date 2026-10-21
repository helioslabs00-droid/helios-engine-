export interface CompanyInput {
  companyName: string;
  industry: string;
  websiteUrl: string;
  employees: number;
  businessSummary: string;
  currentRevenue: string;
  monthlyUsers: string;
  followerCount: string;
  goalMetric: string;
  additionalContext: string;
  uploadedAssets: UploadedAsset[];
}

export interface UploadedAsset {
  id: string;
  name: string;
  type: 'image' | 'spreadsheet' | 'social_post' | 'analytics';
  notes?: string;
  previewUrl?: string;
  base64?: string;
  mimeType?: string;
}

export interface IngestedSiteData {
  url: string;
  domain: string;
  title: string;
  description: string;
  headings: string[];
  summaryExcerpt: string;
  retrievedAt: string;
}

export interface RadarDimension {
  axis: string;
  score: number; // 0 - 100
  benchmark: number;
  rationale: string;
}

export interface StarburstGraphData {
  overallScore: number;
  radarDimensions: RadarDimension[];
}

export interface LatentReasoningPathway {
  agentId: string;
  agentName: string;
  roleTitle: string;
  status: 'thinking' | 'converged' | 'verified' | 'synthesized';
  latencyMs: number;
  creativeSolution: string;
  disagreementsLogged: string[];
  keyFinding: string;
}

export interface ConsultantVote {
  id: string;
  name: string;
  role: string;
  firmBackground: string;
  vote: 'APPROVED' | 'REJECTED';
  score: number; // 0-100
  confidence: number; // 0-100
  critique: string;
  stipulation: string;
}

export interface ModerationGateData {
  quorumRequired: string;
  passed: boolean;
  approvalCount: number;
  rejectionCount: number;
  verdict: string;
  consultants: ConsultantVote[];
  consensusCertificate: {
    signedAt: string;
    consensusHash: string;
    retryRound: number;
    statusNote: string;
  };
}

export interface RankedAction {
  id: string;
  priority: 'P0' | 'P1' | 'P2';
  timeframe: string;
  title: string;
  ownerAgent: string;
  impactScore: number; // 0-100
  effortScore: number; // 0-100
  expectedYield: string;
  calculationFormula: string;
  calculationDetail: string;
  dependencies: string;
}

export interface TrajectoryPoint {
  month: string;
  currentRevenue: number;
  plannedRevenue: number;
  currentUsers: number;
  plannedUsers: number;
  deltaYieldPercent: number;
}

export interface GoalObtainability {
  probabilityPercent: number;
  confidenceInterval: string;
  estimatedTimeSpanMonths: number;
  currentPathProjectedARR: number;
  plannedPathProjectedARR: number;
  modelBasis: string;
}

export interface EngineResult {
  executiveSummary: string;
  companyProfile: {
    name: string;
    industry: string;
    headcount: number;
    currentBaseline: string;
    targetHorizon: string;
  };
  starburstGraph: StarburstGraphData;
  latentReasoningPathways: LatentReasoningPathway[];
  moderationGate: ModerationGateData;
  rankedActions: RankedAction[];
  goalObtainability: GoalObtainability;
  trajectoryComparison: {
    baselineFormula: string;
    plannedFormula: string;
    points: TrajectoryPoint[];
  };
}
