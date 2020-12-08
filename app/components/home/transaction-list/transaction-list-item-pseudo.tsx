import React from 'react';
import { Box, BoxProps } from '@stacks/ui';
import { forwardRefWithAs } from '@stacks/ui-core';

export function listHoverProps(hovered: boolean) {
  return hovered
    ? ({
        content: `''`,
        background: '#FAFAFC',
        borderRadius: '8px',
        zIndex: -1,
        position: 'absolute',
        display: 'block',
        width: 'calc(100% + 20px)',
        height: 'calc(100% + 16px)',
        left: '-8px',
        top: '-8px',
      } as const)
    : {};
}

export function listFocusedProps(focused: boolean) {
  return focused
    ? ({
        content: `''`,
        position: 'absolute',
        border: '1px solid #C5CCFF',
        boxShadow: '0 0 0 3px rgba(170,179,255,0.75)',
        borderRadius: '4px',
        width: 'calc(100% + 20px)',
        height: 'calc(100% + 16px)',
        left: '-8px',
        top: '-8px',
      } as const)
    : {};
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
  border: '1px solid #F0F0F5',
  minHeight: ['152px', '152px', '300px', '416px'],
  justifyContent: 'center',
  alignItems: ['center', 'center', null, null],
};
