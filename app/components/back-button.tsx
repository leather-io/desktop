import React, { FC } from 'react';
import { ArrowIcon, ButtonProps, IconButton, color } from '@stacks/ui';
import { useBack } from '@hooks/use-back-url';

// Cannot use cursor pointer in top bar area of window
// https://github.com/electron/electron/issues/5723
export const BackButton: FC<Omit<ButtonProps, 'children'>> = ({ onClick, ...props }) => {
  const [backUrl, handleBack] = useBack();
  const hasBackState = !!backUrl;

  return (
    <IconButton
      height="32px"
      width="32px"
      style={{
        cursor: 'default',
        minHeight: 'unset',
        minWidth: 'unset',
        padding: 0,
      }}
      onClick={e => {
        handleBack();
        onClick?.(e);
      }}
      pointerEvents={!hasBackState ? 'none' : 'all'}
      as="button"
      {...(props as any)}
      icon={() => <ArrowIcon {...({ direction: 'left' } as any)} color={color('text-title')} />}
    />
  );
};
