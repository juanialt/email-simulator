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
import DeleteLabel from "../../containers/DeleteLabelConfirmation/DeleteLabelConfirmation";
import { getLabels, deleteLabel } from "../../reducers/labels";

import s from "./Navbar.scss";

class Navbar extends React.Component {
  state = {
    isModalOpen: false,
    deleteLabelOpen: false
  }

  componentDidMount() {
    this.props.getLabels(this.props.user.id);
  }

  componentDidUpdate(prevProps) {
    if ((prevProps.deleteLabelSuccess !== this.props.deleteLabelSuccess) && this.props.deleteLabelSuccess) {
      this.props.getLabels(this.props.user.id);
    }
  }

  handleAddLabelClick = () => {
    this.setState({
      isModalOpen: true
    });
  }

  handleCloseModal = () => {
    this.setState({
      isModalOpen: false,
      deleteLabelOpen: false
    });
  }

  requestDeleteLabel = (e, label) => {
    e.preventDefault();
    e.stopPropagation();

    this.setState({
      selectedLabelToDelete: label,
      deleteLabelOpen: true
    });
  }

  handleDeleteLabel = () => {
    const { selectedLabelToDelete: label } = this.state;

    if (this.props.location && this.props.location.pathname && this.props.location.pathname === `/mails/${label.name}`) {
      this.props.history.push("/mails/inbox");
    }

    this.props.deleteLabel({
      labelId: label.id,
      userId: label.userId
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
                <ListItem
                  className={s.listItem}
                  key={label.id}
                  activeClassName={s.selected}
                  component={NavLink}
                  to={`/mails/${label.name}`}>
                  <ListItemIcon><Label /></ListItemIcon>
                  <ListItemText title={label.name} className={s.label} inset primary={label.name} />
                  <div
                    title="Eliminar etiqueta"
                    className={s.actions}
                    onClick={e => this.requestDeleteLabel(e, label)}><Delete /></div>
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

        {this.state.deleteLabelOpen &&
          <DeleteLabel
            label={this.state.selectedLabelToDelete}
            isOpen={this.state.deleteLabelOpen}
            handleClose={this.handleCloseModal}
            handleDelete={this.handleDeleteLabel} />
        }
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  const { user } = state.session;
  const { labels, deleteLabelSuccess } = state.labels;

  return ({
    user,
    labels,
    deleteLabelSuccess
  });
};

export default withRouter(connect(mapStateToProps, {
  getLabels,
  deleteLabel
})(Navbar));
