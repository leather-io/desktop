import bcryptjs from 'bcryptjs';
import { memoizeWith, identity } from 'ramda';

// 980aa096dd224bd69685583b363de2be
export async function generateDerivedKey({ password, salt }: { password: string; salt: string }) {
  return bcryptjs.hash(password, salt);
}

export const generateSalt = memoizeWith(identity, async () => await bcryptjs.genSalt(12));
