import React from "react";
import { Box, Flex, Type, Buttons, Button } from "blockstack-ui/dist";
import { TermsOfUse } from "./terms-of-use";
import ActionButtons from "../containers/ActionButtons";

const Title = ({ ...rest }) => (
  <Type
    display="block"
    fontSize={5}
    fontWeight="500"
    fontFamily="brand"
    {...rest}
  />
);

const TermsPage = ({ quit, next }) => (
  <Flex flexDirection="column" color="white" flexGrow={1} bg="blue.dark">
    <Flex
      alignItems="center"
      justifyContent="center"
      flexShrink={0}
      py={6}
      px={4}
      flexGrow={1}
    >
      <Title>Stacks Wallet Terms of Use</Title>
    </Flex>
    <Flex flexGrow={1} justifyContent="center">
      <Box mx="auto" maxWidth="700px">
        <TermsOfUse />
      </Box>
    </Flex>
    <Buttons justifyContent="center" py={6}>
      <Button mx={2} outline invert onClick={quit}>
        Quit
      </Button>
      <Button mx={2} invert onClick={next}>
        I Accept
      </Button>
    </Buttons>
  </Flex>
);

export default TermsPage;
