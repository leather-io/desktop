import { convertPoxAddressToBtc } from './stacking';

describe(convertPoxAddressToBtc.name, () => {
  describe('P2PKH mainnet', () => {
    test('it resolves address correctly', () => {
      const btcAddress = '1Q9a1zGPfJ4oH5Xaz5wc7BdvWV21fSNkkr';
      const version = Buffer.from([0]);
      const hashbytes = Buffer.from([
        253,
        233,
        200,
        45,
        123,
        196,
        63,
        85,
        233,
        5,
        68,
        56,
        71,
        12,
        60,
        168,
        214,
        231,
        35,
        127,
      ]);
      const result = convertPoxAddressToBtc('mainnet')({ version, hashbytes });
      expect(result).toEqual(btcAddress);
    });
  });

  describe('P2PKH testnet', () => {
    test('it resolves address correctly', () => {
      const btcAddress = 'mp4pEBdJiMh6aL5Uhs6nZX1XhyZ4V2xrzg';
      const version = Buffer.from([0]);
      const hashbytes = Buffer.from([
        93,
        199,
        149,
        82,
        47,
        129,
        220,
        183,
        235,
        119,
        74,
        11,
        142,
        132,
        182,
        18,
        227,
        237,
        193,
        65,
      ]);
      const result = convertPoxAddressToBtc('testnet')({ version, hashbytes });
      expect(result).toEqual(btcAddress);
    });
  });

  describe('P2SH mainnet', () => {
    test('it resolves address correctly', () => {
      const btcAddress = '36Qwfsp8n6hmh3FQSuUrYtbg7izLqbVQgS';
      const version = Buffer.from([1]);
      const hashbytes = Buffer.from([
        51,
        206,
        108,
        100,
        110,
        83,
        178,
        164,
        245,
        191,
        182,
        240,
        242,
        153,
        119,
        229,
        81,
        161,
        53,
        105,
      ]);
      const result = convertPoxAddressToBtc('mainnet')({ version, hashbytes });
      expect(result).toEqual(btcAddress);
    });
  });
  describe('P2SH testnet', () => {
    test('it resolves address correctly', () => {
      const btcAddress = '2MwjqTzEJodSaoehcxRSqfWrvJMGZHq4tdC';
      const version = Buffer.from([1]);
      const hashbytes = Buffer.from([
        49,
        73,
        195,
        235,
        162,
        210,
        28,
        253,
        238,
        165,
        104,
        148,
        134,
        107,
        143,
        76,
        209,
        27,
        114,
        173,
      ]);
      const result = convertPoxAddressToBtc('testnet')({ version, hashbytes });
      expect(result).toEqual(btcAddress);
    });
  });
});
