// @flow
import * as React from "react";
import { withRouter } from "react-router-dom";
import { Flex } from "blockstack-ui";
import { connect } from "react-redux";
import { selectWalletStacksAddress } from "@stores/selectors/wallet";
import Modal from "@components/modal";

type Props = {
  children: React.Node
};

class App extends React.Component<Props> {
  props: Props;

  componentDidMount() {
    if (this.props.location.pathname === "/dashboard") {
      if (!this.props.stx) {
        this.props.history.push("/");
      }
    }
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
          style={{ "-webkit-app-region": "drag" }}
        />
        {this.props.children}
      </Modal>
    );
  }
}

export default connect(state => ({
  stx: selectWalletStacksAddress(state)
}))(withRouter(App));
