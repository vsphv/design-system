import React from "react";
import PropTypes from "prop-types";
import { hot } from "react-hot-loader/root";

import "./index.scss";

const App = ({ audience }) => {
  return <div>Hello {audience}</div>;
};

App.propTypes = {
  audience: PropTypes.string,
};

export default hot(App);
