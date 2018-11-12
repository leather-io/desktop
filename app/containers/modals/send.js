import React from "react";
import { Field, BalanceField } from "@components/field";
import { Hover, State } from "react-powerplug";

const Send = ({ ...rest }) => {
  const InitialScreen = props => (
    <State
      initial={{
        values: {
          recipient: "",
          amount: "",
          note: ""
        }
      }}
    >
      {({ state, setState }) => (
        <>
          <Field
            name="recipient"
            label="Recipient"
            placeholder="Enter a Stacks Address"
          />
          <BalanceField value={12352323} />
          <Field
            name="amount"
            overlay="STX"
            label="Amount"
            type="number"
            placeholder="0.00"
          />
          <Field
            name="note"
            label="Note"
            placeholder="Write an optional message..."
          />
        </>
      )}
    </State>
  );

  return (
    <State initial={{ view: "initial" }}>
      {({ state, setState }) => {
        switch (state.view) {
          default:
            return <InitialScreen />;
        }
      }}
    </State>
  );
};

export { Send };
