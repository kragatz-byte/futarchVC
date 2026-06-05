export type StartupStage = 'idea' | 'mvp' | 'pre-seed' | 'seed' | 'early-revenue';

export type StartupStatus =
  | 'draft'
  | 'pending_review'
  | 'pending'
  | 'analyzed'
  | 'active'
  | 'archived';

export type Startup = {
  id: string;
  status?: StartupStatus;
  name: string;
  tagline: string;
  description: string;
  websiteUrl: string;
  logoUrl: string;
  industry: string;
  stage: StartupStage;
  amountRaising: number;
  valuation: number;
  traction: string;
  founderName: string;
  founderEmail?: string;
  aiScore: number;
  percentInvest: number;
  percentPass: number;
  averageConviction: number;
  averageForecast: number;
  createdAt: string;
};
