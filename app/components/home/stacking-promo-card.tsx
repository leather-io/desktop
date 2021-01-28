import React, { FC, memo, useEffect } from 'react';
import { Box, Button, Flex, Text } from '@blockstack/ui';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

import routes from '@constants/routes.json';
import abstractBtcChart from '../../assets/images/abstract-btc-chart.svg';
import { selectHasPendingDelegateStxCall } from '@store/stacking';
import { useDelegationStatus } from '@hooks/use-delegation-status';

export const StackingPromoCard: FC = memo(() => {
  const history = useHistory();
  const hasPendingDelegateStxCall = useSelector(selectHasPendingDelegateStxCall);

  const { update } = useDelegationStatus();

  useEffect(() => {
    void update();
  }, [hasPendingDelegateStxCall, update]);

  return (
    <Box
      mt="extra-loose"
      borderRadius="8px"
      boxShadow="0px 1px 2px rgba(0, 0, 0, 0.04);"
      border="1px solid #F0F0F5"
    >
      <Flex flexDirection="column" mx="loose" pb="90px" position="relative">
        <Box position="absolute" right="0px" bottom="0px">
          <img
            src={abstractBtcChart}
            alt="Faint bar chart balancing blue bitcoin icons on the 3rd and 5th bar"
          />
        </Box>
        <Text textStyle="body.large.medium" color="ink.600" mt="loose">
          Stacking
        </Text>
        <Text textStyle="display.large" mt="tight">
          Earn bitcoin when you lock your STX temporarily
        </Text>
        <Button
          mt="base"
          alignSelf="flex-start"
          mode="tertiary"
          isDisabled={hasPendingDelegateStxCall}
          onClick={() => history.push(routes.CHOOSE_STACKING_METHOD)}
        >
          {hasPendingDelegateStxCall ? 'Delegation pending' : 'Get started →'}
        </Button>
      </Flex>
    </Box>
  );
});
