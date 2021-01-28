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

import { StackingLayout } from '../components/stacking-layout';
import { StackingFormContainer } from '../components/stacking-form-container';
import { ChooseBtcAddressStep } from './components/choose-btc-address';
import { useStackingFormStep } from '../utils/use-stacking-form-step';

import { DirectStackingInfoCard } from './components/direct-stacking-info-card';
import { DirectStackingIntro } from './components/direct-stacking-intro';
import { ChooseCycleStep } from './components/choose-cycles';
import { ChooseDirectStackingAmountStep } from './components/choose-direct-stacking-amount';
import { ConfirmAndLockStep } from './components/confirm-and-lock';

enum StackingStep {
  ChooseAmount = 'Choose an amount',
  ChooseCycles = 'Choose your duration',
  ChooseBtcAddress = 'Add your Bitcoin address',
}

const cyclesWithDefault = (numCycles: null | number) => numCycles ?? 1;

export const DirectStacking: FC = () => {
  useBackButton(routes.CHOOSE_STACKING_METHOD);

  const [amount, setAmount] = useState<BigNumber | null>(null);
  const [cycles, setCycles] = useState<number | null>(null);
  const [btcAddress, setBtcAddress] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const steps = useStackingFormStep<StackingStep>({
    [StackingStep.ChooseAmount]: amount !== null,
    [StackingStep.ChooseCycles]: cycles !== null,
    [StackingStep.ChooseBtcAddress]: btcAddress !== null,
  });

  const { stackingCycleDuration, nextCycleInfo, poxInfo } = useSelector((state: RootState) => ({
    walletType: selectWalletType(state),
    activeNode: selectActiveNodeApi(state),
    stackingCycleDuration: selectEstimatedStackingDuration(cyclesWithDefault(cycles))(state),
    nextCycleInfo: selectNextCycleInfo(state),
    poxInfo: selectPoxInfo(state),
  }));

  if (nextCycleInfo === null || poxInfo === null) return null;

  const stackingIntro = (
    <DirectStackingIntro timeUntilNextCycle={nextCycleInfo.formattedTimeToNextCycle} />
  );

  const stackingInfoCard = (
    <DirectStackingInfoCard
      cycles={cyclesWithDefault(cycles)}
      balance={amount}
      startDate={nextCycleInfo.nextCycleStartingAt}
      blocksPerCycle={poxInfo.reward_cycle_length}
      duration={stackingCycleDuration}
    />
  );

  const stackingForm = (
    <StackingFormContainer>
      <ChooseDirectStackingAmountStep
        title={StackingStep.ChooseAmount}
        description="Choose how much of your STX you’d like to lock. The BTC you earn will be proportional to the amount locked."
        isComplete={steps.getIsComplete(StackingStep.ChooseAmount)}
        state={steps.getView(StackingStep.ChooseAmount)}
        value={amount}
        minimumAmountToStack={poxInfo.paddedMinimumStackingAmountMicroStx}
        onEdit={() => steps.open(StackingStep.ChooseAmount)}
        onComplete={amount => (setAmount(amount), steps.close(StackingStep.ChooseAmount))}
      />
      <ChooseCycleStep
        title={StackingStep.ChooseCycles}
        cycles={cyclesWithDefault(cycles)}
        isComplete={steps.getIsComplete(StackingStep.ChooseCycles)}
        state={steps.getView(StackingStep.ChooseCycles)}
        onEdit={() => steps.open(StackingStep.ChooseCycles)}
        onComplete={cycles => (setCycles(cycles), steps.close(StackingStep.ChooseCycles))}
        onUpdate={cycle => setCycles(cycle)}
      />
      <ChooseBtcAddressStep
        title={StackingStep.ChooseBtcAddress}
        description="Choose the address where you’d like to receive Bitcoin."
        value={btcAddress || undefined}
        isComplete={steps.getIsComplete(StackingStep.ChooseBtcAddress)}
        state={steps.getView(StackingStep.ChooseBtcAddress)}
        onEdit={() => steps.open(StackingStep.ChooseBtcAddress)}
        onComplete={address => (setBtcAddress(address), steps.close(StackingStep.ChooseBtcAddress))}
      />
      <ConfirmAndLockStep
        title="Confirm and lock"
        formComplete={steps.allComplete}
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
          numCycles={cyclesWithDefault(cycles)}
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
