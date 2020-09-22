import React from "react";
import { Flex, Type, Input, Button } from "blockstack-ui/dist";

import {
  selectWalletBitcoinAddress,
  selectWalletBitcoinBalance,
  selectWalletType,
  selectWalletError
} from "@stores/selectors/wallet";
import { connect } from "react-redux";
import {
  TopSection,
  BottomSection,
  ErrorMessage
} from "@containers/modals/withdraw/common";
import { handleSeedValidation } from "@containers/modals/send/helpers";
import { Seed } from "@components/seed";
import { getSeedFromAnyString } from "@common/utils";
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

export const SeedScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(
  ({
    handleSeedChange,
    sender,
    seed,
    setState,
    processing,
    errors,
    error,
    balance,
    walletType,
    doSignBTCTransaction,
    doBroadcastBTCTransaction,
    clearErrors,
    handleSignTransaction
  }) => {
    const handleKeyPress = event => {
      if (event.key === " ") {
        event.preventDefault();
      }
    };

    const next = async () => {
      await handleSignTransaction(
        doSignBTCTransaction,
        doBroadcastBTCTransaction,
        {
          sender,
          balance,
          walletType
        }
      );
    };

    const handleSubmit = () => {
      clearErrors();
      handleSeedValidation(
        sender,
        { seedArray: Object.values(seed) },
        setState,
        next,
        "BTC"
      );
    };

    return (
      <>
        <TopSection>
          <Type fontSize={4} lineHeight={1.5}>
            Please enter your seed phrase to sign this transaction.
          </Type>
        </TopSection>
        <BottomSection>
          <Seed
            handleOnPaste={(event, index) => {
              if (index === 0) {
                const pasted = event.clipboardData.getData("Text");
                const split = getSeedFromAnyString(pasted);
                if (split.length === 24) {
                  split.forEach((word, i) => {
                    handleSeedChange(word, i);
                  });
                }
              }
            }}
            handleKeyPress={handleKeyPress}
            numWords={24}
            invert
            small
            values={seed}
            isInput
            handleChange={(event, index) => {
              if (event.target.value.includes(" ")) {
                return null;
              }
              handleSeedChange(event.target.value, index);
            }}
            mt="0px"
            mb="0px"
            p="0px"
          />
          {errors && errors.seed && <ErrorMessage>{errors.seed}</ErrorMessage>}
          {error && error.message && (
            <ErrorMessage>{error.message}</ErrorMessage>
          )}
          <Flex justifyContent="center" pt={4} width={1}>
            <Button isLoading={processing} onClick={() => handleSubmit()}>
              Continue
            </Button>
          </Flex>
        </BottomSection>
      </>
    );
  }
);
