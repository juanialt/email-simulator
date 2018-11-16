import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import s from "./styles.scss";

class LoadingPage extends React.Component {
  render() {
    return (
      <div className={s.loadingPage}>
        <CircularProgress size={50} />
        <span>cargando</span>
      </div>
    );
  }
}

export default LoadingPage;
