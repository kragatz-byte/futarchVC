import type { ExpoConfig } from 'expo/config';

import appJson from './app.json';

const expo = appJson.expo as ExpoConfig;

export default {
  expo: {
    ...expo,
    extra: {
      ...(typeof expo.extra === 'object' && expo.extra !== null ? expo.extra : {}),
      openaiApiKey: process.env.OPENAI_API_KEY,
      demoMode: process.env.EXPO_PUBLIC_DEMO_MODE,
    },
  },
} satisfies { expo: ExpoConfig };
