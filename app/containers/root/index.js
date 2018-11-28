// @flow
import React from "react";
import { Provider } from "react-redux";
import { ConnectedRouter } from "react-router-redux";
import { ThemeProvider } from "styled-components";
import { theme, Flex } from "blockstack-ui";
import Routes from "../../routes";
import { GlobalStyles } from "@components/global-styles";

const Root = ({ store, history, ...rest }) => (
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <Flex flexGrow={1} flexDirection="column">
        <GlobalStyles />
        <ConnectedRouter history={history}>
          <Routes />
        </ConnectedRouter>
      </Flex>
    </ThemeProvider>
  </Provider>
);

export default Root;
