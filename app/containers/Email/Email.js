import React from "react";
import moment from "moment";
import { truncate } from "lodash";
import classNames from "classnames";
import Checkbox from "@material-ui/core/Checkbox";

import { formatBytes } from "../../../lib/browser-utils";
import constants from "../../constants";
import s from "./styles.scss";

class Email extends React.Component {
  state = {
    isContentVisible: false,
    isSelected: false
  }

  handleToggleContent = () => {
    this.setState({
      isContentVisible: !this.state.isContentVisible
    });
  }

  renderAttachments = () => {
    const { email } = this.props;

    const amount = email.attachments.length;
    const message = amount > 1 ? `${amount} archivos adjuntos` : `${amount} archivo adjunto`;

    return (
      <div className={s.attachments}>
        <div>{message}</div>
        {
          email.attachments.map((attachment, index) => {
            const type = attachment.type.split("/").pop();

            return (
              <a
                title={attachment.name}
                className={s.attachment}
                key={index}
                href={`${constants.SERVER_PATH}/${attachment.path}`}
                target="_blank">
                <img
                  src={`/images/${type}.svg`}
                  onError={event => {
                    event.target.onerror = null;
                    event.target.src = "/images/unknow.svg";
                  }} />

                <div className={s.data}>
                  <span>{attachment.name}</span>
                </div>

                <div className={s.fullData}>
                  <span>{truncate(attachment.name, { length: 35 })}</span>
                  <span>{formatBytes(attachment.size)}</span>
                  <span>{attachment.type}</span>
                </div>
              </a>
            );
          })
        }
      </div>
    );
  }

  handleSelect = event => {
    const { email } = this.props;

    this.setState({
      isSelected: event.target.checked
    });

    if (event.target.checked && this.props.handleSelect) {
      this.props.handleSelect(email);
    }

    if (!event.target.checked && this.props.handleDeselect) {
      this.props.handleDeselect(email);
    }
  }

  render() {
    const { email } = this.props;
    const { isContentVisible, isSelected } = this.state;

    const localTime = moment.utc(email.date).toDate();
    const date = moment(localTime).format("MMM D, YYYY");
    const time = moment(localTime).format("HH:mm:ss");

    const sender = `${email.senderFirstname || ""} ${email.senderLastname || ""}`.trim();
    const recipients = email.recipients.map(recipient => `${recipient.firstname} ${recipient.lastname}`).join(", ");

    return (
      <div key={email.id} className={classNames("paper-shadow-1", s.email, { [s.visible]: isContentVisible })}>
        <div className={s.emailHeaders} onClick={this.handleToggleContent}>

          <div>
            <Checkbox
              checked={isSelected}
              onChange={this.handleSelect}
              onClick={event => event.stopPropagation()}
            />
          </div>

          <div className={s.senderRecipient}>
            <div className={s.sender}>De: {sender}</div>
            <div className={s.recipients}>Para: {recipients}</div>
          </div>
          <div className={s.subject}>{email.subject || "..."}</div>

          <div className={s.date}>
            <span>{date}</span>
            <span>{time}</span>
          </div>
        </div>

        {isContentVisible &&
          <div className={s.emailContent}>
            <div dangerouslySetInnerHTML={{ __html: email.message }} />

            {email.attachments && email.attachments.length > 0 && this.renderAttachments()}
          </div>
        }
      </div>
    );
  }
}

export default Email;
