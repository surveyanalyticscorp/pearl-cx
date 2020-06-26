import React from 'react';
import { Animated, StyleSheet, Easing } from 'react-native';

class SlideView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
    this._animateSlideView = new Animated.Value(0);
  }

  componentDidMount() {
    Animated.timing(this._animateSlideView, {
      toValue: this.props.value || 50,
      duration: this.props.duration || 50,
      easing: Easing.easeInOutQuad
    }).start();
  }

  slideView = (from = 0, value) => {
    return {
      opacity: this._animateSlideView.interpolate({
        inputRange: [0, value / 2, value],
        outputRange: [0, 0.5, 1],
        extrapolate: 'clamp'
      }),
      transform: [
        {
          translateX: this._animateSlideView.interpolate({
            inputRange: [0, value],
            outputRange: [from, 0],
            extrapolate: 'clamp'
          })
        }
      ]
    };
  };

  render() {
    const traslateFrom = this.props.translateFrom || 50;
    const value = this.props.value || 50;

    return (
      <Animated.View style={[{ flex: 1 }, this.slideView(traslateFrom, value)]}>
        {this.props.children}
      </Animated.View>
    );
  }
}

export default SlideView;
