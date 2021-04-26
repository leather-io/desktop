import React from 'react';
import { Box, BoxProps, Text, Flex, color } from '@stacks/ui';

interface CardProps extends BoxProps {
  title?: string;
}

export const Card: React.FC<CardProps> = ({ title, children, ...rest }) => {
  return (
    <Box
      borderRadius="6px"
      border="1px solid"
      borderColor={color('border')}
      boxShadow="mid"
      textAlign="center"
      width="100%"
      {...rest}
    >
      {title && (
        <Flex
          borderBottom="1px solid"
          borderColor={color('border')}
          height="40px"
          justifyContent="center"
          alignItems="center"
        >
          <Text textStyle="caption" color={color('text-caption')}>
            {title}
          </Text>
        </Flex>
      )}
      <Box my="base" mx="base">
        {children}
      </Box>
    </Box>
  );
};
