import React from "react";
import {
  Box,
  Flex,
  Type,
  Buttons,
  Button
} from "blockstack-ui/dist";
import { TermsOfUse } from "@components/terms-of-use";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { doAcceptTerms } from "@stores/actions/app";
import { ROUTES } from "@common/constants";
import { remote } from "electron";

const mapDispatchToProps = {
  doAcceptTerms
};
const Title = ({ ...rest }) => (
  <Type
    display="block"
    fontSize={5}
    fontWeight="500"
    fontFamily="brand"
    {...rest}
  />
);

const handleAccept = (accept, history) => {
  doAcceptTerms();
  history.push(ROUTES.SETUP);
};

const handleQuit = () => {
  const currentWindow = remote.getCurrentWindow();
  currentWindow.close();
};

const TermsPage = ({ quit, doAcceptTerms, history, next, style }) => {
  return (
    <Flex
      flexDirection="column"
      color="white"
      flexGrow={1}
      bg="blue.dark"
      style={style}
    >
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
        <Button mx={2} outline invert onClick={handleQuit}>
          Quit
        </Button>
        <Button
          onClick={() => handleAccept(doAcceptTerms, history)}
          mx={2}
          invert
        >
          I Accept
        </Button>
      </Buttons>
    </Flex>
  );
};

export default connect(
  null,
  mapDispatchToProps
)(withRouter(TermsPage));
