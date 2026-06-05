import { parseMoneyInput } from '@/lib/parseMoney';
import type { FounderSubmissionForm, FounderSubmissionInput } from '@/types';
import type { StartupStage } from '@/types/startup';

export type SubmissionFieldErrors = Partial<Record<keyof FounderSubmissionForm, string>>;

const STAGES: StartupStage[] = ['idea', 'mvp', 'pre-seed', 'seed', 'early-revenue'];

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value.startsWith('http') ? value : `https://${value}`);
    return Boolean(url.hostname);
  } catch {
    return false;
  }
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function validateSubmissionForm(form: FounderSubmissionForm): {
  errors: SubmissionFieldErrors;
  data: FounderSubmissionInput | null;
} {
  const errors: SubmissionFieldErrors = {};

  if (!form.name.trim()) errors.name = 'Startup name is required.';
  if (!form.tagline.trim()) errors.tagline = 'Tagline is required.';
  if (!form.description.trim()) errors.description = 'Description is required.';
  if (!form.industry.trim()) errors.industry = 'Industry is required.';
  if (!form.traction.trim()) errors.traction = 'Traction is required.';
  if (!form.founderName.trim()) errors.founderName = 'Founder name is required.';
  if (!form.founderEmail.trim()) {
    errors.founderEmail = 'Founder email is required.';
  } else if (!isValidEmail(form.founderEmail)) {
    errors.founderEmail = 'Enter a valid email address.';
  }

  if (!form.websiteUrl.trim()) {
    errors.websiteUrl = 'Website URL is required.';
  } else if (!isValidUrl(form.websiteUrl)) {
    errors.websiteUrl = 'Enter a valid website URL.';
  }

  if (!form.stage || !STAGES.includes(form.stage as StartupStage)) {
    errors.stage = 'Select a stage.';
  }

  const amountRaising = parseMoneyInput(form.amountRaising);
  if (amountRaising === null) {
    errors.amountRaising = 'Enter a valid raise amount (e.g. 500000 or 500K).';
  }

  const valuation = parseMoneyInput(form.valuation);
  if (valuation === null) {
    errors.valuation = 'Enter a valid valuation (e.g. 3000000 or 3M).';
  }

  if (Object.keys(errors).length > 0) {
    return { errors, data: null };
  }

  const websiteUrl = form.websiteUrl.trim().startsWith('http')
    ? form.websiteUrl.trim()
    : `https://${form.websiteUrl.trim()}`;

  return {
    errors: {},
    data: {
      name: form.name.trim(),
      tagline: form.tagline.trim(),
      description: form.description.trim(),
      websiteUrl,
      industry: form.industry.trim(),
      stage: form.stage as StartupStage,
      amountRaising: amountRaising!,
      valuation: valuation!,
      traction: form.traction.trim(),
      founderName: form.founderName.trim(),
      founderEmail: form.founderEmail.trim().toLowerCase(),
    },
  };
}
