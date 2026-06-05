export const CAMPUSES = [
  'Stanford',
  'MIT',
  'Berkeley',
  'Harvard',
  'CMU',
  'Columbia',
  'Yale',
  'Princeton',
  'Other',
] as const;

export type Campus = (typeof CAMPUSES)[number];
