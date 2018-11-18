import React from "react";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import { Inbox, Send, Create } from "@material-ui/icons";
import Divider from "@material-ui/core/Divider";
import classNames from "classnames";

import s from "./Navbar.scss";

class Navbar extends React.Component {
  render() {
    const pathName = (this.props.location && this.props.location.pathname) || "";

    return (
      <section className={s.root}>
        <List>
          <ListItem component={Link} to="/new">
            <ListItemIcon><Create /></ListItemIcon>
            <ListItemText className={s.label} inset primary="Redactar" />
          </ListItem>
          <Divider />
          <ListItem className={classNames({ [s.selected]: pathName.includes("dashboard") })} component={Link} to="/dashboard">
            <ListItemIcon><Inbox /></ListItemIcon>
            <ListItemText className={s.label} inset primary="Bandeja de Entrada" />
          </ListItem>
          <ListItem className={classNames({ [s.selected]: pathName.includes("menu") })} component={Link} to="/sent">
            <ListItemIcon><Send /></ListItemIcon>
            <ListItemText className={s.label} inset primary="Enviados" />
          </ListItem>
        </List>
      </section>
    );
  }
}

export default withRouter(Navbar);
