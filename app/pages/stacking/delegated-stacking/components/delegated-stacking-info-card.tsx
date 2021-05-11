import React, { FC } from 'react';
import { BigNumber } from 'bignumber.js';

import { Box, color, Flex, FlexProps, Text } from '@stacks/ui';

import { DelegationType } from '@models/index';
import { Hr } from '@components/hr';

import { microStxToStx, stxToMicroStx, toHumanReadableStx } from '@utils/unit-convert';
import { ExplainerTooltip } from '@components/tooltip';
import { truncateMiddle } from '@utils/tx-utils';
import { formatCycles } from '@utils/stacking';
import { StackingFormInfoCard } from '../../components/stacking-form-info-card';

function attemptParseNumber(num: number | string | null) {
  if (!num) return 0;
  try {
    if (typeof num !== 'number') {
      const parsed = parseFloat(num);
      return Number.isFinite(parsed) ? parsed : 0;
    }
    return num;
  } catch (e) {
    return 0;
  }
}

interface PoolingInfoCardProps extends FlexProps {
  amount: number | null;
  poolStxAddress: string | null;
  durationInCycles: number | null;
  delegationType: DelegationType | null;
  burnHeight?: number;
}

export const PoolingInfoCard: FC<PoolingInfoCardProps> = props => {
  const { amount, delegationType, poolStxAddress, durationInCycles, burnHeight, ...rest } = props;

  const amountToBeStacked = stxToMicroStx(attemptParseNumber(amount)).integerValue();

  return (
    <StackingFormInfoCard {...rest}>
      <Box mx={['loose', 'extra-loose']}>
        <Flex flexDirection="column" pt="extra-loose" pb="base-loose">
          <Text textStyle="body.large.medium">You're pooling</Text>
          <Text
            fontSize="24px"
            fontFamily="Open Sauce"
            fontWeight={500}
            letterSpacing="-0.02em"
            mt="extra-tight"
          >
            {toHumanReadableStx(amountToBeStacked.toString())}
          </Text>
        </Flex>
        <Hr />
        <Flex flexDirection="column" py="loose">
          <Flex justifyContent="space-between">
            <Flex color={color('text-caption')} alignItems="center">
              <Text mr="tight">Pool address</Text>
              <ExplainerTooltip>
                This address is provided to you by your chosen pool for Stacking delegation
                specifically.
              </ExplainerTooltip>
            </Flex>
            <Text textStyle="body.large.medium" textAlign="right">
              {poolStxAddress ? truncateMiddle(poolStxAddress) : '—'}
            </Text>
          </Flex>
        </Flex>
        <Hr />
        <Flex flexDirection="column" py="loose">
          <Flex justifyContent="space-between" alignItems="flex-start">
            <Flex alignItems="center" color={color('text-caption')}>
              <Text mr="tight">Delegation duration</Text>
              <ExplainerTooltip>
                How long you want to delegate to the pool. This is not necessarily the locking
                duration. However, the locking period cannot be longer than the delegation duration.
              </ExplainerTooltip>
            </Flex>
            <Flex flexDirection="column" justifyContent="flex-start" textStyle="body.large.medium">
              <Text textAlign="right">
                {delegationType === null && '—'}
                {delegationType === 'limited' && formatCycles(durationInCycles ?? 0)}
                {delegationType === 'indefinite' && 'Indefinite'}
              </Text>
              {burnHeight && (
                <Text textStyle="caption" color={color('text-caption')} mt="extra-tight">
                  Until burn block: {burnHeight}
                </Text>
              )}
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </StackingFormInfoCard>
  );
};
