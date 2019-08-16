import React from "react";
import PropTypes from "prop-types";
import { Route, Switch } from "react-router-dom";
import { connect } from "react-redux";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AppHeader from "../components/AppHeader";
import Navbar from "../components/Navbar/Navbar";
import Dashboard from "../containers/Dashboard";
import NewEmail from "../containers/NewEmail";

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
          <Switch>
            <Route exact path="/mails/inbox" component={Dashboard} />
            <Route exact path="/mails/sent" component={Dashboard} />
            <Route path="/mails/:label" component={Dashboard} />
            <Route path="/newemail" component={NewEmail} />
          </Switch>
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
