/*jshint esversion:6*/

import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Platform,
  Image
} from 'react-native';
import H3Widget from '../typography/H3Widget';
import QPCard from '../card/QPCard';
import CustomText from '../../ui/CustomText';
import QPHorizontalSeparator from '../card/QPHorizontalSeparator';
import OnTouchHighlightWidget from '../ui/OnTouchHighlightWidget';
import colorCodes from '../typography/ColorCodes';


export default class ThumbsQuestionWidget extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isAnswerUpdate: false,
      selectedAnswer: -1,
    };
  }

  getImageUrl(answer) {
    const {selectedAnswer} = this.state;

    if (answer.text === 'Hate it') {
      if(answer.ID === selectedAnswer) {
        return require('./thumbs_down_selected.png');
      }
      return require('./thumbs_down.png');
    }

    if (answer.text === 'Love It') {
      if(answer.ID === selectedAnswer) {
        return require('./thumbs_up_selected.png');
      }
      return require('./thumbs_up.png');
    }
    return null;
  };

  render() {
    return (
        <View style={styles.mainContainer}>
          <QPCard customTitle={this.props.title}>
            {this.getSurveyContent() }
          </QPCard>
        </View>
    );
  }

  getSurveyContent() {
    return (
        <View style={styles.thumbsMainContainer}>
          {this.getThumbsWidget() }
        </View>
    );
  }

  getThumbsWidget() {
    return this.props.question.answers.map((answer) => {
      return (
          <View style={styles.thumbsContainer} key={answer.ID}>
            <OnTouchHighlightWidget key={answer.ID} onPress ={() => {
              let data = {
                answerID: `${answer.ID}`,
                logID: `${this.props.logID}`,
                questionID: `${answer.questionID}`,
              };
              this.setState({selectedAnswer: answer.ID});
              this.props.onSelect(data);
            }
            }>
              <Image source={this.getImageUrl(answer) } style={{ width: 60, height: 60 }}/>
            </OnTouchHighlightWidget>
            <H3Widget>{answer.text}</H3Widget>
          </View>
      )
    });
  }

}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#ffffff',
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 15,
    marginRight: 15
  },
  thumbsMainContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center'
  },
  thumbsContainer: {
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'column',
    paddingTop: 2,
    paddingBottom: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  lastResponseText: {
    fontSize: 14,
    padding: 15
  }
});
