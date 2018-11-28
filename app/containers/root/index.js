import React from "react";
import { Provider } from "react-redux";
import { ConnectedRouter } from "react-router-redux";
import { ThemeProvider } from "styled-components";
import { theme, Flex } from "blockstack-ui";
import { GlobalStyles } from "@components/global-styles";
import Routes from "@containers/routes";

const Root = ({ store, history }) => (
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
