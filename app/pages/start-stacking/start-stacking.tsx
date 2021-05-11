import React, { FC } from 'react';
import { Box, Flex, useMediaQuery } from '@stacks/ui';
import { useHistory } from 'react-router-dom';

import routes from '@constants/routes.json';
import { useBackButton } from '@hooks/use-back-url';
import { useSelector } from 'react-redux';
import { selectPoxInfo } from '@store/stacking';
import { toHumanReadableStx } from '@utils/unit-convert';
import { useBalance } from '@hooks/use-balance';
import { STACKING_CONTRACT_CALL_FEE } from '@constants/index';
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

export const ChooseStackingMethod: FC = () => {
  const history = useHistory();
  useBackButton(routes.HOME);
  const [columnBreakpoint] = useMediaQuery('(min-width: 991px)');

  const { availableBalance } = useBalance();

  const poxInfo = useSelector(selectPoxInfo);

  if (!poxInfo) return null;

  const meetsMinThreshold = availableBalance
    .plus(STACKING_CONTRACT_CALL_FEE)
    .isGreaterThanOrEqualTo(poxInfo.paddedMinimumStackingAmountMicroStx);

  const sufficientBalanceToCoverFee = availableBalance.isGreaterThan(STACKING_CONTRACT_CALL_FEE);

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
            <OptionBenefit>A pool stacks on your behalf</OptionBenefit>
            <OptionBenefit>More predictable returns</OptionBenefit>
            <Flex alignItems="baseline">
              <OptionBenefit>No minimum required</OptionBenefit>
              <Box ml="extra-tight" mt="tight">
                <ExplainerTooltip>
                  Your chosen pool may set their own minimum amount to participate
                </ExplainerTooltip>
              </Box>
            </Flex>
          </OptionBenefitContainer>

          <Flex alignItems="center">
            <OptionButton
              onClick={() => history.push(routes.DELEGATED_STACKING)}
              isDisabled={!sufficientBalanceToCoverFee}
            >
              Stack in a pool
            </OptionButton>
            {!sufficientBalanceToCoverFee && <InsufficientStackingBalanceWarning />}
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
            <OptionBenefit>Interact with the protocol directly</OptionBenefit>
            <OptionBenefit>No intermediaries</OptionBenefit>
            <OptionBenefit>
              Minimum required to stack is{' '}
              {toHumanReadableStx(poxInfo?.paddedMinimumStackingAmountMicroStx || 0)}
            </OptionBenefit>
          </OptionBenefitContainer>

          <Flex alignItems="center">
            <OptionButton
              onClick={() => history.push(routes.STACKING)}
              isDisabled={!meetsMinThreshold}
            >
              Stack by yourself
            </OptionButton>
            {!meetsMinThreshold && <InsufficientStackingBalanceWarning />}
          </Flex>
        </Card>
      </CardContainer>
    </Layout>
  );
};
