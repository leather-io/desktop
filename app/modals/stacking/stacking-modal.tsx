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
  useHotkeys('esc', () => onClose());

  return (
    <Modal isOpen maxWidth="488px" minWidth="488px" py="80px">
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
      <Button onClick={onClose}>Close</Button>
    </Modal>
  );
};
