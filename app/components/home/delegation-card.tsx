import React, { FC } from 'react';
import { Flex, Box, Text, Button } from '@blockstack/ui';
import { useDispatch, useSelector } from 'react-redux';

import { useDelegationStatus } from '@hooks/use-delegation-status';
import { selectHasPendingRevokingDelegationCall } from '@store/stacking';
import { truncateMiddle } from '@utils/tx-utils';
import { toHumanReadableStx } from '@utils/unit-convert';
import { DelegatedIcon } from '@components/icons/delegated-icon';
import { homeActions } from '@store/home/home.reducer';

export const DelegationCard: FC = () => {
  const delegationStatus = useDelegationStatus();
  const hasPendingRevokeCall = useSelector(selectHasPendingRevokingDelegationCall);
  const dispatch = useDispatch();

  if (!delegationStatus.delegated) return null;

  return (
    <>
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
            <Flex flexDirection="column" alignItems="center" mt="base-tight" mb="base-loose">
              <Text textStyle="caption" color="ink.600">
                Delegated to
              </Text>
              <Text fontSize="13px" mt="tight" color="ink">
                {truncateMiddle(delegationStatus.delegatedTo, 6)}
              </Text>
            </Flex>
          </Box>
        </Box>
        <Box borderTop="1px solid #F0F0F2" py="extra-tight" px="extra-tight">
          <Button
            variant="unstyled"
            textStyle="body.small"
            style={{ color: '#747478' }}
            isDisabled={hasPendingRevokeCall}
            onClick={() => dispatch(homeActions.openRevokeDelegationModal())}
          >
            {hasPendingRevokeCall ? 'Currently revoking STX' : 'Revoke delegation'}
          </Button>
        </Box>
      </Flex>
    </>
  );
};
