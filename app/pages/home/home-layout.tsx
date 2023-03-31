import { Screen } from '@components/screen';
import { Flex, Box } from '@stacks/ui';
import React, { FC } from 'react';

interface HomeLayoutProps {
  balanceCard: JSX.Element;
  transactionList: JSX.Element;
  stackingCard: JSX.Element | null;
  stackingRewardCard: JSX.Element | null;
}

export const HomeLayout: FC<HomeLayoutProps> = props => {
  const { balanceCard, transactionList, stackingCard, stackingRewardCard } = props;

  return (
    <Screen pt="120px" mb="extra-loose">
      {balanceCard}
      <Flex
        flexDirection={['column', 'column', 'row']}
        justifyContent={[null, null, 'space-between']}
      >
        <Box
          mt="extra-loose"
          maxWidth={[null, null, '720px']}
          flexGrow={1}
          mr={[null, null, 'extra-loose', '72px']}
        >
          {transactionList}
        </Box>
        <Flex flexDirection="column" width={[null, null, '360px', '420px']} mb="extra-loose">
          <Box position="sticky" top="40px">
            {stackingCard}
            {stackingRewardCard}
          </Box>
        </Flex>
      </Flex>
    </Screen>
  );
};
