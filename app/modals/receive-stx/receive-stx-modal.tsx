import React, { FC, memo } from 'react';
import { useDispatch } from 'react-redux';
import { useHotkeys } from 'react-hotkeys-hook';
import { Button } from '@stacks/ui';
import { Modal } from '@modals/components/base-modal';

import { homeActions } from '@store/home';
import { ModalHeader } from '@modals/components/modal-header';
import { useWalletType } from '@hooks/use-wallet-type';

import { TxModalFooter } from '../send-stx/send-stx-modal-layout';
import { RevealStxAddressLedger } from './components/reveal-stx-address-ledger';
import { RevealStxAddressSoftware } from './components/reveal-stx-address-software';
import { HomeSelectors } from 'app/tests/features/home.selectors';

export const ReceiveStxModal: FC<{ isOpen: boolean }> = memo(({ isOpen }) => {
  const dispatch = useDispatch();
  useHotkeys('esc', () => void dispatch(homeActions.closeReceiveModal()));
  const closeModal = () => dispatch(homeActions.closeReceiveModal());
  const { whenWallet } = useWalletType();

  return (
    <Modal handleClose={closeModal} minWidth="488px" isOpen={isOpen}>
      <ModalHeader onSelectClose={closeModal}>Receive STX</ModalHeader>
      {isOpen &&
        whenWallet({
          ledger: <RevealStxAddressLedger />,
          software: <RevealStxAddressSoftware />,
        })}
      <TxModalFooter>
        <Button
          size="md"
          mode="tertiary"
          onClick={closeModal}
          data-test={HomeSelectors.BtnReceiveStxModalClose}
        >
          Close
        </Button>
      </TxModalFooter>
    </Modal>
  );
});
