import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableWithoutFeedback
} from 'react-native';
import QPCard from '../card/QPCard';
import colorCodes from "../typography/ColorCodes";
import CustomText from "../../ui/CustomText";
import QPHorizontalSeparator from "../card/QPHorizontalSeparator";
import QPCardTitle from "../card/QPCardTitle";
export default class SmileyQuestionWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAnswer: -1
    };

    this.smileyComponents = [];
    let pointScale = props.question.pointScale;
    props.question.answers.map((answer, index) => {
      let smileyComponent = this.props.isFromAskModule ? this.getSmileyObjectForAsk(pointScale, answer, index) : this.getSmileyObjectForPulse(answer, index);
      this.smileyComponents.push(smileyComponent);
    })
  }


  getSmileyObjectForAsk (pointScale, answer, index) {
    return {
      image: pointScale === 5 ? this.getSmileyForSetFive(index) : this.getSmileyForSetThree(index),
      text: answer.text,
      answerID: answer.ID,
      logID: this.props.logID,
      questionID: answer.questionID,
    };
  }

  getSmileyObjectForPulse (answer, index) {
    return {
      image: this.getSmileyForSetThree(index),
      text: answer.text,
      answerID: answer.ID,
      flashLetQuestionID: answer.flashLetQuestionID
    };
  }

  getSmileyForSetFive = (index) => {
    switch (index) {
      case 0:
        return require("../../images/smiley_rating_very_dissatisfied.png");
      case 1:
        return require("../../images/smiley_rating_dissatisfied.png");
      case 2:
        return require("../../images/smiley_rating_neutral.png");
      case 3:
        return require("../../images/smiley_rating_satisfied.png");
      case 4:
        return require("../../images/smiley_rating_very_satisfied.png");
      default:
        return require("../../images/smiley_rating_very_satisfied.png");
    }
  };

  getSmileyForSetThree = (index) => {
    switch (index) {
      case 0:
        return require("../../images/smiley_rating_very_dissatisfied.png");
      case 1:
        return require("../../images/smiley_rating_neutral.png");
      case 2:
        return require("../../images/smiley_rating_very_satisfied.png");
      default:
        return require("../../images/smiley_rating_very_satisfied.png");
    }
  };

  getQpCardTitle () {
    const {isFromAskModule, title} = this.props;
    return isFromAskModule ? title : <QPCardTitle>{title}</QPCardTitle>
  }

  render() {
    return (
        <View style={styles.mainContainer}>
          <QPCard customTitle={this.getQpCardTitle()}>
            {this.getQuestionContent() }

            {
              !this.props.isFromAskModule &&
              <View>
                <QPHorizontalSeparator/>
                <CustomText style={[styles.lastResponseText, colorCodes.secondaryFontColor]}>
                  {this.getResponseText()}
                </CustomText>
              </View>
            }
          </QPCard>
        </View>
    );
  }

  getResponseText() {
    return this.props.totalNumberOfResponses > 1 ? this.props.totalNumberOfResponses + ' Responses' : this.props.totalNumberOfResponses
        + ' Response';
  }

  getQuestionContent() {
    return (
        <View style={styles.smileyMainContainer}>
          {this.getSmileyWidget() }
        </View>
    );
  }

  getResponseData (answer) {
    if(this.props.isFromAskModule) {
      return {
        'answerID': answer.answerID,
        'logID': this.props.logID,
        'questionID': answer.questionID,
      };
    } else {
      return {
        'answerID': answer.answerID,
        'flashLetQuestionID': answer.flashLetQuestionID
      };
    }
  }

  getSmileyWidget() {
    return this.smileyComponents.map((answer) => {
      let selectedItemStyle = this.state.selectedAnswer === answer.answerID ? {backgroundColor: '#f5f5f5'} : {backgroundColor: '#ffffff'};
      return (
          <View style={[styles.smileyContainer, selectedItemStyle]} key={answer.answerID}>
              <TouchableWithoutFeedback key={answer.answerID} onPress ={() => {
                let data = this.getResponseData(answer)
                this.setState({selectedAnswer: answer.answerID});
                this.props.onSelect(data);
              }
              }>
              <Image source={answer.image} style={{ width: 40, height: 40 }}/>
            </TouchableWithoutFeedback>
            {/*<H3Widget style={{flex: 1, marginTop: 10, textAlign: 'center', fontSize: 14, flexWrap: 'wrap',}}>{answer.text}</H3Widget>*/}
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
  smileyMainContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center'
  },
  smileyContainer: {
    flex: 1,
    flexDirection: 'column',
    marginHorizontal: 5,
    paddingTop: 5,
    paddingBottom: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  lastResponseText: {
    fontSize: 14,
    padding: 15
  }
});