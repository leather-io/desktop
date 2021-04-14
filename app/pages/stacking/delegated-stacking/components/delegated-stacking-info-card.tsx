import React, { FC } from 'react';
import { BigNumber } from 'bignumber.js';

import { Flex, FlexProps, Text } from '@stacks/ui';

import { DelegationType } from '@models/index';
import { Hr } from '@components/hr';

import { toHumanReadableStx } from '@utils/unit-convert';
import { ExplainerTooltip } from '@components/tooltip';
import { truncateMiddle } from '@utils/tx-utils';
import { formatCycles } from '@utils/stacking';

interface StackingInfoCardProps extends FlexProps {
  balance: BigNumber | null;
  delegateeAddress: string | null;
  durationInCycles: number | null;
  delegationType: DelegationType | null;
  burnHeight?: number;
}

export const DelegatedStackingInfoCard: FC<StackingInfoCardProps> = props => {
  const { balance, delegationType, delegateeAddress, durationInCycles, burnHeight } = props;

  const amountToBeStacked = balance === null ? new BigNumber(0) : balance;

  return (
    <Flex
      flexDirection="column"
      boxShadow="low"
      border="1px solid #F0F0F5"
      borderRadius="8px"
      minHeight="84px"
      alignItems="flex-start"
      minWidth={[null, null, '320px', '420px']}
      position="sticky"
      top="124px"
      {...props}
    >
      <Flex flexDirection="column" px={['loose', 'extra-loose']} pt="extra-loose" pb="base-loose">
        <Text textStyle="body.large.medium">You'll lock</Text>
        <Text fontSize="24px" fontWeight={600} letterSpacing="-0.04em" mt="extra-tight">
          {toHumanReadableStx(amountToBeStacked.toString())}
        </Text>
      </Flex>
      <Hr />
      <Flex flexDirection="column" px={['loose', 'extra-loose']} py="loose" width="100%">
        <Flex justifyContent="space-between">
          <Flex alignItems="center">
            <Text textStyle="body.large.medium" mr="tight">
              Pool address
            </Text>
            <ExplainerTooltip>
              This address is provided to you by your chosen pool for Stacking delegation
              specifically.
            </ExplainerTooltip>
          </Flex>
          <Text textAlign="right">{delegateeAddress ? truncateMiddle(delegateeAddress) : '—'}</Text>
        </Flex>
      </Flex>
      <Hr />
      <Flex flexDirection="column" px={['loose', 'extra-loose']} py="loose" width="100%">
        <Flex justifyContent="space-between" alignItems="flex-start">
          <Flex alignItems="center">
            <Text textStyle="body.large.medium" mr="tight">
              Delegation duration
            </Text>
            <ExplainerTooltip>
              How long you want to delegate to the pool. This is not necessarily the locking
              duration. However, the locking period cannot be longer than the delegation duration.
            </ExplainerTooltip>
          </Flex>
          <Flex flexDirection="column" justifyContent="flex-start">
            <Text textAlign="right">
              {delegationType === null && '—'}
              {delegationType === 'limited' && formatCycles(durationInCycles ?? 0)}
              {delegationType === 'indefinite' && 'Indefinite'}
            </Text>
            {burnHeight && (
              <Text textStyle="caption" color="ink.600" mt="extra-tight">
                Until burn block: {burnHeight}
              </Text>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
