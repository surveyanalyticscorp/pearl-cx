import React, { Component } from 'react';
import { View, Text, Image, Platform, Easing, Animated } from 'react-native';

import styles from './styles';
import FlipView from './FlipView';
import ReviewStatusBar from '../ReviewStatusBar';

class ReviewFlipAnimationView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isFlipped: false,
      hasFinished: false,
      animatedValue: new Animated.Value(0)
    };

    this._mount = false;
  }

  componentDidMount() {
    this._mount = true;
  }

  componentWillUnmount() {
    this._mount = false;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.items.length === 0) {
      this.setState({
        isFlipped: false,
        hasFinished: false,
        animatedValue: new Animated.Value(0)
      });
    } else {
      if (nextProps.items.length !== this.props.items.length) {
        this._mount && this.setState({ isFlipped: true });
      }

      if (nextProps.items.length === this.props.maxCompetencyCount) {
        setTimeout(() => {
          this._mount &&
            this.setState({ hasFinished: true }, () => {
              Animated.spring(this.state.animatedValue, {
                speed: 50,
                toValue: 1,
                velocity: 8,
                bounciness: 0
              }).start();
            });
        }, 500);
      }
    }
  }

  _renderFront() {
    return (
      <View style={styles.container}>
        <Text style={styles.headingTxt}>
          {this.props.headerText || 'Select any three'}
        </Text>
      </View>
    );
  }

  _renderBack(items, showInTransition) {
    if (!this.state.hasFinished) {
      return this._renderStatusBar(items, showInTransition);
    }
    return this._renderConfirmation();
  }

  _getImageUri(src) {
    if (Platform.OS === 'android') {
      return { uri: `asset:/${src}` };
    }

    return { uri: src };
  }

  _renderStatusBar = (items, showInTransition) => (
    <Animated.View
      style={[
        styles.statusBar,
        {
          transform: [
            {
              scaleY: this.state.animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0]
              })
            }
          ]
        }
      ]}
    >
      <ReviewStatusBar maxCompetencyCount={this.props.maxCompetencyCount} items={items} showInTransition={showInTransition} />
    </Animated.View>
  );

  _renderConfirmation = () => (
    <Animated.View
      style={[
        styles.complete,
        {
          transform: [
            {
              scaleY: this.state.animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1]
              })
            }
          ]
        }
      ]}
    >
      <Image source={this._getImageUri('check_greenBg.png')} style={{ width: 22, height: 22 }} />
      <Text style={styles.completeText}>Complete! Nice Job!</Text>
    </Animated.View>
  );

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <FlipView
          style={{ flex: 1 }}
          front={this._renderFront()}
          back={this._renderBack(this.props.items, this.props.showInTransition)}
          isFlipped={
            this.props.showInTransition || this.props.items.length > 0
              ? true
              : this.state.isFlipped
          }
          flipAxis="x"
          flipEasing={Easing.out(Easing.ease)}
          flipDuration={600}
          perspective={500}
        />
      </View>
    );
  }
}

export default ReviewFlipAnimationView;
