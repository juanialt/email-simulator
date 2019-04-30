import React from "react";
import PropTypes from "prop-types";
import CircularProgress from "@material-ui/core/CircularProgress";
import classNames from "classnames";

import s from "./styles.scss";

class Loader extends React.Component {
  static propTypes = {
    size: PropTypes.oneOf(["xsmall", "small", "default", "large"])
  };

  getLoaderSize() {
    const { size } = this.props;

    switch (size) {
      case "xsmall":
        return 20;
      case "small":
        return 40;
      case "large":
        return 80;
      default:
        return 60;
    }
  }

  render() {
    const loaderSize = this.getLoaderSize();

    return (
      <section className={classNames(s.root, { overlay: this.props.overlayed })}>
        <CircularProgress size={loaderSize} />
      </section>
    );
  }
}

export default Loader;
