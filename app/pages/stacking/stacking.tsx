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

type StepState = 'incomplete' | 'complete' | null;

export const Stacking: FC = () => {
  useBackButton(routes.HOME);

  const [amount, setAmount] = useState<BigNumber | null>(null);
  const [cycles, setCycles] = useState(12);
  const [btcAddress, setBtcAddress] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [stepConfirmation, setStepConfirmation] = useState<Record<Step, StepState>>({
    [Step.ChooseAmount]: 'incomplete',
    [Step.ChooseCycles]: 'incomplete',
    [Step.ChooseBtcAddress]: 'incomplete',
    [Step.ConfirmAndLock]: null,
  });

  const { stackingCycleDuration, availableBalance, nextCycleInfo, poxInfo } = useSelector(
    (state: RootState) => ({
      walletType: selectWalletType(state),
      activeNode: selectActiveNodeApi(state),
      stackingCycleDuration: selectEstimatedStackingDuration(cycles)(state),
      availableBalance: selectAvailableBalance(state),
      nextCycleInfo: selectNextCycleInfo(state),
      poxInfo: selectPoxInfo(state),
    })
  );

  const updateStep = (step: Step, to: StepState) =>
    setStepConfirmation(state => ({ ...state, [step]: to }));

  const isComplete = (step: Step) => stepConfirmation[step] === 'complete';

  const formComplete =
    [Step.ChooseAmount, Step.ChooseCycles, Step.ChooseBtcAddress].every(isComplete) && !!btcAddress;

  const balance = availableBalance === null ? new BigNumber(0) : new BigNumber(availableBalance);

  if (nextCycleInfo === null || poxInfo === null) return null;

  const stackingIntro = (
    <StackingIntro timeUntilNextCycle={nextCycleInfo.formattedTimeToNextCycle} />
  );

  const stackingInfoCard = (
    <StackingInfoCard
      cycles={cycles}
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
        isComplete={isComplete(Step.ChooseAmount)}
        value={amount}
        balance={balance}
        minimumAmountToStack={poxInfo.paddedMinimumStackingAmountMicroStx}
        onEdit={() => updateStep(Step.ChooseAmount, 'incomplete')}
        onComplete={amount => (setAmount(amount), updateStep(Step.ChooseAmount, 'complete'))}
      />
      <ChooseCycleStep
        id={Step.ChooseCycles}
        cycles={cycles}
        isComplete={isComplete(Step.ChooseCycles)}
        onEdit={() => updateStep(Step.ChooseCycles, 'incomplete')}
        onComplete={() => updateStep(Step.ChooseCycles, 'complete')}
        onUpdate={cycle => setCycles(cycle)}
      />
      <ChooseBtcAddressStep
        id={Step.ChooseBtcAddress}
        value={btcAddress || undefined}
        isComplete={isComplete(Step.ChooseBtcAddress)}
        onEdit={() => updateStep(Step.ChooseBtcAddress, 'incomplete')}
        onComplete={address => (
          setBtcAddress(address), updateStep(Step.ChooseBtcAddress, 'complete')
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
      {modalOpen && btcAddress && amount !== null && (
        <StackingModal
          onClose={() => setModalOpen(false)}
          amountToStack={amount}
          numCycles={cycles}
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
