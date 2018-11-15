import React from "react";
import { Type, Flex } from "blockstack-ui";
import X from "mdi-react/CloseIcon";
import { connect } from "react-redux";
import { Transition } from "react-spring";
import { Container, Message, Button, Content } from "./styles.js";

const NotificationContext = React.createContext();

import {
  selectNotificationsLeaving,
  selectNotifications,
  doAddNotification,
  doCancelNotification,
  doLeaveNotification,
  doRemoveNotification,
  doNotify,
  doNotifyAlert,
  doNotifyWarning,
  doNotifySuccess
} from "@stores/reducers/notifications";

const Messages = ({ ...rest }) => (
  <NotificationContext.Consumer>
    {({ items, remove, leave, config, cancel, canClose, top }) => (
      <Transition
        native
        items={items}
        keys={item => item.key}
        from={{ opacity: 0, height: 0, life: 1 }}
        enter={{ opacity: 1, height: "auto" }}
        leave={leave}
        onRest={remove}
        config={config}
      >
        {item => ({ ...props }) => (
          <Message style={props}>
            <Content canClose={canClose} top={top}>
              <Flex flexDirection="column" py={4}>
                {item.title ? (
                  <Type color="blue.dark" pb={2} fontWeight="bold">
                    {item.title}
                  </Type>
                ) : null}
                <Type color="blue.dark" fontWeight={"400"}>
                  {item.message}
                </Type>
              </Flex>
              {canClose && (
                <Button onClick={() => cancel(item)}>
                  <X size={18} />
                </Button>
              )}
            </Content>
          </Message>
        )}
      </Transition>
    )}
  </NotificationContext.Consumer>
);
class MessageHub extends React.Component {
  static defaultProps = {
    config: { tension: 125, friction: 20, precision: 0.1 },
    timeout: 1200,
    canClose: true,
    showIndicator: true,
    threshold: Infinity,
    position: "end", // start | center | end
    top: true
  };

  cancelMap = new WeakMap();

  config = (item, state) => {
    const { config, timeout } = this.props;
    return state === "leave" ? [{ duration: timeout }, config, config] : config;
  };

  leave = item => async (next, cancel) => {
    this.cancelMap.set(item, cancel);
    await next({ to: { life: 0 } });
    await next({ to: { opacity: 0 } });
    await next({ to: { height: 0 } }, true);
    this.props.doLeaveNotification();
  };

  render() {
    const { showIndicator, canClose, position, top, children } = this.props;
    return (
      <NotificationContext.Provider
        value={{
          items: this.props.items,
          leaving: this.props.leaving,
          add: this.props.doAddNotification,
          remove: this.props.doRemoveNotification,
          leave: this.leave,
          config: this.config,
          doNotify: this.props.doNotify,
          doNotifyAlert: this.props.doNotifyAlert,
          doNotifyWarning: this.props.doNotifyWarning,
          doNotifySuccess: this.props.doNotifySuccess,
          cancel: (item, secondPass) =>
            doCancelNotification(this.cancelMap, item, secondPass),
          showIndicator,
          canClose,
          position,
          top
        }}
      >
        <>
          <Container position={position} top={top}>
            <Messages />
          </Container>
          {children}
        </>
      </NotificationContext.Provider>
    );
  }
}

export const Notify = ({ notification, type, children, ...rest }) => (
  <NotificationContext.Consumer>
    {({ doNotify, doNotifyAlert, doNotifyWarning, doNotifySuccess }) =>
      children({
        bind: { onClick: () => doNotify(notification, type) },
        doNotify,
        doNotifyAlert,
        doNotifyWarning,
        doNotifySuccess
      })
    }
  </NotificationContext.Consumer>
);

export default connect(
  state => ({
    items: selectNotifications(state),
    leaving: selectNotificationsLeaving(state)
  }),
  {
    doAddNotification,
    doLeaveNotification,
    doRemoveNotification,
    doNotify,
    doNotifyAlert,
    doNotifyWarning,
    doNotifySuccess
  }
)(MessageHub);
