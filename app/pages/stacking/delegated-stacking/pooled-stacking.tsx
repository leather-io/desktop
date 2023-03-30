/* eslint-disable @typescript-eslint/no-unsafe-argument */
import React, { FC, useState, useCallback } from 'react';
import { Form, Formik } from 'formik';
import { useSelector } from 'react-redux';
import { BigNumber } from 'bignumber.js';
import * as yup from 'yup';

import { stxAmountSchema } from '@utils/validators/stx-amount-validator';
import { stxToMicroStx, toHumanReadableStx } from '@utils/unit-convert';
import { RootState } from '@store/index';
import routes from '@constants/routes.json';
import { useBackButton } from '@hooks/use-back-url';
import { DelegatedStackingModal } from '@modals/delegated-stacking/delegated-stacking-modal';
import { selectNextCycleInfo, selectPoxInfo } from '@store/stacking';
import { calculateUntilBurnHeightBlockFromCycles } from '@utils/calculate-burn-height';
import { stxPrincipalSchema } from '@utils/validators/stx-address-validator';
import {
  UI_IMPOSED_MAX_STACKING_AMOUNT_USTX,
  MIN_DELEGATED_STACKING_AMOUNT_USTX,
} from '@constants/index';

import { StackingLayout } from '../components/stacking-layout';
import { StackingFormContainer } from '../components/stacking-form-container';
import { StackingGuideCard } from '../components/stacking-guide-card';
import { StackingFormInfoPanel } from '../components/stacking-form-info-panel';

import { PooledStackingIntro } from './components/pooled-stacking-intro';
import { PoolingInfoCard } from './components/delegated-stacking-info-card';
import { ConfirmAndPoolAction } from './components/confirm-and-pool';
import { ChoosePoolingAmountField } from './components/choose-pooling-amount';
import { ChoosePoolStxAddressField } from './components/choose-pool-stx-address';
import { ChoosePoolingDurationField } from './components/choose-pooling-duration';
import { selectAddress } from '@store/keys';

type Nullable<T> = { [K in keyof T]: T[K] | null };

interface PoolingFormIndefiniteValues<N> {
  delegationType: 'indefinite';
  amount: N;
  stxAddress: string;
}
interface PoolingFormLimitedValues<N> {
  delegationType: 'limited';
  amount: N;
  stxAddress: string;
  cycles: number;
}
type AbstractPoolingFormValues<N> = PoolingFormIndefiniteValues<N> | PoolingFormLimitedValues<N>;

type EditingFormValues = AbstractPoolingFormValues<string | number>;
type CompletedFormValues = AbstractPoolingFormValues<BigNumber>;

const initialPoolingFormValues: Nullable<EditingFormValues> = {
  amount: '',
  stxAddress: '',
  delegationType: null,
  cycles: 1,
};

export const StackingDelegation: FC = () => {
  useBackButton(routes.CHOOSE_STACKING_METHOD);

  const [modalOpen, setModalOpen] = useState(false);
  const [formValues, setFormValues] = useState<null | CompletedFormValues>(null);

  const { poxInfo, address, nextCycleInfo } = useSelector((state: RootState) => ({
    poxInfo: selectPoxInfo(state),
    address: selectAddress(state),
    nextCycleInfo: selectNextCycleInfo(state),
  }));

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

  const validationSchema = yup.object().shape({
    stxAddress: stxPrincipalSchema().test({
      name: 'cannot-pool-to-yourself',
      message: 'Cannot pool to your own STX address',
      test(value: any) {
        if (value === null || value === undefined) return false;
        return value !== address;
      },
    }),
    amount: stxAmountSchema()
      .test({
        name: 'test-min-allowed-delegated-stacking',
        message: `You must delegate at least ${toHumanReadableStx(
          MIN_DELEGATED_STACKING_AMOUNT_USTX
        )}`,
        test(value: any) {
          if (value === null || value === undefined) return false;
          const enteredAmount = stxToMicroStx(value);
          return enteredAmount.isGreaterThanOrEqualTo(MIN_DELEGATED_STACKING_AMOUNT_USTX);
        },
      })
      .test({
        name: 'test-max-allowed-delegated-stacking',
        message: `You cannot delegate more than ${toHumanReadableStx(
          UI_IMPOSED_MAX_STACKING_AMOUNT_USTX
        )}`,
        test(value: any) {
          if (value === null || value === undefined) return false;
          const enteredAmount = stxToMicroStx(value);
          return enteredAmount.isLessThanOrEqualTo(UI_IMPOSED_MAX_STACKING_AMOUNT_USTX);
        },
      }),
    delegationType: yup.string().typeError(`Make sure to choose a duration you'd like to pool for`),
  });

  function handleSubmit(values: EditingFormValues) {
    setFormValues({ ...values, amount: stxToMicroStx(values.amount) });
    setModalOpen(true);
  }

  if (nextCycleInfo === null) return null;

  return (
    <>
      {modalOpen && formValues && (
        <DelegatedStackingModal
          delegateeStxAddress={formValues.stxAddress}
          amountToStack={formValues.amount}
          burnHeight={
            formValues.delegationType === 'limited'
              ? cyclesToUntilBurnBlockHeight(formValues.cycles)
              : undefined
          }
          onClose={() => setModalOpen(false)}
        />
      )}
      <Formik
        initialValues={initialPoolingFormValues as EditingFormValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {({ submitForm, values }) => (
          <StackingLayout
            intro={
              <PooledStackingIntro timeUntilNextCycle={nextCycleInfo.formattedTimeToNextCycle} />
            }
            stackingInfoPanel={
              <StackingFormInfoPanel>
                <PoolingInfoCard
                  poolStxAddress={values.stxAddress}
                  amount={values.amount}
                  durationInCycles={values.delegationType === 'limited' ? values.cycles : null}
                  delegationType={values.delegationType}
                  burnHeight={
                    values.delegationType === 'limited'
                      ? cyclesToUntilBurnBlockHeight(values.cycles)
                      : undefined
                  }
                />
                <StackingGuideCard mt="loose" />
              </StackingFormInfoPanel>
            }
            stackingForm={
              <Form>
                <StackingFormContainer>
                  <ChoosePoolStxAddressField />
                  <ChoosePoolingAmountField />
                  <ChoosePoolingDurationField />
                  <ConfirmAndPoolAction onConfirmAndPool={() => submitForm()} />
                </StackingFormContainer>
              </Form>
            }
          />
        )}
      </Formik>
    </>
  );
};
