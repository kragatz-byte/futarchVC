import { formatCurrency } from '@/lib/format';
import {
  buildSimulatedDcfScenarios,
  formatDcfCaseIntro,
} from '@/lib/simulatedDcf';
import type { SimulatedDcfScenario } from '@/types/dcf';
import type { FounderSubmissionInput } from '@/types';

export type MockDiligenceOutput = {
  executiveSummary: string;
  marketAnalysis: string;
  competitorAnalysis: string;
  bullCase: string;
  bearCase: string;
  bullCaseDcf?: SimulatedDcfScenario;
  bearCaseDcf?: SimulatedDcfScenario;
  risks: string[];
  investmentMemo: string;
  suggestedQuestions: string[];
  aiScore: number;
};

function formatStage(stage: FounderSubmissionInput['stage']): string {
  return stage
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function hasSubstance(value: string, minLength = 12): boolean {
  return value.trim().length >= minLength;
}

function raiseAsPercentOfValuation(amountRaising: number, valuation: number): number {
  if (valuation <= 0) return 0;
  return Math.round((amountRaising / valuation) * 100);
}

export function computeAiScoreFromSubmission(input: FounderSubmissionInput): number {
  const stageBaseline: Record<FounderSubmissionInput['stage'], number> = {
    idea: 5.9,
    mvp: 6.4,
    'pre-seed': 6.8,
    seed: 7.2,
    'early-revenue': 7.6,
  };

  const tractionScore = hasSubstance(input.traction, 20)
    ? Math.min(1.2, input.traction.trim().length / 200)
    : -0.4;

  const descriptionScore = hasSubstance(input.description, 80) ? 0.3 : hasSubstance(input.description, 40) ? 0.1 : -0.2;

  const raisePct = raiseAsPercentOfValuation(input.amountRaising, input.valuation);
  const termsScore = raisePct <= 25 ? 0.35 : raisePct <= 35 ? 0.1 : raisePct <= 50 ? -0.15 : -0.35;

  const raw = stageBaseline[input.stage] + tractionScore + descriptionScore + termsScore;
  const scoreOnTenScale = Math.min(9.2, Math.max(5.5, Math.round(raw * 10) / 10));
  return Math.round(scoreOnTenScale * 10);
}

/**
 * Generates a templated diligence memo from founder submission data only.
 * Replace this module with an OpenAI API call when backend integration is ready.
 */
export function generateDiligenceMock(
  submission: FounderSubmissionInput
): MockDiligenceOutput {
  const {
    name,
    tagline,
    description,
    websiteUrl,
    industry,
    stage,
    amountRaising,
    valuation,
    traction,
    founderName,
  } = submission;

  const stageLabel = formatStage(stage);
  const raise = formatCurrency(amountRaising);
  const val = formatCurrency(valuation);
  const raisePct = raiseAsPercentOfValuation(amountRaising, valuation);
  const aiScore = computeAiScoreFromSubmission(submission);

  const tractionNote = hasSubstance(traction)
    ? `Founder-reported traction: "${traction.trim()}"`
    : 'More information is needed on traction, retention, and revenue metrics.';

  const descriptionNote = hasSubstance(description, 60)
    ? description.trim()
    : 'More information is needed on the product, customer segment, and business model.';

  const executiveSummary = [
    `${name} — ${stageLabel} in ${industry} — is raising ${raise} on a ${val} post-money cap table (${raisePct}% dilution if fully subscribed).`,
    `Positioning: ${tagline.trim()}.`,
    tractionNote,
    `Product narrative: ${descriptionNote}`,
    `Website: ${websiteUrl.trim()}. Lead: ${founderName}.`,
    'This diligence memo synthesizes founder disclosures with a simulated 5-year DCF for bull/bear paths (demo model — not a fairness opinion). Independent customer calls, cohort exports, and cap table review are still required before a final investment decision.',
  ].join(' ');

  const marketAnalysis = [
    `Market sizing — ${industry} (illustrative, submission-based):`,
    `TAM is not founder-disclosed; analyst sketch assumes a broad ${industry} category with multi-billion top-down potential, subject to wedge validation.`,
    `SAM should be narrowed to the specific buyer and budget line ${name} replaces (see product description).`,
    `SOM (24-month): tied to ${stageLabel.toLowerCase()} GTM capacity — typically 1–3 campuses or 20–80 B2B logos before next round.`,
    `Growth drivers must be explicit in follow-up: channel (PLG, partnerships, sales), pricing power, and retention.`,
    `Key market diligence gaps: verified TAM/SAM worksheet, pricing survey, and CAC/LTV assumptions feeding the DCF revenue ramp.`,
  ].join(' ');

  const competitorAnalysis = [
    'Competitive landscape:',
    `The submission does not name direct competitors, incumbents, or substitutes; more information is needed for a rigorous competitive map.`,
    `Based on the stated industry (${industry}) and product description, investors should assume competition from (i) manual or informal workflows, (ii) horizontal tools that partially overlap, and (iii) other campus-stage teams targeting similar pain points — none of which are verified in this filing.`,
    `${name} will need to articulate a durable wedge beyond "${tagline.trim()}" with evidence from customer conversations; that evidence was not included in the submission.`,
  ].join(' ');

  const { bull, bear } = buildSimulatedDcfScenarios({
    name,
    stage,
    amountRaising,
    valuation,
    industry,
  });

  const bullCase = formatDcfCaseIntro(bull, name, 'bull');
  const bearCase = formatDcfCaseIntro(bear, name, 'bear');

  const risks: string[] = [
    `Stage risk: company is at ${stageLabel.toLowerCase()} with limited verified operating history in this filing.`,
    hasSubstance(traction)
      ? 'Traction has not been independently validated; metrics should be confirmed before investment.'
      : 'Traction was not adequately described; underwriting is not possible without usage or revenue data.',
    'Competitive positioning is unclear because named competitors and win/loss data were not submitted.',
    'Market size, regulatory exposure, and margin structure were not disclosed — more information is needed.',
    raisePct > 40
      ? `Financing risk: raise represents ${raisePct}% of stated valuation, which may limit room for future investors if milestones slip.`
      : 'Financing risk: milestone plan and burn rate were not provided; runway analysis requires follow-up.',
  ];

  const investmentMemo = [
    `Investment memo — ${name}:`,
    `Analyst score (heuristic): ${aiScore}/100 — stage, disclosure depth, traction text, and financing terms vs. simulated DCF outcomes.`,
    `Valuation context: ${val} post-money; bull DCF equity ${formatCurrency(bull.equityValue)} (${bull.moicOnRound.toFixed(1)}x MOIC) vs. bear ${formatCurrency(bear.equityValue)} (${bear.moicOnRound.toFixed(1)}x MOIC) on modeled ownership.`,
    `Recommended next steps: (1) verify traction, (2) customer references, (3) competitive win/loss, (4) use-of-proceeds vs. ${raise} raise plan, (5) stress-test DCF revenue and margin assumptions with management.`,
    `Posture: ${aiScore >= 75 ? 'Proceed to partner review / founder call.' : aiScore >= 65 ? 'Hold — more data before conviction.' : 'Likely pass without stronger evidence.'}`,
    'Simulated models are for campus demo purposes; humans make the invest/pass decision on FutarchyVC.',
  ].join(' ');

  const suggestedQuestions: string[] = [
    `What specific metrics support the traction statement${hasSubstance(traction) ? ' you provided' : ''}?`,
    'Who is the primary buyer, and what budget line or workflow does this replace?',
    'Name two alternatives customers use today and why you win or lose against each.',
    `How will the ${raise} round change runway and what milestones will you hit in the next 9–12 months?`,
    'What retention or repeat-usage data can you share from the last 90 days?',
    !hasSubstance(description, 100)
      ? 'Please expand the product description with ICP, pricing model, and deployment timeline.'
      : 'What is the single leading indicator that would convince you the business is working?',
  ];

  return {
    executiveSummary,
    marketAnalysis,
    competitorAnalysis,
    bullCase,
    bearCase,
    bullCaseDcf: bull,
    bearCaseDcf: bear,
    risks,
    investmentMemo,
    suggestedQuestions,
    aiScore,
  };
}
