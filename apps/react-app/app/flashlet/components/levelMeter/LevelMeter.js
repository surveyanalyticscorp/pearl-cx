import React, { Component } from 'react';
import {
  View,
  Dimensions,
  Animated,
  TouchableWithoutFeedback
} from 'react-native';

import styles from './styles';
import { getColor } from '../../utils/levelColors';

const width = Dimensions.get('window').width;

const levelStatuses = {
  HIGHER: 'HIGHER',
  EQUALORLOWER: 'EQUALORLOWER'
};

class LevelMeter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      previousLevel: 0,
      hasanimated: false,
      currentLevel: props.currentLevel || 0,
      backgroundAnimated: new Animated.Value(0)
    };

    this.levels = props.levels || 4;
  }

  componentDidMount() {
    setTimeout(() => {
      Animated.timing(this.state.backgroundAnimated, {
        toValue: 1,
        duration: 0
      }).start(() =>
        this.setState({ backgroundAnimated: new Animated.Value(0) })
      );
    }, 10);
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.currentLevel !== this.props.currentLevel &&
      nextProps.currentLevel <= this.levels
    ) {
      this.setState(
        {
          currentLevel: nextProps.currentLevel,
          previousLevel: this.props.currentLevel
        },
        () => {
          Animated.timing(this.state.backgroundAnimated, {
            toValue: 1,
            duration: 0
          }).start(() =>
            this.setState({ backgroundAnimated: new Animated.Value(0) }, () =>
              this.props.onLevelChange(nextProps.currentLevel, true)
            )
          );
        }
      );
    }
  }

  render() {
    return <View style={styles.container}>{this._renderLevels()}</View>;
  }

  /**
   * Render level bars according to the number of level.
   *
   * @returns {jsx}
   */
  _renderLevels = () => {
    let levels = [];

    let hitSlopHeight = 20;

    for (let i = 1; i <= this.levels; i++) {
      levels.push(
        <TouchableWithoutFeedback
          key={i}
          hitSlop={{
            top: hitSlopHeight,
            left: 0,
            bottom: hitSlopHeight,
            right: 0
          }}
          onPressIn={() => this._handlePress(i)}
        >
          {this._renderLevel(i)}
          {/* </View> */}
        </TouchableWithoutFeedback>
      );
    }

    return <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>{levels}</View>;
  };

  /**
   * Renders a level. Additional computation to set backgroundColor.
   *
   * @param {number} level
   * @returns {jsx}
   */
  _renderLevel = level => {
    let levelStyle = {
      height: 10,
      width: (this.props.width || width) / this.levels - this.props.gap || 10
    };

    let interpolateToBackgroundColor = getColor(this.state.currentLevel);
    let interpolateFromBackgroundColor = getColor(this.state.previousLevel);

    let backgroundColorInterpolate = this.state.backgroundAnimated.interpolate({
      inputRange: [0, 1],
      outputRange: [
        interpolateFromBackgroundColor,
        interpolateToBackgroundColor
      ]
    });

    let levelStatus = this._getLevelStatus(level);

    switch (levelStatus) {
      case levelStatuses.EQUALORLOWER:
        levelStyle = {
          ...levelStyle,
          backgroundColor: backgroundColorInterpolate
        };
        break;

      case levelStatuses.HIGHER:
      default:
        levelStyle = { ...levelStyle, backgroundColor: '#cccccc' };
    }

    return <Animated.View style={levelStyle} />;
  };

  /**
   * Get level status to set interpolate range for background color.
   *
   * @param {number} level
   * @returns {string}
   */
  _getLevelStatus = level => {
    if (level <= this.state.currentLevel) {
      return levelStatuses.EQUALORLOWER;
    }

    return levelStatuses.HIGHER;
  };

  /**
   * Handle a levelBar press.
   *
   * @param {number} index
   * @returns {undefined}
   */
  _handlePress = index => {
    if (this.state.currentLevel === index) {
      return this.setState({ backgroundAnimated: new Animated.Value(0) }, () =>
        this.props.onLevelChange(index, false)
      );
    }

    this.setState(
      prevState => ({
        currentLevel: index,
        previousLevel: prevState.currentLevel
      }),
      () => {
        Animated.timing(this.state.backgroundAnimated, {
          toValue: 1,
          duration: 0
        }).start(() =>
          setTimeout(() => {
            this.setState({ backgroundAnimated: new Animated.Value(0) }, () =>
              this.props.onLevelChange(index, false)
            );
          }, 100)
        );
      }
    );
  };
}

export default LevelMeter;
