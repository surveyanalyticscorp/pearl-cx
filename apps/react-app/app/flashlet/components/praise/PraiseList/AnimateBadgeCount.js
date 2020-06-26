import React, { Component } from 'react';
import { Text, View, Animated, Easing } from 'react-native';

class AnimateBadgeCount extends Component {
  constructor(props) {
    super(props);
    this._animateBadgeCount = new Animated.Value(0);
    this.animateRowId = 0;
  }

  componentWillReceiveProps(props) {
    if (this.props.count !== props.count) {
      this.animateRowId = props.animateRowId;
      this._animate();
    }
  }

  _animate() {
    this._animateBadgeCount.setValue(0);
    Animated.timing(this._animateBadgeCount, {
      toValue: 1,
      duration: 600,
      easing: Easing.linear
    }).start();
  }

  _getAnimationText() {
    return {
      fontSize: this._animateBadgeCount.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [18, 15, 12],
        extrapolate: 'clamp'
      }),
      transform: [
        {
          rotateY: this._animateBadgeCount.interpolate({
            inputRange: [0, 1],
            outputRange: ['180deg', '0deg'],
            extrapolate: 'clamp'
          })
        }
      ]
    };
  }

  render() {
    const { style, count, animateRowId } = this.props;

    if (this.animateRowId !== animateRowId) {
      return <Text style={style}>{count}</Text>;
    }

    return <Animated.Text style={[style, this._getAnimationText()]}>{count}</Animated.Text>;
  }
}

export default AnimateBadgeCount;
