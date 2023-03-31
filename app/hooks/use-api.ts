import { Api } from '@api/api';
import { selectActiveNodeApi } from '@store/stacks-node';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

export function useApi() {
  const activeNode = useSelector(selectActiveNodeApi);
  return useMemo(() => new Api(activeNode.url), [activeNode.url]);
}
