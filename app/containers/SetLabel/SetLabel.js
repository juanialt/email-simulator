import React from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import { addEmailLabel } from "../../reducers/labels";

import s from "./styles.scss";

class SetLabel extends React.Component {
  state = {
    open: this.props.isOpen,
    labelsCheckbox: [],
    labelsCheckboxInitial: []
  };

  componentDidMount() {
    const { labels } = this.props;

    const labelsByEmail = this.props.emails.map(e => e.labels);

    const labelsCheckbox = labels.map(label => {
      const isAll = labelsByEmail.every(e => e.find(l => l.id === label.id));
      const isNone = labelsByEmail.every(x => !x.find(m => m.id === label.id));

      return {
        name: label.name,
        id: label.id,
        checked: isAll,
        indeterminate: !isAll && !isNone
      };
    });

    this.setState({
      labelsCheckbox,
      labelsCheckboxInitial: labelsCheckbox
    });
  }

  handleClose = () => {
    this.props.handleClose();
  };

  handleAddEmailLabel = () => {
    const { labelsCheckbox } = this.state;
    const { emails } = this.props;

    const selectLabels = labelsCheckbox.filter(label => label.checked);
    const deleteLabels = labelsCheckbox.filter(label => !label.checked && !label.indeterminate);

    this.props.addEmailLabel({ selectLabels, deleteLabels, emails });
    this.handleClose();
  };

  handleKeyDown = event => {
    if (event.keyCode === 13) {
      this.handleAddEmailLabel();
    }
  }

  handleSelectLabel = event => {
    const { labelsCheckbox, labelsCheckboxInitial } = this.state;
    const labelName = event.target.value;

    // if the label is indeterminated then we keep that state if not it is just true or false states
    const newLabelsCheckbox = labelsCheckbox.map(label => {
      if (label.name !== labelName) {
        return label;
      }

      const labelInitial = labelsCheckboxInitial.find(l => l.name === labelName);

      return ({
        ...label,
        checked: label.indeterminate ? true : !label.checked,
        indeterminate: labelInitial.indeterminate && !label.checked && !label.indeterminate
      });
    });

    this.setState({
      labelsCheckbox: newLabelsCheckbox
    });
  }

  render() {
    const { labelsCheckbox } = this.state;

    return (
      <div className={s.root} onKeyDown={this.handleKeyDown}>
        <Dialog
          open={this.props.isOpen}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Asignar Etiqueta</DialogTitle>

          {this.props.labels && this.props.labels.length > 0 &&
            <React.Fragment>
              <DialogContent>
                <DialogContentText className="m-b-25">
                  <span>Podes asignarle una o mas etiquetas a los mensajes.</span>
                  <br></br>
                  <span>Selecciona una etiqueta de las creadas para poder continuar.</span>
                </DialogContentText>

                <div>
                  {labelsCheckbox.map(label =>
                    <FormControlLabel
                      key={label.id}
                      control={
                        <Checkbox
                          checked={label.checked}
                          onChange={this.handleSelectLabel}
                          value={label.name}
                          indeterminate={label.indeterminate}
                        />
                      }
                      label={label.name}
                    />
                  )}
                </div>
              </DialogContent>

              <DialogActions>
                <Button onClick={this.handleClose} color="primary">Cancelar</Button>
                <Button onClick={this.handleAddEmailLabel} color="primary" variant="contained">Asignar Etiqueta</Button>
              </DialogActions>
            </React.Fragment>
          }

          {this.props.labels && this.props.labels.length === 0 &&
            <React.Fragment>
              <DialogContent>
                <DialogContentText className="m-b-25">
                  <span>Tenes que crear una etiqueta primero para poder asignarla a los mensajes</span>
                </DialogContentText>

                <div>
                  {labelsCheckbox.map(label =>
                    <FormControlLabel
                      key={label.id}
                      control={
                        <Checkbox
                          checked={label.checked}
                          onChange={this.handleSelectLabel}
                          value={label.name}
                          indeterminate={label.indeterminate}
                        />
                      }
                      label={label.name}
                    />
                  )}
                </div>
              </DialogContent>

              <DialogActions>
                <Button onClick={this.handleClose} color="primary" variant="contained">Aceptar</Button>
              </DialogActions>
            </React.Fragment>
          }
        </Dialog>
      </div >
    );
  }
}

const mapStateToProps = state => {
  const { labels } = state.labels;

  return ({
    labels
  });
};

export default connect(mapStateToProps, {
  addEmailLabel
})(SetLabel);
