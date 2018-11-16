import React from "react";
import { withRouter } from "react-router";
import { Inbox, Send } from "@material-ui/icons";

import s from "./Navbar.scss";

class Navbar extends React.Component {
  render() {
    return (
      <section className={s.root}>
        <div>
          <Inbox />
          <span>Bandeja de Entrada</span>
        </div>
        <div>
          <Send />
          <span>Enviados</span>
        </div>
      </section>
    );
  }
}

export default withRouter(Navbar);
