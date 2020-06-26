import React, { Component } from 'react';
import { View, Animated, Easing } from 'react-native';

class AnimateStatus extends Component {
  constructor(props) {
    super(props);
    this._animateStatus = new Animated.Value(0);
  }

  componentWillReceiveProps(props) {
    if (this.props.status !== props.status) {
      setTimeout(() => {
        this._animate();
      }, 100);
    }
  }

  _animate() {
    this._animateStatus.setValue(0);
    Animated.timing(this._animateStatus, {
      toValue: 1,
      duration: 400,
      easing: Easing.bounce
    }).start();
  }

  render() {
    const { style, flip } = this.props;

    if (!flip || flip === undefined) {
      return <View style={style} />;
    }

    const rotateX = this._animateStatus.interpolate({
      inputRange: [0, 1],
      outputRange: ['180deg', '0deg'],
      extrapolate: 'clamp'
    });

    return <Animated.View style={[style, { transform: [{ rotateX }] }]} />;
  }
}

export default AnimateStatus;
