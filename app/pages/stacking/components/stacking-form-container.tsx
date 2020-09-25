import React, { cloneElement, FC, isValidElement } from 'react';
import { Hr } from '@components/hr';

import { increment } from '@utils/mutate-numbers';

export const StackingFormContainer: FC = ({ children }) => {
  const parsedChildren = Array.isArray(children) ? children : [children];
  const parsedFormSteps = parsedChildren.flatMap((child, index) => {
    if (!isValidElement(child)) return null;
    return [
      <Hr my="extra-loose" key={index.toString() + '-hr'} />,
      cloneElement(child, {
        key: index,
        step: increment(index),
        mb: increment(index) === parsedChildren.length ? '280px' : null,
      }),
    ];
  });
  return <>{parsedFormSteps}</>;
};
