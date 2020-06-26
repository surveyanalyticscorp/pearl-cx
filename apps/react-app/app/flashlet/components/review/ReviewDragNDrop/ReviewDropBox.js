import React, { Component } from 'react';
import { Animated, LayoutAnimation, View, Text } from 'react-native';

import styles from './style';

const boxColors = [
  { boxNumber: 1, boxColor: '#cd4444' },
  { boxNumber: 2, boxColor: '#f8c268' },
  { boxNumber: 3, boxColor: '#8bde2f' },
  { boxNumber: 4, boxColor: '#729e3d' }
];

export default class ReviewDropBox extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillReceiveProps({ dragOver }) {
    if (dragOver !== this.props.dragOver) LayoutAnimation.easeInEaseOut();
  }

  getBoxColor(boxNumber) {
    const colors = boxColors.filter(color => color.boxNumber === boxNumber);

    if (colors) {
      const color = colors[0];
      return { backgroundColor: color.boxColor };
    }

    return null;
  }

  render() {
    const boxHeight = Math.round(this.props.boxHeight);
    const boxWidth = Math.round(this.props.boxWidth);

    if (!(boxHeight > 0)) {
      return <View />;
    }

    return (
      <Animated.View
        key={`${this.props.id}-${this.props.hasOpenSidebar}`}
        style={[
          this.props.customStyle,
          { height: boxHeight, width: this.props.animateWidth }
        ]}
      >
        <View
          style={
            this.props.hasOpenSidebar
              ? [
                  styles.boxOverlay,
                  this.getBoxColor(this.props.id),
                  {
                    height: boxHeight - 6,
                    width: boxWidth - 6
                  }
                ]
              : styles.boxWrapper
          }
        >
          <View style={styles.center}>
            {this.props.items.length > 0 &&
              this.props.items.map((item, i) => {
                return (
                  <View key={`itemtitle-${i}`} style={styles.titleWrapper}>
                    <Text
                      style={[styles.dropItemTitle, { width: boxWidth - 15 }]}
                    >
                      {item.name}
                    </Text>
                  </View>
                );
              })}
          </View>
        </View>
      </Animated.View>
    );
  }
}
