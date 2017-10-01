import React from 'react';
import PropTypes from 'prop-types';
import {keyboardNavType} from './helper';
import Group, {Actions} from './Group';

export default class KeyboardNavigation extends Group {
  static defaultProps = {
    enabled: true,
    keyboardMap: {
      'F6': Actions.NEXT,
    }
  };
  static propTypes = {
    enabled: PropTypes.bool,
    keyboardMap: PropTypes.object
  };
  getChildContext() {
    return {
      ...super.getChildContext(),
      keyboardNavigationParent: this
    };
  }
  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown.bind(this), false);
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown.bind(this), false);
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.selectedIndex !== this.state.selectedIndex) {
      if (prevState.selectedIndex !== -1) {
        this.childs[prevState.selectedIndex].passKeyboardFocus(false);
      }
      if (this.state.selectedIndex !== -1) {
        console.log(this.childs, this.state.selectedIndex);
        this.childs[this.state.selectedIndex].passKeyboardFocus(true);
      }
    }
  }
  onKeyDown(e) {
    if (this.props.enabled) {
      //console.log(e)
      if (this.props.keyboardMap[e.key]) {
        this.doAction(this.props.keyboardMap[e.key]);
        e.preventDefault();
      } else if (this.state.selectedIndex !== -1) {
        this.childs[this.state.selectedIndex].passOnKeyDown(e);
      }
    }
  }

  render() {
    return React.Children.only(this.props.children);
  }
}

