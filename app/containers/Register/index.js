import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import DocumentTitle from "react-document-title";

import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Header from "../../components/Header";

import { register } from "../../reducers/session";

import s from "./styles.scss";

class Register extends React.Component {

  state = {
    name: "",
    lastName: "",
    address: "",
    phone: "",
    country: "",
    state: "",
    city: "",
    password: "",
    email: ""
  }

  handleSubmit = () => {
    // const { name, lastName, address, phone, country, state, city, password, email } = this.state;
    // this.props.register({ email, password });

    // TODO: REGISTER THE USER
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  render() {
    return (
      <DocumentTitle title='Tempos - Registrarse'>
        <section>
          <Header />
          <div className={s.container}>
            <div className="spring"></div>
            <Paper className={s.formContainer}>
              <h1 className={s.title}>Registrarse</h1>

              <div>
                <TextField name="name" margin="normal" onChange={this.handleInputChange} label="Nombre" />
                <TextField name="lastName" margin="normal" onChange={this.handleInputChange} label="Apellido" />
              </div>

              <div>
                <TextField name="address" margin="normal" onChange={this.handleInputChange} label="Dirección" />
                <TextField name="phone" margin="normal" onChange={this.handleInputChange} label="Teléfono" />
              </div>

              <TextField name="country" margin="normal" onChange={this.handleInputChange} label="País" />
              <TextField name="state" margin="normal" onChange={this.handleInputChange} label="Provincia" />
              <TextField name="city" margin="normal" onChange={this.handleInputChange} label="Ciudad" />

              <TextField name="password" margin="normal" onChange={this.handleInputChange} type="password" label="Contraseña" />
              <TextField name="email" margin="normal" onChange={this.handleInputChange} type="email" label="Email Secundario" />

              <Button color="primary" variant="contained" onClick={this.handleSubmit}>Registrarse</Button>
              <div className="links">
                <span><Link to="/">Home</Link>. </span>
                <span>Ya tenes cuenta? <Link to="/sign-in">Ingresar</Link></span>
              </div>
            </Paper>
          </div>
        </section>
      </DocumentTitle>
    );
  }
}

export default connect(null, { register })(Register);
