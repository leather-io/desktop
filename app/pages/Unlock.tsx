import React, { useCallback, useState } from 'react';
import { DecryptWalletForm } from '@modals/components/decrypt-wallet-form';
import { safeAwait } from '@utils/safe-await';
import { isDecryptionError } from '@crypto/key-encryption';
import { useDecryptWallet } from '@hooks/use-decrypt-wallet';
import { createStacksPrivateKey, getPublicKey, publicKeyToString } from '@stacks/transactions';
import { Box } from '@stacks/ui';
import { Onboarding, OnboardingButton, OnboardingTitle } from '@components/onboarding';
import { useBackButton } from '@hooks/use-back-url';
import { ResetWalletModal } from '@modals/reset-wallet/reset-wallet-modal';
import { persistPublicKey } from '@utils/disk-store';
import { useHistory } from 'react-router';
import routes from '@constants/routes.json';
import { useDispatch } from 'react-redux';
import { setPublicKey } from '@store/keys';

export const Unlock: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  useBackButton(null);
  const [password, setPassword] = useState('');
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [decryptionError, setDecryptionError] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const { decryptWallet, isDecrypting } = useDecryptWallet();

  const derivePublicKey = useCallback(async () => {
    const { privateKey } = await decryptWallet(password);
    const senderKey = createStacksPrivateKey(privateKey);
    return publicKeyToString(getPublicKey(senderKey));
  }, [password, decryptWallet]);

  const onUnlockClick = async () => {
    setHasSubmitted(true);
    setIsBusy(true);
    const [error, publicKey] = await safeAwait(derivePublicKey());
    if (error) {
      setDecryptionError(
        isDecryptionError(error) ? 'Unable to decrypt wallet' : 'Something went wrong'
      );
      setIsBusy(false);
    }
    if (publicKey) {
      dispatch(setPublicKey(publicKey));
      await persistPublicKey(publicKey);
      history.push(routes.HOME);
    } else {
      setDecryptionError('Something went wrong');
    }
  };

  return (
    <>
      <ResetWalletModal isOpen={resetModalOpen} onClose={() => setResetModalOpen(false)} />
      <Onboarding>
        <Box mx="extra-loose" mt="extra-loose">
          <OnboardingTitle textAlign={'left'}>Welcome back!</OnboardingTitle>
        </Box>
        <DecryptWalletForm
          description={`Enter your password`}
          onSetPassword={password => setPassword(password)}
          onForgottenPassword={() => setResetModalOpen(true)}
          hasSubmitted={hasSubmitted}
          decryptionError={decryptionError}
        />
        <Box mx="extra-loose" mt="extra-loose">
          <OnboardingButton
            type="submit"
            mt="loose"
            isLoading={isDecrypting || isBusy}
            isDisabled={isDecrypting || isBusy}
            onClick={onUnlockClick}
          >
            Unlock
          </OnboardingButton>
        </Box>
      </Onboarding>
    </>
  );
};
