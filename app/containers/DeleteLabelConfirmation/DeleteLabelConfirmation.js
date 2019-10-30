import React from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import { addLabel } from "../../reducers/labels";

import s from "./styles.scss";

class DeleteLabelConfirmation extends React.Component {
  state = {
    open: this.props.isOpen
  };

  handleClose = () => {
    this.props.handleClose();
  };

  handleDelete = () => {
    this.props.handleDelete(this.props.label);
    this.props.handleClose();
  };

  render() {
    return (
      <div className={s.root}>
        <Dialog
          open={this.props.isOpen}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Eliminar Etiqueta</DialogTitle>
          <DialogContent>
            <DialogContentText className="m-b-25">
              {(this.props.label && this.props.label.name) ?
                <span>Estas seguro que queres eliminar la etiqueta {this.props.label.name} ?</span>
                :
                <span>Estas seguro que queres eliminar la etiqueta seleccionada ?</span>
              }
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

export default connect(() => ({}), {
  addLabel
})(DeleteLabelConfirmation);
