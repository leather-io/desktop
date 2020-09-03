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
    const expectedResultArray = [
      94,
      0,
      166,
      167,
      20,
      189,
      146,
      233,
      48,
      163,
      248,
      178,
      48,
      11,
      140,
      87,
      82,
      126,
      73,
      82,
      237,
      166,
      232,
      173,
      90,
      192,
      67,
      200,
      149,
      147,
      30,
      223,
      60,
      15,
      133,
      99,
      89,
      142,
      223,
      116,
      131,
      24,
      169,
      157,
      157,
      245,
      159,
      140,
    ];
    expect(derivedKeyHash).toEqual(Uint8Array.from(expectedResultArray));
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
