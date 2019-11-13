import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";

import s from "./styles.scss";

const Loader = props => (
  <div className={s.loaderContainer}>
    <CircularProgress size={50} />
    { props.message && <span>cargando</span> }
  </div>
);

export default Loader;
