/**
 * Product copy — ties visible UI to CS153 deliverables (see README).
 * Problem/insight: feed + submit headers. Execution: feature pills. Evaluation: leaderboard/profile.
 */

export const brandCopy = {
  feedTagline: 'Turning collective intelligence into capital allocation.',
  feedMission: 'The startup feed that matters.',
  feedLiveCount: (n: number) => `${n} on the feed right now`,
  leaderboardTagline: 'Compete to identify tomorrow’s winners.',
  leaderboardSubline: 'Reputation from forecasts and decisions — evidence you called it early.',
  profileTagline: 'Your forecasting reputation',
  profileEvidence:
    'Stats and activity update from your real session (forecasts, invest/pass, watchlist).',
  submitTagline: 'Founders: submit for AI diligence',
  submitFlow:
    'We generate a structured diligence memo (score 0–100). Students still decide invest, pass, or forecast.',
  submitAiLabel: 'AI diligence on submit',
} as const;

/** Cute capability chips on Feed (still maps to core product flows). */
export const productCapabilities = [
  { id: 'diligence', emoji: '✨', label: 'AI read' },
  { id: 'forecast', emoji: '🔮', label: 'Forecast' },
  { id: 'decision', emoji: '💫', label: 'Invest / pass' },
  { id: 'leaderboard', emoji: '🏅', label: 'Rankings' },
  { id: 'submit', emoji: '🚀', label: 'Submit' },
] as const;

/** Footer-style disclosure visible in Profile (demo / review builds). */
export const processDisclosure =
  'Built for CS153. AI assists diligence only; humans make investment calls. Demo mode uses sample data when backend keys are unset.';
