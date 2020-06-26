import React from 'react';
import { Animated } from 'react-native';

const defaultDuration = 3000;
const defaultToValue = 3000;

class FadeInView extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      anim: new Animated.Value(0),
      duration: props.duration > 0 ? props.duration : defaultDuration,
      toValue: props.toValue > 0 ? props.toValue : defaultToValue
    };
  }

  componentDidMount() {
    Animated.timing(this.state.anim, {
      toValue: this.state.toValue,
      duration: this.state.duration
    }).start();
  }

  render() {
    const { style, delay, from, children } = this.props;

    if (!children) return <View/>;

    return (
      <Animated.View style={[style, this.fadeIn(delay, from)]}>
        {children}
      </Animated.View>
    );
  }

  fadeIn = (delay, from = 0) => {
    const { anim } = this.state;
    return {
      opacity: anim.interpolate({
        inputRange: [delay, Math.min(delay + 500, this.state.toValue)],
        outputRange: [0, 1],
        extrapolate: 'clamp'
      }),
      transform: [
        {
          translateY: anim.interpolate({
            inputRange: [delay, Math.min(delay + 500, this.state.toValue)],
            outputRange: [from, 0],
            extrapolate: 'clamp'
          })
        }
      ]
    };
  };
}

export default FadeInView;
