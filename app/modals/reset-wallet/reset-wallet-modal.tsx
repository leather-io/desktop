import React, { FC, useState, useRef, useCallback } from 'react';
import { ButtonGroup, Button, Box, color } from '@stacks/ui';
import { Modal } from '@modals/components/base-modal';
import { TxModalFooter } from '../send-stx/send-stx-modal-layout';
import { clearDiskStorage } from '@utils/disk-store';
import { ModalHeader } from '@modals/components/modal-header';
import { SettingsSelectors } from 'app/tests/features/settings.selectors';
import { useAnalytics } from '@hooks/use-analytics';

interface ResetWalletModalProps {
  isOpen: boolean;
  onClose(): void;
}

export const ResetWalletModal: FC<ResetWalletModalProps> = ({ isOpen, onClose }) => {
  const [wipingWallet, setWipingWallet] = useState(false);
  const timer = useRef<number>(0);
  const cancelBtnRef = useRef<HTMLDivElement>();
  const PANIC_CANCEL_TIME = 3500;
  const analytics = useAnalytics();

  const closeModal = useCallback(() => {
    setWipingWallet(false);
    clearTimeout(timer.current);
    onClose();
  }, [timer, onClose]);

  const clearStorage = async () => {
    await clearDiskStorage();
    void main.reloadApp();
  };

  const resetWallet = useCallback(() => {
    setWipingWallet(true);
    void analytics.track('reset_wallet');
    // Allow user to grace period to panic cancel operations
    // Focusing cancel btn ensures any key press of: enter, space, esc
    // will cancel the pending operation
    cancelBtnRef.current?.focus();
    timer.current = window.setTimeout(() => void clearStorage(), PANIC_CANCEL_TIME);
  }, [cancelBtnRef, timer, analytics]);

  return (
    <Modal isOpen={isOpen} handleClose={onClose} minWidth={['100%', '488px']}>
      <ModalHeader onSelectClose={closeModal}>Reset wallet</ModalHeader>
      <Box mx="extra-loose" my="loose" textStyle="body.large">
        Warning: you may lose funds if you do not have backups of your 24-word Secret Key
      </Box>
      <TxModalFooter>
        <ButtonGroup size="md">
          <Button mode="tertiary" onClick={closeModal} ref={cancelBtnRef as any}>
            Cancel
          </Button>
          <Button
            style={{ background: color('feedback-error') }}
            onClick={resetWallet}
            isLoading={wipingWallet}
            data-test={SettingsSelectors.BtnResetWallet}
          >
            Reset wallet
          </Button>
        </ButtonGroup>
      </TxModalFooter>
    </Modal>
  );
};
