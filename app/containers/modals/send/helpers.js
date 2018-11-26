import React from "react";
import { validateStxAddress } from "@utils/validation";
import produce from "immer";
import { prepareTransaction } from "@common/lib/transactions";

const handleValidation = (
  sender,
  currentBalance,
  values,
  setState,
  nextView,
  type
) => {
  const { recipient, amount, memo } = values;

  let errors = {};

  if (amount === "") {
    errors.amount = "Please enter a valid amount to send.";
  }

  if (amount && Number(amount) < 0.000001) {
    errors.amount = "Amount needs to be more than a microstack (> 0.000001).";
  }

  if (recipient === "") {
    errors.recipient = "Please enter a valid Stacks address.";
  }

  if (!errors.amount && !(Number(currentBalance) >= Number(amount))) {
    errors.amount = "You don't have enough Stacks!";
  }

  if (!errors.recipient) {
    const valid = validateStxAddress(recipient);
    if (!valid) {
      errors.recipient = "Invalid Stacks address.";
    }
    if (recipient === sender) {
      errors.recipient = "Sender and recipient address cannot be the same.";
    }
  }

  if (Object.entries(errors).length) {
    setState({
      errors
    });
    return null;
  }

  return prepareTransaction(
    sender,
    values.recipient,
    values.amount,
    type,
    values.memo || ""
  ).then(tx => {
    console.log("ESTIMATE TX", tx);
    if (tx.error) {
      setState({
        errors: tx
      });
      return nextView();
    }
    if (Object.entries(errors).length) {
      setState({
        errors
      });
      return null;
    } else {
      setState({
        errors
      });
      nextView();
    }
  });
};

const updateValue = (value, setState, key) =>
  setState(state =>
    produce(state, draft => {
      draft.values[key] = value;
    })
  );

const handleChange = (event, setState, key) =>
  updateValue(event.target.value, setState, key);

const handleBtcCheck = async (
  sender,
  currentBalance,
  values,
  setState,
  nextView,
  type
) => {
  const tx = await prepareTransaction(
    sender,
    values.recipient,
    values.amount,
    type,
    values.memo || ""
  );

  if (!tx.error) {
    console.log("can proceed");
  }
};

export { handleValidation, handleChange, updateValue };
