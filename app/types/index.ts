declare module '*.svg' {
  const content: any;
  // eslint-disable-next-line import/no-default-export
  export default content;
}

declare module '*.woff2' {
  const content: any;
  // eslint-disable-next-line import/no-default-export
  export default content;
}

declare const api: {
  deriveKey: ({
    pass,
    salt,
  }: {
    pass: string;
    salt: string;
  }) => Promise<{ derivedKeyHash: Uint8Array }>;
  store: {
    get(key: string): any;
    set(key: string, value: any): void;
    delete(key: string): void;
    clear(): void;
    getEntireStore(): any;
    initialValue: Record<string, unknown>;
  };
};
