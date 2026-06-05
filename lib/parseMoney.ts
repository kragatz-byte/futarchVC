export function parseMoneyInput(value: string): number | null {
  const normalized = value.trim().toLowerCase().replace(/[$,\s]/g, '');

  if (!normalized) return null;

  const millionMatch = normalized.match(/^(\d+(?:\.\d+)?)m$/);
  if (millionMatch) {
    return Math.round(parseFloat(millionMatch[1]) * 1_000_000);
  }

  const thousandMatch = normalized.match(/^(\d+(?:\.\d+)?)k$/);
  if (thousandMatch) {
    return Math.round(parseFloat(thousandMatch[1]) * 1_000);
  }

  const numeric = Number(normalized);
  if (!Number.isFinite(numeric) || numeric <= 0) {
    return null;
  }

  return Math.round(numeric);
}
