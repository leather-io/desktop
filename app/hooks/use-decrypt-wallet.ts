import { useCallback } from 'react';
import { useSelector } from 'react-redux';

import { decryptSoftwareWallet, selectEncryptedMnemonic, selectSalt } from '@store/keys';
import { RootState } from '@store/index';

export function useDecryptWallet() {
  const { encryptedMnemonic, salt } = useSelector((state: RootState) => ({
    salt: selectSalt(state),
    encryptedMnemonic: selectEncryptedMnemonic(state),
  }));

  const decryptWallet = useCallback(
    async (password: string) => {
      if (!encryptedMnemonic || !salt) {
        throw new Error('`encryptedMnemonic` or `salt` undefined');
      }
      return decryptSoftwareWallet({
        ciphertextMnemonic: encryptedMnemonic,
        salt,
        password,
      });
    },
    [encryptedMnemonic, salt]
  );

  return { decryptWallet };
}
