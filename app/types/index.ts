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
    initialValue(): Record<string, unknown>;
  };

  nodeHid: {
    listen: typeof import('@ledgerhq/hw-transport').default['listen'];
    open({
      descriptor,
      onDisconnect,
    }: {
      descriptor: string;
      onDisconnect(): void;
    }): Promise<{ transport: any; closeTransportConnection(): Promise<void> }>;
  };
};
