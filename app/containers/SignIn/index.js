import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import DocumentTitle from "react-document-title";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";

import Header from "../../components/Header";
import { signIn } from "../../reducers/session";

import s from "./styles.scss";

class SignIn extends React.Component {
  state = {
    username: "",
    password: ""
  }

  handleSubmit = () => {
    const { username, password } = this.state;

    this.props.signIn({ username, password });
  }

  handleInputChange = event => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  render() {
    return (
      <DocumentTitle title='Email Simulator - Ingresar'>
        <section>
          <Header />
          <div className={s.container}>
            <div className="spring"></div>
            <Paper className={s.formContainer}>

              {this.props.userFetching && <div className={s.loader}>
                <CircularProgress size={60} />
              </div>}

              <h1 className={s.title}>Ingresar</h1>
              <TextField name="username" margin="normal" onChange={this.handleInputChange} label="Usuario" />
              <TextField name="password" margin="normal" onChange={this.handleInputChange} label="Contraseña" type="password" />
              <Button color="primary" variant="contained" onClick={this.handleSubmit}>Ingresar</Button>
              <div className="links">
                <span><Link to="/">Home</Link>. </span>
                <span>No tenes cuenta? <Link to="/register">Registrate</Link></span>
              </div>
            </Paper>
          </div>
          <ToastContainer />
        </section>
      </DocumentTitle>
    );
  }
}

const mapStateToProps = state => {
  const { userFetching, userError } = state.session;

  return ({
    userFetching,
    userError
  });
};

export default connect(mapStateToProps, { signIn })(SignIn);
