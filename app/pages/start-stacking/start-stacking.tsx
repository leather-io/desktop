import React, { FC } from 'react';
import { Box, Flex, useMediaQuery } from '@stacks/ui';
import { useHistory } from 'react-router-dom';

import routes from '@constants/routes.json';
import { useBackButton } from '@hooks/use-back-url';
import { useSelector } from 'react-redux';
import { selectPoxInfo } from '@store/stacking';
import { toHumanReadableStx } from '@utils/unit-convert';
import { useBalance } from '@hooks/use-balance';
import { POOLED_STACKING_TX_SIZE_BYTES, STACKING_CONTRACT_CALL_TX_BYTES } from '@constants/index';
import {
  StartStackingLayout as Layout,
  StackingOptionsCardContainer as CardContainer,
  StackingOptionsCardDescription as Description,
  StackingOptionCard as Card,
  StackingOptionCardTitle as Title,
  StackingOptionCardButton as OptionButton,
  StackingOptionCardBenefit as OptionBenefit,
  StackingOptionCardBenefitContainer as OptionBenefitContainer,
  InsufficientStackingBalanceWarning,
} from './components/start-stacking-layout';
import { ExplainerTooltip } from '@components/tooltip';

import divingBoardIllustration from '@assets/images/stack-in-a-pool.svg';
import fishBowlIllustration from '@assets/images/stack-by-yourself.svg';
import { pseudoBorderLeft } from '@components/styles/pseudo-border-left';
import { IconUser, IconChartLine, IconLock, IconUserMinus } from '@tabler/icons';
import { StepsIcon } from '@components/icons/steps';
import { useModifierKey } from '@hooks/use-modifier-key';
import { useCalculateFee } from '@hooks/use-calculate-fee';

export const ChooseStackingMethod: FC = () => {
  const history = useHistory();
  useBackButton(routes.HOME);
  const [columnBreakpoint] = useMediaQuery('(min-width: 991px)');

  const { isPressed: holdingAltKey } = useModifierKey('alt', 1000);

  const calcFee = useCalculateFee();

  const { availableBalance } = useBalance();

  const poxInfo = useSelector(selectPoxInfo);

  if (!poxInfo) return null;

  const meetsMinThresholdForDirectStacking = availableBalance
    .plus(calcFee(STACKING_CONTRACT_CALL_TX_BYTES))
    .isGreaterThanOrEqualTo(poxInfo.paddedMinimumStackingAmountMicroStx);

  const hasSufficientBalanceToCoverPoolingTxFee = availableBalance.isGreaterThan(
    calcFee(POOLED_STACKING_TX_SIZE_BYTES)
  );

  return (
    <Layout>
      <CardContainer>
        <Card>
          <Box height="130px">
            <img
              src={divingBoardIllustration}
              width="150px"
              alt="Diving board illustration with a blue gradient and ominous-looking hole by Eugenia Digon"
            />
          </Box>
          <Title>Stack in a pool</Title>
          <Description>
            Team up with other stackers in a pool, enabling you to stack even if you don’t meet the
            minimum. You have to trust a pool with the payment of your rewards.
          </Description>

          <OptionBenefitContainer>
            <OptionBenefit icon={IconUser}>A pool stacks on your behalf</OptionBenefit>
            <OptionBenefit icon={IconChartLine}>More predictable returns</OptionBenefit>
            <OptionBenefit icon={StepsIcon}>
              <Flex>
                No minimum required
                <Box ml="extra-tight" alignSelf="center">
                  <ExplainerTooltip>
                    Your chosen pool may set their own minimum amount to participate
                  </ExplainerTooltip>
                </Box>
              </Flex>
            </OptionBenefit>
          </OptionBenefitContainer>

          <Flex alignItems="center">
            <OptionButton
              onClick={() => history.push(routes.DELEGATED_STACKING)}
              isDisabled={!hasSufficientBalanceToCoverPoolingTxFee && !holdingAltKey}
            >
              Stack in a pool
            </OptionButton>
            {!hasSufficientBalanceToCoverPoolingTxFee && <InsufficientStackingBalanceWarning />}
          </Flex>
        </Card>

        <Card
          mt={['extra-loose', null, null, 'unset']}
          {...(columnBreakpoint ? pseudoBorderLeft('border', '1px') : {})}
        >
          <Box height="130px">
            <img
              src={fishBowlIllustration}
              width="150px"
              alt="A dark fishbowl with a lone fish facing right, perhaps contemplating the benefits of Stacking, by Eugenia Digon"
            />
          </Box>
          <Title>Stack by yourself</Title>

          <Description>
            When you stack by yourself, you’ll interact with the protocol directly. You don’t have
            to trust a pool if you have a sufficient amount of STX available.
          </Description>

          <OptionBenefitContainer>
            <OptionBenefit icon={IconLock}>Interact with the protocol directly</OptionBenefit>
            <OptionBenefit icon={IconUserMinus}>No intermediaries</OptionBenefit>
            <OptionBenefit icon={StepsIcon}>
              Minimum required to stack is{' '}
              {toHumanReadableStx(poxInfo?.paddedMinimumStackingAmountMicroStx || 0)}
            </OptionBenefit>
          </OptionBenefitContainer>

          <Flex alignItems="center">
            <OptionButton
              onClick={() => history.push(routes.STACKING)}
              isDisabled={!meetsMinThresholdForDirectStacking && !holdingAltKey}
            >
              Stack by yourself
            </OptionButton>
            {!meetsMinThresholdForDirectStacking && <InsufficientStackingBalanceWarning />}
          </Flex>
        </Card>
      </CardContainer>
    </Layout>
  );
};
