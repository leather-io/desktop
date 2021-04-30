import React, { FC } from 'react';
import { useFocus, useHover } from 'use-events';
import { Box, color, FlexProps, Text } from '@stacks/ui';

import btcIllustration from '@assets/images/abstract-btc-tower.svg';
import { openExternalLink } from '@utils/external-links';
import { STACKING_GUIDE_URL } from '@constants/index';

import { StackingFormInfoCard } from './stacking-form-info-card';
import { LegalDisclaimerTooltip } from '@components/legal-disclaimer-tooltip';

const openStackingGuide = () => openExternalLink(STACKING_GUIDE_URL);

export const StackingGuideCard: FC<FlexProps> = props => {
  const [isHovered, bindHover] = useHover();
  const [isFocused, bindFocus] = useFocus();
  return (
    <LegalDisclaimerTooltip {...props}>
      <Box
        as="a"
        onClick={openStackingGuide}
        href={STACKING_GUIDE_URL}
        {...bindHover}
        {...bindFocus}
      >
        <StackingFormInfoCard
          flexDirection="row"
          p="base-loose"
          alignItems="center"
          textStyle="body.large"
          cursor="pointer"
        >
          <Box
            as="img"
            mr="base"
            display="block"
            src={btcIllustration}
            alt="Abstract Bitcoin icon on chart-like tower"
          />
          <Text maxWidth={[null, null, '292px']}>
            <Text as="strong" textDecoration={isHovered || isFocused ? 'underline' : 'unset'}>
              Read the Stacking Guide
            </Text>{' '}
            <Text display="inline" color={color('text-caption')}>
              to get the most out of Stacking ↗
            </Text>
          </Text>
        </StackingFormInfoCard>
      </Box>
    </LegalDisclaimerTooltip>
  );
};
