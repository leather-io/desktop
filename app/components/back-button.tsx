import React, { FC } from 'react';
import { ArrowIcon, ButtonProps, IconButton } from '@stacks/ui';
import { useWindowFocus } from '@hooks/use-window-focus';
import { useBack } from '@hooks/use-back-url';

const dimmedColor = '#c1c3cc';

const hasDimmedColor = (hasBackAction: boolean, isFocused: boolean) => {
  return !hasBackAction || !isFocused;
};

// Cannot use cursor pointer in top bar area of window
// https://github.com/electron/electron/issues/5723
export const BackButton: FC<Omit<ButtonProps, 'children'>> = ({ onClick, ...props }) => {
  const winState = useWindowFocus();
  const isFocused = winState === 'focused';
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
      isDisabled={!hasBackState}
      {...(props as any)}
      icon={() => (
        <ArrowIcon
          {...({ direction: 'left' } as any)}
          color={hasDimmedColor(hasBackState, isFocused) ? dimmedColor : 'ink'}
        />
      )}
    />
  );
};
