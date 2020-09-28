import React from "react";
import { Type, Flex, Button } from "blockstack-ui";
import { HardwareSteps } from "@containers/hardware-steps";
import { ledgerSteps } from "@screens/onboarding/hardware-wallet/ledger";
import { trezorSteps } from "@screens/onboarding/hardware-wallet/trezor";
import { WALLET_TYPES } from "@stores/reducers/wallet";
import { connect } from "react-redux";

import {
  selectWalletBitcoinBalance,
  selectWalletType,
  selectWalletBitcoinAddress,
  selectWalletError
} from "@stores/selectors/wallet";
import {
  signBTCTransaction,
  doBroadcastTransaction,
  doClearError
} from "@stores/actions/wallet";

const mapStateToProps = state => ({
  sender: selectWalletBitcoinAddress(state),
  balance: selectWalletBitcoinBalance(state),
  walletType: selectWalletType(state),
  error: selectWalletError(state)
});

const mapDispatchToProps = {
  doSignBTCTransaction: signBTCTransaction,
  doBroadcastBTCTransaction: doBroadcastTransaction,
  clearErrors: doClearError
};

export const HardwareScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(
  ({
    walletType,
    balance,
    sender,
    processing,
    handleSignTransaction,
    doSignBTCTransaction,
    doBroadcastBTCTransaction
  }) => {
    const handleSubmit = async () => {
      const reduxValues = { walletType, balance, sender };
      await handleSignTransaction(
        doSignBTCTransaction,
        doBroadcastBTCTransaction,
        reduxValues
      );
    };
    return (
      <Flex flexDirection="column" alignItems="center" py={4}>
        <Type pb={6} fontSize={4}>
          Connect your{" "}
          {walletType === WALLET_TYPES.TREZOR ? "Trezor" : "Ledger"}
        </Type>
        <HardwareSteps
          steps={walletType === WALLET_TYPES.TREZOR ? trezorSteps : ledgerSteps}
        >
          {({ next, hasNext }) => (
            <Flex pt={4}>
              <Button
                style={processing ? { pointerEvents: "none" } : undefined}
                onClick={
                  // eslint-disable-next-line no-nested-ternary
                  processing
                    ? () => null
                    : hasNext
                    ? () => next()
                    : () => handleSubmit()
                }
              >
                {// eslint-disable-next-line no-nested-ternary
                processing ? "Signing..." : hasNext ? "Next" : "Sign transaction"}
              </Button>
            </Flex>
          )}
        </HardwareSteps>
      </Flex>
    );
  }
);
