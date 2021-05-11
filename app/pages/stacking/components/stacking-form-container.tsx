import React, { cloneElement, FC, isValidElement } from 'react';
import { Box } from '@stacks/ui';
import { Hr } from '@components/hr';

import { increment } from '@utils/mutate-numbers';

export const StackingFormContainer: FC = ({ children }) => {
  const parsedChildren = Array.isArray(children) ? children : [children];
  const parsedFormSteps = parsedChildren.flatMap((child, index) => {
    if (!isValidElement(child)) return null;
    return [
      <Hr mt="extra-loose" mb="48px" key={index.toString() + '-hr'} />,
      cloneElement(child, {
        key: index,
        step: increment(index),
        mb: increment(index) === parsedChildren.length ? '280px' : null,
      }),
    ];
  });
  return <Box mt="48px">{parsedFormSteps}</Box>;
};
