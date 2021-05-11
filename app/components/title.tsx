import { Text, BoxProps, color } from '@stacks/ui';
import React, { FC } from 'react';

type TitleProps = BoxProps;

export const Title: FC<TitleProps> = ({ children, ...props }) => {
  return (
    <Text
      as="h1"
      fontSize="40px"
      lineHeight="56px"
      display="block"
      fontWeight={500}
      fontFamily="Open Sauce"
      letterSpacing="-0.02em"
      color={color('text-title')}
      {...props}
    >
      {children}
    </Text>
  );
};
