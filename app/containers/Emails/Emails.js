import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import orderBy from "lodash/orderBy";
import base64 from "base-64";
import moment from "moment";

import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import LabelIcon from "@material-ui/icons/Label";
import ReplyIcon from "@material-ui/icons/Reply";
import ReplyAllIcon from "@material-ui/icons/ReplyAll";
import ForwardIcon from "@material-ui/icons/Forward";

import DeleteEmailConfirmation from "../DeleteEmailConfirmation/DeleteEmailConfirmation";
import SetLabel from "../SetLabel/SetLabel";
import { getReceivedMessages, getSentMessages, getLabelMessages } from "../../reducers/messages";
import Email from "../Email/Email";
import EmptyBoxSvg from "../../images/empty-box.svg";
import constants from "../../constants";

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

  handleReply = () => {
    const email = this.state.selectedEmails[0];
    const date = moment(email.date, "YYYY-MM-DD HH:mm:ss").format("D [de] MMMM [de] YYYY [a las] HH:mm:ss");

    const introHeader = `
    <p>&nbsp;&nbsp;</p>
    <p><em>El día ${date} ${email.senderFirstname} ${email.senderLastname} &lt;${email.senderUsername}&gt; escribió:</em></p>
    <p>&nbsp;&nbsp;</p>`;

    const filesAttached = !email.attachments ? "" : `
    <p>&nbsp;</p>
    <p>Archivos Adjuntos</p>
    ${email.attachments.map(file => (
      `<p><a href="${constants.SERVER_PATH}/${file.path}">${file.name}</a></p>`
    )).join("")}
    <p>&nbsp;</p>
    `;

    const params = {
      to: [this.state.selectedEmails[0].senderId],
      htmlCode: `${introHeader} ${this.state.selectedEmails[0].message} ${filesAttached}`,
      files: email.attachments
    };

    this.props.history.push(`/newemail/${base64.encode(JSON.stringify(params))}`);
  }

  handleReplyAll = () => {
    const email = this.state.selectedEmails[0];
    const date = moment(email.date, "YYYY-MM-DD HH:mm:ss").format("D [de] MMMM [de] YYYY [a las] HH:mm:ss");

    const introHeader = `
    <p>&nbsp;&nbsp;</p>
    <p><em>El día ${date} ${email.senderFirstname} ${email.senderLastname} &lt;${email.senderUsername}&gt; escribió:</em></p>
    <p>&nbsp;&nbsp;</p>`;

    const filesAttached = !email.attachments ? "" : `
    <p>&nbsp;</p>
    <p>Archivos Adjuntos</p>
    ${email.attachments.map(file => (
      `<p><a href="${constants.SERVER_PATH}/${file.path}">${file.name}</a></p>`
    )).join("")}
    <p>&nbsp;</p>
    `;

    const params = {
      to: [email.senderId, ...email.recipients.map(recipient => recipient.id)],
      htmlCode: `${introHeader} ${email.message} ${filesAttached}`
    };

    this.props.history.push(`/newemail/${base64.encode(JSON.stringify(params))}`);
  }

  handleForward = () => {
    const email = this.state.selectedEmails[0];
    const date = moment(email.date, "YYYY-MM-DD HH:mm:ss").format("D [de] MMMM [de] YYYY [a las] HH:mm:ss");

    const introHeader = `
    <p>&nbsp;&nbsp;</p>
    <p>---------- Mensaje Reenviado ----------</p>
    <p>De: ${email.senderFirstname} ${email.senderLastname} &lt;${email.senderUsername}&gt;</p>
    <p>Fecha: ${date}</p>
    <p>Asunto: ${email.subject}</p>
    <p>Recipientes: ${email.recipients.map(recipient => ` ${recipient.firstname} ${recipient.lastname} &lt;${recipient.username}&gt;`)}</p>
    <p>&nbsp;&nbsp;</p>`;

    const filesAttached = !email.attachments ? "" : `
    <p>&nbsp;</p>
    <p>Archivos Adjuntos</p>
    ${email.attachments.map(file => (
      `<p><a href="${constants.SERVER_PATH}/${file.path}">${file.name}</a></p>`
    )).join("")}
    <p>&nbsp;</p>
    `;

    const params = {
      htmlCode: `${introHeader} ${email.message} ${filesAttached}`
    };

    this.props.history.push(`/newemail/${base64.encode(JSON.stringify(params))}`);
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
                {selectedEmails.length < 2 &&
                  <React.Fragment>
                    <IconButton title="Responder" onClick={this.handleReply}>
                      <ReplyIcon />
                    </IconButton>
                    <IconButton title="Responder a todos" onClick={this.handleReplyAll}>
                      <ReplyAllIcon />
                    </IconButton>
                    <IconButton title="Reenviar" onClick={this.handleForward}>
                      <ForwardIcon />
                    </IconButton>
                  </React.Fragment>
                }

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
