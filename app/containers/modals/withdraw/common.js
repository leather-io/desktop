import React from "react";
import { Flex } from "blockstack-ui/dist";

export const ErrorMessage = props => (
  <Flex
    flexDirection="column"
    alignItems="center"
    pt={2}
    color="hsl(10, 85%, 50%)"
    {...props}
  />
);
export const TopSection = props => (
  <Flex
    flexDirection="column"
    p={4}
    borderBottom={1}
    borderColor="blue.mid"
    alignItems="flex-start"
    justifyContent="center"
    width={1}
    bg="blue.light"
    {...props}
  />
);

export const BottomSection = props => (
  <Flex flexDirection="column" p={4} width={1} {...props} />
);
