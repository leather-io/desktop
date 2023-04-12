import stackingImg from '@assets/images/abstract-btc-stx-bar-chart.svg';
import { ExternalLink } from '@components/external-link';
import { Hr } from '@components/hr';
import {
  InfoCard,
  InfoCardGroup,
  InfoCardLabel as Label,
  InfoCardRow as Row,
  InfoCardSection as Section,
  InfoCardValue as Value,
} from '@components/info-card';
import { useBalance } from '@hooks/use-balance';
import { Flex, Text, color } from '@stacks/ui';
import { RootState } from '@store/index';
import { selectStackerInfo } from '@store/stacking/stacking.reducer';
import { formatPoxAddressToNetwork } from '@utils/stacking';
import { truncateMiddle } from '@utils/tx-utils';
import { toHumanReadableStx } from '@utils/unit-convert';
import BigNumber from 'bignumber.js';
import React, { FC } from 'react';
import { useSelector } from 'react-redux';

export const StackingCard: FC = () => {
  const { stackerInfo } = useSelector((state: RootState) => ({
    stackerInfo: selectStackerInfo(state),
  }));
  const { lockedBalance } = useBalance();

  if (!stackerInfo?.isCurrentlyStacking) return null;

  return (
    <InfoCard mt="extra-loose" px="extra-loose" minHeight="180px">
      <Flex mt="loose">
        <img src={stackingImg} alt="A 3-column bar chart with BTC and STX logos trending upwards" />
      </Flex>
      <Flex flexDirection="column" mt="base-loose" pb="base-loose">
        <Text textStyle="body.large.medium">You&apos;re stacking</Text>
        <Text
          fontSize="24px"
          mt="extra-tight"
          fontWeight={500}
          fontFamily="Open Sauce"
          letterSpacing="-0.02em"
        >
          {lockedBalance !== null && toHumanReadableStx(Number(lockedBalance))}
        </Text>
      </Flex>
      <Hr />
      <InfoCardGroup my="loose">
        <Section>
          <Row>
            <Label>Progress</Label>
            <Value>
              {new BigNumber(stackerInfo.stackingPercentage).toPrecision(3).toString()}% complete
            </Value>
          </Row>
        </Section>
        <Section>
          <Row>
            <Label explainer="This is the address your BTC reward will be paid to. If delegated, this is the address of your delegation service">
              Bitcoin address
            </Label>
            <Value>
              {truncateMiddle(formatPoxAddressToNetwork(stackerInfo?.details.pox_address) || '', 6)}
            </Value>
          </Row>
        </Section>
        <Section>
          <Row justifyContent="flex-start">
            🥞
            <ExternalLink
              pl="tight"
              color={color('text-caption')}
              href={`https://stacking.club/reward-address/${String(
                formatPoxAddressToNetwork(stackerInfo?.details.pox_address)
              )}`}
            >
              View on stacking.club
            </ExternalLink>
          </Row>
        </Section>
      </InfoCardGroup>
    </InfoCard>
  );
};
