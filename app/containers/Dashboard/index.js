import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import classNames from "classnames";
import orderBy from "lodash/orderBy";
import { getReceivedMessages, getSentMessages } from "../../reducers/messages";
import Email from "../Email/Email";

import s from "./styles.scss";

class Dashboard extends React.Component {

  componentDidMount() {
    const pathName = (this.props.location && this.props.location.pathname) || "";

    if (pathName.includes("inbox")) {
      this.props.getReceivedMessages();
    }

    if (pathName.includes("sent")) {
      this.props.getSentMessages();
    }
  }

  renderInbox = () => {
    const { emailsReceived } = this.props;

    return (
      <div className={s.root}>
        <h1>Bandeja de Entrada</h1>

        {emailsReceived.length === 0 && <h3>No recibiste ningun email todavia...</h3>}

        <section className={classNames("paper-shadow-1", s.emailContainer)}>
          {emailsReceived && orderBy(emailsReceived, ["date"], ["desc"]).map(email =>
            <Email key={email.id} email={email} />
          )}
        </section>
      </div>
    );
  }

  renderSent = () => {
    const { emailsSent } = this.props;

    return (
      <div className={s.root}>
        <h1>Bandeja de Salida</h1>

        {emailsSent.length === 0 && <h3>No enviaste ningun email todavia...</h3>}
        
        <section className={classNames("paper-shadow-1", s.emailContainer)}>
          {emailsSent && orderBy(emailsSent, ["date"], ["desc"]).map(email =>
            <Email key={email.id} email={email} />
          )}
        </section>
      </div>
    );
  }

  render() {
    const pathName = (this.props.location && this.props.location.pathname) || "";

    if (pathName.includes("inbox")) {
      return this.renderInbox();
    }

    return this.renderSent();
  }
}

const mapStateToProps = state => {
  const { user } = state.session;
  const { emailsSent, emailsReceived } = state.messages;

  return ({
    user,
    emailsSent,
    emailsReceived
  });
};

export default withRouter(connect(mapStateToProps, {
  getReceivedMessages, getSentMessages
})(Dashboard));
