import React, { FC } from 'react';
import { Flex, Box } from '@blockstack/ui';
import { Screen } from '@components/screen';

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
      <Flex flexDirection={['column', 'column', 'row']}>
        <Box mt="extra-loose" flexGrow={1} mr={[null, null, 'extra-loose', '72px']}>
          {transactionList}
        </Box>
        <Flex flexDirection="column" minWidth={[null, null, '376px']}>
          <Box position="sticky" top="40px">
            {stackingCard}
            {stackingRewardCard}
          </Box>
        </Flex>
      </Flex>
    </Screen>
  );
};
