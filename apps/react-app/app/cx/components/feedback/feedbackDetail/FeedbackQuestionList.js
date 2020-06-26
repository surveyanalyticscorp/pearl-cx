import React, { Component } from 'react';
import {

  View
} from 'react-native';

import styles from './styles';
import ProgressSteps from '../../progressStep';
import CustomText from "../../../../global/ui/CustomText";

const progressWidth = 100;

class FeedbackQuestionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data
    }
  }
  render() {
    const item = this.state.data;

    return (
      <View style={styles.surveyContainer}>
        <View style={{ marginBottom: 4 }}>
          <CustomText style={[styles.textBold, styles.textMedium]}>{item.title}</CustomText>
        </View>
        <View style={styles.queryContainer}>
          <View style={styles.query}>
            <CustomText style={[styles.textMedium, styles.grayText]} numberOfLines={3}>{item.query}</CustomText>
          </View>
          <View style={styles.progressContainer}>
            <View style={{ width: progressWidth }}>
              <ProgressSteps
                maxSteps={10}
                progress={item.rating}
                stepSize={8}
                progressColor={item.rating_color}
                unProgressedColor={'gray'}
              />
            </View>
          </View>
        </View>
      </View>
    )
  }

}

export default FeedbackQuestionList;
