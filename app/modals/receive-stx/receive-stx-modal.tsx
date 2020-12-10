import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import Qr from 'qrcode.react';
import {
  Box,
  Button,
  color,
  ControlledModal,
  Flex,
  ModalProps,
  Text,
  useClipboard,
} from '@stacks/ui';
import { border } from '@utils/border';

import { TxModalFooter, TxModalHeader } from '../transaction/transaction-modal-layout';
import { homeActions } from '@store/home/home.reducer';

interface ReceiveStxModalProps extends Partial<ModalProps> {
  address: string;
  isOpen: boolean;
}

export const ReceiveStxModal: FC<ReceiveStxModalProps> = ({ address, isOpen }) => {
  const dispatch = useDispatch();
  const { hasCopied, onCopy } = useClipboard(address);
  const closeModal = React.useCallback(() => dispatch(homeActions.closeReceiveModal()), []);
  return (
    <ControlledModal minWidth="488px" isOpen={isOpen} handleClose={() => closeModal()}>
      <TxModalHeader onSelectClose={closeModal}>Receive STX</TxModalHeader>

      <Flex flexDirection="column" alignItems="center" mx="extra-loose">
        <Box border={border()} p="base" mt="extra-loose" borderRadius="8px">
          <Qr value={address} shapeRendering="sharp-edges" />
        </Box>
        <Text textStyle="body.large.medium" mt="loose" color={color('text-caption')}>
          Wallet address
        </Text>
        <Flex
          mt="base-tight"
          justifyContent="center"
          alignItems="center"
          border={border()}
          height="48px"
          borderRadius="6px"
          width="100%"
        >
          <Text color={color('text-body')} fontSize="14px">
            {address}
          </Text>
        </Flex>

        <Text
          _hover={
            hasCopied
              ? { pointerEvents: 'none' }
              : { textDecoration: 'underline', cursor: 'pointer' }
          }
          userSelect="none"
          fontSize={1}
          color={color('accent')}
          mt="tight"
          mb="loose"
          onClick={onCopy}
        >
          {hasCopied ? 'Copied!' : 'Copy address'}
        </Text>
      </Flex>
      <TxModalFooter>
        <Button size="md" onClick={closeModal}>
          Close
        </Button>
      </TxModalFooter>
    </ControlledModal>
  );
};
