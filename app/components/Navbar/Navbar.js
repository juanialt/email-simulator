import React from "react";
import { NavLink } from "react-router-dom";
import { withRouter } from "react-router";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import { Inbox, Send, Create, Add, Label, Delete } from "@material-ui/icons";
import Divider from "@material-ui/core/Divider";
import classNames from "classnames";
import { connect } from "react-redux";

import NewLabel from "../../containers/NewLabel/NewLabel";
import { getLabels } from "../../reducers/labels";

import s from "./Navbar.scss";

class Navbar extends React.Component {
  state = {
    isModalOpen: false
  }

  componentDidMount() {
    this.props.getLabels(this.props.user.id);
  }

  handleAddLabelClick = () => {
    this.setState({
      isModalOpen: true
    });
  }

  handleCloseModal = () => {
    this.setState({
      isModalOpen: false
    });
  }

  render() {
    const { labels } = this.props;
    const pathName = (this.props.location && this.props.location.pathname) || "";

    return (
      <React.Fragment>
        <section className={s.root}>
          <List className={s.list}>
            <ListItem activeClassName={s.selected} component={NavLink} to="/newemail">
              <ListItemIcon><Create /></ListItemIcon>
              <ListItemText className={s.label} inset primary="Redactar" />
            </ListItem>
            <Divider className={s.divider} />
            <ListItem activeClassName={s.selected} component={NavLink} to="/mails/inbox">
              <ListItemIcon><Inbox /></ListItemIcon>
              <ListItemText className={s.label} inset primary="Bandeja de Entrada" />
            </ListItem>
            <ListItem activeClassName={s.selected} component={NavLink} to="/mails/sent">
              <ListItemIcon><Send /></ListItemIcon>
              <ListItemText className={s.label} inset primary="Enviados" />
            </ListItem>

            <Divider className={s.divider} />

            <List className={s.list}>
            {labels.map(label => (
              <ListItem className={s.listItem} key={label.id} activeClassName={s.selected} component={NavLink} to={`/mails/${label.name}`}>
                <ListItemIcon><Label /></ListItemIcon>
                <ListItemText className={s.label} inset primary={label.name} />
                <div className={s.actions}><Delete /></div>
              </ListItem>
            ))}
            </List>

            <Divider className={s.divider} />

            <ListItem onClick={this.handleAddLabelClick} className={classNames("cursor-pointer", { [s.selected]: pathName.includes("newlabel") })}>
              <ListItemIcon><Add /></ListItemIcon>
              <ListItemText className={s.label} inset primary="Crear Etiqueta" />
            </ListItem>
          </List>
        </section>
        <NewLabel isOpen={this.state.isModalOpen} handleClose={this.handleCloseModal} />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  const { user } = state.session;
  const { labels } = state.labels;

  return ({
    user,
    labels
  });
};

export default withRouter(connect(mapStateToProps, {
  getLabels
})(Navbar));
