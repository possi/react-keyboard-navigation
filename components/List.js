import React from 'react';
import Group from '../Group';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class List extends React.Component {
  state = {
    active: false
  };
  static defaultProps = {
    component: 'ul',
    isGroupDefault: false
  };
  static propTypes = {
    component: PropTypes.node
  };

  render() {
    const {isGroupDefault, ...props} = this.props;
    props.className = classNames(props.className, {
      'active': this.state.active
    });
    const component = React.createElement(this.props.component, props);
    return <Group isGroupDefault={isGroupDefault} ref={el => this.group = el} onKeyboardFocus={act => this.setState({active: act})}>{component}</Group>
  }
}