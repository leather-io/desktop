import React, { FC, useState, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { BigNumber } from 'bignumber.js';

import { DelegationType } from '@models';
import { RootState } from '@store/index';
import routes from '@constants/routes.json';
import { useBackButton } from '@hooks/use-back-url';
import { DelegatedStackingModal } from '@modals/delegated-stacking/delegated-stacking-modal';

import { StackingLayout } from '../components/stacking-layout';
import { StackingFormContainer } from '../components/stacking-form-container';
import { useStackingFormStep } from '../utils/use-stacking-form-step';

import { StackingDelegationIntro } from './components/stacking-delegated-intro';
import { DelegatedStackingInfoCard } from './components/delegated-stacking-info-card';
import { ConfirmAndDelegateStep } from './components/confirm-and-delegate';
import { ChooseDelegatedStackingAmountStep } from './components/choose-delegated-stacking-amount';
import { ChooseDelegateeStxAddressStep } from './components/choose-delegatee-stx-address';
import { ChooseMembershipDurationStep } from './components/choose-membership-duration';
import { selectPoxInfo } from '@store/stacking';
import { calculateUntilBurnHeightBlockFromCycles } from '@utils/calculate-burn-height';

enum DelegateStep {
  ChooseDelegateeAddress = 'ChooseDelegateeAddress',
  ChooseAmount = 'ChooseAmount',
  ChooseDuration = 'ChooseDuration',
}

export const StackingDelegation: FC = () => {
  useBackButton(routes.CHOOSE_STACKING_METHOD);

  const [amount, setAmount] = useState<BigNumber | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [delegateeAddress, setDelegateeAddress] = useState<string | null>(null);
  const [durationInCycles, setDurationInCycles] = useState<number | null>(null);
  const [delegationType, setDelegationType] = useState<DelegationType | null>(null);

  const { poxInfo } = useSelector((state: RootState) => ({
    poxInfo: selectPoxInfo(state),
  }));

  const steps = useStackingFormStep<DelegateStep>({
    [DelegateStep.ChooseDelegateeAddress]: delegateeAddress !== null,
    [DelegateStep.ChooseAmount]: amount !== null,
    [DelegateStep.ChooseDuration]: durationInCycles !== null,
  });

  const cyclesToUntilBurnBlockHeight = useCallback(
    (cycles: number | null) => {
      if (!poxInfo) throw new Error('`poxInfo` not defined');
      if (!cycles) return;
      return calculateUntilBurnHeightBlockFromCycles({
        cycles,
        rewardCycleLength: poxInfo.reward_cycle_length,
        currentCycleId: poxInfo.reward_cycle_id,
        genesisBurnBlockHeight: poxInfo.first_burnchain_block_height,
      });
    },
    [poxInfo]
  );

  const durationValue = useMemo(() => {
    if (delegationType === 'indefinite') return 'Indefinite';
    if (delegationType === 'limited')
      return `${String(durationInCycles)} cycle${durationInCycles !== 1 ? 's' : ''}`;
    return;
  }, [delegationType, durationInCycles]);

  const stackingForm = (
    <StackingFormContainer>
      <ChooseDelegateeStxAddressStep
        title="Choose delegatee's address"
        description="Enter the STX address shared with you by your chosen delegatee"
        isComplete={steps.getIsComplete(DelegateStep.ChooseDelegateeAddress)}
        value={delegateeAddress ?? undefined}
        state={steps.getView(DelegateStep.ChooseDelegateeAddress)}
        onEdit={() => steps.open(DelegateStep.ChooseDelegateeAddress)}
        onComplete={address => (
          setDelegateeAddress(address), steps.close(DelegateStep.ChooseDelegateeAddress)
        )}
      />
      <ChooseDelegatedStackingAmountStep
        title="Choose an amount"
        description="Choose how much of your STX you’d like to delegate. This can be more than your current balance. Your delegatee may require you to delegate a minimum amount."
        isComplete={steps.getIsComplete(DelegateStep.ChooseAmount)}
        state={steps.getView(DelegateStep.ChooseAmount)}
        value={amount}
        onEdit={() => steps.open(DelegateStep.ChooseAmount)}
        onComplete={amount => (setAmount(amount), steps.close(DelegateStep.ChooseAmount))}
      />
      <ChooseMembershipDurationStep
        title="Choose duration"
        description=""
        isComplete={steps.getIsComplete(DelegateStep.ChooseDuration)}
        value={
          delegationType === 'indefinite'
            ? 'Indefinite'
            : `${String(durationInCycles)} cycle${durationInCycles !== 1 ? 's' : ''}`
        }
        state={steps.getView(DelegateStep.ChooseDuration)}
        onEdit={() => steps.open(DelegateStep.ChooseDuration)}
        onComplete={({ duration, delegationType }) => {
          setDurationInCycles(duration);
          setDelegationType(delegationType);
          steps.close(DelegateStep.ChooseDuration);
        }}
      />
      <ConfirmAndDelegateStep
        id="Confirm and Delegate"
        formComplete={steps.allComplete}
        onConfirmAndDelegate={() => setModalOpen(true)}
      />
    </StackingFormContainer>
  );

  return (
    <>
      {modalOpen && amount && delegateeAddress && (
        <DelegatedStackingModal
          delegateeStxAddress={delegateeAddress}
          amountToStack={amount}
          burnHeight={cyclesToUntilBurnBlockHeight(durationInCycles)}
          onClose={() => setModalOpen(false)}
        />
      )}
      <StackingLayout
        intro={<StackingDelegationIntro />}
        stackingInfoCard={
          <DelegatedStackingInfoCard
            delegateeAddress={delegateeAddress}
            balance={amount}
            durationInCycles={durationInCycles}
            delegationType={delegationType}
            burnHeight={cyclesToUntilBurnBlockHeight(durationInCycles)}
          />
        }
        stackingForm={stackingForm}
      />
    </>
  );
};
