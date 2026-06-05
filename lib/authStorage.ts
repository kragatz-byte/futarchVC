import AsyncStorage from '@react-native-async-storage/async-storage';

import { DEMO_MODE_STORAGE_KEY } from '@/constants/auth';

export async function loadDemoModeFlag(): Promise<boolean> {
  const value = await AsyncStorage.getItem(DEMO_MODE_STORAGE_KEY);
  return value === 'true';
}

export async function persistDemoModeFlag(enabled: boolean): Promise<void> {
  if (enabled) {
    await AsyncStorage.setItem(DEMO_MODE_STORAGE_KEY, 'true');
    return;
  }
  await AsyncStorage.removeItem(DEMO_MODE_STORAGE_KEY);
}
