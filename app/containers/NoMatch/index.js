import React from "react";
import { Link } from "react-router-dom";

import s from "./NoMatch.scss";

class NoMatch extends React.Component {
  render() {
    return (
      <div className={s.root}>
        <h1>Oops...</h1>
        <h3>No podemos encontrar lo que estas buscando</h3>
        <Link to="/">Home</Link>
      </div>
    );
  }
}

export default NoMatch;
