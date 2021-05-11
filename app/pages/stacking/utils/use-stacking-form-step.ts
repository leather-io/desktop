import { useState } from 'react';
import { mapObjIndexed } from 'ramda';

/**
 * Accepts an object, keyed by form step, where the
 * property describes when that step is complete.
 * The step being `closed` is implicitly required for being complete
 */
export function useStackingFormStep<T>(stepComplete: Record<string, boolean>) {
  const keys = Object.keys(stepComplete);

  const [stepState] = useState(() =>
    keys.reduce((acc, val) => {
      (acc as any)[val as any] = val === keys[0] ? 'open' : 'closed';
      return acc;
    }, {})
  );

  const stepCompleteMap = mapObjIndexed(val => Boolean(val), stepComplete);

  const getIsComplete = (step: T) => (stepCompleteMap as any)[step];

  const allComplete = Object.values(stepCompleteMap).every(value => value);

  return {
    stepState,
    getIsComplete,
    open,
    close,
    stepCompleteMap,
    allComplete,
  };
}
