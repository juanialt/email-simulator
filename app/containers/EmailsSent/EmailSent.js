import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import orderBy from "lodash/orderBy";

import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import LabelIcon from "@material-ui/icons/Label";

import DeleteEmailConfirmation from "../../containers/DeleteEmailConfirmation/DeleteEmailConfirmation";
import { getSentMessages } from "../../reducers/messages";
import Email from "../Email/Email";

import s from "./styles.scss";

class EmailsSent extends React.Component {
  state = {
    selectedEmails: [],
    isModalOpen: false
  }

  componentDidMount() {
    this.props.getSentMessages();
  }

  componentDidUpdate(prevProps) {
    if (this.props.deleteEmailsSucceeded === true &&
      this.props.deleteEmailsSucceeded !== prevProps.deleteEmailsSucceeded) {
      this.props.getSentMessages();

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
    const { emailsSent } = this.props;

    // return (
    //   <div className={s.root}>
    //     <h1>Bandeja de Salida</h1>

    //     {emailsSent.length === 0 && <h3>No enviaste ningun email todavia...</h3>}

    //     <section className={s.emailContainer}>
    //       {emailsSent && orderBy(emailsSent, ["date"], ["desc"]).map(email =>
    //         <Email key={email.id} email={email} />
    //       )}
    //     </section>
    //   </div>
    // );

    return (
      <React.Fragment>
        <div className={s.root}>
          <div className={s.header}>
            <h1>Bandeja de Salida</h1>
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

          {emailsSent.length === 0 && <h3>No recibiste ningun email todavia...</h3>}

          <section className={s.emailContainer}>
            {emailsSent && orderBy(emailsSent, ["date"], ["desc"]).map(email =>
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
  const { emailsSent, deleteEmailsSucceeded } = state.messages;

  return ({
    user,
    emailsSent,
    deleteEmailsSucceeded
  });
};

export default withRouter(connect(mapStateToProps, { getSentMessages })(EmailsSent));
