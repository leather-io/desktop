import { generateSalt, generateDerivedKey } from './key-generation';

describe(generateDerivedKey.name, () => {
  test('a bcrypt hash is returned', async () => {
    const salt = '$2a$12$BwnByfKrfRbpxsazN712T.';
    const password = 'f255cadb0af84854819c63f26c53e1a9';
    const result = await generateDerivedKey({ salt, password });
    expect(result).toEqual('$2a$12$BwnByfKrfRbpxsazN712T.ckDPUEMy2RJR6pyE8kOf2l3IMaxZ7R6');
  });
});

describe(generateSalt.name, () => {
  test('that bcrypt salt is returned', async () => {
    const salt = await generateSalt();
    expect(salt).toBeDefined();
    expect(salt[0]).toEqual('$');
    expect(salt.length).toEqual(29);
  });

  test('that salt fn is memoized per client', async () => {
    const salt1 = await generateSalt();
    const salt2 = await generateSalt();
    expect(salt1).toEqual(salt2);
  });
});
