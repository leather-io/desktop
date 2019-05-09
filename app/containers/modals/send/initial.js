import React from "react";
import { Field, BalanceField } from "@components/field";
import { Button, Type, Flex, Card } from "blockstack-ui";

const InitialScreen = ({
  nextView,
  hide,
  state,
  setState,
  children,
  balance,
  sender,
  wrapper: Wrapper,
  type,
  handleChange,
  handleValidation,
  pendingBalance,
  ...rest
}) => (
  <Wrapper hide={hide}>
    <Field
      name="recipient"
      label="Recipient"
      error={state.errors.recipient}
      onChange={e => handleChange(e, setState, "recipient")}
      placeholder="Enter a Stacks Address"
      value={state.values.recipient}
      autofocus
    />
    <BalanceField />
    <Field
      name="amount"
      overlay="STX"
      label="Amount to send"
      onChange={e => handleChange(e, setState, "amount")}
      type="number"
      error={state.errors.amount}
      placeholder="0.000000"
      value={state.values.amount}
      max={balance}
    />
    <Field
      name="memo"
      label="Note"
      is="textarea"
      value={state.values.memo}
      onChange={e => handleChange(e, setState, "memo")}
      placeholder="Write an optional message..."
      error={state.errors.memo}
    />
    {children
      ? children({
          next: {
            props: {
              disabled: state.processing
            },
            label: state.processing ? "Loading..." : "Continue",
            action: () =>
              state.processing ? null :
                handleValidation(
                  sender,
                  balance,
                  pendingBalance,
                  state.values,
                  setState,
                  nextView,
                  type
                )
          },
          secondary: {
            label: "Cancel",
            action: hide
          }
        })
      : null}
  </Wrapper>
);

export { InitialScreen };
