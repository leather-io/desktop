import React, { FC } from 'react';

import { Box, Flex, FlexProps, Text } from '@stacks/ui';

import { DelegationType } from '@models/index';
import { Hr } from '@components/hr';

import { POOLED_STACKING_TX_SIZE_BYTES } from '@constants/index';
import { parseNumericalFormInput } from '@utils/form/parse-numerical-form-input';
import { stxToMicroStx, toHumanReadableStx } from '@utils/unit-convert';
import { truncateMiddle } from '@utils/tx-utils';
import { formatCycles } from '@utils/stacking';
import {
  InfoCard,
  InfoCardLabel as Label,
  InfoCardRow as Row,
  InfoCardGroup as Group,
  InfoCardValue as Value,
  InfoCardSection as Section,
} from '../../../../components/info-card';
import { useCalculateFee } from '@hooks/use-calculate-fee';

interface PoolingInfoCardProps extends FlexProps {
  amount: string | number | null;
  poolStxAddress: string | null;
  durationInCycles: number | null;
  delegationType: DelegationType | null;
  burnHeight?: number;
}

export const PoolingInfoCard: FC<PoolingInfoCardProps> = props => {
  const { amount, delegationType, poolStxAddress, durationInCycles, burnHeight, ...rest } = props;
  const amountToBeStacked = stxToMicroStx(parseNumericalFormInput(amount)).integerValue();

  const calcFee = useCalculateFee();

  return (
    <InfoCard {...rest}>
      <Box mx={['loose', 'extra-loose']}>
        <Flex flexDirection="column" pt="extra-loose" pb="base-loose">
          <Text textStyle="body.large.medium">You're pooling</Text>
          <Text
            fontSize="24px"
            fontFamily="Open Sauce"
            fontWeight={500}
            letterSpacing="-0.02em"
            mt="extra-tight"
          >
            {toHumanReadableStx(amountToBeStacked.toString())}
          </Text>
        </Flex>
        <Hr />
        <Group mt="base-loose" mb="extra-loose">
          <Section>
            <Row>
              <Label explainer=" How long you want to delegate to the pool. This is not necessarily the locking duration. However, the locking period cannot be longer than the delegation duration.">
                Type
              </Label>
              <Value>
                {delegationType === null && '—'}
                {delegationType === 'limited' && formatCycles(durationInCycles ?? 0)}
                {delegationType === 'indefinite' && 'Indefinite'}
              </Value>
            </Row>

            {burnHeight && (
              <Row>
                <Label>Burn height</Label>
                <Value>{burnHeight}</Value>
              </Row>
            )}
          </Section>

          <Section>
            <Row>
              <Label explainer="This address is provided to you by your chosen pool for Stacking delegation specifically.">
                Pool address
              </Label>
              <Value>{poolStxAddress ? truncateMiddle(poolStxAddress) : '—'}</Value>
            </Row>
          </Section>

          <Section>
            <Row>
              <Label>Fee</Label>
              <Value>{toHumanReadableStx(calcFee(POOLED_STACKING_TX_SIZE_BYTES))}</Value>
            </Row>
          </Section>
        </Group>
      </Box>
    </InfoCard>
  );
};
