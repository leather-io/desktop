import React from 'react';
import { Flex, Box } from '@blockstack/ui';

type HomeComponents =
  | 'balanceCard'
  | 'transactionList'
  | 'stackingPromoCard'
  | 'stackingRewardCard';

type HomeLayout = {
  [key in HomeComponents]: JSX.Element;
};

export const HomeLayout: React.FC<HomeLayout> = ({
  balanceCard,
  transactionList,
  stackingPromoCard,
  stackingRewardCard,
}) => {
  return (
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
      {/* <Button onClick={openModal}>Open a modal</Button> */}
      {/* <Box>Mnemonic: {mnemonic}</Box>
      <Box mt="loose">MnemonicEncryptedHex: {privateKey}</Box>
      <Box mt="loose">Private key: {privateKey}</Box>
      <Box mt="loose">Base58: {base58}</Box>
      <Box mt="loose">Salt: {(keys as any).salt}</Box>
      <Box mt="loose">Password: {(keys as any).password}</Box>
      <Box mt="loose">Stretched Key: {(keys as any).derivedEncryptionKey}</Box> */}
    </Flex>
  );
};
