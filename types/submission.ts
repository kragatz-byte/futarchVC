import type { StartupStage } from './startup';

export type FounderSubmissionInput = {
  name: string;
  tagline: string;
  description: string;
  websiteUrl: string;
  industry: string;
  stage: StartupStage;
  amountRaising: number;
  valuation: number;
  traction: string;
  founderName: string;
  founderEmail: string;
};

export type FounderSubmissionForm = {
  name: string;
  tagline: string;
  description: string;
  websiteUrl: string;
  industry: string;
  stage: StartupStage | '';
  amountRaising: string;
  valuation: string;
  traction: string;
  founderName: string;
  founderEmail: string;
};

export const EMPTY_SUBMISSION_FORM: FounderSubmissionForm = {
  name: '',
  tagline: '',
  description: '',
  websiteUrl: '',
  industry: '',
  stage: '',
  amountRaising: '',
  valuation: '',
  traction: '',
  founderName: '',
  founderEmail: '',
};
