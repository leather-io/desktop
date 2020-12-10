import React, { FC, useRef, useState } from 'react';
import { Box, ControlledModal, Button, ButtonGroup, color } from '@stacks/ui';
import { TxModalFooter, TxModalHeader } from '../transaction/transaction-modal-layout';
import { remote } from 'electron';
import { clearDiskStorage } from '@utils/disk-store';

interface ResetWalletModalProps {
  isOpen: boolean;
  onClose(): void;
}

export const ResetWalletModal: FC<ResetWalletModalProps> = ({ isOpen, onClose }) => {
  const [wipingWallet, setWipingWallet] = useState(false);
  const timer = useRef<number>(0);
  const cancelBtnRef = useRef<HTMLDivElement>();
  const PANIC_CANCEL_TIME = 3500;

  const closeModal = () => {
    setWipingWallet(false);
    clearTimeout(timer.current);
    onClose();
  };

  const resetWallet = () => {
    setWipingWallet(true);
    // Allow user to grace period to panic cancel operations
    // Focusing cancel btn ensures any key press of: enter, space, esc
    // will cancel the pending operation
    cancelBtnRef.current?.focus();
    timer.current = setTimeout(() => {
      clearDiskStorage();
      remote.getCurrentWindow().reload();
    }, PANIC_CANCEL_TIME);
  };

  const header = <TxModalHeader onSelectClose={closeModal}>Reset wallet</TxModalHeader>;
  const footer = (
    <TxModalFooter>
      <ButtonGroup size="md">
        <Button mode="tertiary" onClick={closeModal} ref={cancelBtnRef as any}>
          Cancel
        </Button>
        <Button
          style={{ background: color('feedback-error') }}
          onClick={resetWallet}
          isLoading={wipingWallet}
        >
          Reset wallet
        </Button>
      </ButtonGroup>
    </TxModalFooter>
  );
  return (
    <ControlledModal isOpen={isOpen} handleClose={onClose} minWidth={['100%', '488px']}>
      {header}
      <Box mx="extra-loose" my="loose" textStyle="body.large">
        Warning: you may lose funds if you do not have backups of your 24-word Secret Key
      </Box>
      {footer}
    </ControlledModal>
  );
};
