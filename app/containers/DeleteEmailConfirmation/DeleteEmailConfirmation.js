import React from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import { deleteEmails } from "../../reducers/messages";
import Loader from "../../containers/Loader/Loader";

import s from "./styles.scss";

class DeleteEmailConfirmation extends React.Component {
  state = {
    open: this.props.isOpen,
    labelName: "",
    labelNameError: ""
  };

  handleClose = () => {
    this.setState({
      labelName: "",
      labelNameError: ""
    });
    this.props.handleClose();
  };

  handleDelete = () => {
    const { emails } = this.props;

    this.props.deleteEmails(emails);
    this.props.handleClose();
  };

  render() {
    const { isOpen, amount, fetchingDeleteEmails } = this.props;

    return (
      <div className={s.root}>
        <Dialog
          open={isOpen}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Eliminar Emails</DialogTitle>
          <DialogContent>
            {fetchingDeleteEmails && <Loader />}
            <DialogContentText className="m-b-25">
              <span>Estas seguro que queres eliminar {amount} {amount > 1 ? "emails" : "email"}?</span>
              <br></br>
              <span>Esta accion es irreversible.</span>
            </DialogContentText>
          </DialogContent>

          <DialogActions>
            <Button onClick={this.handleClose} color="primary">Cancelar</Button>
            <Button onClick={this.handleDelete} color="primary" variant="contained">Eliminar</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { fetchingDeleteEmails } = state.messages;

  return ({
    fetchingDeleteEmails
  });
};

export default connect(mapStateToProps, {
  deleteEmails
})(DeleteEmailConfirmation);
