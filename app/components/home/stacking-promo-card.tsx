import { AbstractBtcChartSvg } from '@components/svg/abstract-btc-chart';
import { useFetchDelegationStatus } from '@hooks/use-fetch-delegation-status';
import { useMempool } from '@hooks/use-mempool';
import { Box, Button, color, Flex, Text } from '@stacks/ui';
import { selectPoxInfo } from '@store/stacking';
import { openExternalLink } from '@utils/external-links';
import { isDelegateStxTx } from '@utils/tx-utils';
import React, { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';

export const StackingPromoCard: FC = () => {
  const { outboundMempoolTxs } = useMempool();
  const poxInfo = useSelector(selectPoxInfo);
  const hasPendingDelegateStxCall = outboundMempoolTxs.some(tx =>
    isDelegateStxTx(tx, poxInfo?.contract_id)
  );

  const delegationStatus = useFetchDelegationStatus();

  useEffect(() => {
    void delegationStatus.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasPendingDelegateStxCall]);

  return (
    <Box
      mt="extra-loose"
      borderRadius="8px"
      boxShadow="0px 1px 2px rgba(0, 0, 0, 0.04);"
      border={`1px solid ${color('border')}`}
    >
      <Flex flexDirection="column" mx="loose" pb="90px" position="relative">
        <Box position="absolute" right="0px" bottom="0px">
          <AbstractBtcChartSvg />
        </Box>
        <Text textStyle="body.large.medium" color={color('text-caption')} mt="loose">
          Stacking
        </Text>
        <Text textStyle="display.large" mt="tight">
          Have a chance to earn BTC by locking your STX temporarily
        </Text>

        <Text textStyle="caption" color={color('text-caption')} lineHeight={1.6} mt="tight">
          Stacking already? Stacking info is now found on lockstacks.com
        </Text>

        <Button
          mt="base"
          alignSelf="flex-start"
          mode="tertiary"
          isDisabled={hasPendingDelegateStxCall}
          onClick={() => openExternalLink('https://lockstacks.com')}
        >
          {'Get stacking on Lockstacks →'}
        </Button>
      </Flex>
    </Box>
  );
};
