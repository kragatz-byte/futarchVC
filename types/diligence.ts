import type { SimulatedDcfScenario } from './dcf';

export type DiligenceReport = {
  id: string;
  startupId: string;
  executiveSummary: string;
  marketAnalysis: string;
  competitorAnalysis: string;
  bullCase: string;
  bearCase: string;
  /** Simulated 5-year DCF backing the bull case narrative. */
  bullCaseDcf?: SimulatedDcfScenario;
  /** Simulated 5-year DCF backing the bear case narrative. */
  bearCaseDcf?: SimulatedDcfScenario;
  risks: string[];
  investmentMemo: string;
  suggestedQuestions: string[];
  aiScore: number;
  generatedAt: string;
};
