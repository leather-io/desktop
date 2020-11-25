import { Buffer } from 'buffer';

const algorithmName = 'AES-GCM';

function extractEncryptionKey(hash: Uint8Array) {
  return hash.slice(0, 32);
}

function extractEncryptionInitVector(hash: Uint8Array) {
  return hash.slice(32, hash.length);
}

async function deriveWebCryptoKey(derivedKeyHash: Uint8Array) {
  const format = 'raw';
  const key = extractEncryptionKey(derivedKeyHash);
  const extractable = false;
  const keyUsages: KeyUsage[] = ['encrypt', 'decrypt'];
  return crypto.subtle.importKey(format, key, algorithmName, extractable, keyUsages);
}

interface EncryptMnemonicArgs {
  mnemonic: string;
  derivedKeyHash: Uint8Array;
}
export async function encryptMnemonic({ mnemonic, derivedKeyHash }: EncryptMnemonicArgs) {
  const key = await deriveWebCryptoKey(derivedKeyHash);
  const iv = extractEncryptionInitVector(derivedKeyHash);
  const cipherArrayBuffer = await crypto.subtle.encrypt(
    { name: algorithmName, iv },
    key,
    new TextEncoder().encode(mnemonic)
  );
  return Buffer.from(cipherArrayBuffer).toString('hex');
}

interface DecryptMnemonicArgs {
  encryptedMnemonic: string;
  derivedKeyHash: Uint8Array;
}
export async function decryptMnemonic({ encryptedMnemonic, derivedKeyHash }: DecryptMnemonicArgs) {
  if (derivedKeyHash.length !== 48) throw new Error('Key must be of length 48');
  const key = await deriveWebCryptoKey(derivedKeyHash);
  const iv = extractEncryptionInitVector(derivedKeyHash);
  const algorithm = { name: algorithmName, iv };
  const encryptedBuffer = Buffer.from(encryptedMnemonic, 'hex');
  const decrypted = await crypto.subtle.decrypt(algorithm, key, encryptedBuffer);
  const textDecoder = new TextDecoder();
  return textDecoder.decode(decrypted);
}
