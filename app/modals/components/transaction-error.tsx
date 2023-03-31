import { ModalHeader } from './modal-header';
import { TxModalButton, TxModalFooter } from '@modals/send-stx/send-stx-modal-layout';
import { FailedBroadcastError } from '@modals/send-stx/steps/failed-broadcast-error';
import { PostCoreNodeTransactionsError } from '@stacks/stacks-blockchain-api-types';
import React, { FC } from 'react';

interface TransactionErrorProps {
  error: PostCoreNodeTransactionsError | null;
  onClose(): void;
  onGoBack(): void;
}

export const TransactionError: FC<TransactionErrorProps> = props => {
  const { error, onClose, onGoBack } = props;
  return (
    <>
      <ModalHeader onSelectClose={onClose} />
      <FailedBroadcastError error={error} />
      <TxModalFooter>
        <TxModalButton mode="tertiary" onClick={onClose}>
          Close
        </TxModalButton>
        <TxModalButton onClick={onGoBack}>Try again</TxModalButton>
      </TxModalFooter>
    </>
  );
};
