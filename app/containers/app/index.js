import * as React from "react";
import { withRouter } from "react-router-dom";
import { Flex } from "blockstack-ui";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { selectWalletStacksAddress } from "@stores/selectors/wallet";
import Modal from "@components/modal";
import { ROUTES } from "../../routes";
import debounce from "lodash.debounce";
import { raf, ric } from "@common/utils";
import { APP_IDLE } from "@stores/reducers/app";
import { doPersistState } from "@stores/actions/app";
import { reactShouldRefreshData } from "@stores/reactors/wallet";
import { createObserver } from "@stores/reactors/subscriptions";

const defaults = {
  idleTimeout: 30000,
  idleAction: APP_IDLE,
  doneCallback: null,
  stopWhenTabInactive: true
};

const ricOptions = { timeout: 500 };
export const getIdleDispatcher = (stopWhenInactive, timeout, fn) =>
  debounce(() => {
    // the requestAnimationFrame ensures it doesn't run when tab isn't active
    stopWhenInactive ? raf(() => ric(fn, ricOptions)) : ric(fn, ricOptions);
  }, timeout);

class App extends React.Component {
  static contextTypes = {
    store: PropTypes.object
  };

  state = {
    unsubscribe: null
  };

  componentDidMount() {
    const { store } = this.context;
    const { idleAction, idleTimeout } = defaults;
    let idleDispatcher;

    if (idleTimeout) {
      idleDispatcher = getIdleDispatcher(
        defaults.stopWhenTabInactive,
        idleTimeout,
        () => store.dispatch({ type: idleAction })
      );
    }
    idleDispatcher();
    reactShouldRefreshData(store);
    const observer = createObserver(this.context.store);
    const unsubscribe = observer(
      state => ({ appTime: state.app.appTime }),
      (state, oldState) => {
        idleDispatcher();
        reactShouldRefreshData(store);
      }
    );
    this.setState({
      unsubscribe
    });
    if (this.props.stx && this.props.location.pathname !== ROUTES.DASHBOARD) {
      this.props.history.push(ROUTES.DASHBOARD);
    }
    if (this.props.location.pathname === ROUTES.DASHBOARD) {
      if (!this.props.stx) {
        this.props.history.push(ROUTES.RESTORE_OPTIONS);
      }
    }
  }

  componentWillUnmount() {
    this.props.doPersistState();
    this.state.unsubscribe && this.state.unsubscribe();
  }

  render() {
    return (
      <Modal>
        <Flex
          position="absolute"
          width={1}
          left={0}
          top={0}
          height={40}
          style={{ WebkitAppRegion: "drag" }}
        />
        {this.props.children}
      </Modal>
    );
  }
}

export default connect(
  state => ({
    stx: selectWalletStacksAddress(state)
  }),
  {
    doPersistState
  }
)(withRouter(App));
