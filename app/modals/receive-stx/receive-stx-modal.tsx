import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { useHotkeys } from 'react-hotkeys-hook';
import { Modal, Button } from '@blockstack/ui';

import { homeActions } from '@store/home';

import { useWalletType } from '@hooks/use-wallet-type';

import { TxModalHeader, TxModalFooter } from '../transaction/transaction-modal-layout';
import { RevealStxAddressLedger } from './components/reveal-stx-address-ledger';
import { RevealStxAddressSoftware } from './components/reveal-stx-address-software';

export const ReceiveStxModal: FC = () => {
  const dispatch = useDispatch();
  useHotkeys('esc', () => void dispatch(homeActions.closeReceiveModal()));
  const closeModal = () => dispatch(homeActions.closeReceiveModal());
  const { whenWallet } = useWalletType();

  return (
    <Modal
      minWidth="488px"
      isOpen
      headerComponent={<TxModalHeader onSelectClose={closeModal}>Receive STX</TxModalHeader>}
      footerComponent={
        <TxModalFooter>
          <Button size="md" mode="tertiary" onClick={closeModal}>
            Close
          </Button>
        </TxModalFooter>
      }
    >
      {whenWallet({
        ledger: <RevealStxAddressLedger />,
        software: <RevealStxAddressSoftware />,
      })}
    </Modal>
  );
};
