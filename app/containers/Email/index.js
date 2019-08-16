import React from "react";
import moment from "moment";

import s from "./styles.scss";

class Email extends React.Component {
  state = {
    isContentVisible: false
  }

  handleToggleContent = () => {
    this.setState({
      isContentVisible: !this.state.isContentVisible
    });
  }

  render() {
    const { email } = this.props;
    const date = moment(email.date).format("MMM D, YYYY");
    const time = moment(email.date).format("HH:mm:ss");

    const sender = `${email.senderFirstname || ""} ${email.senderLastname || ""}`.trim();

    console.log(email);
    console.log("=======");

    return (
      <div key={email.id}>
        <div className={s.email} key={email.id} onClick={this.handleToggleContent}>

            <div className={s.sender}>De: {sender}</div>
            <div className={s.recipients}>Para: {sender}</div>
            <div className={s.subject}>{email.subject || "..."}</div>

          <div className={s.date}>
            <span>{date}</span>
            <span>{time}</span>
          </div>
        </div>

        {this.state.isContentVisible &&
          <div className={s.emailContent} dangerouslySetInnerHTML={{ __html: email.message }} />
        }
      </div>
    );
  }
}

export default Email;
