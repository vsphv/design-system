import React from "react";
import ReactDOM from "react-dom";
import App from "./components/index.jsx";

ReactDOM.render(<App audience="world" />, document.getElementById("app"));

if (module.hot) {
  module.hot.accept("./components", function () {
    ReactDOM.render(
      <App audience="updated world" />,
      document.getElementById("app")
    );
  });
}
