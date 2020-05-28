import React from 'react';
import { Box, BoxProps, Text, Flex } from '@blockstack/ui';

interface CardProps extends BoxProps {
  title: string;
}

export const Card: React.FC<CardProps> = ({ title, children, ...rest }) => {
  return (
    <Box
      borderRadius="6px"
      border="1px solid"
      borderColor="#E5E5EC"
      boxShadow="mid"
      textAlign="center"
      {...rest}
    >
      <Flex
        borderBottom="1px solid"
        borderColor="#E5E5EC"
        height="40px"
        justifyContent="center"
        alignItems="center"
      >
        <Text textStyle="caption" color="ink.600">
          {title}
        </Text>
      </Flex>
      <Box px={10} py={5}>
        <Text>{children}</Text>
      </Box>
    </Box>
  );
};
