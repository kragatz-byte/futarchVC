import type { Startup } from '@/types';

import { getAllStartups, getStartupById as getRegistryStartupById } from './startupRegistry';

export async function getStartups(): Promise<Startup[]> {
  return getAllStartups();
}

export async function getStartupById(id: string): Promise<Startup | undefined> {
  return getRegistryStartupById(id);
}
