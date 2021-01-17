import React, { FC } from 'react';
import Tippy from '@tippyjs/react';
import { Box, BoxProps } from '@blockstack/ui';

import { Explainer } from './icons/explainer';

export const ExplainerTooltip: FC<BoxProps> = ({ children, ...props }) => {
  return (
    <Tippy
      content={
        <Box
          p="base-tight"
          color="white"
          background="black"
          borderRadius="6px"
          textStyle="body.small.medium"
          whiteSpace="wrap"
          maxWidth="290px"
          {...props}
        >
          {children}
        </Box>
      }
    >
      <Explainer mt="1px" cursor="help" />
    </Tippy>
  );
};
