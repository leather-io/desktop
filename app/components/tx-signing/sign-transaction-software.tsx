import {
  StackingModalButton as Button,
  StackingModalFooter as Footer,
} from '../../modals/components/stacking-modal-layout';
import { SignTransactionProps } from './sign-transaction';
import routes from '@constants/routes.json';
import { isDecryptionError } from '@crypto/key-encryption';
import { useCreateSoftwareContractCallTx } from '@hooks/use-create-software-contract-call-tx';
import { createSoftwareWalletTokenTransferTx } from '@hooks/use-create-token-transfer-tx';
import { useDecryptWallet } from '@hooks/use-decrypt-wallet';
import { DecryptWalletForm } from '@modals/components/decrypt-wallet-form';
import { blastUndoStackToRemovePasswordFromMemory } from '@utils/blast-undo-stack';
import { capitalize } from '@utils/capitalize';
import { safeAwait } from '@utils/safe-await';
import { HomeSelectors } from 'app/tests/features/home.selectors';
import React, { useCallback, useRef, useState } from 'react';
import { useHistory } from 'react-router';

type SignTransactionSoftwareProps = SignTransactionProps;

export const SignTransactionSoftware: React.FC<SignTransactionSoftwareProps> = props => {
  const { action, txOptions, isBroadcasting, onTransactionSigned, onClose } = props;

  const [decryptionError, setDecryptionError] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isBusy, setIsBusy] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const [password, setPassword] = useState('');
  const history = useHistory();

  const { decryptWallet, isDecrypting } = useDecryptWallet();
  const { createSoftwareContractCallTx } = useCreateSoftwareContractCallTx();

  const createSoftwareWalletTx = useCallback(async () => {
    const { stxPrivateKey } = await decryptWallet(password);
    blastUndoStackToRemovePasswordFromMemory(inputRef.current);
    if ('recipient' in txOptions) {
      return createSoftwareWalletTokenTransferTx({ privateKey: stxPrivateKey, txOptions });
    }
    return createSoftwareContractCallTx({ privateKey: stxPrivateKey, txOptions });
  }, [decryptWallet, password, createSoftwareContractCallTx, txOptions]);

  return (
    <>
      <DecryptWalletForm
        description={`Enter your password to ${action}`}
        onSetPassword={password => setPassword(password)}
        onForgottenPassword={() => history.push(routes.SETTINGS)}
        hasSubmitted={hasSubmitted}
        decryptionError={decryptionError}
        ref={inputRef}
      />
      <Footer>
        <Button mode="tertiary" onClick={onClose}>
          Close
        </Button>
        <Button
          isLoading={isDecrypting || isBroadcasting || isBusy}
          isDisabled={isDecrypting || isBroadcasting || isBusy}
          data-test={HomeSelectors.BtnSendStxFormBroadcastTx}
          onClick={async () => {
            setHasSubmitted(true);
            setIsBusy(true);
            const [error, tx] = await safeAwait(createSoftwareWalletTx());
            if (error) {
              setDecryptionError(
                isDecryptionError(error) ? 'Unable to decrypt wallet' : 'Something went wrong'
              );
              setIsBusy(false);
            }
            if (tx) onTransactionSigned(tx);
          }}
        >
          {capitalize(action)}
        </Button>
      </Footer>
    </>
  );
};
