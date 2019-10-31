import React from "react";
import PropTypes from "prop-types";
import { Route, Switch } from "react-router-dom";
import { connect } from "react-redux";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AppHeader from "./AppHeader";
import Navbar from "./Navbar/Navbar";
import NewEmail from "../containers/NewEmail";

import "./AppContainer.scss";
// import EmailsSent from "../containers/EmailsSent/EmailSent";
// import EmailsReceived from "../containers/EmailsReceived/EmailsReceived";
// import EmailsLabel from "../containers/EmailsLabel/EmailsLabel";
import Emails from "../containers/Emails/Emails";

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
            <Route exact path="/mails/inbox" component={Emails} />
            <Route exact path="/mails/sent" component={Emails} />
            <Route path="/mails/:label" component={Emails} />
            {/* <Route exact path="/mails/inbox" component={EmailsReceived} />
            <Route exact path="/mails/sent" component={EmailsSent} />
            <Route path="/mails/:label" component={EmailsLabel} /> */}
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
