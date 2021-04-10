import React, { FC } from 'react';
import { Flex, Box, Text, color } from '@stacks/ui';
import { useDispatch, useSelector } from 'react-redux';

import { useDelegationStatus } from '@hooks/use-delegation-status';
import { useCalculateFee } from '@hooks/use-calculate-fee';
import { useBalance } from '@hooks/use-balance';
import { isRevokingDelegationTx, truncateMiddle } from '@utils/tx-utils';
import { toHumanReadableStx } from '@utils/unit-convert';
import { DelegatedIcon } from '@components/icons/delegated-icon';
import { selectPoxInfo } from '@store/stacking';
import { homeActions } from '@store/home/home.reducer';
import { REVOKE_DELEGATION_TX_SIZE_BYTES } from '@constants/index';
import { ErrorLabel } from '@components/error-label';
import { ErrorText } from '@components/error-text';
import { useMempool } from '@hooks/use-mempool';

export const DelegationCard: FC = () => {
  const dispatch = useDispatch();
  const { outboundMempoolTxs } = useMempool();
  const delegationStatus = useDelegationStatus();
  const poxInfo = useSelector(selectPoxInfo);

  const hasPendingRevokeCall = outboundMempoolTxs.some(tx =>
    isRevokingDelegationTx(tx, poxInfo?.contract_id)
  );

  const balance = useBalance();
  const calculateFee = useCalculateFee();

  const hasSufficientBalanceToCoverFee = balance.availableBalance.isGreaterThanOrEqualTo(
    calculateFee(REVOKE_DELEGATION_TX_SIZE_BYTES)
  );

  if (!delegationStatus.delegated) return null;

  return (
    <Flex
      flexDirection="column"
      mt="extra-loose"
      borderRadius="8px"
      boxShadow="0px 1px 2px rgba(0, 0, 0, 0.04);"
      border={`1px solid ${color('border')}`}
      minHeight="180px"
    >
      <Box>
        <Flex mt="loose" justifyContent="center">
          <DelegatedIcon size="44px" />
        </Flex>
        <Text
          display="block"
          color={color('text-caption')}
          textStyle="caption"
          mt="tight"
          textAlign="center"
        >
          You've delegated up to
        </Text>
        <Flex justifyContent="center" mt="tight">
          <Text textStyle="body.large.medium" fontSize="24px">
            {toHumanReadableStx(delegationStatus.amountMicroStx.toString())}
          </Text>
        </Flex>
        <Box mr="2px">
          <Flex flexDirection="column" alignItems="center" mt="base-tight" mb="base">
            <Text textStyle="caption" color={color('text-caption')}>
              Delegated to
            </Text>
            <Text fontSize="13px" mt="tight" color={color('text-title')}>
              {truncateMiddle(delegationStatus.delegatedTo, 6)}
            </Text>
            {delegationStatus.deadDelegation && (
              <Flex flexDirection="column" alignItems="center" mt="base">
                <ErrorLabel mt="1px" px="loose">
                  <ErrorText>
                    Your delegation has expired. Your pool is no longer able to stack on your
                    behalf. Revoke your delegation and reinitiate if you wish to continue Stacking.
                  </ErrorText>
                </ErrorLabel>
              </Flex>
            )}
          </Flex>
        </Box>
        <Box borderTop={`1px solid ${color('border')}`} py="extra-tight" px="extra-tight">
          {hasSufficientBalanceToCoverFee ? (
            <Text
              as="button"
              border={0}
              textStyle="body.small"
              color={color('text-body')}
              pointerEvents={
                hasPendingRevokeCall || !hasSufficientBalanceToCoverFee ? 'none' : 'all'
              }
              cursor={
                hasPendingRevokeCall || !hasSufficientBalanceToCoverFee ? 'not-allowed' : 'unset'
              }
              onClick={() => dispatch(homeActions.openRevokeDelegationModal())}
            >
              {hasPendingRevokeCall ? 'Currently revoking STX' : 'Revoke delegation'}
            </Text>
          ) : (
            <Text
              mx="base-loose"
              my="tight"
              textStyle="caption"
              color={color('text-caption')}
              lineHeight="18px"
              display="block"
            >
              You don't have enough unlocked STX to cover the transaction fee needed to revoke your
              delegation. Please deposit a small amount of STX or wait for any locked STX to unlock
              if you wish to revoke delegation.
            </Text>
          )}
        </Box>
      </Box>
    </Flex>
  );
};
