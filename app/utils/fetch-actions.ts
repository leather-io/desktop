import { createAction } from '@reduxjs/toolkit';

export function generateFetchActions<F, T, E>(prefix: string, resource: string) {
  const actionPrefix = `${prefix}/${resource}`;
  const x = createAction<F>(actionPrefix);
  const start = createAction<T>(actionPrefix + '-done');
  const fail = createAction<E>(actionPrefix + '-fail');
  return [x, start, fail];
}
