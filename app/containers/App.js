// @flow
import * as React from "react";
import { Flex } from "blockstack-ui";
type Props = {
  children: React.Node
};

export default class App extends React.Component<Props> {
  props: Props;

  render() {
    return (
      <>
        <Flex
          position="absolute"
          width={1}
          left={0}
          top={0}
          height={40}
          style={{ "-webkit-app-region": "drag" }}
        />
        {this.props.children}
      </>
    );
  }
}
