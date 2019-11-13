import React from "react";
import PropTypes from "prop-types";
import { Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AppHeader from "./AppHeader";
import Navbar from "./Navbar/Navbar";
import NewEmail from "../containers/NewEmail";
import Emails from "../containers/Emails/Emails";

import s from "./AppContainer.scss";

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
      <section className={"app-container-component"}>
        {this.props.user && <AppHeader user={this.props.user} />}
        <section className={s.content}>
          <Navbar />
          <Switch>
            <Route path="/mails/:label" component={Emails} />
            <Route exact path="/newemail" component={NewEmail} />
            <Route path="/newemail/:data" component={NewEmail} />
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
