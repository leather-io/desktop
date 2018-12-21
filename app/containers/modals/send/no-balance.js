import React from "react";
import { Button, Type, Flex, Card } from "blockstack-ui";
import CoinsIcon from "mdi-react/CoinsIcon";


const NoBalance = ({ wrapper: Wrapper, nextView, children, hide, ...rest }) => {
  return (
    <Wrapper hide={hide}>
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
    </Wrapper>
  );
};

export {NoBalance}
