import React, { FC } from 'react';
import Tippy from '@tippyjs/react';
import { Box, color } from '@stacks/ui';

import { Explainer } from './icons/explainer';

export const ExplainerTooltip: FC = ({ children }) => {
  return (
    <Tippy
      content={
        <Box
          p="base-tight"
          background={color('invert')}
          borderRadius="6px"
          textStyle="body.small.medium"
          whiteSpace="normal"
          maxWidth="290px"
          color={color('bg')}
        >
          {children}
        </Box>
      }
    >
      <Explainer mt="1px" cursor="help" />
    </Tippy>
  );
};
