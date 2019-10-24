import React from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import { addEmailLabel } from "../../reducers/labels";

import s from "./styles.scss";

class SetLabel extends React.Component {
  state = {
    open: this.props.isOpen,
    selectedLabel: "",
    selectError: false,
    selectErrorMessage: "Este campo es requerido",
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
    this.setState({
      selectError: false,
      selectedLabel: ""
    });

    this.props.handleClose();
  };

  handleAddEmailLabel = () => {
    const { labelsCheckbox } = this.state;
    // const { emails } = this.props;

    if (labelsCheckbox.some(label => label.checked)) {
      // this.props.addEmailLabel({ selectedLabel, emails });
      this.handleClose();
    } else {
      this.setState({
        selectError: true
      });
    }
  };

  handleInputChange = event => {
    this.setState({
      selectedLabel: event.target.value,
      selectError: false
    });
  }

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
          <DialogContent>
            <DialogContentText className="m-b-25">
              Podes asignarle una o mas etiquetas a los mensajes.
              <br></br>
              Selecciona una etiqueta de las creadas para poder continuar.
            </DialogContentText>
            <div className="m-b-25">

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

              <FormControl className="w-100" error={this.state.selectError}>
                <Select
                  className="w-100"
                  value={this.state.selectedLabel}
                  onChange={this.handleInputChange}
                  displayEmpty
                  name="Etiqueta"
                >
                  <MenuItem value={""} disabled>Etiqueta</MenuItem>
                  {this.props.labels.map(label =>
                    <MenuItem key={label.id} value={label.id}>{label.name}</MenuItem>
                  )}
                </Select>
                {this.state.selectError &&
                  <FormHelperText>{this.state.selectErrorMessage}</FormHelperText>
                }
              </FormControl>
            </div>
          </DialogContent>

          <DialogActions>
            <Button onClick={this.handleClose} color="primary">Cancelar</Button>
            <Button onClick={this.handleAddEmailLabel} color="primary" variant="contained">Asignar Etiqueta</Button>
          </DialogActions>
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
