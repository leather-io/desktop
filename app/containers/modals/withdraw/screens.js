import React from "react";
import { InitialScreen } from "@containers/modals/withdraw/initial";
import { SeedScreen } from "@containers/modals/withdraw/seed";
import { HardwareScreen } from "@containers/modals/withdraw/hardware";
import { ConfirmScreen } from "@containers/modals/withdraw/confirm";
import { SuccessScreen } from "@containers/modals/withdraw/success";
import { SCREENS } from "@containers/modals/withdraw-btc";

export const Screens = ({
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
  handleSignTransaction,
  handleBroadcastTx,
  rawTx,
  transaction
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
  if (screen === SCREENS.hardware)
    return (
      <HardwareScreen
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
  if (screen === SCREENS.confirm) {
    return (
      <ConfirmScreen
        handleBroadcastTx={handleBroadcastTx}
        recipient={recipient}
        rawTx={rawTx}
        processing={processing}
      />
    );
  }
  if (screen === SCREENS.success)
    return (
      <SuccessScreen
        hide={hide}
        recipient={recipient}
        rawTx={rawTx}
        transaction={transaction}
        navigate={setScreen}
      />
    );
};
