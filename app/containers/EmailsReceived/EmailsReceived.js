import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import orderBy from "lodash/orderBy";

import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import LabelIcon from "@material-ui/icons/Label";

import DeleteEmailConfirmation from "../../containers/DeleteEmailConfirmation/DeleteEmailConfirmation";
import { getReceivedMessages } from "../../reducers/messages";
import Email from "../Email/Email";

import s from "./styles.scss";

class EmailsReceived extends React.Component {
  state = {
    selectedEmails: [],
    isModalOpen: false
  }

  componentDidMount() {
    this.props.getReceivedMessages();
  }

  componentDidUpdate(prevProps) {
    if (this.props.deleteEmailsSucceeded === true &&
      this.props.deleteEmailsSucceeded !== prevProps.deleteEmailsSucceeded) {
      this.props.getReceivedMessages();

      this.setState({
        selectedEmails: []
      });
    }
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

  render() {
    const { selectedEmails } = this.state;
    const { emailsReceived } = this.props;

    return (
      <React.Fragment>
        <div className={s.root}>
          <div className={s.header}>
            <h1>Bandeja de Entrada</h1>
            {selectedEmails.length > 0 &&
              <div>
                <IconButton title="Eliminar" onClick={this.handleDeleteEmail}>
                  <DeleteIcon />
                </IconButton>
                <IconButton title="Asignar Etiqueta">
                  <LabelIcon />
                </IconButton>
              </div>
            }
          </div>

          {emailsReceived.length === 0 && <h3>No recibiste ningun email todavia...</h3>}

          <section className={s.emailContainer}>
            {emailsReceived && orderBy(emailsReceived, ["date"], ["desc"]).map(email =>
              <Email
                key={email.id}
                email={email}
                handleSelect={this.handleSelectEmail}
                handleDeselect={this.handleDeselectEmail} />
            )}
          </section>
        </div>
        <DeleteEmailConfirmation
          emails={selectedEmails}
          amount={selectedEmails.length}
          isOpen={this.state.isModalOpen}
          handleClose={this.handleCloseModal} />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  const { user } = state.session;
  const { emailsReceived, deleteEmailsSucceeded } = state.messages;

  return ({
    user,
    emailsReceived,
    deleteEmailsSucceeded
  });
};

export default withRouter(connect(mapStateToProps, { getReceivedMessages })(EmailsReceived));
