import { Tooltip } from './tooltip';
import { BoxProps } from '@stacks/ui';
import React, { FC } from 'react';

export const LegalDisclaimerTooltip: FC<BoxProps> = props => (
  <Tooltip
    display="inherit"
    text="This link will take you to an external third-party website that is not affiliated with Leather."
    {...props}
  />
);
