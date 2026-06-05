import AsyncStorage from '@react-native-async-storage/async-storage';

const THESIS_KEY = '@futarchyvc/investing-thesis';

export async function loadInvestingThesis(fallback: string): Promise<string> {
  try {
    const saved = await AsyncStorage.getItem(THESIS_KEY);
    return saved ?? fallback;
  } catch {
    return fallback;
  }
}

export async function saveInvestingThesis(thesis: string): Promise<void> {
  await AsyncStorage.setItem(THESIS_KEY, thesis);
}
