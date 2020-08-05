import { memoizeWith, identity } from 'ramda';
import argon2, { ArgonType } from 'argon2-browser';

import { delay } from '../utils/delay';

export async function deriveKey({ pass, salt }: { pass: string; salt: string }) {
  // Without this additional delay of 1ms, an odd behaviour with the argon2 library
  // causes the promise to be render blocking
  await delay(1);
  const result = await argon2.hash({
    pass,
    salt,
    hashLen: 48,
    time: 400,
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
