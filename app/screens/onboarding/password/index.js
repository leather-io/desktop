// @flow
import React, { Component } from "react";
import { Flex, Type, Input, Buttons } from "blockstack-ui/dist";
import { Button } from "@components/button/index";
import { Page } from "@components/page";

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
      <Page
        alignItems="center"
        justifyContent="center"
        title="Create a Password"
      >
        <Flex flexDirection={"column"} maxWidth="600px">
          <Input variant="dark" name="password" type="password" autoFocus />
          <Input variant="dark" type="password" name="passwordConfirm" />
          <Flex flexGrow={1} mt="auto" />
          <Buttons pt={6}>
            <Button invert outline to="/restore-options">
              Back
            </Button>
            <Button invert onClick={next}>
              Continue
            </Button>
          </Buttons>
        </Flex>
      </Page>
    );
  }
}
