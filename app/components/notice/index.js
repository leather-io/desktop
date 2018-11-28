import React from "react";
import { Flex, Type } from "blockstack-ui/dist";

const Notice = ({ label = "Note", children, dark, ...rest }) => (
  <Flex
    mb={4}
    width={1}
    bg={dark ? "blue.darker" : "white"}
    borderColor={dark ? "borders.dark" : "blue.mid"}
    borderRadius={6}
    border={1}
    boxShadow="card"
    overflow="hidden"
    {...rest}
  >
    <Flex
      px={4}
      fontSize={1}
      bg={dark ? "blue.darker" : "blue.light"}
      p={2}
      borderRight={1}
      borderColor={dark ? "borders.dark" : "blue.mid"}
    >
      <Type>{label}</Type>
    </Flex>
    <Flex px={3} p={2}>
      {children}
    </Flex>
  </Flex>
);

export { Notice };
