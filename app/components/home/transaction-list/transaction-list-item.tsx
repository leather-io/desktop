import React, {
  FC,
  MutableRefObject,
  RefObject,
  useLayoutEffect,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import { useSelector } from 'react-redux';
import { useHover, useFocus } from 'use-events';
import { Box, Stack, Text } from '@blockstack/ui';
import { Transaction } from '@blockstack/stacks-blockchain-api-types';

import { getContractName, getTxTypeName } from '@stacks/ui-utils';
import { RootState } from '@store/index';
import { selectPoxInfo } from '@store/stacking';
import { capitalize } from '@utils/capitalize';
import { getStxTxDirection } from '@utils/get-stx-transfer-direction';
import { sumStxTxTotal } from '@utils/sum-stx-tx-total';
import { TransactionIcon, TransactionIconVariants } from './transaction-icon';
import { toHumanReadableStx } from '@utils/unit-convert';
import { makeExplorerTxLink } from '@utils/external-links';
import {
  getRecipientAddress,
  isStackingTx,
  isDelegateStxTx,
  isRevokingDelegationTx,
  isDelegatedStackingTx,
} from '@utils/tx-utils';

import {
  createTxListContextMenu,
  registerHandler,
  deregisterHandler,
} from './transaction-list-context-menu';
import { TransactionListItemContainer } from './transaction-list-item-container';

interface TransactionListItemProps {
  tx: Transaction;
  address: string;
  activeTxIdRef: MutableRefObject<any>;
  domNodeMapRef: MutableRefObject<any>;
  onSelectTx(txId: string): void;
}

export const TransactionListItem: FC<TransactionListItemProps> = props => {
  const { tx, address, onSelectTx, activeTxIdRef, domNodeMapRef } = props;
  const { poxInfo } = useSelector((state: RootState) => ({
    poxInfo: selectPoxInfo(state),
  }));

  const direction = getStxTxDirection(address, tx);

  const txFailed =
    tx.tx_status === 'abort_by_response' || tx.tx_status === 'abort_by_post_condition';

  const getTxIconVariant = useCallback((): TransactionIconVariants => {
    if (txFailed) {
      return 'failed';
    }
    if (tx.tx_type === 'token_transfer') {
      return direction;
    }
    if (isStackingTx(tx, poxInfo?.contract_id) || isDelegatedStackingTx(tx, poxInfo?.contract_id)) {
      return 'locked';
    }
    if (isDelegateStxTx(tx, poxInfo?.contract_id)) {
      return 'delegated';
    }
    if (isRevokingDelegationTx(tx, poxInfo?.contract_id)) {
      return 'revoked';
    }
    return 'default';
  }, [direction, poxInfo?.contract_id, tx, txFailed]);

  const transactionTitle = useCallback(() => {
    if (tx.tx_type === 'token_transfer') return capitalize(direction);
    if (isStackingTx(tx, poxInfo?.contract_id)) {
      if (tx.tx_status === 'pending') return 'Initiating Stacking';
      if (tx.tx_status === 'abort_by_response' || tx.tx_status === 'abort_by_post_condition')
        return 'Stacking initiation failed';
      return 'Stacking initiated successfully';
    }
    if (isDelegatedStackingTx(tx, poxInfo?.contract_id)) {
      return 'Delegator Stacked STX';
    }
    if (isDelegateStxTx(tx, poxInfo?.contract_id)) {
      if (tx.tx_status === 'pending') return 'Initiating delegation';
      if (tx.tx_status === 'abort_by_response' || tx.tx_status === 'abort_by_post_condition')
        return 'Failed to delegate STX';
      return 'Delegated STX';
    }
    if (isRevokingDelegationTx(tx, poxInfo?.contract_id)) {
      if (tx.tx_status === 'pending') return 'Initiating revocation';
      if (tx.tx_status === 'abort_by_response' || tx.tx_status === 'abort_by_post_condition')
        return 'Failed to revoke delegation';
      return 'Revoked STX';
    }
    if (tx.tx_type === 'smart_contract') {
      return getContractName(tx.smart_contract.contract_id);
    }
    return capitalize(tx.tx_type).replace('_', ' ');
  }, [direction, poxInfo?.contract_id, tx]);

  const sumPrefix = direction === 'sent' && !isStackingTx(tx, poxInfo?.contract_id) ? '−' : '';
  const memo =
    tx.tx_type === 'token_transfer' &&
    Buffer.from(
      tx.token_transfer.memo.replace('0x', '').replace(/^(0{2})+|(0{2})+$/g, ''),
      'hex'
    ).toString('utf8');
  const txDate = new Date(tx.burn_block_time_iso);
  const txDateShort = txDate.toLocaleString();

  const containerRef = useRef<HTMLButtonElement>(null);
  const [hovered, bindHover] = useHover();
  const [focused, bindFocus] = useFocus();

  useEffect(() => {
    if (containerRef.current !== null && domNodeMapRef !== null) {
      domNodeMapRef.current[tx.tx_id] = containerRef.current;
    }
  }, [domNodeMapRef, tx.tx_id]);

  if (focused && activeTxIdRef !== null) {
    activeTxIdRef.current = tx.tx_id;
  }

  const { current: copy } = useRef({
    txid: tx.tx_id,
    recipientAddress: getRecipientAddress(tx) || '',
    memo: memo || '',
    date: txDate && txDate.toISOString(),
    txDetails: JSON.stringify(tx, null, 2),
    explorerLink: makeExplorerTxLink(tx.tx_id),
  });

  useLayoutEffect(() => {
    const el = containerRef.current;
    const contextMenuHandler = (event: Event) => createTxListContextMenu(event, { tx, copy });
    registerHandler(el, contextMenuHandler);
    return () => deregisterHandler(el, contextMenuHandler);
  }, [tx, copy]);

  return (
    <TransactionListItemContainer
      // UI library bug where it is only considered HTMLDivElement
      // type casting here so type is correct elsewhere
      ref={(containerRef as unknown) as RefObject<HTMLDivElement>}
      onClick={() => onSelectTx(tx.tx_id)}
      focused={focused}
      hovered={hovered}
      txId={tx.tx_id}
      {...bindHover}
      {...bindFocus}
    >
      <TransactionIcon variant={getTxIconVariant()} mr="base-loose" />
      <Box flex={1}>
        <Text textStyle="body.large.medium" display="block">
          {transactionTitle()}
        </Text>
        <Stack isInline spacing="tight">
          <Text textStyle="body.small" color="ink.600">
            {getTxTypeName(tx)}
          </Text>
          <Text textStyle="body.small" color="ink.600">
            {txDateShort}
          </Text>
        </Stack>
      </Box>
      <Box textAlign="right">
        <Text
          textStyle="body.large"
          color="ink.900"
          title={`Fee: ${toHumanReadableStx(tx.fee_rate)}`}
          display="block"
        >
          {txFailed ? (
            <Text mr="tight" color="feedback.error" fontSize={0} fontWeight={500}>
              Failed
            </Text>
          ) : null}
          {sumPrefix +
            toHumanReadableStx(sumStxTxTotal(address, tx, poxInfo?.contract_id).toString())}
        </Text>
        <Text textStyle="body.small" color="ink.600">
          {memo}
        </Text>
      </Box>
    </TransactionListItemContainer>
  );
};
