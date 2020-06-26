import React, { Component } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

class ReviewStatusBar extends Component {
  constructor() {
    super();
    this.state = {
      width: 0
    };

    this._toValue = 1;
    this._progress = new Animated.Value(0);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.items.length !== this.props.items.length) {
      this._toValue = nextProps.items.length >= this.props.items.length ? 1 : 0;
      setTimeout(() => {
        Animated.spring(this._progress, {
          toValue: this._toValue,
          speed: 30,
          bounciness: 0
        }).start(() => (this._progress = new Animated.Value(0)));
      }, 100);
    }
  }

  render() {
      let views = [];
      for (let i = 0; i < this.props.maxCompetencyCount; i++) {
          if(i === 0) {
            views.push( <View key={i}
                onLayout={({ nativeEvent }) =>
                    this.setState({ width: nativeEvent.layout.width })
                }
                style={[styles.barStyle, this.getBackground(i+1)]}
            >
              <Animated.View
                  style={[styles.absoluteBar, this.getProgressStyle(i+1)]}
              />
            </View>)
          } else {
              views.push(<View key={i} style={[styles.barStyle, this.getBackground(i+1)]}>
                <Animated.View
                    style={[styles.absoluteBar, this.getProgressStyle(i+1)]}
                />
              </View>);
          }
      }
    return (
      <View style={styles.barDisplayType}>
          {views}
      </View>
    );
  }

  getProgressStyle = counter => {
    if (this.props.items.length && counter === this.props.items.length) {
      return {
        width: this.state.width,
        height: 8,
        backgroundColor: 'rgb(75,145,226)',
        transform: [
          {
            translateX: this._progress.interpolate({
              inputRange: [0, 1],
              outputRange: [-this.state.width, 0]
            })
          }
        ]
      };
    }
  };

  getBackground = counter => {
    if (this.props.items.length && counter <= this.props.items.length) {
      return { backgroundColor: 'rgb(75,145,226)' };
    }
  };
}

const styles = StyleSheet.create({
  barDisplayType: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  barStyle: {
    width: 60,
    height: 8,
    overflow: 'hidden',
    marginHorizontal: 4,
    position: 'relative',
    backgroundColor: '#C2C2C2'
  },
  absoluteBar: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'absolute',
    paddingHorizontal: 2
  }
});

export default ReviewStatusBar;
