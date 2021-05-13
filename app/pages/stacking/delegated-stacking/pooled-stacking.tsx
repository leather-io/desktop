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
import { stxAddressSchema } from '@utils/validators/stx-address-validator';
import {
  MAX_DELEGATED_STACKING_AMOUNT_USTX,
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

interface PoolingFormIndefiniteValues {
  delegationType: 'indefinite';
  amount: number;
  stxAddress: string;
}

interface PoolingFormLimitedValues {
  delegationType: 'limited';
  amount: string;
  stxAddress: string;
  cycles: number;
}

type PoolingFormValues = PoolingFormIndefiniteValues | PoolingFormLimitedValues;

const initialPoolingFormValues: Nullable<PoolingFormValues> = {
  amount: '',
  stxAddress: '',
  delegationType: null,
  cycles: 1,
};

export const StackingDelegation: FC = () => {
  useBackButton(routes.CHOOSE_STACKING_METHOD);

  const [modalOpen, setModalOpen] = useState(false);
  const [formValues, setFormValues] = useState<null | PoolingFormValues>(null);

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
    stxAddress: stxAddressSchema().test({
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
          MAX_DELEGATED_STACKING_AMOUNT_USTX.toString()
        )}`,
        test(value: any) {
          if (value === null || value === undefined) return false;
          const enteredAmount = stxToMicroStx(value);
          return enteredAmount.isLessThanOrEqualTo(MAX_DELEGATED_STACKING_AMOUNT_USTX);
        },
      }),
  });

  const handleSubmit = (values: PoolingFormValues) => {
    console.log(values);
    setFormValues(values);
    setModalOpen(true);
  };

  if (nextCycleInfo === null) return null;

  return (
    <>
      {modalOpen && formValues && formValues.amount && formValues.stxAddress && (
        <DelegatedStackingModal
          delegateeStxAddress={formValues.stxAddress}
          amountToStack={new BigNumber(formValues.amount)}
          burnHeight={
            formValues.delegationType === 'limited'
              ? cyclesToUntilBurnBlockHeight(formValues.cycles)
              : undefined
          }
          onClose={() => setModalOpen(false)}
        />
      )}
      <Formik
        initialValues={initialPoolingFormValues as PoolingFormValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        // remove this style of validation
        validate={({ delegationType }) => {
          if (delegationType === null) {
            return { delegationType: 'You must select a duration' };
          }
          return {};
        }}
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
