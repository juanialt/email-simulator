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
    // const { user } = this.props;
    // this.props.getInbox(user.id);

    const pathName = (this.props.location && this.props.location.pathname) || "";

    if (pathName.includes("inbox")) {
      this.props.getReceivedMessages();
    }

    if (pathName.includes("sent")) {
      this.props.getSentMessages();
    }
  }

  // componentDidUpdate(prevProps) {
  //   const pathName = (this.props.location && this.props.location.pathname) || "";

  //   if (pathName.includes("inbox") && this.props.emailsReceived !== prevProps.emailsReceived) {
  //     this.props.getReceivedMessages();
  //   }

  //   if (pathName.includes("sent") && this.props.emailsSent !== prevProps.emailsSent) {
  //     this.props.getSentMessages();
  //   }
  // }

  renderInbox = () => {
    const { emailsReceived } = this.props;

    return (
      <div className={s.root}>
        <h1>Bandeja de Entrada</h1>

        {emailsReceived.length === 0 && <h3>No recibiste ningun email todavia...</h3>}

        {/* {emailsReceived && emailsReceived.map(email =>
          <div className={s.email} key={email.id}>
            <div className={s.sender}>{`${email.senderFirstname || ""} ${email.senderLastname || ""}`.trim()}</div>
            <div className={s.subject}>{email.subject}</div>
            <div className={s.date}>{moment(email.date).format("MMM D, YYYY | HH:mm:ss")}</div>
          </div>
        )} */}

        {/* orderBy(users, ['user', 'age'], ['asc', 'desc']); */}


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

        {/* {emailsSent && emailsSent.map(email =>
          <div className={s.email} key={email.id}>
            <div className={s.sender}>{`${email.senderFirstname || ""} ${email.senderLastname || ""}`.trim()}</div>
            <div className={s.subject}>{email.subject}</div>
            <div className={s.date}>{moment(email.date).format("MMM D, YYYY | HH:mm:ss")}</div>
          </div>
        )} */}
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
