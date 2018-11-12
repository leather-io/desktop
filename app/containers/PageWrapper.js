// @flow
import React from "react";
import { Flex, Type } from "blockstack-ui/dist";

const Title = ({ ...rest }) => (
  <Type
    display="block"
    fontSize={7}
    fontWeight="300"
    fontFamily="brand"
    lineHeight={1.3}
    {...rest}
  />
);
const PageWrapper = ({ title, children, icon, ...rest }) => {
  return (
    <Flex
      p={6}
      alignItems="center"
      flexDirection="column"
      flexGrow={1}
      color="white"
      bg="blue.dark"
      {...rest}
    >
      <Title>{title}</Title>
      {children}
    </Flex>
  );
};

export default PageWrapper;
