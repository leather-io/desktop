import React from "react";
import { Flex, Box, Type, Input, Button } from "blockstack-ui/dist";
import { Modal } from "@components/modal";
import { satoshisToBtc } from "@utils/utils";
import {
  signBTCTransaction,
  broadcastBtcTransaction,
  doClearError
} from "@stores/actions/wallet";
import { WALLET_TYPES } from "@stores/reducers/wallet";
import {
  selectWalletBitcoinAddress,
  selectWalletBitcoinBalance,
  selectWalletError,
  selectWalletType
} from "@stores/selectors/wallet";
import { connect } from "react-redux";
import { Seed } from "@components/seed";
import { handleSeedValidation } from "@containers/modals/send/helpers";
import { StaticField, Label } from "@components/field";
import { btcAddressToStacksAddress } from "stacks-utils";

const SCREENS = {
  initial: "SCREENS/initial",
  seed: "SCREENS/seed",
  hardware: "SCREENS/hardware",
  success: "SCREENS/success"
};

const mapPropsToState = state => ({
  sender: selectWalletBitcoinAddress(state),
  balance: selectWalletBitcoinBalance(state),
  walletType: selectWalletType(state)
});

const ErrorMessage = props => (
  <Flex
    flexDirection="column"
    alignItems="center"
    pt={2}
    color="hsl(10, 85%, 50%)"
    {...props}
  />
);
const TopSection = props => (
  <Flex
    flexDirection="column"
    p={4}
    borderBottom={1}
    borderColor="blue.mid"
    alignItems="flex-start"
    justifyContent="center"
    width={1}
    bg="blue.light"
    {...props}
  />
);

const BottomSection = props => (
  <Flex flexDirection="column" p={4} width={1} {...props} />
);

/**
 * TODO: replace values with real ones
 */
const SuccessScreen = ({ hide }) => {
  return (
    <>
      <TopSection>
        <Type fontSize={4} lineHeight={1.5}>
          Transaction Sent!
        </Type>
      </TopSection>
      <BottomSection>
        <Flex pb={4} flexDirection="column">
          <Label>Amount Sent</Label>
          <Type fontSize={4}>REPLACE_AMOUNT BTC</Type>
          <Label pt={3}>Fee</Label>
          <Type>REPLACE_FEE BTC</Type>
        </Flex>
        <Flex flexDirection="column">
          <StaticField label="Recipient" value={"REPLACE_TO"} />
          <StaticField
            label="Tx Hash"
            value={"REPLACE_TXID"}
            link={`https://explorer.blockstack.org/tx/${"REPLACE_TXID"}`}
          />
        </Flex>
        <Box mx="auto">
          <Button onClick={hide}>Close</Button>
        </Box>
      </BottomSection>
    </>
  );
};
const SeedScreen = connect(
  state => ({
    sender: selectWalletBitcoinAddress(state),
    balance: selectWalletBitcoinBalance(state),
    walletType: selectWalletType(state),
    error: selectWalletError(state)
  }),
  {
    doSignBTCTransaction: signBTCTransaction,
    doBroadcastBTCTransaction: broadcastBtcTransaction,
    clearErrors: doClearError
  }
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
                const split = pasted.trim().split(" ");
                if (split.length === 24) {
                  event.target.setAttribute("pasted", 1);
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

const InitialScreen = connect(
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

const Screens = ({
  screen,
  setScreen,
  handleSeedChange,
  handleRecipientChange,
  recipient,
  seed,
  setState,
  processing,
  errors,
  hide,
  setErrors,
  handleSignTransaction
}) => {
  if (screen === SCREENS.seed)
    return (
      <SeedScreen
        setState={setState}
        seed={seed}
        handleSeedChange={handleSeedChange}
        navigate={setScreen}
        processing={processing}
        errors={errors}
        handleSignTransaction={handleSignTransaction}
      />
    );
  if (screen === SCREENS.initial)
    return (
      <InitialScreen
        recipient={recipient}
        handleRecipientChange={handleRecipientChange}
        navigate={setScreen}
        errors={errors}
        setErrors={setErrors}
      />
    );
  if (screen === SCREENS.success)
    return <SuccessScreen hide={hide} navigate={setScreen} />;
};

class WithdrawBTCModal extends React.Component {
  state = {
    recipient: undefined,
    screen: SCREENS.initial,
    seed: {},
    errors: {},
    processing: false,
    transaction: undefined
  };
  setScreen = screen => this.setState({ screen });
  handleSeedChange = (value, index) => {
    this.setState(state => ({
      ...state,
      seed: {
        ...state.seed,
        [index]: value
      }
    }));
  };
  handleRecipientChange = recipient => this.setState({ recipient });
  setErrors = (key, value) =>
    this.setState(s => ({
      ...s,
      errors: {
        ...s.errors,
        [key]: value
      }
    }));

  handleSignTransaction = async (
    doSignBTCTransaction,
    doBroadcastBTCTransaction,
    reduxValues
  ) => {
    const { sender, balance, walletType } = reduxValues;

    const rawTx = await doSignBTCTransaction(
      sender,
      this.state.recipient,
      balance,
      walletType,
      Object.values(this.state.seed).join(" ")
    );
    if (rawTx && !rawTx.error) {
      // const finalTx = await doBroadcastBTCTransaction(rawTx);
      // if (finalTx) {
      //   this.handleSetTransaction(finalTx);
      //   this.setScreen(SCREENS.success);
      // }
    }
  };

  handleSetTransaction = transaction => this.setState({ transaction });

  render() {
    return (
      <Modal
        title="Withdraw BTC"
        hide={this.props.hide}
        maxWidth="560px"
        p={0}
        position="relative"
      >
        <Screens
          hide={this.props.hide}
          processing={this.state.processing}
          setState={(state, callBack) => this.setState(state, callBack)}
          setScreen={this.setScreen}
          screen={this.state.screen}
          handleSeedChange={this.handleSeedChange}
          seed={this.state.seed}
          handleRecipientChange={this.handleRecipientChange}
          recipient={this.state.recipient}
          setErrors={this.setErrors}
          errors={this.state.errors}
          handleSignTransaction={this.handleSignTransaction}
          handleSetTransaction={this.handleSetTransaction}
          transaction={this.state.transaction}
        />
      </Modal>
    );
  }
}

export { WithdrawBTCModal };
