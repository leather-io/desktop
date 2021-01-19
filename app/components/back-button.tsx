import React, { FC } from 'react';
import { Button, ArrowIcon, ButtonProps } from '@blockstack/ui';
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
    <Button
      variant="unstyled"
      _hover={{ background: 'none' }}
      position="absolute"
      left={0}
      top="5px"
      height="34px"
      width="34px"
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
      isDisabled={!hasBackState}
      {...(props as any)}
    >
      <ArrowIcon
        direction="left"
        color={hasDimmedColor(hasBackState, isFocused) ? dimmedColor : 'ink'}
      />
    </Button>
  );
};
