import { StackingModalHeader as Header, modalStyle } from '../components/stacking-modal-layout';
import { SignTransaction } from '@components/tx-signing/sign-transaction';
import { useLatestNonce } from '@hooks/use-latest-nonce';
import { TransactionError } from '@modals/components/transaction-error';
import { PostCoreNodeTransactionsError } from '@stacks/stacks-blockchain-api-types';
import { ContractCallOptions, StacksTransaction, TokenTransferOptions } from '@stacks/transactions';
import { Modal } from '@stacks/ui';
import React, { FC } from 'react';

interface TxSigningModalProps {
  action: string;
  txDetails: TokenTransferOptions | ContractCallOptions;
  isBroadcasting: boolean;
  error: PostCoreNodeTransactionsError | null;
  onTryAgain(): void;
  onTransactionSigned(tx: StacksTransaction): void;
  onClose(): void;
}

export const TxSigningModal: FC<TxSigningModalProps> = props => {
  const { action, txDetails, isBroadcasting, error, onTryAgain, onClose, onTransactionSigned } =
    props;

  const { nonce } = useLatestNonce();

  return (
    <Modal isOpen {...modalStyle}>
      {!error && (
        <>
          <Header onSelectClose={onClose}>Confirm and {action}</Header>
          <SignTransaction
            action={action}
            txOptions={{ ...txDetails, nonce }}
            isBroadcasting={isBroadcasting}
            onClose={onClose}
            onTransactionSigned={onTransactionSigned}
          />
        </>
      )}

      {error && <TransactionError error={error} onClose={onClose} onGoBack={() => onTryAgain()} />}
    </Modal>
  );
};
