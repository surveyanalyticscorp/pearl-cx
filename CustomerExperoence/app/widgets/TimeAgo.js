import React, {Component} from 'react';
import {Text} from 'react-native';
import moment from 'moment';

export default class TimeAgo extends Component {
  componentDidMount() {
    var {interval} = this.props;
    this.setInterval(this.update, interval);
  }
  componentWillUnmount() {
    this.clearInterval(this.update);
  }
  update() {
    this.forceUpdate();
  }
  render() {
    return (
      <Text {...this.props}>
        {moment(this.props.time).fromNow(this.props.hideAgo)}
      </Text>
    );
  }
  clearInterval() {
    this.props.interval = 0;
  }
  setInterval(interval) {
    this.props.interval = interval;
  }
}

TimeAgo.defaultProps = {
  hideAgo: false,
  interval: 60000,
};
