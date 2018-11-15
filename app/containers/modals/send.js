import React from "react";
import { Field, BalanceField } from "@components/field";
import { Hover, State } from "react-powerplug";
import { Button, Type, Flex } from "blockstack-ui";
import { validateStxAddress, validateStxAmount } from "@utils/validation";
import produce from "immer";
import { HardwareSteps } from "@containers/hardware-steps";
import { ledgerSteps } from "@screens/onboarding/hardware-wallet/ledger";
import { TextLink } from "@containers/buttons/onboarding-navigation";
import { connect } from "react-redux";
import { selectWalletBalance } from "@stores/selectors/wallet";
import CoinsIcon from "mdi-react/CoinsIcon";

const mapStateToProps = state => ({
  balance: selectWalletBalance(state)
});
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
    errors.amount = "Please enter a valid amount to send.";
  }
  if (recipient === "") {
    errors.recipient = "Please enter a valid Stacks address.";
  }

  if (!errors.amount && parseInt(currentBalance) <= amount) {
    errors.amount = "You don't have enough Stacks!";
  }

  if (!errors.recipient) {
    const valid = validateStxAddress(recipient);
    if (!valid) {
      errors.recipient = "Invalid Stacks address.";
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

const InitialScreen = ({
  nextView,
  hide,
  state,
  setState,
  children,
  ...rest
}) => (
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
          next: {
            action: () => handleSubmit(312312, state.values, setState, nextView)
          },
          secondary: {
            label: "Cancel",
            action: hide
          }
        })
      : null}
  </>
);

const HardwareView = ({ nextView, children, ...rest }) => {
  return children ? (
    <Flex flexDirection="column" alignItems="center" pt={4}>
      <Type pb={6} fontSize={4}>
        Connect your Ledger
      </Type>
      <HardwareSteps steps={ledgerSteps}>
        {({ step, next, hasNext, hasPrev, prev }) => (
          <Flex pt={4}>
            {children({
              next: {
                label: hasNext ? "Next" : "Continue",
                action: () => (hasNext ? next() : nextView())
              },
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
            next: {
              action: () => nextView()
            }
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
            next: {
              action: () => nextView()
            }
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
            next: {
              action: () => hide()
            }
          })
        : null}
    </>
  );
};

const NoBalance = ({ nextView, children, hide, ...rest }) => {
  return (
    <>
      <Flex
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        color="blue.mid"
        pb={6}
      >
        <Flex py={4}>
          <CoinsIcon size={100} />
        </Flex>
        <Type fontWeight="bold" color="blue.dark">
          You don't have any Stacks!
        </Type>
      </Flex>
      {children
        ? children({
            next: {
              action: () => hide(),
              label: "Cancel"
            }
          })
        : null}
    </>
  );
};

const Send = connect(mapStateToProps)(({ balance, hide, ...rest }) => {
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

        if (balance === "0") {
          Component = NoBalance;
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
                <Button height="auto" py={2} onClick={next.action}>
                  {next.label || "Continue"}
                </Button>
                {secondary ? (
                  <TextLink onClick={secondary.action}>
                    {secondary.label}
                  </TextLink>
                ) : null}
              </Flex>
            )}
          </Component>
        );
      }}
    </State>
  );
});

export { Send };
