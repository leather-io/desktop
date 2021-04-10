import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';

import { decryptSoftwareWallet, selectEncryptedMnemonic, selectSalt } from '@store/keys';
import { RootState } from '@store/index';
import { delay } from '@utils/delay';
import { safeAwait } from '@utils/safe-await';

const shortDelayToGiveAnimationsTime = async () => delay(100);

export function useDecryptWallet() {
  const [isDecrypting, setIsDecrypting] = useState(false);

  const { encryptedMnemonic, salt } = useSelector((state: RootState) => ({
    salt: selectSalt(state),
    encryptedMnemonic: selectEncryptedMnemonic(state),
  }));

  const decryptWallet = useCallback(
    async (password: string) => {
      if (!encryptedMnemonic || !salt) {
        throw new Error('`encryptedMnemonic` or `salt` undefined');
      }
      setIsDecrypting(true);
      await shortDelayToGiveAnimationsTime();
      const [error, decryptedSoftwareWallet] = await safeAwait(
        decryptSoftwareWallet({
          ciphertextMnemonic: encryptedMnemonic,
          salt,
          password,
        })
      );
      setIsDecrypting(false);
      if (error) throw error;
      return decryptedSoftwareWallet as NonNullable<typeof decryptedSoftwareWallet>;
    },
    [encryptedMnemonic, salt]
  );

  return { decryptWallet, isDecrypting };
}
