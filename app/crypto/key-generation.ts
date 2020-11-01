import { ipcRenderer } from 'electron';
import { memoizeWith, identity } from 'ramda';
import argon2, { ArgonType } from 'argon2-browser';

interface DeriveKeyArgs {
  pass: string;
  salt: string;
}

/**
 * This method **must not** be imported by code on the renderer thread
 */
export async function deriveArgon2Key({ pass, salt }: DeriveKeyArgs) {
  const result = await argon2.hash({
    pass,
    salt,
    hashLen: 48,
    time: 400,
    type: ArgonType.Argon2id,
  });
  return { derivedKeyHash: result.hash };
}

export async function deriveKey({ pass, salt }: DeriveKeyArgs) {
  console.log('sending derive-key');
  return ipcRenderer.invoke('derive-key', {
    pass,
    salt,
  });
}

export function generateRandomHexString() {
  const size = 16;
  const randomValues = [...crypto.getRandomValues(new Uint8Array(size))];
  return randomValues.map(val => ('00' + val.toString(16)).slice(-2)).join('');
}

export const generateSalt = memoizeWith(identity, () => generateRandomHexString());
