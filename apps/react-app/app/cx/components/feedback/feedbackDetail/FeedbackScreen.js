import React, { Component } from 'react';
import {

  View
} from 'react-native';

import styles from './styles';
import FeedbackQuestionList from './FeedbackQuestionList';
import CustomText from "../../../../global/ui/CustomText";

class FeedbackScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data
    }
  }

  _renderSurveyRow = (data) => {
    return (
      <View style={styles.rowContainer} key={data.id}>
        <FeedbackQuestionList
          data={data} />
      </View>
    )
  }

  render() {
    const surveyQuestions = this.state.data.standard_report;

    return (
      <View style={styles.container}>
        <View>
          <View>
            <CustomText style={[styles.textMedium, styles.grayText]}>{this.state.data.comment}</CustomText>
          </View>
          <View style={{ paddingVertical: 12 }}>
            <CustomText style={[styles.textMedium, styles.grayText, styles.textBold]}>Standard Report</CustomText>
          </View>
        </View>
        <View>
          {surveyQuestions.map(surveyQuest => this._renderSurveyRow(surveyQuest))}
        </View>
      </View>

    )
  }

}

export default FeedbackScreen;
