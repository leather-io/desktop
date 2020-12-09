import React from 'react';
import { useHistory } from 'react-router';
import { Box, Flex, Text, Button } from '@stacks/ui';
import { border } from '@utils/border';

import routes from '@constants/routes.json';
import btcPodium from '../../assets/images/btc-podium.svg';

export const StackingParticipationCard = () => {
  const history = useHistory();
  return (
    <Box
      mt="extra-loose"
      borderRadius="8px"
      boxShadow="0px 1px 2px rgba(0, 0, 0, 0.04);"
      border={border()}
    >
      <Flex flexDirection="column" mt="40px" mb="extra-loose">
        <img src={btcPodium} />
        <Text display="block" textAlign="center" textStyle="display.small" mt="loose">
          Earn Bitcoin rewards
        </Text>
        <Text display="block" mt="tight" textAlign="center" maxWidth="320px" mx="auto">
          When you lock your STX, you'll have a chance to earn Bitcoin every week.
        </Text>
        <Button
          size="md"
          mt="base"
          mx="auto"
          width="272px"
          mode="secondary"
          onClick={() => history.push(routes.STACKING)}
        >
          Get started
        </Button>
      </Flex>
    </Box>
  );
};
