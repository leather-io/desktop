import { memoizeWith, identity } from 'ramda';
import argon2, { ArgonType } from 'argon2-browser';

export async function deriveKey({ pass, salt }: { pass: string; salt: string }) {
  const result = await argon2.hash({
    pass,
    salt,
    hashLen: 48,
    time: 44,
    mem: 1024 * 32,
    type: ArgonType.Argon2id,
  });
  return { derivedKeyHash: result.hash };
}

export function generateRandomHexString() {
  const size = 16;
  const randomValues = [...crypto.getRandomValues(new Uint8Array(size))];
  return randomValues.map(val => ('00' + val.toString(16)).slice(-2)).join('');
}

export const generateSalt = memoizeWith(identity, () => generateRandomHexString());
