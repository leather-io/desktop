import React, { FC } from 'react';
import { Box, Text, BoxProps } from '@blockstack/ui';
import { openExternalLink } from '@utils/external-links';

interface ExternalLinkProps extends BoxProps {
  href: string;
}

export const ExternalLink: FC<ExternalLinkProps> = ({ href, children, ...props }) => {
  const openUrl = () => openExternalLink(href);
  return (
    <Text
      onClick={openUrl}
      as="button"
      cursor="pointer"
      display="block"
      outline={0}
      _hover={{ textDecoration: 'underline' }}
      _focus={{ textDecoration: 'underline' }}
      {...{ type: 'button' }}
      {...props}
    >
      {children}
      <Box display="inline-block" ml="extra-tight" mb="1px">
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M8 5.90118V0.745999C8 0.300626 7.71031 0 7.25348 0L2.08914 0.0111343C1.66017 0.0111343 1.35933 0.334029 1.35933 0.707029C1.35933 1.09116 1.68802 1.38622 2.07799 1.38622H3.7883L5.7883 1.30828L4.8468 2.14335L0.233983 6.75296C0.0779944 6.90884 0 7.09812 0 7.27627C0 7.64927 0.339833 8 0.718663 8C0.902507 8 1.08635 7.92206 1.24234 7.76618L5.86072 3.15101L6.69638 2.21016L6.61838 4.13083V5.91788C6.61838 6.31315 6.91922 6.63605 7.29805 6.63605C7.68245 6.63605 8 6.31872 8 5.90118Z"
            fill="currentColor"
          />
        </svg>
      </Box>
    </Text>
  );
};
