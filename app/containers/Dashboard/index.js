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
    return (
      <div className={s.root}>
        EMAIL Dashboard
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { user } = state.session;

  return ({
    user
  });
};

export default connect(mapStateToProps, {
  getInbox
})(Dashboard);
