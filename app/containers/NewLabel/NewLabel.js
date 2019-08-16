import React from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import { addLabel } from "../../reducers/labels";

import s from "./styles.scss";

class NewLabel extends React.Component {
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

  handleCreate = () => {
    const { labelName } = this.state;

    if (labelName) {
      this.props.addLabel(labelName);
    } else {
      this.setState({
        labelNameError: "Este campo es requerido"
      });
    }
  };

  handleInputChange = event => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value,
      [`${name}Error`]: ""
    });
  }

  render() {
    return (
      <div className={s.root}>
        <Dialog
          open={this.props.isOpen}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Crear Etiqueta</DialogTitle>
          <DialogContent>
            <DialogContentText className="m-b-25">
              Cuando guardes tus correos electrónicos, puedes asignarles etiquetas. Añádeles todas las que quieras.
              <br></br>
              <strong>Nota:</strong> Si eliminas un mensaje, se borrará de todas las etiquetas que tenga asignadas y de tu bandeja de entrada.
            </DialogContentText>

            <TextField
              required
              autoFocus
              name="labelName"
              id="name"
              label="Nombre Etiqueta"
              type="text"
              fullWidth
              variant="outlined"
              value={this.state.labelName}
              onChange={this.handleInputChange}
              error={!!this.state.labelNameError}
              helperText={this.state.labelNameError}
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={this.handleClose} color="primary">Cancelar</Button>
            <Button onClick={this.handleCreate} color="primary">Crear Etiqueta</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { labels, fetchingAddLabel } = state.labels;

  return ({
    labels,
    fetchingAddLabel
  });
};

export default connect(mapStateToProps, {
  addLabel
})(NewLabel);
