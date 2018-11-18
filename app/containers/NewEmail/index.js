import React from "react";
import { connect } from "react-redux";
import { Editor } from "react-draft-wysiwyg";
import { convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import s from "./styles.scss";

class NewEmail extends React.Component {
  state = {
    contentState: null,
    editorState: null
  }

  componentDidMount() {
  }

  onContentStateChange = contentState => {
    this.setState({
      contentState
    });
  };

  onEditorStateChange = editorState => {
    this.setState({
      editorState
    });
  };

  handleEmailSend = () => {
    console.log(this.state.contentState);
    console.log("------------");
    console.log(draftToHtml(convertToRaw(this.state.editorState.getCurrentContent())));
    console.log("------------");
  }

  render() {
    return (
      <div className={s.root}>
        NEW EMAIL
        <div onClick={this.handleEmailSend}>SEND!</div>
        <Editor onEditorStateChange={this.onEditorStateChange} onContentStateChange={this.onContentStateChange}/>
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

export default connect(mapStateToProps, null)(NewEmail);
