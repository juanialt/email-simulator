import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import DocumentTitle from "react-document-title";
import { ToastContainer } from "react-toastify";

import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";

import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import { Done } from "@material-ui/icons";

import Header from "../../components/Header";
import Loader from "../../components/Loader";

import { register } from "../../reducers/session";
import { getCountries } from "../../reducers/regions";

import s from "./styles.scss";

class Register extends React.Component {
  state = {
    username: "",
    name: "",
    lastName: "",
    address: "",
    phone: "",
    country: null,
    countryId: "",
    state: null,
    stateId: "",
    city: "",
    email: "",
    password: "",

    usernameError: "",
    nameError: "",
    lastNameError: "",
    addressError: "",
    phoneError: "",
    countryError: "",
    stateError: "",
    cityError: "",
    emailError: "",
    passwordError: ""
  }

  componentDidMount() {
    this.props.getCountries();
  }

  handleSubmit = () => {
    const { username, name, lastName, address, phone, countryId, stateId, city, password, email } = this.state;

    if (this.validateForm()) {
      this.props.register({
        username,
        name,
        lastName,
        address,
        phone,
        countryId,
        stateId,
        city,
        email,
        password
      });
    }
  }

  validateForm = () => {
    const { username, name, lastName, address, phone, countryId, stateId, city, password, email } = this.state;

    const usernameValid = this.validateEmpty("username", username);
    const nameValid = this.validateEmpty("name", name);
    const lastNameValid = this.validateEmpty("lastName", lastName);
    const addressValid = this.validateEmpty("address", address);
    const phoneValid = this.validateEmpty("phone", phone);

    const countryValid = this.validateEmpty("country", countryId);
    const stateValid = this.validateEmpty("state", stateId);

    const cityValid = this.validateEmpty("city", city);
    const passwordValid = this.validateEmpty("password", password);
    const emailValid = this.validateEmpty("email", email) && this.validateEmail("email", email);

    // debugger;

    return (
      usernameValid &&
      nameValid &&
      lastNameValid &&
      addressValid &&
      phoneValid &&
      countryValid &&
      stateValid &&
      cityValid &&
      passwordValid &&
      emailValid
    );
  }

  validateEmpty = (name, value) => {
    if (value === "") {
      this.setState({
        [`${name}Error`]: "Este campo es requerido"
      });
      return false;
    }
    return true;
  }

  validateEmail = (name, value) => {
    const isValidEmail = !!value.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/); // eslint-disable-line no-useless-escape

    if (!isValidEmail) {
      this.setState({
        [`${name}Error`]: "Debe ser una direccion de email valida"
      });
      return false;
    }
    return true;
  }

  componentDidUpdate(prevProps) {
    if ((this.props.countries !== prevProps.countries) && this.props.countries) {
      this.setState({
        country: this.props.countries[0]
      });
    }
  }

  handleCountryChange = event => {
    const { countries } = this.props;
    const countryId = parseInt(event.target.value, 10);

    const country = countries.find(country => country.id === countryId);

    this.setState({
      country,
      countryId,
      countryError: "",
      states: country.regions,
      stateId: ""
    });
  }

  handleStateChange = event => {
    const { country } = this.state;
    const regionId = parseInt(event.target.value, 10);

    const state = country.regions.find(region => region.id === regionId);

    this.setState({
      state,
      stateError: "",
      stateId: state.id
    });
  }

  handleInputChange = event => {
    const { target } = event;
    const { value, name } = target;

    this.setState({
      [name]: value,
      [`${name}Error`]: ""
    });
  }

  renderForm = () => (
    <React.Fragment>
      <h1 className={s.title}>Registrarse</h1>

      <TextField
        name="username"
        margin="normal"
        onChange={this.handleInputChange}
        label="Nombre de Usuario"
        error={!!this.state.usernameError}
        helperText={this.state.usernameError} />

      <div className="d-flex">
        <TextField
          name="name"
          fullWidth
          margin="normal"
          onChange={this.handleInputChange}
          label="Nombre"
          error={!!this.state.nameError}
          helperText={this.state.nameError} />

        <TextField
          name="lastName"
          fullWidth
          margin="normal"
          className="m-l-20"
          onChange={this.handleInputChange}
          label="Apellido"
          error={!!this.state.lastNameError}
          helperText={this.state.lastNameError} />
      </div>

      <div className="d-flex">
        <TextField
          name="address"
          fullWidth
          margin="normal"
          onChange={this.handleInputChange}
          label="Dirección"
          error={!!this.state.addressError}
          helperText={this.state.addressError} />

        <TextField
          name="phone"
          fullWidth
          margin="normal"
          className="m-l-20"
          onChange={this.handleInputChange}
          label="Teléfono"
          error={!!this.state.phoneError}
          helperText={this.state.phoneError} />
      </div>

      <FormControl margin="normal" error={!!this.state.countryError}>
        <InputLabel>País</InputLabel>
        <Select native name="country" value={this.state.countryId} onChange={this.handleCountryChange}>
          <option value=""></option>
          {this.props.countries.map(country => (
            <option value={country.id} key={country.id}>
              {country.name}
            </option>
          ))}
        </Select>
        {this.state.countryError && <FormHelperText>{this.state.countryError}</FormHelperText>}
      </FormControl>

      <FormControl margin="normal" error={!!this.state.stateError}>
        <InputLabel>Provincia</InputLabel>
        <Select native name="state" value={this.state.stateId} onChange={this.handleStateChange}>
          <option value=""></option>
          {this.state.country && this.state.country.regions.map(state => (
            <option value={state.id} key={state.id}>
              {state.name}
            </option>
          ))}
        </Select>
        {this.state.stateError && <FormHelperText>{this.state.stateError}</FormHelperText>}
      </FormControl>

      <TextField
        name="city"
        margin="normal"
        onChange={this.handleInputChange}
        label="Ciudad"
        error={!!this.state.cityError}
        helperText={this.state.cityError} />

      <TextField
        name="email"
        margin="normal"
        onChange={this.handleInputChange}
        type="email"
        label="Email Secundario"
        error={!!this.state.emailError}
        helperText={this.state.emailError} />

      <TextField
        name="password"
        margin="normal"
        onChange={this.handleInputChange}
        type="password"
        label="Contraseña"
        error={!!this.state.passwordError}
        helperText={this.state.passwordError} />

      <Button color="primary" variant="contained" onClick={this.handleSubmit}>Registrarse</Button>

      <div className="text-center">
        <span><Link to="/">Home</Link>. </span>
        <span>Ya tenes cuenta? <Link to="/sign-in">Ingresar</Link></span>
      </div>
    </React.Fragment>
  );

  renderSuccess = () => (
    <section className={s.success}>
      <h1 className="m-0">Gracias por registrarte</h1>
      <div className={s.successIcon}>
        <Done fontSize="large" />
      </div>
      <p>Ahora ya podes utilizar el sistema</p>
      <Link to="/sign-in">Ingresar</Link>
    </section>
  );

  render() {
    return (
      <DocumentTitle title='Email Simulator - Registrarse'>
        <section>
          <Header />
          <div className={s.container}>
            <div className="spring"></div>

            <Paper className={s.formContainer}>
              {this.props.registerFetching && <Loader />}
              {this.props.registerSucceeded ?
                this.renderSuccess()
                :
                this.renderForm()
              }
            </Paper>
          </div>

          <ToastContainer />
        </section>
      </DocumentTitle>
    );
  }
}

const mapStateToProps = state => {
  const { messages } = state.messages;
  const { countries } = state.regions;
  const { registerFetching, registerSucceeded } = state.session;

  return ({
    messages,
    countries,
    registerFetching,
    registerSucceeded
  });
};

export default connect(mapStateToProps, {
  register,
  getCountries
})(Register);
