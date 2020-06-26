/*jshint esversion:6*/

import React, {Component} from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import SmileyQuestionWidget from "../../../global/widgets/smiley-question/SmileyQuestionWidget";
var dataJSON = {};
export default class Pulse extends Component {
  constructor() {
    super();
  }

  render() {
    
      return (
        <View style={{ flex: 1 } }>
          <SmileyQuestionWidget question={this.props.data.body.selectedBatch.question}
                                isFromAskModule={false}
                                title={this.props.data.body.selectedBatch.question.title}
                                totalNumberOfResponses={(this.props.data.body.selectedBatch.result)?
                                      this.props.data.body.selectedBatch.result.teamResult.totalCount : 0}
                                onSelect = {(data) => {
              data.campaignBatchID = this.props.data.body.selectedBatch.batch.ID;

              this.props.onAnswerSelect(data);
            } }>
          </SmileyQuestionWidget>
        </View>
      );
    
    
  }
}
const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    flexWrap: 'wrap'
  }
});
