import Constants from 'expo-constants';

import { isForcedDemoMode } from './demoMode';

/**
 * OPENAI_API_KEY from .env is injected via app.config.ts `extra` for Expo client builds.
 * Restart with `npx expo start -c` after changing the key.
 */
export function getOpenAiApiKey(): string | undefined {
  const fromExtra = Constants.expoConfig?.extra?.openaiApiKey;
  const key =
    (typeof fromExtra === 'string' ? fromExtra : undefined) ??
    process.env.OPENAI_API_KEY;

  const trimmed = key?.trim();
  return trimmed || undefined;
}

export function isOpenAiConfigured(): boolean {
  if (isForcedDemoMode()) return false;
  return Boolean(getOpenAiApiKey());
}
