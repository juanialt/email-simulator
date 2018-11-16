import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import Paper from "@material-ui/core/Paper";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { AccountCircle } from "@material-ui/icons";

import logoImg from "../images/logo-full-crop.png";
import { signOut } from "../reducers/session";

import s from "./AppHeader.scss";

class AppHeader extends React.Component {

  static defaultProps = {
    user: {
      firstname: "",
      lastname: ""
    }
  };

  state = {
    anchorEl: null
  }

  handleSignout = () => this.props.signOut();

  handleIconClick = event => this.setState({ anchorEl: event.currentTarget });
  handleClose = () => this.setState({ anchorEl: null });

  render() {
    const { anchorEl } = this.state;
    const { firstname, lastname } = this.props.user;
    const fullName = `${firstname || ""} ${lastname || ""}`.trim();

    return (
      <header>
        <Paper className={s.container} elevation={1} square={true}>
          <Link to="/" className={s.imageLink}>
            <img src={logoImg} />
          </Link>

          <section className={s.actionButtons} onClick={this.handleIconClick}>
            <span className="m-r-10">{fullName}</span>
            <AccountCircle fontSize="large" />
          </section>

          <Menu
            anchorEl={anchorEl}
            open={!!anchorEl}
            onClose={this.handleClose}
          >
            <MenuItem onClick={() => this.handleSignout()}>
              Cerrar Sesion
            </MenuItem>
          </Menu>
        </Paper>
      </header>
    );
  }
}

export default connect(null, { signOut })(AppHeader);
