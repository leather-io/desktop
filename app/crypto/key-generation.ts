import { memoizeWith, identity } from 'ramda';
import argon2 from 'argon2-browser';

export async function generateDerivedKey({ pass, salt }: { pass: string; salt: string }) {
  const { hashHex } = await argon2.hash({
    pass,
    salt,
    hashLen: 64,
    type: argon2.ArgonType.Argon2id,
  });
  return hashHex;
}

export function generateRandomHexString() {
  const size = 16;
  const randomValues = [...crypto.getRandomValues(new Uint8Array(size))];
  return randomValues.map(val => ('00' + val.toString(16)).slice(-2)).join('');
}

export const generateSalt = memoizeWith(identity, () => generateRandomHexString());
