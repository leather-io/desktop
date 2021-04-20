import React, { FC, memo } from 'react';
import { useDispatch } from 'react-redux';
import { useHotkeys } from 'react-hotkeys-hook';
import { Button } from '@stacks/ui';
import { Modal } from '@modals/components/base-modal';

import { homeActions } from '@store/home';

import { useWalletType } from '@hooks/use-wallet-type';

import { TxModalHeader, TxModalFooter } from '../transaction/transaction-modal-layout';
import { RevealStxAddressLedger } from './components/reveal-stx-address-ledger';
import { RevealStxAddressSoftware } from './components/reveal-stx-address-software';

export const ReceiveStxModal: FC<{ isOpen: boolean }> = memo(({ isOpen }) => {
  const dispatch = useDispatch();
  useHotkeys('esc', () => void dispatch(homeActions.closeReceiveModal()));
  const closeModal = () => dispatch(homeActions.closeReceiveModal());
  const { whenWallet } = useWalletType();

  return (
    <Modal handleClose={closeModal} minWidth="488px" isOpen={isOpen}>
      <TxModalHeader onSelectClose={closeModal}>Receive STX</TxModalHeader>
      {whenWallet({
        ledger: <RevealStxAddressLedger />,
        software: <RevealStxAddressSoftware />,
      })}
      <TxModalFooter>
        <Button size="md" mode="tertiary" onClick={closeModal}>
          Close
        </Button>
      </TxModalFooter>
    </Modal>
  );
});
