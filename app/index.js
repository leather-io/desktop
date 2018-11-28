import React from "react";
import { render } from "react-dom";
import { AppContainer } from "react-hot-loader";
import Root from "@containers/root";
import { configureStore, history } from "./store/configureStore";
import { getAll } from "@stores/persist/index";

getAll().then(data => {
  const { store } = configureStore(data || {});

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
