import React, { FC } from 'react';
import { Flex, Box } from '@blockstack/ui';

type HomeComponents =
  | 'balanceCard'
  | 'transactionList'
  | 'stackingPromoCard'
  | 'stackingRewardCard';

type HomeLayoutProps = {
  [key in HomeComponents]: JSX.Element;
};

export const HomeLayout: FC<HomeLayoutProps> = ({
  balanceCard,
  transactionList,
  stackingPromoCard,
  stackingRewardCard,
}) => (
  <Flex
    flexShrink={1}
    maxWidth="1104px"
    pt="120px"
    flexDirection="column"
    mx={['loose', 'loose', 'extra-loose', 'extra-loose', 'auto']}
    mb="extra-loose"
  >
    {balanceCard}
    <Flex flexDirection={['column', 'column', 'row']}>
      <Box mt="extra-loose" flexGrow={1} mr={[null, null, 'extra-loose', '72px']}>
        {transactionList}
      </Box>
      <Flex flexDirection="column" minWidth={[null, null, '376px']}>
        {stackingPromoCard}
        {stackingRewardCard}
      </Flex>
    </Flex>
  </Flex>
);
