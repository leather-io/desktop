export function delay(delayMs: number) {
  return new Promise(resolve => setTimeout(() => resolve(), delayMs));
}
