import React, { Component } from 'react';
import { View, Image, ActivityIndicator, Platform } from 'react-native';

import styles from './EmployeeViewStyle';

class EmployeeImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }

  render() {
    let loader = this.state.loading ? (
      <View>
        <ActivityIndicator style={styles.loading} color="black" />
      </View>
    ) : null;

    return <Image source={{ uri: this.props.source }} style={styles.employeeImage} />
  }
}

export default EmployeeImage;
