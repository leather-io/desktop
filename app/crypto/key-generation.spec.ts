import crypto from 'crypto';

import { generateSalt, deriveKey } from './key-generation';

// https://stackoverflow.com/a/52612372/1141891
Object.defineProperty(global, 'crypto', {
  value: {
    getRandomValues: (arr: Uint8Array) => crypto.randomBytes(arr.length),
  },
});

describe(deriveKey.name, () => {
  test('a argon2id hash is returned', async () => {
    const salt = '$2a$12$BwnByfKrfRbpxsazN712T.';
    const pass = 'f255cadb0af84854819c63f26c53e1a9';
    const { derivedKeyHash } = await deriveKey({ salt, pass });
    const hash = Buffer.from(derivedKeyHash).toString('hex');
    expect(hash).toEqual(
      'd941c6ec3f04fa67c68b497169986588436b1697aa6b3a93218152658e5c494d2e3da9ea93522f0e4cb14b414b57b463'
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
