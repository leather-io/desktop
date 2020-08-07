import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import BlockstackApp from '@zondax/ledger-blockstack';
import type Transport from '@ledgerhq/hw-transport';
import TransportNodeHid from '@ledgerhq/hw-transport-node-hid';
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
import { useInterval } from '../../../hooks/use-interval';
import { ERROR_CODE } from '../../../../../ledger-blockstack/js/src/common';
import { delay } from '../../../utils/delay';
import { LedgerConnectInstructions } from '../../../components/ledger/ledger-connect-instructions';

const STX_DERIVATION_PATH = `m/44'/5757'/0'/0/0`;

export enum LedgerConnectStep {
  Disconnected,
  ConnectedAppClosed,
  ConnectedAppOpen,
  HasAddress,
}

export const ConnectLedger: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [step, setStep] = useState(LedgerConnectStep.Disconnected);
  const [loading, setLoading] = useState(false);
  const transport = useRef<Transport | null>(null);
  const disconnectTimeouts = useRef<number>(0);
  const listeningForAddEvent = useRef(true);

  const SAFE_ASSUME_REAL_DEVICE_DISCONNECT_TIME = 1000;
  const POLL_LEDGER_INTERVAL = 250;

  const createListener = useCallback(() => {
    console.log('creating listener');
    const tHid = TransportNodeHid.listen({
      next: async (event: any) => {
        if (event.type === 'add') {
          console.log('clearing timeout id', disconnectTimeouts.current);
          clearTimeout(disconnectTimeouts.current);
          tHid.unsubscribe();
          const t = await TransportNodeHid.open(event.descriptor);
          listeningForAddEvent.current = false;
          transport.current = t;
          t.on('disconnect', async () => {
            console.log('disconnect event');
            listeningForAddEvent.current = true;
            transport.current = null;
            await t.close();
            console.log('starting timeout');
            const timer = setTimeout(() => {
              console.log('running disconnect timeout');
              setStep(LedgerConnectStep.Disconnected);
            }, SAFE_ASSUME_REAL_DEVICE_DISCONNECT_TIME);
            console.log('timeout timer', timer);
            disconnectTimeouts.current = timer;
            createListener();
          });
        }
      },
      error: () => ({}),
      complete: () => ({}),
    });
    return tHid;
  }, []);

  useEffect(() => {
    const subscription = createListener();
    return () => {
      subscription.unsubscribe();
      if (transport.current) {
        void transport.current.close();
        transport.current = null;
      }
    };
  }, [createListener]);

  useInterval(() => {
    if (
      transport.current &&
      step !== LedgerConnectStep.HasAddress &&
      !listeningForAddEvent.current
    ) {
      console.log('Polling');
      // There's a bug with the node-hid library where it doesn't
      // fire disconnect event until next time an operation using it is called.
      // Here we poll a request to ensure the event is fired
      void new BlockstackApp(transport.current)
        .getVersion()
        .then(resp => {
          if (resp.returnCode === 0x6e00) return setStep(LedgerConnectStep.ConnectedAppClosed);
          if (resp.returnCode === 0x9000) return setStep(LedgerConnectStep.ConnectedAppOpen);
        })
        .catch(() => ({}));
    }
  }, POLL_LEDGER_INTERVAL);

  async function handleLedger() {
    const usbTransport = transport.current;

    if (usbTransport === null) return;

    const app = new BlockstackApp(usbTransport);

    try {
      await app.getVersion();

      const confirmedResponse = await app.showAddressAndPubKey(STX_DERIVATION_PATH);
      if (confirmedResponse.returnCode !== ERROR_CODE.NoError) {
        console.log(`Error [${confirmedResponse.returnCode}] ${confirmedResponse.errorMessage}`);
        return;
      }
      if (confirmedResponse.address) {
        setLoading(true);
        setStep(LedgerConnectStep.HasAddress);
        await delay(1250);
        dispatch(
          setLedgerWallet({
            address: confirmedResponse.address,
            publicKey: confirmedResponse.publicKey,
            onSuccess: () => history.push(routes.HOME),
          })
        );
      }
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <Onboarding>
      <OnboardingTitle>Connect your Ledger</OnboardingTitle>
      <OnboardingBackButton onClick={() => history.push(routes.CREATE)} />
      <OnboardingText>Follow these steps to connect your Ledger S or X</OnboardingText>

      <LedgerConnectInstructions step={step} />

      <OnboardingButton mt="loose" onClick={handleLedger} isDisabled={step < 2} isLoading={loading}>
        Continue
      </OnboardingButton>
    </Onboarding>
  );
};
