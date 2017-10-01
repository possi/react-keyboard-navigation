import React from 'react';
import Item from '../Item';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class List extends React.Component {
  state = {
    active: false
  };
  static defaultProps = {
    component: 'li'
  };
  static propTypes = {
    component: PropTypes.node
  };

  render() {
    const props = {...this.props};
    props.className = classNames(props.className, {
      'active': this.state.active
    });
    const component = React.createElement(this.props.component, props);
    return <Item ref={el => this.group = el} onKeyboardFocus={act => this.setState({active: act})}>{component}</Item>
  }
}