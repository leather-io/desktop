import React, { FC, useMemo } from 'react';
import { Flex, Box, Text, color, Button } from '@stacks/ui';
import { useDispatch, useSelector } from 'react-redux';

import { useDelegationStatus } from '@hooks/use-delegation-status';
import { useCalculateFee } from '@hooks/use-calculate-fee';
import { useBalance } from '@hooks/use-balance';
import { isRevokingDelegationTx, truncateMiddle } from '@utils/tx-utils';
import { toHumanReadableStx } from '@utils/unit-convert';
import { selectPoxInfo, selectStackerInfo } from '@store/stacking';
import { homeActions } from '@store/home/home.reducer';
import { REVOKE_DELEGATION_TX_SIZE_BYTES } from '@constants/index';
import { useMempool } from '@hooks/use-mempool';
import pooledStackingImg from '@assets/images/pooled-stacking-swimming-pool.svg';
import {
  InfoCard,
  InfoCardGroup,
  InfoCardLabel as Label,
  InfoCardRow as Row,
  InfoCardSection as Section,
  InfoCardValue as Value,
} from '@components/info-card';
import { Hr } from '@components/hr';
import { IconBan } from '@tabler/icons';
import { Title } from '@components/title';

export const DelegationCard: FC = () => {
  const dispatch = useDispatch();
  const { outboundMempoolTxs } = useMempool();
  const delegationStatus = useDelegationStatus();
  const poxInfo = useSelector(selectPoxInfo);
  const stackerInfo = useSelector(selectStackerInfo);

  const hasPendingRevokeCall = outboundMempoolTxs.some(tx =>
    isRevokingDelegationTx(tx, poxInfo?.contract_id)
  );

  const balance = useBalance();
  const calculateFee = useCalculateFee();

  const revocationFee = useMemo(
    () => calculateFee(REVOKE_DELEGATION_TX_SIZE_BYTES),
    [calculateFee]
  );
  const hasSufficientBalanceToCoverFee =
    balance.availableBalance.isGreaterThanOrEqualTo(revocationFee);

  if (!delegationStatus.delegated) return null;

  return (
    <InfoCard minHeight="180px" mt="extra-loose" px={['loose', 'extra-loose']}>
      <Flex mt="loose">
        <img
          src={pooledStackingImg}
          alt="Colourful illustration of a diving board protruding out of a blue hole"
        />
      </Flex>

      {!delegationStatus.deadDelegation && (
        <>
          <Flex flexDirection="column" mt="base-loose" pb="base-loose">
            <Text textStyle="body.large.medium">You're pooling</Text>
            <Text
              fontSize="24px"
              mt="extra-tight"
              fontWeight={500}
              fontFamily="Open Sauce"
              letterSpacing="-0.02em"
            >
              {toHumanReadableStx(delegationStatus.amountMicroStx)}
            </Text>
          </Flex>
          <Hr />
          <InfoCardGroup my="loose">
            <Section>
              <Row>
                <Label>Status</Label>
                <Value
                  color={color(
                    stackerInfo?.isCurrentlyStacking ? 'feedback-success' : 'text-caption'
                  )}
                >
                  {stackerInfo?.isCurrentlyStacking ? 'Active' : 'Waiting on pool'}
                </Value>
              </Row>
              <Row>
                <Label>Type</Label>
                <Value>{delegationStatus.untilBurnHeight ? 'One time' : 'Indefinite'}</Value>
              </Row>
              <Row>
                <Label>Progress</Label>
                <Value>{stackerInfo?.stackingPercentage ?? 0}%</Value>
              </Row>
            </Section>

            <Section>
              <Row>
                <Label>Pool address</Label>
                <Value>{truncateMiddle(delegationStatus.delegatedTo, 6)}</Value>
              </Row>
            </Section>

            <Section>
              <Row>
                <Label>
                  {hasSufficientBalanceToCoverFee ? (
                    <Button
                      variant="link"
                      border={0}
                      color={color('text-caption')}
                      textStyle="body.small"
                      fontSize="16px"
                      pointerEvents={
                        hasPendingRevokeCall || !hasSufficientBalanceToCoverFee ? 'none' : 'all'
                      }
                      cursor={
                        hasPendingRevokeCall || !hasSufficientBalanceToCoverFee
                          ? 'not-allowed'
                          : 'unset'
                      }
                      onClick={() => dispatch(homeActions.openRevokeDelegationModal())}
                    >
                      <Box mr="extra-tight">
                        <IconBan size="14px" />
                      </Box>
                      {hasPendingRevokeCall ? 'Currently revoking STX' : 'Revoke delegation'}
                    </Button>
                  ) : (
                    <Text
                      textStyle="caption"
                      mb="tight"
                      color={color('text-caption')}
                      lineHeight="18px"
                      display="block"
                    >
                      You don't have enough unlocked STX to cover the transaction fee needed to
                      revoke your delegation. Please deposit a small amount of STX or wait for any
                      locked STX to unlock if you wish to revoke delegation.
                    </Text>
                  )}
                </Label>
              </Row>
            </Section>
          </InfoCardGroup>
        </>
      )}

      {delegationStatus.deadDelegation && (
        <Box mt="base" mb="loose">
          <Title fontSize="24px">You’ve finished pooling</Title>
          <Text>
            You pooled for 6 cycles. Revoke the pool’s permission to stack on your behalf to start
            stacking again.
          </Text>
          <Box color={color('text-caption')} mt="loose">
            Fees: <Text color={color('text-body')}>{toHumanReadableStx(revocationFee)}</Text>
          </Box>
          <Box>
            <Button onClick={() => dispatch(homeActions.openRevokeDelegationModal())} mt="loose">
              Revoke permission
            </Button>
          </Box>
        </Box>
      )}
    </InfoCard>
  );
};
