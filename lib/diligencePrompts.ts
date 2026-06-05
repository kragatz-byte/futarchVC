/**
 * Prompt contract for CS153: AI produces structured evidence; humans retain decision rights.
 * See services/generateDiligence.ts for call site and mock fallback.
 */
import { formatCurrency } from '@/lib/format';
import type { FounderSubmissionInput } from '@/types';

/** Exact system prompt for the OpenAI diligence call. */
export const DILIGENCE_SYSTEM_PROMPT = `You are an AI venture capital analyst helping evaluate an early-stage startup.

Your role is to produce structured diligence that supports human investment judgment. You do not make the final investment decision.

Analyze the startup based only on the information provided. Do not fabricate traction, competitors, market data, founder background, or financial information. If information is missing, explicitly state what is unknown and what additional diligence would be needed.

Be skeptical but fair. Write in-depth, professional VC memo style (multiple paragraphs per section where appropriate).

For bull_case and bear_case you MUST include a simulated 5-year DCF with explicit assumptions (WACC, terminal growth, revenue ramp, EBITDA margins, FCF, terminal value, enterprise value, MOIC). Label the model as simulated/educational. Present year-by-year figures in the text. Do not claim the DCF is audited or based on undisclosed financials.`;

/** Exact user prompt template (placeholders filled at runtime). */
export const DILIGENCE_USER_PROMPT_TEMPLATE = `Startup:
Name: {{name}}
Tagline: {{tagline}}
Description: {{description}}
Website: {{website_url}}
Industry: {{industry}}
Stage: {{stage}}
Amount Raising: {{amount_raising}}
Valuation: {{valuation}}
Traction: {{traction}}
Founder: {{founder_name}}

Return valid JSON only with these fields:
{
  "executive_summary": "",
  "market_analysis": "",
  "competitor_analysis": "",
  "bull_case": "(Must include simulated 5-year DCF table + narrative upside)",
  "bear_case": "(Must include simulated 5-year DCF table + narrative downside)",
  "risks": "",
  "investment_memo": "",
  "suggested_questions": "",
  "ai_score": 0
}

The ai_score should be a number from 0 to 100 representing overall investment attractiveness based only on the provided information.`;

function fillPromptTemplate(
  template: string,
  values: Record<string, string | number>
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    const value = values[key];
    return value === undefined || value === null ? '' : String(value);
  });
}

export function buildDiligenceUserPrompt(input: FounderSubmissionInput): string {
  return fillPromptTemplate(DILIGENCE_USER_PROMPT_TEMPLATE, {
    name: input.name.trim(),
    tagline: input.tagline.trim(),
    description: input.description.trim(),
    website_url: input.websiteUrl.trim(),
    industry: input.industry.trim(),
    stage: input.stage,
    amount_raising: formatCurrency(input.amountRaising),
    valuation: formatCurrency(input.valuation),
    traction: input.traction.trim(),
    founder_name: input.founderName.trim(),
  });
}
