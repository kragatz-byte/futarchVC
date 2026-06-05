export type ForecastQuestionId = 'next-round-18m' | 'arr-1m-24m' | 'exit-100m-5y';

export type ForecastQuestion = {
  id: ForecastQuestionId;
  label: string;
};

export const FORECAST_QUESTIONS: ForecastQuestion[] = [
  {
    id: 'next-round-18m',
    label: 'Will this startup raise another round within 18 months?',
  },
  {
    id: 'arr-1m-24m',
    label: 'Will this startup reach $1M ARR within 24 months?',
  },
  {
    id: 'exit-100m-5y',
    label: 'Will this startup be acquired or valued above $100M within 5 years?',
  },
];

export type ForecastAnswer = {
  questionId: ForecastQuestionId;
  probability: number;
  reasoning?: string;
};

export type StartupForecastSubmission = {
  id: string;
  startupId: string;
  userId: string;
  answers: ForecastAnswer[];
  createdAt: string;
  updatedAt: string;
};

/** @deprecated Legacy shape — use StartupForecastSubmission */
export type ForecastOutcome = 'success' | 'pivot' | 'fail';

/** @deprecated Legacy shape — use StartupForecastSubmission */
export type Forecast = {
  id: string;
  startupId: string;
  userId: string;
  outcome: ForecastOutcome;
  successProbability: number;
  confidence: number;
  rationale: string;
  createdAt: string;
};
