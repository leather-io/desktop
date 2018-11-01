// @flow
import React, { Component } from "react";
import { Provider } from "react-redux";
import { ConnectedRouter } from "react-router-redux";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import { theme, Flex } from "blockstack-ui";
import Routes from "../routes";

const GlobalStyles = createGlobalStyle`

@import url('https://fonts.googleapis.com/css?family=IBM+Plex+Mono:300,400,500,600,700');
html {
  height: 100%;
}

body {
  position: relative;
  height: 100%;
  font-size: 16px;
  margin: 0;
  font-family: ${theme.fonts.default};
  color: ${theme.colors.blue.dark};
  line-height: 1.4rem;
  display: flex;
  flex-direction: column;
  #root{
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  & > div{
  flex-grow: 1;
  display: flex;
  flex-direction: column;

  }
  }
}

h2 {
  margin: 0;
  font-size: 3rem;
  font-weight: normal;
  color: #ffffff;
}

p {
  font-size: 20px;
}

li {
  list-style: none;
}

a {
  color: #ffffff;
  text-decoration: underline;
}

a:hover {
  opacity: 1;
  text-decoration: underline;
  cursor: pointer;
}
`;

type Props = {
  store: {},
  history: {}
};

export default class Root extends Component<Props> {
  render() {
    return (
      <Provider store={this.props.store}>
        <ConnectedRouter history={this.props.history}>
          <ThemeProvider theme={theme}>
            <React.Fragment>
              <Flex flexGrow={1} flexDirection="column">
                <GlobalStyles />
                <Routes />
              </Flex>
            </React.Fragment>
          </ThemeProvider>
        </ConnectedRouter>
      </Provider>
    );
  }
}
