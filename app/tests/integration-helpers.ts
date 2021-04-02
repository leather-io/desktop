export function repeatAction(times: number) {
  return async (handler: () => Promise<void>) => {
    for (let i = 0; i < times; i++) {
      await handler();
    }
  };
}

export function createTestSelector(name: string) {
  return `[data-test="${name}"]`;
}
