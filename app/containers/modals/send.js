import React from "react";
import { Field, BalanceField } from "@components/field";
import { Hover, State } from "react-powerplug";
import { Button, Type, Flex } from "blockstack-ui";
import { validateStxAddress, validateStxAmount } from "@utils/validation";
import produce from "immer";
import { HardwareSteps } from "@containers/hardware-steps";
import { ledgerSteps } from "@screens/onboarding/hardware-wallet/ledger";

const updateValue = (value, setState, key) =>
  setState(state =>
    produce(state, draft => {
      draft.values[key] = value;
    })
  );

const handleChange = (event, setState, key) =>
  updateValue(event.target.value, setState, key);

const handleValidation = (currentBalance, values, setState, nextView) => {
  const { recipient, amount, note } = values;

  let errors = {};

  if (amount === "") {
    errors.amount = "Please enter a valid amount.";
  }
  if (recipient === "") {
    errors.recipient = "Please enter a valid Stacks Address.";
  }

  if (!errors.amount && parseInt(currentBalance) <= amount) {
    errors.amount = "You don't have enough Stacks!";
  }

  if (!errors.recipient) {
    const valid = validateStxAddress(recipient);
    if (!valid) {
      errors.recipient = "Address seems invalid.";
    }
  }

  if (Object.entries(errors).length) {
    setState({
      errors
    });
    return null;
  } else {
    nextView();
  }
};

/**
 * TODO: connect to global store balance
 */
const handleSubmit = (balance = 123212, values, setState, nextView) => {
  handleValidation(balance, values, setState, nextView);
};

const InitialScreen = ({ nextView, state, setState, children, ...rest }) => (
  <>
    <Field
      name="recipient"
      label="Recipient"
      error={state.errors.recipient}
      onChange={e => handleChange(e, setState, "recipient")}
      placeholder="Enter a Stacks Address"
      autofocus
    />
    <BalanceField value={12352323} />
    <Field
      name="amount"
      overlay="STX"
      label="Amount"
      onChange={e => handleChange(e, setState, "amount")}
      type="number"
      error={state.errors.amount}
      placeholder="0.00"
      max={312312}
    />
    <Field
      name="note"
      label="Note"
      is="textarea"
      onChange={e => handleChange(e, setState, "note")}
      placeholder="Write an optional message..."
    />
    {children
      ? children({
          next: () => handleSubmit(312312, state.values, setState, nextView)
        })
      : null}
  </>
);

const HardwareView = ({ nextView, children, ...rest }) => {
  return children ? (
    <Flex flexDirection="column" alignItems="center" pt={4}>
      <Type pb={5} fontSize={4}>
        Connect your Ledger
      </Type>
      <HardwareSteps steps={ledgerSteps}>
        {({ step, next, hasNext, hasPrev, prev }) => (
          <Flex pt={4}>
            {children({
              next: () => (hasNext ? next() : nextView()),
              secondary: {
                label: "Skip",
                action: nextView
              }
            })}
          </Flex>
        )}
      </HardwareSteps>
    </Flex>
  ) : null;
};
const BTCTopUpView = ({ nextView, children, ...rest }) => {
  return (
    <>
      Top Up View
      {children
        ? children({
            next: () => nextView()
          })
        : null}
    </>
  );
};
const Confirmation = ({ nextView, children, ...rest }) => {
  return (
    <>
      Confirmation
      {children
        ? children({
            next: () => nextView()
          })
        : null}
    </>
  );
};
const Success = ({ nextView, children, hide, ...rest }) => {
  return (
    <>
      Success!
      {children
        ? children({
            next: () => hide()
          })
        : null}
    </>
  );
};

const Send = ({ hide, ...rest }) => {
  return (
    <State
      initial={{
        view: 0,
        values: {
          recipient: "",
          amount: "",
          note: ""
        },
        errors: {}
      }}
    >
      {({ state, setState }) => {
        let Component;
        switch (state.view) {
          case 1:
            Component = HardwareView;
            break;
          case 2:
            Component = Confirmation;
            break;
          case 3:
            Component = Success;
            break;
          default:
            Component = InitialScreen;
        }
        return (
          <Component
            view={state.view}
            state={state}
            setState={setState}
            nextView={() =>
              setState(({ view, ...rest }) => ({ ...rest, view: view + 1 }))
            }
            prevView={() =>
              setState(({ view, ...rest }) => ({ ...rest, view: view - 1 }))
            }
            hide={hide}
          >
            {({ next, secondary }) => (
              <Flex
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
              >
                <Button onClick={next}>Continue</Button>
                {secondary ? (
                  <Flex pt={3}>
                    <Type onClick={secondary.action}>{secondary.label}</Type>
                  </Flex>
                ) : null}
              </Flex>
            )}
          </Component>
        );
      }}
    </State>
  );
};

export { Send };
