import React, { FC, useRef, useState } from 'react';

import { StackingModal } from '@modals/stacking/stacking-modal';
import { useBackButton } from '@hooks/use-back-url';
import routes from '@constants/routes.json';

import { StackingLayout } from './components/stacking-layout';
import { StackingInfoCard } from './components/stacking-info-card';
import { StackingFormContainer } from './components/stacking-form-container';
import { StackingIntro } from './components/stacking-intro';

import { ChooseCycleStep } from './step/choose-cycles';
import { ChooseBtcAddressStep } from './step/choose-btc-address';
import { ConfirmAndLockStep } from './step/confirm-and-lock';
import { useSelector } from 'react-redux';
import { RootState } from '@store/index';
import { selectWalletType } from '@store/keys';

enum Step {
  ChooseCycles = 'Choose your duration',
  ChooseBtcAddress = 'Add your Bitcoin address',
  ConfirmAndLock = 'Confirm and lock',
}

type StepState = 'incomplete' | 'complete' | null;

export const Stacking: FC = () => {
  useBackButton(routes.HOME);

  const [cycles, setCycles] = useState(1);
  const [btcAddress, setBtcAddress] = useState<string | null>(null);

  const [stepConfirmation, setStepConfirmation] = useState<Record<Step, StepState>>({
    [Step.ChooseCycles]: 'incomplete',
    [Step.ChooseBtcAddress]: 'incomplete',
    [Step.ConfirmAndLock]: null,
  });

  const { walletType } = useSelector((state: RootState) => ({
    walletType: selectWalletType(state),
  }));

  const isComplete = (step: Step) => stepConfirmation[step] === 'complete';

  const updateStep = (step: Step, to: StepState) =>
    setStepConfirmation(state => ({ ...state, [step]: to }));

  const dateRef = useRef(new Date());

  const formComplete =
    stepConfirmation[Step.ChooseCycles] === 'complete' &&
    stepConfirmation[Step.ChooseBtcAddress] === 'complete' &&
    !!btcAddress;

  const stackingInfoCard = (
    <StackingInfoCard cycles={cycles} startDate={dateRef.current} duration="12–19 days" />
  );

  const stackingForm = (
    <StackingFormContainer>
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
        isComplete={isComplete(Step.ChooseBtcAddress)}
        onEdit={() => updateStep(Step.ChooseBtcAddress, 'incomplete')}
        onComplete={address => (
          setBtcAddress(address), updateStep(Step.ChooseBtcAddress, 'complete')
        )}
      />
      <ConfirmAndLockStep
        id={Step.ConfirmAndLock}
        formComplete={formComplete}
        onConfirmAndLock={() => setModalOpen(true)}
      />
    </StackingFormContainer>
  );

  return (
    <>
      {modalOpen && <StackingModal walletType={walletType} onClose={() => setModalOpen(false)} />}
      <StackingLayout
        intro={<StackingIntro />}
        stackingInfoCard={stackingInfoCard}
        stackingForm={stackingForm}
      />
    </>
  );
};
