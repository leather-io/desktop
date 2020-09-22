import React from "react";
import { Flex, Type, Input, Button } from "blockstack-ui/dist";
import { satoshisToBtc } from "@utils/utils";
import { doClearError } from "@stores/actions/wallet";
import { WALLET_TYPES } from "@stores/reducers/wallet";
import {
  selectWalletBitcoinAddress,
  selectWalletBitcoinBalance,
  selectWalletType
} from "@stores/selectors/wallet";
import { connect } from "react-redux";
import {
  TopSection,
  BottomSection,
  ErrorMessage
} from "@containers/modals/withdraw/common";
import { SCREENS } from "@containers/modals/withdraw-btc";
import { btcAddressToStacksAddress } from "stacks-utils";

const mapPropsToState = state => ({
  sender: selectWalletBitcoinAddress(state),
  balance: selectWalletBitcoinBalance(state),
  walletType: selectWalletType(state)
});

export const InitialScreen = connect(
  mapPropsToState,
  { clearErrors: doClearError }
)(
  ({
    balance,
    walletType,
    navigate,
    clearErrors,
    recipient,
    handleRecipientChange,
    setErrors,
    errors
  }) => {
    const handleSubmit = () => {
      clearErrors();
      setErrors("btcAddress", undefined);
      try {
        const stacksAddress = btcAddressToStacksAddress(recipient);
        if (stacksAddress) {
          navigate(
            walletType === WALLET_TYPES.SOFTWARE
              ? SCREENS.seed
              : SCREENS.hardware
          );
        }
      } catch (e) {
        console.log(e);
        setErrors("btcAddress", "Invalid BTC address, please try again.");
      }
    };

    return (
      <>
        <TopSection>
          <Type fontSize={4} lineHeight={1.5}>
            Enter a Bitcoin address to withdraw {satoshisToBtc(balance)} BTC
            from the Stacks Wallet.
          </Type>
        </TopSection>
        <BottomSection>
          <Input
            placeholder="Enter a BTC address"
            width="100%"
            flexGrow={1}
            value={recipient}
            onChange={e => {
              const address = e.target.value;
              handleRecipientChange(address);
            }}
          />
          {errors.btcAddress ? (
            <ErrorMessage>{errors.btcAddress}</ErrorMessage>
          ) : null}
          <Flex justifyContent="center" p={4} pb={0} width={1}>
            <Button onClick={() => handleSubmit()}>Withdraw BTC</Button>
          </Flex>
        </BottomSection>
      </>
    );
  }
);
