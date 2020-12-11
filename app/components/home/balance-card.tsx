import React, { FC, useState } from 'react';
import {
  ArrowIcon,
  Box,
  BoxProps,
  Button,
  color,
  EncryptionIcon,
  Stack,
  StackProps,
  Text,
} from '@stacks/ui';

import { features, NETWORK } from '@constants';
import { toHumanReadableStx } from '@utils/unit-convert';
import { safeAwait } from '@utils/safe-await';
import { delay } from '@utils/delay';
import BN from 'bn.js';

import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '@store/index';
import { selectAddress } from '@store/keys';
import { selectActiveNodeApi } from '@store/stacks-node';
import { selectAddressBalance } from '@store/address';
import { selectStackerInfo } from '@store/stacking';
import { homeActions } from '@store/home';
import { Api } from '@api/api';

interface UseBalanceCardReturn {
  balance: string | null;
  balanceBN: BN;
  lockedBN: BN;
  available: BN;
  lockedStx?: string;
  requestingTestnetStx?: boolean;
  onSelectSend(): void;
  onSelectReceive(): void;
  onRequestTestnetStx({ stacking }: { stacking: boolean }): Promise<any>;
  requestTestnetStacks(e: React.MouseEvent): Promise<any>;
}

const useBalanceCard = (): UseBalanceCardReturn => {
  const dispatch = useDispatch();

  const [requestingTestnetStx, setRequestingTestnetStx] = useState(false); // should be in redux

  const { address, balance, activeNode, stackerInfo } = useSelector((state: RootState) => ({
    address: selectAddress(state),
    balance: selectAddressBalance(state),
    activeNode: selectActiveNodeApi(state),
    stackerInfo: selectStackerInfo(state),
  }));

  const lockedStx = stackerInfo?.amount_microstx;

  const onRequestTestnetStx = React.useCallback(
    async ({ stacking }: { stacking: boolean }) =>
      address && new Api(activeNode.url).getFaucetStx(address, stacking),
    [address, activeNode.url]
  );
  const onSelectSend = React.useCallback(() => dispatch(homeActions.openTxModal()), [dispatch]);
  const onSelectReceive = React.useCallback(() => dispatch(homeActions.openReceiveModal()), [
    dispatch,
  ]);

  const requestTestnetStacks = React.useCallback(
    async (e: React.MouseEvent) => {
      if (NETWORK !== 'testnet') return;
      if (e.nativeEvent) setRequestingTestnetStx(true);
      const [error] = await safeAwait(
        Promise.all([onRequestTestnetStx({ stacking: e.nativeEvent.altKey }), delay(1500)])
      );
      if (error) {
        console.log(error);
        window.alert(`Faucet request failed: ${error.name}`);
      }
      setRequestingTestnetStx(false);
    },
    [setRequestingTestnetStx, onRequestTestnetStx]
  );

  const balanceBN = new BN(balance || 0, 10);
  const lockedBN = new BN(lockedStx || 0, 10);
  const available = balanceBN.sub(lockedBN);

  return {
    balance,
    balanceBN,
    lockedBN,
    available,
    onRequestTestnetStx,
    onSelectSend,
    onSelectReceive,
    lockedStx,
    requestTestnetStacks,
    requestingTestnetStx,
  };
};

const Balance: FC<BoxProps> = props => {
  const { balance } = useBalanceCard();
  return (
    <Box {...props}>
      <Text textStyle="body.large.medium" color={color('text-caption')} display="block">
        Total balance
      </Text>
      <Text
        color={color('text-title')}
        fontSize="40px"
        lineHeight="56px"
        fontWeight="400"
        letterSpacing="-0.01em"
        fontFamily={`'Open Sauce'`}
      >
        {balance === null ? '–' : toHumanReadableStx(balance)}
      </Text>
    </Box>
  );
};

const Stacking: FC<StackProps> = props => {
  const { lockedBN, available, lockedStx } = useBalanceCard();
  return features.stacking && lockedBN.toNumber() !== 0 ? (
    <Stack
      alignItems="center"
      spacing="tight"
      color="ink.600"
      fontSize={['14px', '16px']}
      {...props}
    >
      <EncryptionIcon size="16px" color="#409EF3" display={['none', 'block']} />
      <Text>{toHumanReadableStx(lockedStx || '0')} locked</Text>
      <Text children="·" />
      <Text>{toHumanReadableStx(available)} available</Text>
    </Stack>
  ) : null;
};

const Actions: FC<StackProps> = props => {
  const {
    balance,
    onSelectReceive,
    onSelectSend,
    requestingTestnetStx,
    requestTestnetStacks,
  } = useBalanceCard();
  return (
    <Stack isInline spacing="tight" {...props}>
      <Button size="md" onClick={onSelectSend} isDisabled={balance === '0' || balance === null}>
        <ArrowIcon direction={'up' as any} mr="base-tight" />
        Send
      </Button>
      <Button size="md" onClick={onSelectReceive}>
        <ArrowIcon direction={'down' as any} mr="base-tight" />
        Receive
      </Button>
      {NETWORK === 'testnet' && (
        <Button
          mode="secondary"
          size="md"
          isDisabled={requestingTestnetStx}
          onClick={(e: any) => requestTestnetStacks(e)}
          title="Hold alt to request more STX. Use sparingly."
        >
          <Box
            mr="extra-tight"
            fontSize="18px"
            left="-4px"
            position="relative"
            display={['none', 'none', 'block']}
          >
            🚰
          </Box>
          {requestingTestnetStx ? 'Requesting faucet' : 'Get testnet STX'}
        </Button>
      )}
    </Stack>
  );
};

export const BalanceCard: FC<BoxProps> = React.memo(props => (
  <Box {...props}>
    <Stack spacing="base">
      <Box>
        <Balance />
        <Stacking mt="tight" />
      </Box>
      <Actions />
    </Stack>
  </Box>
));
