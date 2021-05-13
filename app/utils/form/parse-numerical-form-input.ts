export function parseNumericalFormInput(num: number | string | null) {
  if (!num) return 0;
  try {
    if (typeof num !== 'number') {
      const parsed = parseFloat(num);
      return Number.isFinite(parsed) ? parsed : 0;
    }
    return num;
  } catch (e) {
    return 0;
  }
}
