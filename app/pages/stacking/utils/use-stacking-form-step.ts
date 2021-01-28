import { useCallback, useState } from 'react';
import { mapObjIndexed } from 'ramda';

export type StackingStepView = 'open' | 'closed';

/**
 * Accepts an object, keyed by form step, where the
 * property describes when that step is complete.
 * The step being `closed` is implicitly required for being complete
 */
export function useStackingFormStep<T>(stepComplete: Record<string, boolean>) {
  const keys = Object.keys(stepComplete);

  const [stepState, setStepState] = useState(() =>
    keys.reduce((acc, val) => {
      (acc as any)[val as any] = val === keys[0] ? 'open' : 'closed';
      return acc;
    }, {})
  );

  const update = useCallback(
    (step: string, to: StackingStepView) => {
      const stepIndex = keys.indexOf(step);
      if (to === 'closed' && stepIndex !== keys.length - 1) {
        setStepState(state => ({ ...state, [keys[stepIndex + 1]]: 'open' }));
      }
      setStepState(state => ({ ...state, [step]: to }));
    },
    [keys]
  );

  const open = useCallback((step: T) => update((step as unknown) as string, 'open'), [update]);
  const close = useCallback((step: T) => update((step as unknown) as string, 'closed'), [update]);

  const getView = (step: T) => (stepState as any)[step];

  const stepCompleteMap = mapObjIndexed(
    (val, stepKey) => Boolean(val && getView((stepKey as unknown) as T) === 'closed'),
    stepComplete
  );

  const getIsComplete = (step: T) => (stepCompleteMap as any)[step];

  const allComplete = Object.values(stepCompleteMap).every(value => value);

  return {
    stepState,
    getView,
    getIsComplete,
    open,
    close,
    stepCompleteMap,
    allComplete,
  };
}
