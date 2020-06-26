import React, { Component } from 'react';
import { View, Animated } from 'react-native';
import styles from './Style';

class AnimateToast extends Component {
  constructor(props) {
    super(props);
    this.animatedToast = new Animated.Value(0);
  }

  componentWillReceiveProps(props) {
    if (this.props.showToast !== props.showToast) {
      this._animate();
    }
  }

  _animate() {
    this.animatedToast.setValue(0);
    Animated.spring(this.animatedToast, {
      speed: 50,
      toValue: 1,
      velocity: 8,
      bounciness: 0
    }).start(() => {
      this.props.onAfterToastDisplay && this.props.onAfterToastDisplay(true);
    });
  }

  render() {
    const { showToast, children } = this.props;

    if (!showToast) {
      return <View />;
    }

    const scaleY = this.animatedToast.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1]
    });

    return (
      <Animated.View
        style={[
          styles.headerMsg,
          {
            transform: [{ scaleY }, { perspective: 10000 }]
          }
        ]}
      >
        {children}
      </Animated.View>
    );
  }
}

export default AnimateToast;
