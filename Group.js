import React from 'react';
import PropTypes from 'prop-types';
import {keyboardNavType} from './helper';

export const Actions = {
  NEXT: Symbol('keyboardNavigation.group.next'),
  PREV: Symbol('kayboardNavigation.group.prev')
};

export default class Group extends React.Component {
  state = {
    selectedIndex: -1,
    in: false,
  };
  childs = [];
  static contextTypes = {
    keyboardNavigationParent: PropTypes.object,
    keyboardNavigationParentType: PropTypes.oneOf(Object.values(keyboardNavType))
  };
  static childContextTypes = {
    keyboardNavigationParent: PropTypes.object,
    keyboardNavigationParentType: PropTypes.oneOf(Object.values(keyboardNavType))
  };
  static propTypes = {
    onKeyboardFocus: PropTypes.func,
    keyboardMap: PropTypes.object,
    isGroupDefault: PropTypes.bool
  };
  static defaultProps = {
    isGroupDefault: false,
    onKeyboardFocus: active => {},
    keyboardMap: {
      'ArrowDown': Actions.NEXT,
      'ArrowUp': Actions.PREV
    }
  };
  getChildContext() {
    return {
      keyboardNavigationParentType: keyboardNavType.GROUP,
      keyboardNavigationParent: this
    };
  }
  passKeyboardFocus(focus) {
    const stateUpdate = {in: focus};
    if (!focus && this.state.selectedIndex !== -1) {
      stateUpdate.selectedIndex = -1;
    }
    this.setState(stateUpdate);
  }
  passOnKeyDown(e) {
    if (this.props.keyboardMap[e.key]) {
      this.doAction(this.props.keyboardMap[e.key]);
      e.preventDefault();
    } else if (this.state.selectedIndex !== -1) {
      this.childs[this.state.selectedIndex].passOnKeyDown(e);
    }
  }
  doAction(action) {
    switch (action) {
      case Actions.NEXT:
        this.moveSelection(1);
        break;
      case Actions.PREV:
        this.moveSelection(-1);
        break;
    }
  }
  moveSelection(idx) {
    let newIndex = this.state.selectedIndex + idx;
    if (newIndex < 0) {
      newIndex = this.childs.length - 1;
    } else if (newIndex >= this.childs.length) {
      newIndex = 0;
    }
    this.setState({selectedIndex: newIndex});
  }
  componentDidMount() {
    this.context.keyboardNavigationParent.registerChild(this, this.props.isGroupDefault);
  }
  componentWillUnmount() {
    this.context.keyboardNavigationParent.unregisterChild(this);
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.selectedIndex !== this.state.selectedIndex) {
      if (prevState.selectedIndex !== -1) {
        this.childs[prevState.selectedIndex].passKeyboardFocus(false);
      }
      if (this.state.selectedIndex !== -1) {
        this.childs[this.state.selectedIndex].passKeyboardFocus(true);
      }
    }
    if (prevState.in !== this.state.in) {
      this.props.onKeyboardFocus(this.state.in);
    }
  }
  registerChild(element, isDefault) {
    this.childs = this.childs.concat([element]);
    if (this.state.selectedIndex === -1 && isDefault) {
      this.setState({selectedIndex: this.childs.length - 1});
    }
  }
  unregisterChild(element) {
    let current = this.selectedIndex > -1 ? this.childs[this.selectedIndex] : null;
    this.childs = this.childs.filter((el) => el !== element);
    if (current) {
      let newIndex = this.childs.indexOf(current);
      if (newIndex > -1) {
        this.setState({selectedIndex: newIndex});
      }
    }
  }
  render() {
    return React.Children.only(this.props.children);
  }
}
