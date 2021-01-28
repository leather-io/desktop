import React, { FC } from 'react';
import { Flex, Text } from '@blockstack/ui';
import { ExternalLink } from '@components/external-link';
import { useHistory } from 'react-router-dom';

import routes from '@constants/routes.json';
import { useBackButton } from '@hooks/use-back-url';
import { useSelector } from 'react-redux';
import { selectMeetsMinStackingThreshold, selectPoxInfo } from '@store/stacking';
import { RootState } from '@store/index';
import { toHumanReadableStx } from '@utils/unit-convert';
import { useBalance } from '@hooks/use-balance';
import {
  StartStackingLayout as Layout,
  StackingOptionsCardContainer as CardContainer,
  StackingOptionCard as Card,
  StackingOptionCardTitle as Title,
  StackingOptionCardButton as OptionButton,
  StackingOptionCardAdvantage as OptionBenefit,
  InsufficientStackingBalanceWarning,
} from './components/start-stacking-layout';

export const ChooseStackingMethod: FC = () => {
  const history = useHistory();
  useBackButton(routes.HOME);

  const { availableBalance } = useBalance();

  const { meetsMinThreshold, poxInfo } = useSelector((state: RootState) => ({
    meetsMinThreshold: selectMeetsMinStackingThreshold(state),
    poxInfo: selectPoxInfo(state),
  }));

  const sufficientBalanceToCoverFee = availableBalance.isGreaterThan(260);

  return (
    <Layout>
      <Text textStyle="display.large" fontSize="32px" mt="tight" display="block" textAlign="center">
        Start stacking
      </Text>
      <Text mt="base" color="ink.600" maxWidth="480px">
        Lock your STX to support the network. As a reward, you’ll earn Bitcoin that miners transfer
        as part of Proof of Transfer.
      </Text>
      <ExternalLink href="" fontWeight="normal" mt="base-tight">
        Learn more about stacking
      </ExternalLink>

      <CardContainer>
        <Card>
          <Title>Stack by yourself</Title>
          <OptionBenefit>Interact with the contract directly</OptionBenefit>
          <OptionBenefit>
            Minimum required to stack{' '}
            {toHumanReadableStx(poxInfo?.paddedMinimumStackingAmountMicroStx || 0)}
          </OptionBenefit>
          <OptionBenefit>You choose a set duration</OptionBenefit>
          <Flex alignItems="center">
            <OptionButton
              onClick={() => history.push(routes.STACKING)}
              isDisabled={!meetsMinThreshold}
            >
              Continue
            </OptionButton>
            {!meetsMinThreshold && <InsufficientStackingBalanceWarning />}
          </Flex>
        </Card>

        <Card ml={[null, null, 'loose']} mt={['loose', null, 'unset']}>
          <Title>Delegate</Title>
          <OptionBenefit>A service stacks on your behalf</OptionBenefit>
          <OptionBenefit>Stack in with small sums</OptionBenefit>
          <OptionBenefit>Indefinite until you cancel</OptionBenefit>
          <Flex alignItems="center">
            <OptionButton
              onClick={() => history.push(routes.DELEGATED_STACKING)}
              isDisabled={!sufficientBalanceToCoverFee}
            >
              Continue
            </OptionButton>
            {!sufficientBalanceToCoverFee && <InsufficientStackingBalanceWarning />}
          </Flex>
        </Card>
      </CardContainer>
    </Layout>
  );
};
