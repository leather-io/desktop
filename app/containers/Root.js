// @flow
import React, { Component } from "react";
import { Provider } from "react-redux";
import { ConnectedRouter } from "react-router-redux";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import { theme, Flex } from "blockstack-ui";
import { normalize } from "polished";
import Routes from "../routes";
import Modal from "@components/modal";
import fetch from "cross-fetch";

export const AppContext = React.createContext();

const fetchStacksData = async () => {
  try {
    const response = await fetch(
      "https://blockstack-explorer-api.herokuapp.com/api/stacks/addresses/SM3KJBA4RZ7Z20KD2HBXNSXVPCR1D3CRAV6Q05MKT"
    );
    const data = await response.json();
    console.log(data);
    return data;
  } catch (e) {
    console.log(e);
  }
};
const GlobalStyles = createGlobalStyle`

@import url('https://fonts.googleapis.com/css?family=IBM+Plex+Mono:300,400,500,600,700');

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    /* display: none; <- Crashes Chrome on hover */
    -webkit-appearance: none;
    margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
}
${normalize()}
html {
  height: 100%;
  width:100%;
    max-width: 100%;

}

*{
box-sizing: border-box;
}

body {
  position: relative;
  height: 100%;
  width: 100%;
  max-width: 100%;
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

textarea{
resize: vertical;

}
#root{
max-width: 100%;
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
  state = {
    data: null
  };
  async componentDidMount() {
    const data = await fetchStacksData();
    if (!this.state.data && data) {
      this.setState({
        data
      });
    }
  }

  render() {
    return (
      <AppContext.Provider value={this.state.data}>
        <Provider store={this.props.store}>
          <ConnectedRouter history={this.props.history}>
            <ThemeProvider theme={theme}>
              <React.Fragment>
                <Flex flexGrow={1} flexDirection="column">
                  <GlobalStyles />
                  <Modal>
                    <Routes />
                  </Modal>
                </Flex>
              </React.Fragment>
            </ThemeProvider>
          </ConnectedRouter>
        </Provider>
      </AppContext.Provider>
    );
  }
}
