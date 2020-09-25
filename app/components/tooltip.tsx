import React, { FC } from 'react';
import Tippy from '@tippyjs/react';
import { Box } from '@blockstack/ui';

import { Explainer } from './icons/explainer';

export const ExplainerTooltip: FC = ({ children }) => {
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
        >
          {children}
        </Box>
      }
    >
      <Explainer mt="1px" cursor="help" />
    </Tippy>
  );
};
