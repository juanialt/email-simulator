import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import orderBy from "lodash/orderBy";

import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import LabelIcon from "@material-ui/icons/Label";

import DeleteEmailConfirmation from "../DeleteEmailConfirmation/DeleteEmailConfirmation";
import SetLabel from "../SetLabel/SetLabel";
import { getReceivedMessages, getSentMessages, getLabelMessages } from "../../reducers/messages";
import Email from "../Email/Email";
import EmptyBoxSvg from "../../images/empty-box.svg";

import s from "./styles.scss";

class Emails extends React.Component {
  state = {
    selectedEmails: [],
    isModalOpen: false,
    isSetLabelOpen: false,
    pageSection: null
  }

  componentDidMount() {
    const pageSection = this.getPageSection();

    this.handleGetEmails(pageSection);

    this.setState({
      pageSection
    });
  }

  componentDidUpdate(prevProps) {
    const { deleteEmailsSucceeded, addEmailLabelSuccess } = this.props;
    const { pathname } = this.props.location;
    const pageSection = this.getPageSection();

    if ((deleteEmailsSucceeded === true && deleteEmailsSucceeded !== prevProps.deleteEmailsSucceeded)
      || (addEmailLabelSuccess === true && addEmailLabelSuccess !== prevProps.addEmailLabelSuccess)) {
      this.handleGetEmails(pageSection);

      this.setState({
        selectedEmails: []
      });
    }

    if ((prevProps.deleteLabelSuccess !== this.props.deleteLabelSuccess) && this.props.deleteLabelSuccess) {
      this.handleGetEmails(pageSection);

      this.setState({
        selectedEmails: []
      });
    }

    if (pathname && prevProps.location.pathname !== pathname) {
      this.handleGetEmails(pageSection);

      this.setState({
        pageSection
      });
    }
  }

  handleGetEmails = section => {
    switch (section) {
      case "inbox":
        this.props.getReceivedMessages();
        break;
      case "sent":
        this.props.getSentMessages();
        break;
      default:
        this.props.getLabelMessages(section);
        break;
    }
  }

  getPageSection = () => {
    const { pathname } = this.props.location;

    if (pathname === "/mails/inbox") {
      return "inbox";
    }
    if (pathname === "/mails/sent") {
      return "sent";
    }
    return (this.props.match.params && this.props.match.params.label) || "";
  }

  handleSelectEmail = email => {
    this.setState(state => ({
      selectedEmails: [...state.selectedEmails, email]
    }));
  }

  handleDeselectEmail = email => {
    this.setState(state => ({
      selectedEmails: state.selectedEmails.filter(e => e.id !== email.id)
    }));
  }

  handleDeleteEmail = () => {
    this.setState({
      isModalOpen: true
    });
  }

  handleCloseModal = () => {
    this.setState({
      isModalOpen: false
    });
  }

  handleOpenSetLabelModal = () => {
    this.setState({
      isSetLabelOpen: true
    });
  }

  handleCloseSetLabelModal = () => {
    this.setState({
      isSetLabelOpen: false
    });
  }

  render() {
    const { selectedEmails, pageSection } = this.state;
    const { emails } = this.props;

    let pageSectionName = "...";

    switch (pageSection) {
      case "sent":
        pageSectionName = "Bandeja de Salida";
        break;
      case "inbox":
        pageSectionName = "Bandeja de Entrada";
        break;
      default:
        pageSectionName = `Etiqueta: ${pageSection}`;
        break;
    }

    return (
      <React.Fragment>
        <div className={s.root}>
          <div className={s.header}>
            <h1>{pageSectionName}</h1>
            {selectedEmails.length > 0 &&
              <div>
                <IconButton title="Eliminar" onClick={this.handleDeleteEmail}>
                  <DeleteIcon />
                </IconButton>
                <IconButton title="Asignar Etiqueta" onClick={this.handleOpenSetLabelModal}>
                  <LabelIcon />
                </IconButton>
              </div>
            }
          </div>

          {emails.length === 0 &&
            <div className={s.emptyState}>
              <div className={s.emptyBox}>
                <img src={EmptyBoxSvg} />
              </div>
              <h3>No hay nada para mostrar</h3>
            </div>
          }

          <section className={s.emailContainer}>
            {emails && orderBy(emails, ["date"], ["desc"]).map(email =>
              <Email
                key={email.id}
                email={email}
                selected={!!selectedEmails.find(el => el.id === email.id)}
                handleSelect={this.handleSelectEmail}
                handleDeselect={this.handleDeselectEmail} />
            )}
          </section>
        </div>
        {this.state.isModalOpen &&
          <DeleteEmailConfirmation
            emails={selectedEmails}
            amount={selectedEmails.length}
            isOpen={this.state.isModalOpen}
            handleClose={this.handleCloseModal} />
        }

        {this.state.isSetLabelOpen &&
          <SetLabel
            emails={selectedEmails}
            isOpen={this.state.isSetLabelOpen}
            handleClose={this.handleCloseSetLabelModal} />
        }
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  const { user } = state.session;
  const { emails, deleteEmailsSucceeded } = state.messages;
  const { addEmailLabelSuccess, deleteLabelSuccess } = state.labels;

  return ({
    user,
    emails,

    deleteEmailsSucceeded,
    addEmailLabelSuccess,
    deleteLabelSuccess
  });
};

export default withRouter(connect(mapStateToProps, {
  getReceivedMessages, getSentMessages, getLabelMessages
})(Emails));
