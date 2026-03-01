export interface Deal {
  id: string;
  properties: {
    dealname: string;
    amount: string | null;
    dealstage: string;
    pipeline: string;
    closedate: string;
    hs_lastmodifieddate: string;
    hubspot_owner_id: string | null;
  };
  createdAt: string;
  updatedAt: string;
  archived: boolean;
}

export interface AIAnalysisResult {
  pipelineHealthScore: number;
  forecastConfidence: "Low" | "Medium" | "High";
  keyRisks: Array<{
    dealId: string;
    risk: string;
    severity: "High" | "Medium" | "Low";
    coachingTip?: string;
  }>;
  executiveSummary: string;
  recommendedActions: string[];
  velocityAnalysis?: {
    stageBottlenecks: Array<{ stage: string; avgDays: number; status: "Good" | "Warning" | "Critical" }>;
    insight: string;
  };
  competitorIntel?: Array<{
    dealId: string;
    competitorName: string;
    recentNews: string;
    winStrategy: string;
    sourceUrl?: string;
  }>;
}

export interface UserState {
  isAuthenticated: boolean;
  isLoading: boolean;
  deals: Deal[];
  analysis: AIAnalysisResult | null;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
