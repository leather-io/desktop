import React from 'react';
import { Flex, Box, Text, color } from '@stacks/ui';
import { SuccessCheckmark } from './icons/success-checkmark';

interface ToastProps {
  show?: boolean;
  icon?: React.FC;
}

export const Toast: React.FC<ToastProps> = ({
  show = false,
  icon: Icon = SuccessCheckmark,
  children,
}) => (
  <Flex
    p={6}
    width="100%"
    position="fixed"
    justifyContent="center"
    align="center"
    bottom={0}
    left={0}
    style={{ pointerEvents: 'none' }}
  >
    <Flex
      width={['100%', 'unset']}
      bg="white"
      boxShadow="mid"
      border="1px solid"
      borderColor="inherit"
      p={4}
      justifyContent="center"
      alignItems="center"
      borderRadius="6px"
      opacity={show ? 1 : 0}
      transform={show ? 'none' : 'translateY(20px)'}
      transition="150ms all"
    >
      <Box mr={1} color={color('feedback-success')}>
        <Icon />
      </Box>
      <Text fontSize="14px" fontWeight="medium">
        {children}
      </Text>
    </Flex>
  </Flex>
);
