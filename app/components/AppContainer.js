import React from "react";
import PropTypes from "prop-types";
import { Route } from "react-router-dom";
import { connect } from "react-redux";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AppHeader from "../components/AppHeader";
import Navbar from "../components/Navbar";
import Dashboard from "../containers/Dashboard";

import "./AppContainer.scss";

class AppContainer extends React.Component {
  static defaultProps = {
    user: null
  };

  static propTypes = {
    users: PropTypes.array,
    userSelected: PropTypes.object
  };

  render() {
    return (
      <section className="app-container-component">
        {this.props.user && <AppHeader user={this.props.user} />}
        <section className="app-container-component-content">
          <Navbar />
          <Route path="/dashboard" component={Dashboard} />
        </section>
        <ToastContainer />
      </section>
    );
  }
}

const mapStateToProps = state => {
  const { user } = state.session;

  return ({
    user
  });
};

export default connect(mapStateToProps)(AppContainer);
