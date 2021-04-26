import React, { FC, useState, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { BigNumber } from 'bignumber.js';

import { DelegationType } from '@models';
import { formatCycles } from '@utils/stacking';
import { RootState } from '@store/index';
import routes from '@constants/routes.json';
import { useBackButton } from '@hooks/use-back-url';
import { DelegatedStackingModal } from '@modals/delegated-stacking/delegated-stacking-modal';
import { selectPoxInfo } from '@store/stacking';
import { calculateUntilBurnHeightBlockFromCycles } from '@utils/calculate-burn-height';

import { StackingLayout } from '../components/stacking-layout';
import { StackingFormContainer } from '../components/stacking-form-container';
import { useStackingFormStep } from '../utils/use-stacking-form-step';

import { StackingDelegationIntro } from './components/stacking-delegated-intro';
import { DelegatedStackingInfoCard } from './components/delegated-stacking-info-card';
import { ConfirmAndDelegateStep } from './components/confirm-and-delegate';
import { ChooseDelegatedStackingAmountStep } from './components/choose-delegated-stacking-amount';
import { ChoosePoolStxAddressStep } from './components/choose-delegatee-stx-address';
import { ChooseMembershipDurationStep } from './components/choose-membership-duration';
import { StackingGuideCard } from '../components/stacking-guide-card';
import { StackingFormInfoPanel } from '../components/stacking-form-info-panel';

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
    [DelegateStep.ChooseDuration]: delegationType !== null,
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
    if (delegationType === 'limited' && durationInCycles !== null)
      return formatCycles(durationInCycles);
    return;
  }, [delegationType, durationInCycles]);

  const stackingForm = (
    <StackingFormContainer>
      <ChoosePoolStxAddressStep
        title="Pool address"
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
        description="Choose how much you’ll pool. Your pool may require a minimum."
        isComplete={steps.getIsComplete(DelegateStep.ChooseAmount)}
        state={steps.getView(DelegateStep.ChooseAmount)}
        value={amount}
        onEdit={() => steps.open(DelegateStep.ChooseAmount)}
        onComplete={amount => (setAmount(amount), steps.close(DelegateStep.ChooseAmount))}
      />
      <ChooseMembershipDurationStep
        title="Choose indefinite or limited cycles"
        isComplete={steps.getIsComplete(DelegateStep.ChooseDuration)}
        value={durationValue}
        state={steps.getView(DelegateStep.ChooseDuration)}
        onEdit={() => steps.open(DelegateStep.ChooseDuration)}
        onComplete={({ duration, delegationType }) => {
          setDurationInCycles(duration);
          setDelegationType(delegationType);
          steps.close(DelegateStep.ChooseDuration);
        }}
      />
      <ConfirmAndDelegateStep
        id="Confirm and pool"
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
        stackingInfoPanel={
          <StackingFormInfoPanel>
            <DelegatedStackingInfoCard
              delegateeAddress={delegateeAddress}
              balance={amount}
              durationInCycles={durationInCycles}
              delegationType={delegationType}
              burnHeight={cyclesToUntilBurnBlockHeight(durationInCycles)}
            />
            <StackingGuideCard mt="loose" />
          </StackingFormInfoPanel>
        }
        stackingForm={stackingForm}
      />
    </>
  );
};
