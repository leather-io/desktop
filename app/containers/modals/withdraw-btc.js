import React from "react";

import { Modal } from "@components/modal";
import { Screens } from "@containers/modals/withdraw/screens";

export const SCREENS = {
  initial: "SCREENS/initial",
  seed: "SCREENS/seed",
  hardware: "SCREENS/hardware",
  confirm: "SCREENS/confirm",
  success: "SCREENS/success"
};

export class WithdrawBTCModal extends React.Component {
  state = {
    screen: SCREENS.initial,
    recipient: undefined,
    seed: {},
    errors: {},
    processing: false,
    transaction: undefined,
    rawTx: undefined
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
    const { recipient, seed } = this.state;
    const seedString = Object.values(seed).join(" ");
    this.handleProcessing(true);
    const rawTx = await doSignBTCTransaction(
      sender,
      recipient,
      balance,
      walletType,
      seedString
    );
    if (!rawTx.error) {
      this.handleSetRawTx(rawTx);
      this.setScreen(SCREENS.confirm);
      this.handleProcessing(false);
    } else {
      this.handleProcessing(false);
    }
  };

  handleProcessing = processing => this.setState({ processing });

  handleBroadcastTx = async doBroadcastBTCTransaction => {
    if (this.state.rawTx.rawTx) {
      this.handleProcessing(true);
      const txid = await doBroadcastBTCTransaction(this.state.rawTx.rawTx);
      if (txid) {
        this.handleSetTransaction(txid);
        this.setScreen(SCREENS.success);
        this.handleProcessing(false);
      }
    }
  };

  handleSetRawTx = rawTx => this.setState({ rawTx });
  handleSetTransaction = transaction => this.setState({ transaction });

  render() {
    // eslint-disable-next-line react/prop-types
    const { hide } = this.props;
    const {
      processing,
      screen,
      seed,
      recipient,
      errors,
      transaction,
      rawTx
    } = this.state;
    return (
      <Modal
        title="Withdraw BTC"
        hide={hide}
        maxWidth="560px"
        p={0}
        position="relative"
      >
        <Screens
          setState={(state, callBack) => this.setState(state, callBack)}
          handleRecipientChange={this.handleRecipientChange}
          handleSignTransaction={this.handleSignTransaction}
          handleSetTransaction={this.handleSetTransaction}
          handleBroadcastTx={this.handleBroadcastTx}
          handleSeedChange={this.handleSeedChange}
          handleSetRawTx={this.handleSetRawTx}
          setScreen={this.setScreen}
          setErrors={this.setErrors}
          processing={processing}
          transaction={transaction}
          recipient={recipient}
          errors={errors}
          screen={screen}
          rawTx={rawTx}
          seed={seed}
          hide={hide}
        />
      </Modal>
    );
  }
}
