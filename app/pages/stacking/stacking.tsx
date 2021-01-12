import React, { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import { BigNumber } from 'bignumber.js';

import { StackingModal } from '@modals/stacking/stacking-modal';
import { useBackButton } from '@hooks/use-back-url';
import routes from '@constants/routes.json';
import { RootState } from '@store/index';
import { selectWalletType } from '@store/keys';
import { selectActiveNodeApi } from '@store/stacks-node';
import {
  selectEstimatedStackingDuration,
  selectNextCycleInfo,
  selectPoxInfo,
} from '@store/stacking';
import { selectAvailableBalance } from '@store/address';

import { StackingLayout } from './components/stacking-layout';
import { StackingInfoCard } from './components/stacking-info-card';
import { StackingFormContainer } from './components/stacking-form-container';
import { StackingIntro } from './components/stacking-intro';

import { ChooseCycleStep } from './step/choose-cycles';
import { ChooseAmountStep } from './step/choose-amount';
import { ChooseBtcAddressStep } from './step/choose-btc-address';
import { ConfirmAndLockStep } from './step/confirm-and-lock';

enum Step {
  ChooseAmount = 'Choose an amount',
  ChooseCycles = 'Choose your duration',
  ChooseBtcAddress = 'Add your Bitcoin address',
  ConfirmAndLock = 'Confirm and lock',
}

export type StackingStepState = 'open' | 'closed';

export const Stacking: FC = () => {
  useBackButton(routes.HOME);

  const [amount, setAmount] = useState<BigNumber | null>(null);
  const [cycles, setCycles] = useState<number | null>(null);
  const [btcAddress, setBtcAddress] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [stepState, setStepState] = useState<Record<Step, StackingStepState>>({
    [Step.ChooseAmount]: 'open',
    [Step.ChooseCycles]: 'closed',
    [Step.ChooseBtcAddress]: 'closed',
    [Step.ConfirmAndLock]: 'open',
  });

  const stepComplete = {
    [Step.ChooseAmount]: amount !== null && stepState[Step.ChooseAmount] === 'closed',
    [Step.ChooseCycles]: cycles !== null && stepState[Step.ChooseCycles] === 'closed',
    [Step.ChooseBtcAddress]: btcAddress !== null && stepState[Step.ChooseBtcAddress] === 'closed',
    [Step.ConfirmAndLock]: true,
  };

  const { stackingCycleDuration, availableBalance, nextCycleInfo, poxInfo } = useSelector(
    (state: RootState) => ({
      walletType: selectWalletType(state),
      activeNode: selectActiveNodeApi(state),
      stackingCycleDuration: selectEstimatedStackingDuration(cycles || 1)(state),
      availableBalance: selectAvailableBalance(state),
      nextCycleInfo: selectNextCycleInfo(state),
      poxInfo: selectPoxInfo(state),
    })
  );

  const updateStep = (step: Step, to: StackingStepState) => {
    if (step === Step.ChooseAmount && to === 'closed') {
      setStepState(state => ({ ...state, [Step.ChooseCycles]: 'open' }));
    }
    if (step === Step.ChooseCycles && to === 'closed') {
      setStepState(state => ({ ...state, [Step.ChooseBtcAddress]: 'open' }));
    }
    setStepState(state => ({ ...state, [step]: to }));
  };

  const formComplete =
    [Step.ChooseAmount, Step.ChooseCycles, Step.ChooseBtcAddress].every(
      value => stepComplete[value]
    ) && !!btcAddress;

  const balance = availableBalance === null ? new BigNumber(0) : new BigNumber(availableBalance);

  if (nextCycleInfo === null || poxInfo === null) return null;

  const stackingIntro = (
    <StackingIntro timeUntilNextCycle={nextCycleInfo.formattedTimeToNextCycle} />
  );

  const stackingInfoCard = (
    <StackingInfoCard
      cycles={cycles || 1}
      balance={amount}
      startDate={nextCycleInfo.nextCycleStartingAt}
      blocksPerCycle={poxInfo.reward_cycle_length}
      duration={stackingCycleDuration}
    />
  );

  const stackingForm = (
    <StackingFormContainer>
      <ChooseAmountStep
        id={Step.ChooseAmount}
        isComplete={stepComplete[Step.ChooseAmount]}
        state={stepState[Step.ChooseAmount]}
        value={amount}
        balance={balance}
        minimumAmountToStack={poxInfo.paddedMinimumStackingAmountMicroStx}
        onEdit={() => updateStep(Step.ChooseAmount, 'open')}
        onComplete={amount => (setAmount(amount), updateStep(Step.ChooseAmount, 'closed'))}
      />
      <ChooseCycleStep
        id={Step.ChooseCycles}
        cycles={cycles || 1}
        isComplete={stepComplete[Step.ChooseCycles]}
        state={stepState[Step.ChooseCycles]}
        onEdit={() => updateStep(Step.ChooseCycles, 'open')}
        onComplete={cycles => {
          setCycles(cycles);
          updateStep(Step.ChooseCycles, 'closed');
        }}
        onUpdate={cycle => setCycles(cycle)}
      />
      <ChooseBtcAddressStep
        id={Step.ChooseBtcAddress}
        value={btcAddress || undefined}
        isComplete={stepComplete[Step.ChooseBtcAddress]}
        state={stepState[Step.ChooseBtcAddress]}
        onEdit={() => updateStep(Step.ChooseBtcAddress, 'open')}
        onComplete={address => (
          setBtcAddress(address), updateStep(Step.ChooseBtcAddress, 'closed')
        )}
      />
      <ConfirmAndLockStep
        id={Step.ConfirmAndLock}
        formComplete={formComplete}
        estimatedDuration={stackingCycleDuration}
        timeUntilNextCycle={nextCycleInfo.formattedTimeToNextCycle}
        onConfirmAndLock={() => setModalOpen(true)}
      />
    </StackingFormContainer>
  );

  return (
    <>
      a
      {modalOpen && btcAddress && amount !== null && (
        <StackingModal
          onClose={() => setModalOpen(false)}
          amountToStack={amount}
          numCycles={cycles || 1}
          poxAddress={btcAddress}
        />
      )}
      <StackingLayout
        intro={stackingIntro}
        stackingInfoCard={stackingInfoCard}
        stackingForm={stackingForm}
      />
    </>
  );
};
