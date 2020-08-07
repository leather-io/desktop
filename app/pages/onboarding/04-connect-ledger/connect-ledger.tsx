import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import BlockstackApp from '@zondax/ledger-blockstack';

import { useDispatch } from 'react-redux';

import routes from '../../../constants/routes.json';
import {
  Onboarding,
  OnboardingTitle,
  OnboardingText,
  OnboardingButton,
  OnboardingBackButton,
} from '../../../components/onboarding';
import { setLedgerWallet } from '../../../store/keys';

import { ERROR_CODE } from '../../../../../ledger-blockstack/js/src/common';
import { delay } from '../../../utils/delay';
import { LedgerConnectInstructions } from '../../../components/ledger/ledger-connect-instructions';
import { useLedger } from '../../../hooks/use-ledger';
import { ErrorLabel } from '../../../components/error-label';
import { ErrorText } from '../../../components/error-text';

const STX_DERIVATION_PATH = `m/44'/5757'/0'/0/0`;

export enum LedgerConnectStep {
  Disconnected,
  ConnectedAppClosed,
  ConnectedAppOpen,
  HasAddress,
}

export const ConnectLedger: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [hasConfirmedAddress, setHasConfirmedAddress] = useState(false);
  const [deviceError, setDeviceError] = useState<string | null>(null);

  const dispatch = useDispatch();
  const history = useHistory();
  const { transport, step } = useLedger();

  async function handleLedger() {
    setDeviceError(null);
    const usbTransport = transport;

    if (usbTransport === null) return;

    const app = new BlockstackApp(usbTransport);

    try {
      const version = await app.getVersion();
      // await app.getAppInfo();
      console.log(version);

      const confirmedResponse = await app.showAddressAndPubKey(STX_DERIVATION_PATH);
      if (confirmedResponse.returnCode !== ERROR_CODE.NoError) {
        console.log('resp', confirmedResponse);
        setDeviceError('Has your Ledger device locked itself?');
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
      <OnboardingBackButton onClick={() => history.push(routes.CREATE)} />
      <OnboardingText>Follow these steps to connect your Ledger S or X</OnboardingText>

      <LedgerConnectInstructions step={hasConfirmedAddress ? LedgerConnectStep.HasAddress : step} />
      {deviceError && (
        <ErrorLabel mt="base-loose">
          <ErrorText>{deviceError}</ErrorText>
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
