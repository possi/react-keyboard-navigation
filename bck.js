import React from 'react';
import PropTypes from 'prop-types';

export const keyboardNavType = {
  CONTEXT_CONTAINER: Symbol('keyboardNavigation.context_container'),
  GROUP: Symbol('keyboardNavigation.group'),
  ITEM: Symbol('keyboardNavigation.item')
};

export default class KeyboardNavigation extends React.Component {
  childs = [];
  static defaultProps = {
    enabled: true
  };
  static propTypes = {
    enabled: PropTypes.bool
  };
  static childContextTypes = {
    keyboardNavigationParent: PropTypes.object,
    keyboardNavigationParentType: PropTypes.oneOf(Object.values(keyboardNavType))
  };
  getChildContext() {
    return {
      keyboardNavigationParentType: keyboardNavType.CONTEXT_CONTAINER,
      keyboardNavigationParent: this
    };
  }
  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown.bind(this), false);
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown.bind(this), false);
  }
  onKeyDown(e) {
    if (this.props.enabled) {
      console.log(e)
    }
  }
  registerChild(element) {
    this.childs.push(element);
  }

  render() {
    let cls="keyboard-context";
    return <div className={cls}>
      {this.props.children}
    </div>;
  }
}

export class Group extends React.Component {
  state = {
    in: false
  };
  componentDidMount() {
    this.context.keyboardNavigationParent.registerChild(this);
  }
  render() {
    let cls = 'keyboard-group';
    if (this.state.in) {
      cls += " active";
    }
    return <div className={cls}>
      {this.props.children}
    </div>;
  }
}
Group.contextTypes = {
  keyboardNavigationParent: PropTypes.object,
  keyboardNavigationParentType: PropTypes.oneOf(Object.values(keyboardNavType))
};

export class Item extends React.Component {
  state = {
    active: false
  };
  componentDidMount() {
    this.context.keyboardNavigationParent.registerChild(this);
  }
  render() {
    let cls = 'keyboard-item';
    if (this.state.active) {
      cls += "active";
    }
    return <div className={cls}>
      {this.props.children}
    </div>;
  }
}
Item.contextTypes = {
  keyboardNavigationParent: PropTypes.object,
  keyboardNavigationParentType: PropTypes.oneOf(Object.values(keyboardNavType))
};
