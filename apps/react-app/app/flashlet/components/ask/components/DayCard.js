import React, {Component} from 'react';
import {
    ActivityIndicator,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import QPCard from "../../../../global/widgets/card/QPCard";
import styles from "../homePage/askedQuestionsListStyle";

import {Actions} from "react-native-router-flux";
import {ActionBarModule} from "../../../../global/native-modules/NativeModules";
import QuestionRow from "./QuestionRow";
import CustomText from "../../../../global/ui/CustomText";


export default class DayCard extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const{item,key} = this.props;

        return (<QPCard
                customTitle={this.getCardHeader(item,key)}
                children={this.getQuestionList(item,key)}
                style={styles.cardContainerStyle}
        />);
    }
    goToAskQuestion (item, itemKey) {
        const {questions} = this.props;
        Actions.addQuestion({item, itemKey, questions});
        ActionBarModule.updateTitleAndMenu(
            JSON.stringify({title: 'Ask'})
        );
        ActionBarModule.toggleBackButton(false);
    }

    getCardHeader(item, key) {
        let questionCount = item.questions.length;
        let cardHeader = (
            <View key={"" + key}
                  style={styles.cardHeaderStyle}>
                <View style={styles.cardHeaderDateTextStyle}>
                    <CustomText style={{fontSize: 13, fontWeight: 'bold',height: '100%'}}>
                        {this.props.headerTitle}
                    </CustomText>
                </View>
                <View style={styles.cardHeaderQuestionCountContainerStyle}>
                    <CustomText style={styles.cardHeaderQuestionCountTextStyle}>
                        {questionCount === 0 ? 'Be the first to ask' : (questionCount === 1 ? '1 question' :`${questionCount} questions`)}
                    </CustomText>
                </View>
            </View>
        );
        return cardHeader;
    }

    getQuestionList(item, key) {
        let questionList = [];
        let itemKey = key;
        const{rightIcon, rightIconClickable, onPressRightIcon} = this.props;
        questionList.push(item.questions.map((item, key) => {
            return (
                <QuestionRow item={item} key={key}
                             rightIcon={rightIcon}
                             rightIconClickable={rightIconClickable}
                             onPressRightIcon={onPressRightIcon}
                             onPress={(key, questionID) => {this.props.onPress && this.props.onPress(key, questionID)}}
                />
            );
        }));

        if (this.props.canAddQuestion) {
            questionList.push(
                <TouchableOpacity onPress={() => {
                    this.goToAskQuestion(item, itemKey)
                }}>
                    <View style={styles.buttonContainer}>
                        <Text style={styles.addQuestionTextStyle}>+ Ask a Question</Text>
                    </View>
                </TouchableOpacity>
            );
        }
        return questionList;
    }
}