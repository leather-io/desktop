import { LegalDisclaimerTooltip } from './legal-disclaimer-tooltip';
import { Box, Text, BoxProps, color } from '@stacks/ui';
import { openExternalLink } from '@utils/external-links';
import React, { FC } from 'react';

interface ExternalLinkProps extends BoxProps {
  href: string;
}

export const ExternalLink: FC<ExternalLinkProps> = ({ href, children, ...props }) => {
  const openUrl = () => openExternalLink(href);
  return (
    <LegalDisclaimerTooltip display="inline-block">
      <Text
        onClick={openUrl}
        as="button"
        type="button"
        cursor="pointer"
        display="block"
        outline={0}
        color={color('brand')}
        _hover={{ textDecoration: 'underline' }}
        _focus={{ textDecoration: 'underline' }}
        {...props}
      >
        {children}
        <Box display="inline-block" ml="extra-tight" mb="1px">
          ↗
        </Box>
      </Text>
    </LegalDisclaimerTooltip>
  );
};
