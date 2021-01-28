import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { Flex, Box, Text } from '@blockstack/ui';

import { RootState } from '@store/index';
import { formatPoxAddressToNetwork } from '@utils/stacking';
import { selectStackerInfo } from '@store/stacking/stacking.reducer';
import { PercentageCircle } from '@components/chart/percentage-circle';
import BigNumber from 'bignumber.js';
import { ExplainerTooltip } from '@components/tooltip';

type StackingCardProps = any;

export const StackingCard: FC<StackingCardProps> = () => {
  const { stackerInfo } = useSelector((state: RootState) => ({
    stackerInfo: selectStackerInfo(state),
  }));

  return (
    <Flex
      flexDirection="column"
      mt="extra-loose"
      borderRadius="8px"
      boxShadow="0px 1px 2px rgba(0, 0, 0, 0.04);"
      border="1px solid #F0F0F5"
      px="loose"
      minHeight="180px"
    >
      {stackerInfo?.isCurrentlyStacking && (
        <Box>
          <Flex mt="loose" justifyContent="center">
            <PercentageCircle percentage={stackerInfo.stackingPercentage} />
          </Flex>
          <Text
            display="block"
            color="ink.600"
            textStyle="caption"
            mt="base-tight"
            textAlign="center"
          >
            Stacking progress
          </Text>
          <Flex justifyContent="center" mt="tight">
            <Text textStyle="body.large.medium" fontSize="24px">
              {new BigNumber(stackerInfo.stackingPercentage).toPrecision(3).toString()}% complete
            </Text>
          </Flex>
          <Box mr="2px">
            <Flex flexDirection="column" alignItems="center" mt="base-tight" mb="base-loose">
              <Flex alignItems="center">
                <Text textStyle="caption" color="ink.600" mr="extra-tight">
                  Reward to be paid to
                </Text>
                <ExplainerTooltip mt="1px">
                  This is the address your BTC reward will be paid to. If delegated, this is the
                  address of your delegator.
                </ExplainerTooltip>
              </Flex>
              <Text fontSize="13px" mt="tight" color="ink">
                {formatPoxAddressToNetwork(stackerInfo?.details.pox_address)}
              </Text>
            </Flex>
          </Box>
        </Box>
      )}
    </Flex>
  );
};
