import React, { FC } from 'react';
import { BoxProps } from '@stacks/ui';
import { Tooltip } from './tooltip';

export const LegalDisclaimerTooltip: FC<BoxProps> = props => (
  <Tooltip
    display="inherit"
    text="This link will take you to an external third-party website that is not affiliated with Hiro Systems PBC."
    {...props}
  />
);
