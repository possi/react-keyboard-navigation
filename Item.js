import React from 'react';
import PropTypes from 'prop-types';
import {keyboardNavType} from './helper';

export default class Item extends React.Component {
  state = {
    active: false
  };
  static contextTypes = {
    keyboardNavigationParent: PropTypes.object,
    keyboardNavigationParentType: PropTypes.oneOf(Object.values(keyboardNavType))
  };
  static defaultProps = {
    onKeyboardFocus: active => {}
  };
  static childContextTypes = {
    keyboardNavigationParent: PropTypes.object,
    keyboardNavigationParentType: PropTypes.oneOf(Object.values(keyboardNavType))
  };
  getChildContext() {
    return {
      keyboardNavigationParentType: keyboardNavType.ITEM,
      keyboardNavigationParent: null
    };
  }
  passKeyboardFocus(focus) {
    this.setState({active: focus});
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.active !== this.state.active) {
      this.props.onKeyboardFocus(this.state.active);
    }
  }
  passOnKeyDown(e) {
    if (e.key === 'Enter') {
      if (this.element.onClick) {
        this.element.onClick(e);
      }
    }
  }
  componentDidMount() {
    this.context.keyboardNavigationParent.registerChild(this);
  }
  componentWillUnmount() {
    this.context.keyboardNavigationParent.unregisterChild(this);
  }
  render() {
    return React.cloneElement(React.Children.only(this.props.children), {
      ref: (el) => this.element = el
    });
  }
}
