import React, { useCallback, useRef, useState } from 'react';
import { useHistory } from 'react-router';

import routes from '@constants/routes.json';
import { useDecryptWallet } from '@hooks/use-decrypt-wallet';
import { useCreateSoftwareContractCallTx } from '@hooks/use-create-software-contract-call-tx';
import {
  StackingModalButton as Button,
  StackingModalFooter as Footer,
} from '../../modals/components/stacking-modal-layout';
import { safeAwait } from '@utils/safe-await';
import { isDecryptionError } from '@crypto/key-encryption';
import { SignTransactionProps } from './sign-transaction';
import { DecryptWalletForm } from '@modals/components/decrypt-wallet-form';
import { createSoftwareWalletTokenTransferTx } from '@hooks/use-create-token-transfer-tx';
import { capitalize } from '@utils/capitalize';
import { blastUndoStackToRemovePasswordFromMemory } from '@utils/blast-undo-stack';

type SignTransactionSoftwareProps = SignTransactionProps;

export const SignTransactionSoftware = (props: SignTransactionSoftwareProps) => {
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
    const { privateKey } = await decryptWallet(password);
    blastUndoStackToRemovePasswordFromMemory(inputRef.current);
    if ('recipient' in txOptions) {
      return createSoftwareWalletTokenTransferTx({ privateKey, txOptions });
    }
    return createSoftwareContractCallTx({ privateKey, txOptions });
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
