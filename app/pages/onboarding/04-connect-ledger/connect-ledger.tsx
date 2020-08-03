import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Flex, Text, useForceUpdate } from '@blockstack/ui';
import BlockstackApp from '@zondax/ledger-blockstack';
import Transport from '@ledgerhq/hw-transport';
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
import { setLedgerAddress } from '../../../store/keys';
import { useInterval } from '../../../hooks/use-interval';
import { ERROR_CODE } from '../../../../../ledger-blockstack/js/src/common';
const EXAMPLE_PATH = "m/44'/5757'/0/0/0";

export const ConnectLedger: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const forceUpdate = useForceUpdate();

  const [loading, setLoading] = useState(false);
  const [transportError, setTransportError] = useState<Error>();
  const transport = useRef<Transport | null>(null);

  async function getTransport() {
    // if (!transport.current) {
    //   console.log('No ref to transport, creating new');
    //   return TransportNodeHid.create(100, 100);
    // }
    return Promise.resolve(transport.current);
  }

  function createListener() {
    console.log('creatingListener');
    const tHid = TransportNodeHid.listen({
      next: async (event: any) => {
        console.log({ event });
        if (event.type === 'add') {
          tHid.unsubscribe();
          const t = await TransportNodeHid.open(event.descriptor);
          console.log({ t });
          transport.current = t;
          // forceUpdate();

          transport.current.on('disconnect', async (event: any) => {
            console.log('device disconnected, relisten', event);
            transport.current = null;
            await t.close();
            createListener();
          });
        }
      },
      error: (error: any) => {
        setTransportError(error);
        console.log({ error });
      },
      complete: () => console.log('complete'),
    });
    return tHid;
  }

  useEffect(() => {
    const subscription = createListener();

    return () => {
      console.log('tear down component');
      subscription.unsubscribe();
      if (transport.current) {
        void transport.current.close();
        transport.current = null;
      }
    };
  }, []);

  useInterval(() => {
    if (transport.current) {
      console.log('Ping device');
      // There's a bug with the node-hid library where it doesn't
      // fire disconnect event until next time an operation using it is called.
      // Here we poll a request to ensure the event is fired
      void new BlockstackApp(transport.current).getAppInfo().catch(() => ({}));
    }
  }, 2_000);

  const testLedger = async () => {
    await getInfo();
  };

  async function getInfo() {
    // const transport = await TransportNodeHid.create();
    const transport = await getTransport();

    if (transport === null) {
      console.log('tried to show address but transport null');
      return;
    }

    const app = new BlockstackApp(transport);
    console.log(app);
    forceUpdate();
  }

  async function handleLedger() {
    const transport = await getTransport();

    if (transport === null) {
      console.log('tried to show address but transport null');
      return;
    }

    const app = new BlockstackApp(transport);
    console.log(app);

    try {
      const response = await app.getVersion();
      console.log({ response });

      // now it is possible to access all commands in the app
      // this.log('Please click in the device');
      const confirmedResponse = await app.showAddressAndPubKey(EXAMPLE_PATH);
      if (confirmedResponse.returnCode !== ERROR_CODE.NoError) {
        console.log(`Error [${confirmedResponse.returnCode}] ${confirmedResponse.errorMessage}`);
        return;
      }
      if (confirmedResponse.address) {
        setLoading(true);
        dispatch(
          setLedgerAddress({
            address: confirmedResponse.address,
            onSuccess: () => history.push(routes.HOME),
          })
        );
      }
    } catch (e) {
      console.log(e);
    }
  }

  const ledgerConnected = !!transport.current;

  return (
    <Onboarding>
      <OnboardingTitle>Connect your Ledger</OnboardingTitle>
      <OnboardingBackButton onClick={() => history.push(routes.CREATE)} />
      <OnboardingText>Follow these steps to connect your Ledger device</OnboardingText>
      <Box border="1px solid #F0F0F5" mt="extra-loose" borderRadius="8px">
        <Flex height="56px" alignItems="center" mx="extra-loose">
          <Text>1. Connect your Ledger to your computer</Text>
        </Flex>
        <Flex height="56px" alignItems="center" mx="extra-loose">
          <Text>2. Install the Stacks app on your Ledger</Text>
        </Flex>
        <Flex height="56px" alignItems="center" mx="extra-loose">
          <Text>3. Open the Stacks app on your Ledger</Text>
        </Flex>
      </Box>
      <Box my="extra-loose">
        Some instructions
        {!ledgerConnected && (
          <Box>
            Your ledger isn't connected. Plug it in to a USB port on your computer and enter your
            PIN number.
          </Box>
        )}
        <pre>error: {transportError && JSON.stringify(transportError)}</pre>
        {/* <pre>transport: {transport && JSON.stringify(transport)}</pre> */}
      </Box>
      <OnboardingButton onClick={testLedger}>Test ledger</OnboardingButton>
      <OnboardingButton onClick={handleLedger} isDisabled={!ledgerConnected} isLoading={loading}>
        Connect ledger
      </OnboardingButton>
    </Onboarding>
  );
};
