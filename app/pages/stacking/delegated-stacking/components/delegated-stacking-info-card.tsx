import React, { FC } from 'react';
import { BigNumber } from 'bignumber.js';

import { Flex, FlexProps, Text } from '@blockstack/ui';

import { Hr } from '@components/hr';

import { toHumanReadableStx } from '@utils/unit-convert';
import { ExplainerTooltip } from '@components/tooltip';
import { truncateMiddle } from '../../../../utils/tx-utils';

interface StackingInfoCardProps extends FlexProps {
  balance: BigNumber | null;
  delegatorAddress: string | null;
}

export const DelegatedStackingInfoCard: FC<StackingInfoCardProps> = props => {
  const { balance, delegatorAddress } = props;

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
              Delegator address
            </Text>
            <ExplainerTooltip>
              This will be provided to you by your chosen delegator
            </ExplainerTooltip>
          </Flex>
          <Text textAlign="right">{delegatorAddress ? truncateMiddle(delegatorAddress) : '—'}</Text>
        </Flex>
      </Flex>
    </Flex>
  );
};
