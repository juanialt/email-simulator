import React, { PropTypes } from 'react';

class MyTitle extends React.Component {

  static propTypes = {
    color: PropTypes.string,
    title: PropTypes.string
  };

  render() {
    const style = { color: this.props.color };
    const title = this.props.title;

    return (
      <div>
        <h1 style={style}>{title}</h1>
      </div>
    );
  }
}

export default MyTitle;
