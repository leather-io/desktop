import { generateSalt, generateDerivedKey } from './key-generation';

import crypto from 'crypto';
// https://stackoverflow.com/a/52612372/1141891
Object.defineProperty(global, 'crypto', {
  value: {
    getRandomValues: (arr: Uint8Array) => crypto.randomBytes(arr.length),
  },
});

describe(generateDerivedKey.name, () => {
  test('a argon2id hash is returned', async () => {
    const salt = '$2a$12$BwnByfKrfRbpxsazN712T.';
    const pass = 'f255cadb0af84854819c63f26c53e1a9';
    const result = await generateDerivedKey({ salt, pass });
    expect(result).toEqual(
      '5d46ddfd7273e1a74ba1db937693bfd59de4881d58b86ed4002ee24abf156a77cf12885ee0e50de19af8c67e0115eb0a82576b11864226a6c157aac8a500e9f8'
    );
  });
});

describe(generateSalt.name, () => {
  test('that a 32char hex salt is returned', () => {
    const salt = generateSalt();
    expect(salt).toBeDefined();
    expect(salt.length).toEqual(32);
  });

  test('that salt fn is memoized per client', () => {
    const salt1 = generateSalt();
    const salt2 = generateSalt();
    expect(salt1).toEqual(salt2);
  });
});
