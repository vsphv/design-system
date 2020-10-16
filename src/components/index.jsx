import React from "react";
import PropTypes from "prop-types";

import "./index.scss";

const App = ({ audience }) => {
  return <div>Hello {audience}</div>;
};

App.propTypes = {
  audience: PropTypes.string,
};

export default App;
