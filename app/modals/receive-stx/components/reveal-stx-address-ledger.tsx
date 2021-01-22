import React, { FC, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import BlockstackApp from '@zondax/ledger-blockstack';
import { Box, Button, Flex, Stack } from '@blockstack/ui';

import { delay } from '@utils/delay';
import { STX_DERIVATION_PATH } from '@constants/index';
import { LedgerConnectStep, useLedger } from '@hooks/use-ledger';
import { LedgerConnectInstructions } from '@components/ledger/ledger-connect-instructions';
import { selectAddress } from '@store/keys';
import { RootState } from '@store/index';

import { AddressDisplayer } from './address-displayer';
import { SevereWarning } from '@components/severe-warning';

export const RevealStxAddressLedger: FC = () => {
  const { transport, step } = useLedger();
  const [isWaitingLedger, setIsWaitingLedger] = useState(false);
  const [address, setAddress] = useState<null | string>(null);
  const [success, setSuccess] = useState(false);

  const { address: persistedAddress } = useSelector((state: RootState) => ({
    address: selectAddress(state),
  }));

  const stepToShow = success ? LedgerConnectStep.HasAddress : step;

  const showAddress = persistedAddress === address && address !== null;

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
        setSuccess(resp.address === persistedAddress);
        await delay(1500);
        setAddress(resp.address);
      }
      setIsWaitingLedger(false);
    } catch (e) {
      setIsWaitingLedger(false);
    }
  }, [persistedAddress, transport]);

  return (
    <Flex
      flexDirection="column"
      alignItems={showAddress ? 'unset' : 'center'}
      mb="base-tight"
      mx="extra-loose"
    >
      {!showAddress || address === null ? (
        <Flex flexDirection="column" mx="extra-loose" width="320px">
          <Stack spacing="base-loose">
            <Box>
              <LedgerConnectInstructions action="Verify address" step={stepToShow} />
            </Box>
            <Button
              mode="secondary"
              mx="extra-loose"
              isDisabled={step < LedgerConnectStep.ConnectedAppOpen}
              isLoading={isWaitingLedger}
              onClick={verifyAddress}
            >
              Request Ledger address
            </Button>
            <Box>
              {address !== null && address !== persistedAddress && (
                <SevereWarning mt="tight" mb="base" pr="base-loose">
                  The addresses do not match. Make sure you're using the same Ledger device with
                  which you created this wallet.
                </SevereWarning>
              )}
            </Box>
          </Stack>
        </Flex>
      ) : (
        <AddressDisplayer address={address} />
      )}
    </Flex>
  );
};
