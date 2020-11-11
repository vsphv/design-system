import React from "react";
import { hot } from "react-hot-loader/root";
import PropTypes from "prop-types";
import "./index.scss";

const App = ({ audience }) => {
  const [counter, setCounter] = React.useState(0);
  const handleClick = () => setCounter(counter + 1);
  return (
    <>
      <button onClick={handleClick}>click me</button>
      <div>
        Hello, {audience} {counter}...
      </div>
    </>
  );
};

App.propTypes = {
  audience: PropTypes.string,
};

export default hot(App);
