import React from "react";
import { Flex, Type } from "blockstack-ui/dist";

const Notice = ({ label = "Note", children, ...rest }) => (
  <Flex
    mb={4}
    width={1}
    bg="white"
    borderColor="blue.mid"
    borderRadius={6}
    border={1}
    boxShadow="card"
    overflow="hidden"
  >
    <Flex
      px={4}
      fontSize={1}
      bg="blue.light"
      p={2}
      borderRight={1}
      borderColor="blue.mid"
    >
      <Type>{label}</Type>
    </Flex>
    <Flex px={3} p={2}>
      {children}
    </Flex>
  </Flex>
);

export { Notice };
