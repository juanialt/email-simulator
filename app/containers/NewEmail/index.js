import React from "react";
import { connect } from "react-redux";
import { Editor } from "react-draft-wysiwyg";
import { convertToRaw, EditorState, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import classNames from "classnames";
import { toast } from "react-toastify";
import base64 from "base-64";
import { withRouter } from "react-router-dom";

import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import AttachIcon from "@material-ui/icons/AttachFile";

import { sendMessage } from "../../reducers/messages";
import { getUsers } from "../../reducers/users";

import s from "./styles.scss";

class NewEmail extends React.Component {
  state = {
    contentState: null,
    editorState: null,
    htmlCode: "",

    from: this.props.user.username || "",
    to: [],
    subject: "",
    files: null,
    oldFiles: null
  }

  componentDidMount() {
    const urlParams = this.props.match.params.data;

    if (urlParams) {
      const decodedParams = base64.decode(urlParams);
      const params = JSON.parse(decodedParams);
      const { to = [], htmlCode, files = null } = params;

      console.log(htmlCode);

      const blocksFromHTML = htmlToDraft(htmlCode);
      const state = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap,
      );

      const editorState = EditorState.createWithContent(state);

      this.setState({
        to,
        htmlCode,
        editorState,
        oldFiles: files
      });
    }

    this.props.getUsers();
  }

  onContentStateChange = contentState => {
    this.setState({
      contentState
    });
  };

  onEditorStateChange = editorState => {
    this.setState({
      editorState,
      htmlCode: draftToHtml(convertToRaw(editorState.getCurrentContent()))
    });
  };

  handleInputChange = event => {
    const { target } = event;
    const { value, name } = target;

    this.setState({
      [name]: value
    });
  }

  showError = message => {
    toast.error(message, {
      position: toast.POSITION.BOTTOM_LEFT
    });
  }

  validateNewEmail = () => {
    const { from, to } = this.state;

    if (!from) {
      this.showError("Ingrese un Remitente");
      return false;
    }

    if (!to) {
      this.showError("Ingrese por lo menos un Recipiente");
      return false;
    }

    return true;
  }

  handleEmailSend = () => {
    const { htmlCode, from, to, subject, files } = this.state;

    if (this.validateNewEmail()) {
      this.props.sendMessage({ from, to, subject, htmlCode, files });
      this.clearForm();
    }
  }

  clearForm = () => {
    this.setState({
      contentState: null,
      editorState: null,
      htmlCode: "",
      to: [],
      subject: "",
      files: null
    });
  }

  handleFileChange = event => {
    this.setState({
      files: event.target.files
    });
  }

  renderFiles = () => {
    const { files } = this.state;

    const amount = files.length;
    const message = amount > 1 ? `${amount} archivos adjuntos` : `${amount} archivo adjunto`;

    return (
      <div className={s.attachments}>
        <div><p>{message}</p></div>
        <div>
          {Array.from(files).map((file, index) => (
            <p key={index}>{file.name}</p>
          ))}
        </div>
      </div>
    );
  }

  render() {
    const { users } = this.props;
    const { from, to, subject, files, editorState } = this.state;

    const valid = to.length > 0;

    return (
      <div className={s.root}>
        <section className={classNames(s.header, "d-flex flex-column")}>
          <Input
            name="from"
            value={from}
            placeholder="Remitente"
            type="email"
            required
            disabled
            onChange={this.handleInputChange}
          />

          <Select
            multiple
            value={to}
            onChange={this.handleInputChange}
            displayEmpty
            name="to" >
            <MenuItem value={""} disabled>Recipiente</MenuItem>
            {users.map(user => <MenuItem key={user.id} value={user.id}>{user.username}</MenuItem>)}
          </Select>


          <Input
            name="subject"
            value={subject}
            placeholder="Asunto"
            onChange={this.handleInputChange}
            inputProps={{
              maxLength: 255
            }} />
        </section>

        <section className={s.editorContainer}>
          <Editor
            defaultEditorState={editorState}
            editorState={editorState}
            toolbarClassName={s.editorToolbar}
            wrapperClassName={s.editorWrapper}
            editorClassName={s.editorText}
            onEditorStateChange={this.onEditorStateChange}
            onContentStateChange={this.onContentStateChange} />
        </section>

        {files && this.renderFiles()}

        <section className={s.footer}>
          <input
            style={{ display: "none" }}
            type="file"
            name="fileToUpload"
            id="fileToUpload"
            multiple
            onChange={this.handleFileChange} />
          <label htmlFor="fileToUpload" className="m-r-15" title="Adjuntar archivos">
            <Button variant="contained" component="span" color="primary">
              <AttachIcon />
            </Button>
          </label>

          <Button disabled={!valid} variant="contained" color="primary" onClick={this.handleEmailSend}>
            Enviar
          </Button>
        </section>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { user } = state.session;
  const { users } = state.users;

  return ({
    user,
    users
  });
};

export default withRouter(connect(mapStateToProps, {
  sendMessage,
  getUsers
})(NewEmail));
