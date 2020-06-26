import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

import Everyone from '../../employeeList/Everyone/Everyone';
import MyNetwork from '../../employeeList/MyNetwork/MyNetwork';
import SegmentedControl from '../../segmentControl/SegmentControl';

const menuSegment = {
  MY_NETWORK: 0,
  EVERYONE: 1
};

class PraiseNew extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isScrollDown: false,
      selectedSegment: props.selectedSegment || menuSegment.MY_NETWORK
    };
  }

  onTabChange = index => {
    this.setState({ selectedSegment: index });
  };

  switchView = () => {
    const origin = 'PRAISE';

    switch (this.state.selectedSegment) {
      case menuSegment.MY_NETWORK:
        return <MyNetwork origin={origin} />;
      case menuSegment.EVERYONE:
        return <Everyone origin={origin} />;
    }
  };

  render() {
    return (
      <View style={styles.mainContainer}>
        <SegmentedControl
          values={['MY NETWORK', 'EVERYONE']}
          onValueChange={index => this.onTabChange(index)}
          selectedIndex={this.state.selectedSegment}
        />
        <View style={styles.contentContainer}>{this.switchView()}</View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  contentContainer: {
    flex: 1
  }
});

export default PraiseNew;
