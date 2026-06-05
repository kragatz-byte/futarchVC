import Constants from 'expo-constants';

/**
 * When true, the app skips Supabase/OpenAI network calls and uses mock data + local storage.
 * Set in `.env`: EXPO_PUBLIC_DEMO_MODE=true
 * Restart Expo with: npx expo start -c
 *
 * Recommended for CS153 recordings and expo-go demos without backend setup.
 */
export function isForcedDemoMode(): boolean {
  const fromExtra = Constants.expoConfig?.extra?.demoMode;
  if (fromExtra === true || fromExtra === 'true') return true;

  const fromEnv = process.env.EXPO_PUBLIC_DEMO_MODE?.trim().toLowerCase();
  return fromEnv === 'true' || fromEnv === '1' || fromEnv === 'yes';
}
