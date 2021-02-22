import React, { FC, useState } from 'react';
import { BigNumber } from 'bignumber.js';

import { useBackButton } from '@hooks/use-back-url';
import routes from '@constants/routes.json';
import { DelegatedStackingModal } from '@modals/delegated-stacking/delegated-stacking-modal';

import { StackingLayout } from '../components/stacking-layout';
import { StackingFormContainer } from '../components/stacking-form-container';
import { useStackingFormStep } from '../utils/use-stacking-form-step';

import { StackingDelegationIntro } from './components/stacking-delegated-intro';
import { DelegatedStackingInfoCard } from './components/delegated-stacking-info-card';
import { ConfirmAndDelegateStep } from './components/confirm-and-delegate';
import { ChooseDelegatedStackingAmountStep } from './components/choose-delegated-stacking-amount';
import { ChooseDelegateeStxAddressStep } from './components/choose-delegatee-stx-address';

enum DelegateStep {
  ChooseDelegateeAddress = 'ChooseDelegateeAddress',
  ChooseAmount = 'ChooseAmount',
}

export const StackingDelegation: FC = () => {
  useBackButton(routes.CHOOSE_STACKING_METHOD);

  const [amount, setAmount] = useState<BigNumber | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [delegateeAddress, setDelegateeAddress] = useState<string | null>(null);

  const steps = useStackingFormStep<DelegateStep>({
    [DelegateStep.ChooseDelegateeAddress]: delegateeAddress !== null,
    [DelegateStep.ChooseAmount]: amount !== null,
  });

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
          onClose={() => setModalOpen(false)}
        />
      )}
      <StackingLayout
        intro={<StackingDelegationIntro />}
        stackingInfoCard={
          <DelegatedStackingInfoCard delegateeAddress={delegateeAddress} balance={amount} />
        }
        stackingForm={stackingForm}
      />
    </>
  );
};
