import React from 'react';
import { Box, BoxProps, color } from '@stacks/ui';
import { forwardRefWithAs } from '@stacks/ui-core';
import { border } from '@utils/border';
import { transition } from '@blockstack/ui';

export function listHoverProps(hovered: boolean) {
  return {
    content: `''`,
    position: 'absolute',
    background: color('bg-4'),
    borderRadius: '8px',
    zIndex: -1,
    display: 'block',
    width: 'calc(100% + 20px)',
    height: 'calc(100% + 16px)',
    left: '-8px',
    top: '-8px',
    transition,
    opacity: hovered ? 1 : 0,
  };
}

export function listFocusedProps(focused: boolean) {
  return {
    content: `''`,
    position: 'absolute',
    border: `1px solid ${color('brand') as string}`,
    boxShadow: '0 0 0 3px rgba(170,179,255,0.75)',
    borderRadius: '4px',
    width: 'calc(100% + 20px)',
    height: 'calc(100% + 16px)',
    left: '-8px',
    top: '-8px',
    opacity: focused ? 1 : 0,
  };
}

export const EnableBefore = forwardRefWithAs<BoxProps, 'button'>(
  ({ _before, _after, ...rest }, ref) => (
    <Box
      width="100%"
      _before={{
        content: `''`,
        ..._before,
      }}
      _after={{
        content: `''`,
        ..._after,
      }}
      {...rest}
      ref={ref}
    />
  )
);

export const templateTxBoxProps = {
  flexDirection: 'column' as const,
  borderRadius: '8px',
  boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.04);',
  border: border(),
  minHeight: ['152px', '152px', '300px', '416px'],
  justifyContent: 'center',
  alignItems: ['center', 'center', null, null],
  bg: color('bg-2'),
};
