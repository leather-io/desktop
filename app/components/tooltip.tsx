import React, { FC } from 'react';
import Tippy from '@tippyjs/react';
import { Box, BoxProps } from '@blockstack/ui';

import { ExplainerIcon } from './icons/explainer';

interface TooltipProps extends BoxProps {
  text: string;
}

export const Tooltip: FC<TooltipProps> = ({ children, text, ...props }) => {
  return (
    <Tippy
      zIndex={9999999}
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
          {text}
        </Box>
      }
    >
      <Box as="span" {...props}>
        {children}
      </Box>
    </Tippy>
  );
};

interface ExplainerLabelProps {
  text: string;
}

export const ExplainerLabel: FC<ExplainerLabelProps> = ({ text, children }) => (
  <>
    {' '}
    <Tooltip
      text={text}
      textDecoration="underline"
      style={{ textDecorationStyle: 'dotted' }}
      cursor="help"
    >
      {children}
    </Tooltip>{' '}
  </>
);

export const ExplainerTooltip: FC<BoxProps> = ({ children, ...props }) => {
  return (
    <Tippy
      zIndex={9999999}
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
      <ExplainerIcon mt="1px" cursor="help" />
    </Tippy>
  );
};
