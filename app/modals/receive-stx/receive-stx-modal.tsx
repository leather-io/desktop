import { TxModalFooter } from '../send-stx/send-stx-modal-layout';
import { RevealStxAddressLedger } from './components/reveal-stx-address-ledger';
import { RevealStxAddressSoftware } from './components/reveal-stx-address-software';
import { useWalletType } from '@hooks/use-wallet-type';
import { Modal } from '@modals/components/base-modal';
import { ModalHeader } from '@modals/components/modal-header';
import { Button } from '@stacks/ui';
import { homeActions } from '@store/home';
import { HomeSelectors } from 'app/tests/features/home.selectors';
import React, { FC } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useDispatch } from 'react-redux';

export const ReceiveStxModal: FC<{ isOpen: boolean }> = ({ isOpen }) => {
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
};
