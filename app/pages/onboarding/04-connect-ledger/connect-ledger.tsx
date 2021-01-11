import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import BlockstackApp, { LedgerError } from '@zondax/ledger-blockstack';

import { STX_DERIVATION_PATH } from '@constants/index';
import routes from '@constants/routes.json';
import {
  Onboarding,
  OnboardingTitle,
  OnboardingText,
  OnboardingButton,
} from '@components/onboarding';
import { setLedgerWallet } from '@store/keys';

import { delay } from '@utils/delay';
import { LedgerConnectInstructions } from '@components/ledger/ledger-connect-instructions';
import { useLedger } from '@hooks/use-ledger';
import { ErrorLabel } from '@components/error-label';
import { ErrorText } from '@components/error-text';
import { useBackButton } from '@hooks/use-back-url';

export enum LedgerConnectStep {
  Disconnected,
  ConnectedAppClosed,
  ConnectedAppOpen,
  HasAddress,
}

export const ConnectLedger: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [didRejectTx, setDidRejectTx] = useState(false);
  const [hasConfirmedAddress, setHasConfirmedAddress] = useState(false);
  const [deviceError, setDeviceError] = useState<string | null>(null);
  useBackButton(routes.CREATE);

  const dispatch = useDispatch();
  const history = useHistory();
  const { transport, step, error } = useLedger();

  async function handleLedger() {
    setDeviceError(null);
    setLoading(true);
    const usbTransport = transport;

    if (usbTransport === null) return;

    const app = new BlockstackApp(usbTransport);

    try {
      await app.getVersion();

      const confirmedResponse = await app.showAddressAndPubKey(STX_DERIVATION_PATH);

      if (confirmedResponse.returnCode === LedgerError.TransactionRejected) {
        setDidRejectTx(true);
        setLoading(false);
        return;
      }

      if (confirmedResponse.returnCode !== LedgerError.NoErrors) {
        setLoading(false);
        return;
      }

      if (confirmedResponse.address) {
        setLoading(true);
        setHasConfirmedAddress(true);
        await delay(750);
        dispatch(
          setLedgerWallet({
            address: confirmedResponse.address,
            publicKey: (confirmedResponse.publicKey as unknown) as Buffer,
            onSuccess: () => history.push(routes.HOME),
          })
        );
      }
    } catch (e) {
      console.warn(e);
    }
  }

  return (
    <Onboarding>
      <OnboardingTitle>Connect your Ledger</OnboardingTitle>
      <OnboardingText>Follow these steps to connect your Ledger S or X</OnboardingText>

      <LedgerConnectInstructions
        action="Confirm your address"
        step={hasConfirmedAddress ? LedgerConnectStep.HasAddress : step}
      />
      {deviceError && (
        <ErrorLabel mt="base-loose">
          <ErrorText>{deviceError}</ErrorText>
        </ErrorLabel>
      )}
      {error && (
        <ErrorLabel mt="base-loose">
          <ErrorText>{error}</ErrorText>
        </ErrorLabel>
      )}
      {didRejectTx && (
        <ErrorLabel mt="base-loose">
          <ErrorText>You must approve the transaction that appears on your Ledger device</ErrorText>
        </ErrorLabel>
      )}
      <OnboardingButton
        mt="loose"
        onClick={handleLedger}
        isDisabled={step < 2 || loading}
        isLoading={loading}
      >
        Continue
      </OnboardingButton>
    </Onboarding>
  );
};
