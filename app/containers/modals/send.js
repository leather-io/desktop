import React from "react";
import { Field, BalanceField } from "@components/field";
import { Hover, State } from "react-powerplug";
import { Button, Type, Flex } from "blockstack-ui";
import { validateStxAddress, validateStxAmount } from "@utils/validation";
import produce from "immer";
import { HardwareSteps } from "@containers/hardware-steps";
import { ledgerSteps } from "@screens/onboarding/hardware-wallet/ledger";
import { trezorSteps } from "@screens/onboarding/hardware-wallet/trezor";
import { TextLink } from "@containers/buttons/onboarding-navigation";
import { connect } from "react-redux";
import {
  selectWalletBalance,
  selectWalletType,
  selectWalletStacksAddress,
  selectWalletError
} from "@stores/selectors/wallet";
import CoinsIcon from "mdi-react/CoinsIcon";

import { microToStacks } from "@utils/utils";
import {
  doSignTransaction,
  doBroadcastTransaction,
  doClearError
} from "@stores/actions/wallet";
import { WALLET_TYPES } from "@stores/reducers/wallet";
import { ERRORS } from "@common/lib/transactions";

const SecondaryLink = ({ action, label }) => (
  <TextLink onClick={action}>{label}</TextLink>
);

const mapStateToProps = state => ({
  balance: microToStacks(selectWalletBalance(state)),
  type: selectWalletType(state),
  sender: selectWalletStacksAddress(state),
  error: selectWalletError(state)
});
const updateValue = (value, setState, key) =>
  setState(state =>
    produce(state, draft => {
      draft.values[key] = value;
    })
  );

const handleChange = (event, setState, key) =>
  updateValue(event.target.value, setState, key);

const handleValidation = (
  sender,
  currentBalance,
  values,
  setState,
  nextView
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
  } else {
    nextView();
  }
};

/**
 * TODO: connect to global store balance
 */
const handleSubmit = handleValidation;

const InitialScreen = ({
  nextView,
  hide,
  state,
  setState,
  children,
  balance,
  sender,
  ...rest
}) => (
  <>
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
      label="Amount"
      onChange={e => handleChange(e, setState, "amount")}
      type="number"
      error={state.errors.amount}
      placeholder="0.00"
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
    />
    {children
      ? children({
          next: {
            action: () =>
              handleSubmit(sender, balance, state.values, setState, nextView)
          },
          secondary: {
            label: "Cancel",
            action: hide
          }
        })
      : null}
  </>
);

const HardwareView = ({
  nextView,
  prevView,
  children,
  type,
  doSignTransaction,
  state,
  sender,
  setState,
  ...rest
}) => {
  const handleSubmit = async () => {
    console.log("handleSubmit");
    setState({
      processing: true
    });
    try {
      const tx = await doSignTransaction(
        sender,
        state.values.recipient,
        state.values.amount,
        type,
        state.values.memo || ""
      );
      console.log(tx);
    } catch (e) {
      console.log("caught error, processing done");
      setState({
        processing: false
      });
    }
  };
  return children ? (
    <Flex flexDirection="column" alignItems="center" pt={4}>
      <Type pb={6} fontSize={4}>
        Connect your {type === WALLET_TYPES.TREZOR ? "Trezor" : "Ledger"}
      </Type>
      <HardwareSteps
        steps={type === WALLET_TYPES.TREZOR ? trezorSteps : ledgerSteps}
      >
        {({ step, next, hasNext, hasPrev, prev }) => (
          <Flex pt={4}>
            {children({
              next: {
                label: hasNext ? "Next" : "Continue",
                action: () => (hasNext ? next() : handleSubmit())
              },
              secondary: [
                {
                  label: "Back",
                  action: prevView
                },
                {
                  label: "Skip",
                  action: nextView
                }
              ]
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

class SendComponent extends React.Component {
  state = {
    view: 0,
    processing: false,
    values: {
      recipient: "",
      amount: "",
      memo: ""
    },
    errors: {}
  };

  componentWillUnmount() {
    this.props.doClearError();
  }

  render() {
    const {
      balance,
      hide,
      doSignTransaction,
      doBroadcastTransaction,
      doClearError,
      type,
      sender,
      error,
      ...rest
    } = this.props;

    let Component;
    switch (this.state.view) {
      case 1:
        Component =
          error &&
          error.type &&
          error.type === ERRORS.INSUFFICIENT_BTC_BALANCE.type
            ? BTCTopUpView
            : HardwareView;
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

    const componentProps = {
      state: this.state,
      view: this.state.view,
      setState: (...args) => this.setState(...args),
      balance,
      type,
      sender,
      error,
      nextView: () =>
        this.setState(({ view, ...rest }) => ({ ...rest, view: view + 1 })),
      prevView: () =>
        this.setState(({ view, ...rest }) => ({ ...rest, view: view - 1 })),
      hide: this.state.processing
        ? () => null
        : () => {
            doClearError();
            hide();
          },
      doSignTransaction,
      doBroadcastTransaction
    };

    return (
      <Component {...componentProps}>
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
              Array.isArray(secondary) ? (
                <Flex>
                  {secondary.map((item, i) => (
                    <SecondaryLink {...item} key={i} />
                  ))}
                </Flex>
              ) : (
                <SecondaryLink {...secondary} />
              )
            ) : null}
          </Flex>
        )}
      </Component>
    );
  }
}

const Send = connect(
  mapStateToProps,
  { doSignTransaction, doBroadcastTransaction, doClearError }
)(SendComponent);

export { Send };
