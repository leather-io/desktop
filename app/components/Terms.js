import React from "react";
import { Box, Flex, Type } from "blockstack-ui";
import { TermsOfUse } from "./terms-of-use";
import Button from "../containers/Button";
import ActionButtons from "../containers/ActionButtons";

const Title = ({ ...rest }) => (
  <Type display="block" fontSize={5} fontWeight="500" fontFamily="brand" {...rest} />
);

const TermsPage = ({ quit, next }) => (
  <Box color="white" flexGrow={1} bg="blue.dark">
    <Flex
      alignItems="center"
      justifyContent="center"
      flexShrink={0}
      py={6}
      px={4}
    >
      <Title>Stacks Wallet Terms of Use</Title>
    </Flex>
    <Flex justifyContent="center">
      <Box mx="auto" maxWidth="700px">
        <TermsOfUse />
      </Box>
    </Flex>
    <ActionButtons>
      <Button onClick={quit}>Quit</Button>
      <Button onClick={next}>I Accept</Button>
    </ActionButtons>
  </Box>
);

export default TermsPage;
