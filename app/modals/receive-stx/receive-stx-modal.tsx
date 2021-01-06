import React, { FC, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHotkeys } from 'react-hotkeys-hook';
import Qr from 'qrcode.react';
import {
  Text,
  Modal,
  Button,
  Flex,
  Box,
  useClipboard,
  ExclamationMarkCircleIcon,
} from '@blockstack/ui';

import { RootState } from '@store/index';
import { selectWalletType } from '@store/keys';
import { homeActions } from '@store/home';
import { useLedger, LedgerConnectStep } from '@hooks/use-ledger';

import { NETWORK, STX_DERIVATION_PATH } from '@constants/index';
import { ExchangeWithdrawalWarning } from '@components/testnet/exchange-withdrawal-warning';
import { TxModalHeader, TxModalFooter } from '../transaction/transaction-modal-layout';
import { LedgerConnectInstructions } from '@components/ledger/ledger-connect-instructions';
import { delay } from '@utils/delay';
import BlockstackApp from '@zondax/ledger-blockstack';

interface ReceiveStxModalProps {
  address: string;
}

export const ReceiveStxModal: FC<ReceiveStxModalProps> = ({ address }) => {
  const dispatch = useDispatch();
  useHotkeys('esc', () => void dispatch(homeActions.closeReceiveModal()));
  const [view, setView] = useState<'main' | 'verify-ledger'>('main');
  const [ledgerAddress, setLedgerAddress] = useState<null | string>(null);
  const [isWaitingLedger, setIsWaitingLedger] = useState(false);
  const { hasCopied, onCopy } = useClipboard(address);
  const closeModal = () => dispatch(homeActions.closeReceiveModal());

  const { walletType } = useSelector((state: RootState) => ({
    walletType: selectWalletType(state),
  }));

  const { transport, step } = useLedger();

  const verifyAddress = useCallback(async () => {
    const usbTransport = transport;
    if (usbTransport === null) return;
    setIsWaitingLedger(true);

    const app = new BlockstackApp(usbTransport);

    try {
      await app.getVersion();
      await delay(1);
      const resp = await app.showAddressAndPubKey(STX_DERIVATION_PATH);
      if (resp && resp.address) {
        setLedgerAddress(resp.address);
      }
      setIsWaitingLedger(false);
    } catch (e) {
      console.log(e);
      setIsWaitingLedger(false);
    }
  }, [transport]);

  const stepToShow = address === ledgerAddress ? LedgerConnectStep.HasAddress : step;

  return (
    <Modal
      minWidth="488px"
      isOpen
      headerComponent={<TxModalHeader onSelectClose={closeModal}>Receive STX</TxModalHeader>}
      footerComponent={
        <TxModalFooter>
          <Button size="lg" onClick={closeModal}>
            Close
          </Button>
        </TxModalFooter>
      }
    >
      <Flex flexDirection="column" alignItems="center" mx="extra-loose">
        {NETWORK === 'testnet' && <ExchangeWithdrawalWarning />}
        {view === 'main' && (
          <>
            <Box border="1px solid #F0F0F5" p="base" mt="base" borderRadius="8px">
              <Qr value={address} shapeRendering="sharp-edges" />
            </Box>
            <Text textStyle="body.large.medium" mt="loose">
              Wallet address
            </Text>
          </>
        )}
        {view === 'verify-ledger' && (
          <Flex flexDirection="column" width="80%" mb="base-tight">
            <LedgerConnectInstructions action="Verify address" step={stepToShow} />
            <Button
              mode="secondary"
              mt="base"
              mx="extra-loose"
              isDisabled={step < LedgerConnectStep.ConnectedAppOpen}
              isLoading={isWaitingLedger}
              onClick={verifyAddress}
            >
              Request Ledger address
            </Button>
            {ledgerAddress !== null && ledgerAddress !== address && (
              <Flex
                backgroundColor="#FCEBEC"
                width="100%"
                borderRadius="6px"
                padding="base"
                mt="tight"
                pr="base-loose"
              >
                <ExclamationMarkCircleIcon
                  color="#CF0000"
                  width="16px"
                  height="16px"
                  minWidth="16px"
                  mr="tight"
                  mt="1px"
                />
                <Text textStyle="body.small">
                  The addresses do not match. Make sure you're using the Ledger device with which
                  you created this wallet.
                </Text>
              </Flex>
            )}
          </Flex>
        )}
        <Flex
          mt="base-tight"
          justifyContent="center"
          alignItems="center"
          border="1px solid #E1E3E8"
          height="48px"
          borderRadius="6px"
          width="100%"
        >
          <Text color="ink" fontSize="14px">
            {address}
          </Text>
        </Flex>
        <Box mb="loose" mt="base">
          <Button variant="link" onClick={onCopy} mr="tight">
            {hasCopied ? 'Copied' : 'Copy address'}
          </Button>
          {walletType === 'ledger' && (
            <Button variant="link" onClick={() => setView('verify-ledger')}>
              Verify Ledger address
            </Button>
          )}
        </Box>
      </Flex>
    </Modal>
  );
};
