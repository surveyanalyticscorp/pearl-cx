import React, { Component } from 'react';
import { Text, View, Animated, TouchableOpacity, Image, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const { height } = Dimensions.get('window');

import styles from './AnimateBadgeGivenStyle';

class AnimateBadgeGiven extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hide: false
    };
    this._animateBadgeUser = new Animated.Value(0);
  }

  componentDidMount() {
    this._animate(true);
  }

  _animate(showModal) {
    this._animateBadgeUser.setValue(0);
    Animated.spring(this._animateBadgeUser, {
      toValue: 1,
      velocity: 3,
      tension: 2,
      friction: 8
    }).start(() => {
      if (showModal) this._onClose();
    });
  }

  _getBadgeAnimation() {
    const from = this.state.hide ? 5 : height - 50;
    const to = this.state.hide ? height - 50 : 5;

    return {
      top: this._animateBadgeUser.interpolate({
        inputRange: [0, 1],
        outputRange: [from, to],
        extrapolate: 'clamp'
      }),
      opacity: this._animateBadgeUser.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [this.state.hide ? 1 : 0, 0.5, this.state.hide ? 0 : 1],
        extrapolate: 'clamp'
      })
    };
  }

  _onClose() {
    this.setState({ hide: true }, () => {
      this._animate(false);
    });

    setTimeout(() => {
      this.props.hideModal(this.props.praiseNewBadge.selectedBadge);
    }, 1300);
  }

  render() {
    const { badgeUser, badgeName, badgeUserImage } = this.props;

    return (
      <Animated.View style={[styles.container, this._getBadgeAnimation()]}>
        <View style={[styles.content]}>
          <View style={styles.title}>
            <Text style={styles.textEmployee}>You gave {badgeUser} an</Text>
            <Text style={styles.textBadgeName}>{badgeName}</Text>
            <Text style={styles.textAward}>Award!</Text>
          </View>
          <Image source={{ uri: badgeUserImage }} style={styles.badgeUser} />
          <Text style={styles.textNumber}>+1</Text>
        </View>
      </Animated.View>
    );
  }
}

export default AnimateBadgeGiven;
