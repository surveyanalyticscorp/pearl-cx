import React, { Component } from 'react';
import {
  View,
  Text
} from 'react-native';

import styles from './styles';

export default class ProgessSteps extends Component {

  constructor(props) {
    super(props)

    this._initialSetup();
  }

  _initialSetup() {
    this.progress = this.props.progress / this.props.maxSteps * 10;
    if (this.progress > this.props.maxSteps) this.progress = this.props.maxSteps;
    if (this.progress < 0) this.progress = 0;
  }

  renderSingleStep = (key, active = false) =>
    <View key={key} style={{ width: this.props.stepSize, height: this.props.stepSize, backgroundColor: active ? this.props.progressColor : this.props.unProgressedColor }} />

  renderProgress = () => {
    var steps = [];
    for (i = 1; i <= this.props.maxSteps; i++) {
      steps.push(this.renderSingleStep(i, i <= this.progress))
    }
    return steps;
  }

  render() {
    return (
      <View style={[styles.mainContainer, { justifyContent: 'space-between' }]}>
        {
          this.renderProgress()
        }
      </View>
    );
  }

}
