import React, { useState } from 'react';
import { Box, Flex, Text, Button } from '@blockstack/ui';

import { useBackButton } from '../../hooks/use-back-url.hook';
import routes from '../../constants/routes.json';
import { ResetWalletModal } from '../../modals/reset-wallet/reset-wallet-modal';
import { useSelector } from 'react-redux';
import { selectWalletType } from '../../store/keys/keys.reducer';

export const Settings = () => {
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const walletType = useSelector(selectWalletType);
  useBackButton(routes.HOME);
  return (
    <>
      <ResetWalletModal isOpen={resetModalOpen} onClose={() => setResetModalOpen(false)} />
      <Flex
        flexDirection="column"
        maxWidth="1104px"
        mx={['loose', 'loose', 'extra-loose', 'extra-loose', 'auto']}
      >
        <Box mx="extra-loose" mt="68px">
          <Text textStyle="display.large">Settings</Text>
          <Text textStyle="display.small" mt="loose" display="block">
            Reset wallet
          </Text>
          <Text as="h3" textStyle="body.large" display="block" mt="tight">
            When you reset your wallet,
            {walletType === 'software' &&
              ' you will need to sign back in with your 24-word Secret Key.'}
            {walletType === 'ledger' && ' you will need to reauthenticate with your Ledger device'}
          </Text>
          <Button
            mt="base"
            style={{ background: '#D4001A' }}
            onClick={() => setResetModalOpen(true)}
          >
            Reset wallet
          </Button>
        </Box>
      </Flex>
    </>
  );
};
