import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { useHotkeys } from 'react-hotkeys-hook';
import Qr from 'qrcode.react';
import { Text, Modal, Button, Flex, Box, useClipboard } from '@blockstack/ui';

import { TxModalHeader, TxModalFooter } from '../transaction/transaction-modal-layout';
import { homeActions } from '../../store/home/home.reducer';
import { useWindowFocus } from '../../pages/app';

interface ReceiveStxModalProps {
  address: string;
}

export const ReceiveStxModal: FC<ReceiveStxModalProps> = ({ address }) => {
  const dispatch = useDispatch();
  useHotkeys('esc', () => void dispatch(homeActions.closeReceiveModal()));
  const { hasCopied, onCopy } = useClipboard(address);
  const closeModal = () => dispatch(homeActions.closeReceiveModal());
  return (
    <Modal
      minWidth="488px"
      isOpen
      headerComponent={<TxModalHeader onSelectClose={closeModal}>Receive STX</TxModalHeader>}
      footerComponent={
        <TxModalFooter>
          <Button size="lg" onClick={closeModal}>
            Close
          </Button>
        </TxModalFooter>
      }
    >
      <Flex flexDirection="column" alignItems="center" mx="extra-loose">
        <Box border="1px solid #F0F0F5" p="base" mt="extra-loose" borderRadius="8px">
          <Qr value={address} shapeRendering="sharp-edges" />
        </Box>
        <Text textStyle="body.large.medium" mt="loose">
          Wallet address
        </Text>
        <Flex
          mt="base-tight"
          justifyContent="center"
          alignItems="center"
          border="1px solid #E1E3E8"
          height="48px"
          borderRadius="6px"
          width="100%"
        >
          <Text color="ink" fontSize="14px">
            {address}
          </Text>
        </Flex>
        <Button variant="link" mt="tight" mb="loose" onClick={onCopy}>
          {hasCopied ? 'Copied' : 'Copy address'}
        </Button>
      </Flex>
    </Modal>
  );
};
