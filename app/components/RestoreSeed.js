// @flow
import React, { Component } from "react";
import { Flex, Type, Input, Buttons } from "blockstack-ui/dist";
import { Button } from "./button/index";
import ActionButtons from "../containers/ActionButtons";

type Props = {};

const Item = ({ title, body, ...rest }) => (
  <Flex width={0.45} flexDirection="column" {...rest}>
    <Type fontWeight="500" fontSize={3} pb={3}>
      {title}
    </Type>
    <Type color="hsl(242, 56%, 75%)">{body}</Type>
  </Flex>
);

export default class RestoreSeed extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
  }

  render() {
    const { address, error, handleChange, next } = this.props;

    return (
      <Flex flexDirection={"column"} maxWidth="600px">
        <Type lineHeight={1.5} fontSize={3} pt={6}>
          For your security, at this time you can only create a watch-only
          wallet if you do not have a hardware wallet device. Please enter
          either your Public Key or a Single Stacks Address to continue.
        </Type>
        <Flex py={6} justifyContent="space-between">
          <Item
            title="Public Key"
            body="This has been provided to you during the nullam bibendum quis
              neque vel gravida."
          />
          <Item
            title="Single Address"
            body="This has been provided to you during the nullam bibendum quis
              neque vel gravida."
          />
        </Flex>
        <Input
          variant="dark"
          type="textarea"
          name="address"
          value={address}
          error={error}
          onChange={handleChange}
        />
        <Buttons pt={6}>
          <Button invert outline to="/">
            Back
          </Button>
          <Button invert onClick={next}>
            Continue
          </Button>
        </Buttons>
      </Flex>
    );
  }
}
