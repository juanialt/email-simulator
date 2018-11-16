import React, { Component } from 'react';
// import { findDOMNode } from 'react-dom';

import PropTypes from 'prop-types';
import Ps from 'perfect-scrollbar';

import { omit } from 'lodash/fp';

import { getStyle } from 'browser-utils';

const Scrollbar = (ComposedComponent, scrollOptions) => class extends Component {
    //
    // static propTypes = {
    //     // REF https://github.com/noraesae/perfect-scrollbar
    //     scrollOptions: PropTypes.object,
    //     scrollWarning: PropTypes.bool
    // };
    //
    // static defaultProps = {
    //     scrollOptions: {},
    //     scrollWarning: true
    // };
    //
    // decorate() {
    //     const el = findDOMNode(this);
    //     const { scrollOptions, scrollWarning } = this.props;
    //     if (scrollWarning && getStyle(el, 'position') !== 'relative') {
    //         console.warn('Perfect Scrollbar requires the element to have a "position: relative" style for it to work proper.', el);
    //     }
    //     Ps.initialize(el, scrollOptions);
    // }
    //
    // clean() {
    //     const el = findDOMNode(this);
    //     Ps.destroy(el);
    // }
    //
    // componentDidMount = () => this.decorate();
    // componentWillUpdate = () => this.clean();
    // componentDidUpdate = () => this.decorate();
    // componentWillUnmount = () => this.clean();
    //
    // render() {
    //     const props = omit(['scrollOptions', 'scrollWarning'], this.props);
    //     return <ComposedComponent {...props} />;
    // }
};

export default Scrollbar;
