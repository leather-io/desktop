import React from "react";
import { Box, Flex, Type, Buttons, Button } from "blockstack-ui/dist";
import { TermsOfUse } from "@components/terms-of-use";
import { Link } from "react-router-dom";
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
      <Title>Terms of Use</Title>
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
      <Button is={Link} to="/restore-options" mx={2} invert>
        I Accept
      </Button>
    </Buttons>
  </Flex>
);

export default TermsPage;
