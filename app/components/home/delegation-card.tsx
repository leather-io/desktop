import React, { FC } from 'react';
import { Flex, Box, Text, Button } from '@stacks/ui';
import { useDispatch, useSelector } from 'react-redux';

import { useDelegationStatus } from '@hooks/use-delegation-status';
import { useCalculateFee } from '@hooks/use-calculate-fee';
import { useBalance } from '@hooks/use-balance';
import { selectHasPendingRevokingDelegationCall } from '@store/stacking';
import { truncateMiddle } from '@utils/tx-utils';
import { toHumanReadableStx } from '@utils/unit-convert';
import { DelegatedIcon } from '@components/icons/delegated-icon';
import { homeActions } from '@store/home/home.reducer';
import { REVOKE_DELEGATION_TX_SIZE_BYTES } from '@constants/index';
import { ErrorLabel } from '@components/error-label';
import { ErrorText } from '@components/error-text';

export const DelegationCard: FC = () => {
  const dispatch = useDispatch();
  const delegationStatus = useDelegationStatus();
  const hasPendingRevokeCall = useSelector(selectHasPendingRevokingDelegationCall);

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
      border="1px solid #F0F0F5"
      minHeight="180px"
    >
      <Box>
        <Flex mt="loose" justifyContent="center">
          <DelegatedIcon size="44px" />
        </Flex>
        <Text display="block" color="ink.600" textStyle="caption" mt="tight" textAlign="center">
          You've delegated up to
        </Text>
        <Flex justifyContent="center" mt="tight">
          <Text textStyle="body.large.medium" fontSize="24px">
            {toHumanReadableStx(delegationStatus.amountMicroStx.toString())}
          </Text>
        </Flex>
        <Box mr="2px">
          <Flex flexDirection="column" alignItems="center" mt="base-tight" mb="base">
            <Text textStyle="caption" color="ink.600">
              Delegated to
            </Text>
            <Text fontSize="13px" mt="tight" color="ink">
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
        <Box borderTop="1px solid #F0F0F2" py="extra-tight" px="extra-tight">
          {hasSufficientBalanceToCoverFee ? (
            <Button
              variant="unstyled"
              textStyle="body.small"
              style={{ color: '#747478' }}
              isDisabled={hasPendingRevokeCall || !hasSufficientBalanceToCoverFee}
              onClick={() => dispatch(homeActions.openRevokeDelegationModal())}
            >
              {hasPendingRevokeCall ? 'Currently revoking STX' : 'Revoke delegation'}
            </Button>
          ) : (
            <Text
              mx="base-loose"
              my="tight"
              textStyle="caption"
              color="ink.600"
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
