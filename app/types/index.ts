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

declare module 'secure-electron-store' {
  const content: {
    new (x: any): any;
  };
  const readConfigRequest: any;
  const readConfigResponse: any;
  const writeConfigRequest: any;
  const clearRendererBindings: any;
  const readUnprotectedConfigRequest: any;
  const writeUnprotectedConfigRequest: any;
  export {
    readConfigRequest,
    readConfigResponse,
    writeConfigRequest,
    writeUnprotectedConfigRequest,
    readUnprotectedConfigRequest,
    clearRendererBindings,
  };
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
    send(readOrWriteConfig: any, key: string, value?: any): void;
    onReceive(readOrWriteConfig: any, key: (val: any) => void): void;
    initial(): any;
  };
};
