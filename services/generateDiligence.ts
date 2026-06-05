/**
 * Diligence pipeline: OpenAI JSON → parseDiligenceJson → DiligenceReport.
 * Demo mode and missing keys use generateDiligenceMock (no network required).
 */
import {
  buildDiligenceUserPrompt,
  DILIGENCE_SYSTEM_PROMPT,
} from '@/lib/diligencePrompts';
import { isForcedDemoMode } from '@/lib/demoMode';
import { getOpenAiApiKey, isOpenAiConfigured } from '@/lib/openaiConfig';
import { parseDiligenceResponse } from '@/lib/parseDiligenceJson';
import { formatCurrency } from '@/lib/format';
import { logoUrlForSymbol, symbolFromIndustry } from '@/lib/startupSymbol';
import type { DiligenceReport, FounderSubmissionInput, Startup } from '@/types';

import {
  computeAiScoreFromSubmission,
  generateDiligenceMock,
  type MockDiligenceOutput,
} from './generateDiligenceMock';

const OPENAI_CHAT_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_MODEL = 'gpt-4o-mini';

/** Input payload sent to the diligence model (snake_case). */
export type DiligenceGenerationInput = {
  startup_name: string;
  tagline: string;
  description: string;
  website_url: string;
  industry: string;
  stage: string;
  amount_raising: number;
  valuation: number;
  traction: string;
  founder_name: string;
};

function slugifyName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function createStartupId(name: string): string {
  const slug = slugifyName(name) || 'startup';
  return `${slug}-${Date.now().toString(36).slice(-5)}`;
}

export function toDiligenceGenerationInput(
  input: FounderSubmissionInput
): DiligenceGenerationInput {
  return {
    startup_name: input.name.trim(),
    tagline: input.tagline.trim(),
    description: input.description.trim(),
    website_url: input.websiteUrl.trim(),
    industry: input.industry.trim(),
    stage: input.stage,
    amount_raising: input.amountRaising,
    valuation: input.valuation,
    traction: input.traction.trim(),
    founder_name: input.founderName.trim(),
  };
}

type OpenAiChatResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  error?: {
    message?: string;
  };
};

async function callOpenAiDiligence(
  apiKey: string,
  input: FounderSubmissionInput,
  fallback: MockDiligenceOutput
): Promise<MockDiligenceOutput> {
  const response = await fetch(OPENAI_CHAT_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      temperature: 0.35,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: DILIGENCE_SYSTEM_PROMPT },
        { role: 'user', content: buildDiligenceUserPrompt(input) },
      ],
    }),
  });

  let body: OpenAiChatResponse;
  try {
    body = (await response.json()) as OpenAiChatResponse;
  } catch {
    throw new Error('OpenAI returned a non-JSON response');
  }

  if (!response.ok) {
    const message = body.error?.message ?? `OpenAI request failed (${response.status})`;
    throw new Error(message);
  }

  const content = body.choices?.[0]?.message?.content;
  if (!content?.trim()) {
    throw new Error('OpenAI returned an empty diligence response');
  }

  const parsed = parseDiligenceResponse(content, fallback);
  if (!parsed) {
    throw new Error('Could not parse OpenAI diligence JSON');
  }

  return parsed;
}

/**
 * Generates diligence via OpenAI when OPENAI_API_KEY is set; otherwise uses the mock generator.
 */
export async function generateDiligence(
  input: FounderSubmissionInput
): Promise<MockDiligenceOutput> {
  const fallback = generateDiligenceMock(input);

  if (isForcedDemoMode()) {
    return fallback;
  }

  const apiKey = getOpenAiApiKey();

  if (!apiKey) {
    if (__DEV__) {
      console.info('[Diligence] OPENAI_API_KEY missing — using mock diligence');
    }
    return fallback;
  }

  try {
    return await callOpenAiDiligence(apiKey, input, fallback);
  } catch (error) {
    if (__DEV__) {
      const message = error instanceof Error ? error.message : 'Unknown OpenAI error';
      console.warn(`[Diligence] OpenAI failed (${message}) — using mock diligence`);
    }
    return fallback;
  }
}

export function buildStartupFromSubmission(input: FounderSubmissionInput): Startup {
  const id = createStartupId(input.name);
  const aiScore = computeAiScoreFromSubmission(input);

  return {
    id,
    name: input.name,
    tagline: input.tagline,
    description: input.description,
    websiteUrl: input.websiteUrl,
    logoUrl: logoUrlForSymbol(symbolFromIndustry(input.industry)),
    industry: input.industry,
    stage: input.stage,
    amountRaising: input.amountRaising,
    valuation: input.valuation,
    traction: input.traction,
    founderName: input.founderName,
    founderEmail: input.founderEmail,
    aiScore,
    percentInvest: 0,
    percentPass: 0,
    averageConviction: 0,
    averageForecast: 0,
    createdAt: new Date().toISOString(),
  };
}

export function toDiligenceReport(
  startupId: string,
  content: MockDiligenceOutput
): DiligenceReport {
  return {
    id: `diligence-${startupId}`,
    startupId,
    ...content,
    generatedAt: new Date().toISOString(),
  };
}

export async function generateDiligenceReport(
  startup: Startup,
  submission?: FounderSubmissionInput
): Promise<DiligenceReport> {
  const input: FounderSubmissionInput = submission ?? {
    name: startup.name,
    tagline: startup.tagline,
    description: startup.description,
    websiteUrl: startup.websiteUrl,
    industry: startup.industry,
    stage: startup.stage,
    amountRaising: startup.amountRaising,
    valuation: startup.valuation,
    traction: startup.traction,
    founderName: startup.founderName,
    founderEmail: startup.founderEmail ?? '',
  };

  const content = await generateDiligence(input);

  return toDiligenceReport(startup.id, {
    ...content,
    aiScore: content.aiScore,
  });
}

/** @deprecated Use generateDiligence */
export function generateDiligenceReportSync(
  startup: Startup,
  submission?: FounderSubmissionInput
): DiligenceReport {
  const input: FounderSubmissionInput = submission ?? {
    name: startup.name,
    tagline: startup.tagline,
    description: startup.description,
    websiteUrl: startup.websiteUrl,
    industry: startup.industry,
    stage: startup.stage,
    amountRaising: startup.amountRaising,
    valuation: startup.valuation,
    traction: startup.traction,
    founderName: startup.founderName,
    founderEmail: startup.founderEmail ?? '',
  };

  return toDiligenceReport(startup.id, generateDiligenceMock(input));
}

export async function generateDiligenceWithDelay(
  input: FounderSubmissionInput,
  startup: Startup
): Promise<DiligenceReport> {
  const content = await generateDiligence(input);

  if (!isOpenAiConfigured()) {
    const delayMs = isForcedDemoMode() ? 600 : 1200;
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  return toDiligenceReport(startup.id, content);
}

export function describeDiligenceSource(): 'openai' | 'mock' {
  return isOpenAiConfigured() ? 'openai' : 'mock';
}

export function formatSubmissionContext(input: FounderSubmissionInput): string {
  const payload = toDiligenceGenerationInput(input);
  return `${payload.startup_name} · ${payload.industry} · raising ${formatCurrency(payload.amount_raising)} at ${formatCurrency(payload.valuation)} valuation`;
}
