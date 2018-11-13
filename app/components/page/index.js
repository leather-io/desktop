// @flow
import React from "react";
import { Flex, Type } from "blockstack-ui/dist";
const PageContext = React.createContext();
const Title = ({ ...rest }) => (
  <Type
    display="block"
    fontSize={7}
    fontWeight="300"
    fontFamily="brand"
    lineHeight={1.3}
    maxWidth="400px"
    textAlign="center"
    {...rest}
  />
);
const Page = ({ title, children, icon, bg = "blue.dark", ...rest }) => {
  return (
    <Flex
      p={6}
      alignItems="center"
      flexDirection="column"
      flexGrow={1}
      color="white"
      bg={bg}
      maxWidth="100%"
      position="relative"
      {...rest}
    >
      <PageContext.Provider value={{ bg }}>
        <>
          <Title>{title}</Title>
          {children}
        </>
      </PageContext.Provider>
    </Flex>
  );
};

export { Page, PageContext };
