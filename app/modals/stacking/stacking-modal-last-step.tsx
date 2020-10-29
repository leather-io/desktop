import React, { FC } from 'react';
import { LargeCheckmark } from '@components/icons/large-checkmark';
import { Button, Flex, Modal, Text } from '@blockstack/ui';
import { useHotkeys } from 'react-hotkeys-hook';
import { WalletType } from '../../types/wallet-type';

interface StackingModalProps {
  walletType: WalletType;
  onClose(): void;
}

export const StackingModal: FC<StackingModalProps> = props => {
  const { onClose } = props;
  useHotkeys('esc', onClose, [onClose]);

  return (
    <Modal isOpen maxWidth="488px" minWidth="488px" pt="80px" pb="extra-loose">
      <Flex justifyContent="center">
        <LargeCheckmark />
      </Flex>
      <Text textStyle="display.small" display="block" textAlign="center" mt="extra-loose">
        You locked your STX for 2 weeks
      </Text>
      <Text
        textStyle="body.large"
        display="block"
        textAlign="center"
        mt="base-tight"
        mx="extra-loose"
      >
        You’ll receive Bitcoin twice, at the end of every cycle.
      </Text>
      <Flex justifyContent="flex-end">
        <Button mt="extra-loose" onClick={onClose} mr="extra-loose">
          Close
        </Button>
      </Flex>
    </Modal>
  );
};
