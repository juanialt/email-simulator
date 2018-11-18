import React from "react";
import { connect } from "react-redux";
import { getInbox } from "../../reducers/messages";

import s from "./styles.scss";

class Dashboard extends React.Component {

  componentDidMount() {
    const { user } = this.props;

    console.log("-------");
    console.log(user);
    console.log("-------");

    this.props.getInbox(user.id);
  }

  render() {
    const { emailsSent } = this.props;

    console.log("------");
    console.log(emailsSent);
    console.log("------");

    return (
      <div className={s.root}>
        EMAIL Dashboard
        {emailsSent && emailsSent.map(email => <div key={email.message_id}>{email.subject}</div>)}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { user } = state.session;
  const { emailsSent } = state.messages;

  return ({
    user,
    emailsSent
  });
};

export default connect(mapStateToProps, {
  getInbox
})(Dashboard);
