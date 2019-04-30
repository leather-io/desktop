import React from "react";
import { Button, Type, Flex, Card } from "blockstack-ui";
import { TextLink } from "@containers/buttons/onboarding-navigation";
import { connect } from "react-redux";
import {
  selectWalletBalance,
  selectWalletType,
  selectWalletStacksAddress,
  selectWalletError,
  selectPendingBalance
} from "@stores/selectors/wallet";
import { microToStacks, emptySeedArray } from "@utils/utils";
import {
  doSignTransaction,
  doBroadcastTransaction,
  doClearError
} from "@stores/actions/wallet";
import { ERRORS } from "@common/lib/transactions";
import { Modal } from "@components/modal";
import { BTCTopUpView } from "@containers/modals/send/top-up";
import { Confirmation } from "@containers/modals/send/confirm";
import { Success } from "@containers/modals/send/success";
import { InitialScreen } from "@containers/modals/send/initial";
import { HardwareView } from "@containers/modals/send/hardware";
import { SeedView } from "@containers/modals/send/seed";
import { NoBalance } from "@containers/modals/send/no-balance";
import {
  handleChange,
  handleSeedChange,
  handleValidation,
  handleSeedValidation,
  clearSeed,
} from "@containers/modals/send/helpers";
import { WALLET_TYPES } from "@stores/reducers/wallet";

const SecondaryLink = ({ action, label, ...rest }) => (
  <TextLink onClick={action} {...rest}>
    {label}
  </TextLink>
);

const Navigation = ({ next, secondary }) => (
  <Flex flexDirection="column" alignItems="center" justifyContent="center">
    <Button height="auto" py={2} onClick={next.action}>
      {next.label || "Continue"}
    </Button>
    {secondary ? (
      Array.isArray(secondary) ? (
        <Flex>
          {secondary.map((item, i) => (
            <SecondaryLink
              {...item}
              key={i}
              mr={i < secondary.length - 1 ? 2 : 0}
            />
          ))}
        </Flex>
      ) : (
        <SecondaryLink {...secondary} />
      )
    ) : null}
  </Flex>
);
const mapStateToProps = state => ({
  balance: microToStacks(selectWalletBalance(state)),
  pendingBalance: microToStacks(selectPendingBalance(state)),
  type: selectWalletType(state),
  sender: selectWalletStacksAddress(state),
  error: selectWalletError(state)
});

const Wrapper = props => <Modal title="Send Stacks" {...props} />;

class SendComponent extends React.Component {
  state = {
    view: 0,
    processing: false,
    values: {
      recipient: "",
      amount: "",
      memo: "",
      seed: "",
      seedArray: emptySeedArray(24)
    },
    draft: null,
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
      pendingBalance,
    } = this.props;

    let Component;
    switch (this.state.view) {
      case 1:
        Component =
          this.state.errors &&
          this.state.errors.type &&
          this.state.errors.type === ERRORS.INSUFFICIENT_BTC_BALANCE.type
            ? BTCTopUpView
            : (type === WALLET_TYPES.SOFTWARE ? SeedView : HardwareView);
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
      pendingBalance,
      type,
      sender,
      error,
      handleChange,
      handleSeedChange,
      handleValidation,
      handleSeedValidation,
      nextView: () => 
        this.setState(({ view, ...rest }) => ({ ...rest, view: view + 1 })),
      goToView: view => this.setState(({ ...rest }) => ({ ...rest, view })),
      prevView: () =>
        this.setState(({ view, ...rest }) => ({ ...rest, view: view - 1 })),
      hide: () => {
        doClearError();
        hide();
      },
      doSignTransaction,
      doBroadcastTransaction,
      clearSeed
    };

    return (
      <Component wrapper={Wrapper} {...componentProps} children={Navigation} />
    );
  }
}

const Send = connect(
  mapStateToProps,
  { doSignTransaction, doBroadcastTransaction, doClearError }
)(SendComponent);

export { Send };
