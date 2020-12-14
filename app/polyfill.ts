(window as any).global = window;
// eslint-disable-next-line @typescript-eslint/no-var-requires
(window as any).Buffer = (window as any).Buffer || require('buffer').Buffer;
