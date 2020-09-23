import React from "react";
import { render } from "react-dom";
import { AppContainer } from "react-hot-loader";
import Root from "@containers/root";
import { configureStore, history } from "./store/configureStore";
import { getAll } from "@stores/persist";

getAll().then(data => {
  // we are modifying the data so the
  // initial state will never be of one that is loading
  const modifiedData =
    data &&
    data.wallet &&
    (data.wallet.fetchingBalances ||
      data.wallet.fetchingAddressData ||
      data.wallet.loading ||
      data.wallet.signing ||
      data.wallet.broadcasting)
      ? {
          ...data,
          wallet: {
            ...data.wallet,
            fetchingBalances: false,
            fetchingAddressData: false,
            loading: false,
            signing: false,
            broadcasting: false
          }
        }
      : data;

  const { store } = configureStore(modifiedData || {});

  render(
    <AppContainer>
      <Root store={store} history={history} />
    </AppContainer>,
    document.getElementById("root")
  );

  if (module.hot) {
    module.hot.accept("./containers/root", () => {
      // eslint-disable-next-line global-require
      const NextRoot = require("./containers/root").default;
      render(
        <AppContainer>
          <NextRoot store={store} history={history} />
        </AppContainer>,
        document.getElementById("root")
      );
    });
  }
});
