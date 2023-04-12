import { BoxProps, color, Text } from '@stacks/ui';
import { RootState } from '@store/index';
import { selectNextCycleInfo, selectPoxInfo } from '@store/stacking';
import React, { FC } from 'react';
import { useSelector } from 'react-redux';

type OneCycleDescriptorProps = BoxProps;

export const OneCycleDescriptor: FC<OneCycleDescriptorProps> = props => {
  const { nextCycleInfo, poxInfo } = useSelector((state: RootState) => ({
    nextCycleInfo: selectNextCycleInfo(state),
    poxInfo: selectPoxInfo(state),
  }));
  return (
    <Text display="block" textStyle="body.small" color={color('text-caption')} {...props}>
      Cycles last {poxInfo?.reward_cycle_length} Bitcoin blocks, currently{' '}
      {nextCycleInfo?.estimateCycleDuration}
    </Text>
  );
};
