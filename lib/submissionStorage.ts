import AsyncStorage from '@react-native-async-storage/async-storage';

import type { DiligenceReport, Startup } from '@/types';

const STORAGE_KEY = '@futarchyvc/submitted-startups';

export type SubmittedStartupBundle = {
  startup: Startup;
  diligence: DiligenceReport;
};

export type SubmittedStartupsStore = {
  bundles: SubmittedStartupBundle[];
};

export async function loadSubmittedStartups(): Promise<SubmittedStartupsStore> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return { bundles: [] };

    const parsed = JSON.parse(raw) as SubmittedStartupsStore;
    const bundles = (parsed.bundles ?? []).filter(
      (bundle): bundle is SubmittedStartupBundle =>
        Boolean(
          bundle?.startup?.id &&
            bundle?.diligence?.startupId &&
            bundle.diligence.startupId === bundle.startup.id
        )
    );
    return { bundles };
  } catch {
    return { bundles: [] };
  }
}

export async function persistSubmittedStartups(store: SubmittedStartupsStore): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}
