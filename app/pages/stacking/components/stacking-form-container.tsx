import { Hr } from '@components/hr';
import { Box } from '@stacks/ui';
import { BoxProps } from '@stacks/ui-core';
import { increment } from '@utils/mutate-numbers';
import React, { cloneElement, isValidElement } from 'react';

interface ChildProps extends BoxProps {
  step: number;
}

type TChild = React.ReactElement<ChildProps>;

interface Props {
  children: TChild | TChild[];
}

export const StackingFormContainer = ({ children }: Props) => {
  const parsedChildren = Array.isArray(children) ? children : [children];
  const parsedFormSteps = parsedChildren.flatMap((child, index) => {
    if (!isValidElement(child)) return null;
    return [
      <Hr mt="extra-loose" mb="48px" key={index.toString() + '-hr'} />,
      cloneElement(child, {
        key: index,
        step: increment(index),
        mb: increment(index) === parsedChildren.length ? '280px' : undefined,
      }),
    ];
  });
  return <Box mt="48px">{parsedFormSteps}</Box>;
};
