import { useCallback, useMemo, useRef } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import * as R from 'ramda';
import { MempoolTransaction } from '@blockstack/stacks-blockchain-api-types';
import { useSelector } from 'react-redux';
import { RootState } from '@store/index';
import { selectTransactionList } from '@store/transaction';
import { selectPendingTransactions } from '@store/pending-transaction';
import { useMempool } from '@hooks/use-mempool';
import { increment, decrement } from '@utils/mutate-numbers';

export function useTransactionList() {
  const { txs, pendingTxs } = useSelector((state: RootState) => ({
    txs: selectTransactionList(state),
    pendingTxs: selectPendingTransactions(state),
  }));

  const { mempoolTxs } = useMempool();
  const txIdEquals = useMemo(() => R.eqBy<MempoolTransaction>(tx => tx.tx_id), []);

  const dedupedPendingTxs = useMemo(() => {
    return R.uniqWith(txIdEquals, [...pendingTxs, ...mempoolTxs]).filter(
      mempoolTx => !txs.map(({ tx }) => tx.tx_id).includes(mempoolTx.tx_id)
    );
  }, [txIdEquals, pendingTxs, mempoolTxs, txs]);

  const focusedTxIdRef = useRef<string | null>(null);
  const txDomNodeRefMap = useRef<Record<string, HTMLButtonElement>>({});

  const focusTxDomNode = useCallback(
    (shift: (i: number) => number) => {
      const allTxs = [...dedupedPendingTxs, ...txs.map(({ tx }) => tx)];
      if (allTxs.length === 0) return;
      if (focusedTxIdRef.current === null) {
        const txId = allTxs[0].tx_id;
        focusedTxIdRef.current = txId;
        txDomNodeRefMap.current[txId].focus();
        return;
      }
      const nextIndex = shift(allTxs.findIndex(tx => tx.tx_id === focusedTxIdRef.current));
      const nextTx = allTxs[nextIndex];
      if (!nextTx) return;
      const domNode = txDomNodeRefMap.current[nextTx.tx_id];
      if (!domNode) return;
      domNode.focus();
    },
    [dedupedPendingTxs, txs]
  );

  useHotkeys('j', () => focusTxDomNode(increment), [txs, pendingTxs]);
  useHotkeys('k', () => focusTxDomNode(decrement), [txs, pendingTxs]);

  return {
    txs,
    pendingTxs: dedupedPendingTxs,
    txCount: txs.length + dedupedPendingTxs.length,
    focusTxDomNode,
    focusedTxIdRef,
    txDomNodeRefMap,
  };
}
