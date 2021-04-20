import React, { FC } from 'react';
import { Flex, Box, color } from '@stacks/ui';
import { Screen } from '@components/screen';
import { ExternalLink } from '@components/external-link';

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
        <Flex flexDirection="column" maxWidth={[null, null, '376px']}>
          <Box position="sticky" top="40px">
            {stackingCard}
            {stackingRewardCard}
            <Box
              mt="loose"
              borderRadius="8px"
              boxShadow="0px 1px 2px rgba(0, 0, 0, 0.04);"
              border={`1px solid ${color('border')}`}
              textStyle="caption"
              px="loose"
              py="base-loose"
              color={color('text-caption')}
              lineHeight="18px"
            >
              ⚠️ Please check our status page for known issues if you’re experiencing any
              difficulties
              <ExternalLink
                fontSize="12px"
                mt="tight"
                href="https://www.hiro.so/questions/what-known-issues-are-currently-affecting-the-stacks-wallet"
              >
                Check status
              </ExternalLink>
            </Box>
          </Box>
        </Flex>
      </Flex>
    </Screen>
  );
};
