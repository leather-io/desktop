import React from "react";
import { Flex, Type, Card, Button } from "blockstack-ui/dist";
import { Label } from "@components/field";
import { satoshisToBtc } from "@utils/utils";
import { selectWalletBitcoinBalance } from "@stores/selectors/wallet";
import { doBroadcastTransaction } from "@stores/actions/wallet";
import { connect } from "react-redux";
import { TopSection } from "@containers/modals/withdraw/common";

const mapStateToProps = state => ({
  balance: selectWalletBitcoinBalance(state)
});
const mapDispatchToProps = {
  doBroadcastBTCTransaction: doBroadcastTransaction
};
export const ConfirmScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(
  ({
    rawTx,
    balance,
    recipient,
    handleBroadcastTx,
    doBroadcastBTCTransaction,
    processing
  }) => {
    const { fee } = rawTx;
    return (
      <>
        <TopSection>
          <Card p={0} width={1}>
            <Flex flexGrow={1}>
              <Flex
                alignItems="center"
                p={4}
                borderRight={1}
                borderColor="blue.mid"
                width="50%"
              >
                <Type fontSize={3}>Please confirm your transaction.</Type>
              </Flex>
              <Flex p={4} flexDirection="column">
                <Label>Amount to withdraw</Label>
                <Type fontSize={4}>{satoshisToBtc(balance - fee)} STX</Type>
                <Label pt={3}>Fee</Label>
                <Type>{satoshisToBtc(fee)} BTC</Type>
                <Label pt={3}>Recipient</Label>
                <Type>{recipient}</Type>
              </Flex>
            </Flex>
          </Card>
        </TopSection>
        <Flex justifyContent="center" py={4} width={1}>
          <Button
            style={processing ? { pointerEvents: "none" } : undefined}
            onClick={
              // eslint-disable-next-line no-nested-ternary
              processing
                ? () => null
                : () => handleBroadcastTx(doBroadcastBTCTransaction)
            }
          >
            {// eslint-disable-next-line no-nested-ternary
            processing ? "Processing..." : "Confirm withdraw"}
          </Button>
        </Flex>
      </>
    );
  }
);
