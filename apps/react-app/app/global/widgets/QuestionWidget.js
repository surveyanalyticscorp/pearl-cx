import React, {Component} from 'react';
import {Dimensions, StyleSheet, TouchableHighlight, View} from 'react-native';
import CustomText from '../ui/CustomText';
import GridView from 'react-native-gridview';
import renderIf from '../renderIf';

const { height, width } = Dimensions.get('window');
const factor = width > height ? height : width;

export default class QuestionWidget extends Component {

    questionResponseMap = new Map();
    isSingleSelect = false;
    constructor(props) {
        super(props);
        this.state = {
            submitDisabled: true
        };
        this.isSingleSelect = this.props.questionType !== 'checkbox';
    }

    renderTitle() {
        if (this.props.title) {
            return (<View style={styles.titleContainer} >
                <View style={{ flex: 1.0, justifyContent: 'center' }}>
                    <CustomText style={styles.titleText} ellipsizeMode='tail' {...this.props}>
                        {this.props.question.text}
                    </CustomText>
                </View>
            </View>);
        }
        return (<View></View>)
    }
    render() {
        return (
            <View style={styles.mainContainer}>
                {this.renderTitle()}
                <View style={styles.answerContainer} >
                    {this.renderQuestionWidget(this.props.answers)}
                </View>
                {
                    renderIf(!this.isSingleSelect)(
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            {this.showSubmitButton()}
                        </View>
                    )
                }
            </View>
        );
    }

    renderQuestionWidget(answers) {
        return (
            <GridView
                data={answers}
                itemsPerRow={2}
                renderItem={this.renderAnswerBoxes.bind(this)} />
        );
    }

    showSubmitButton() {
        var _this = this;
        return (<TouchableHighlight style={[styles.submitButtonContainer, this.state.submitDisabled ? { backgroundColor: '#E8E8E8' } : { backgroundColor: '#A0A3A8' }]}
            disabled={this.state.submitDisabled}
            onPress={() => { this.submitResponses(); }}>
            <View >
                <CustomText style={styles.submitButtonText} numberOfLines={1} ellipsizeMode='tail'>
                    {"Submit"}
                </CustomText>
            </View>

        </TouchableHighlight>);
    }
    previousSelected = null;
    handleOnClick(answer) {
        if (this.isSingleSelect) {
            this.questionResponseMap.clear();
            if (this.previousSelected != null) { this.previousSelected.isSelected = false; }
        }
        if (answer.isSelected && !this.isSingleSelect) {
            answer.isSelected = false;
            this.questionResponseMap.delete(answer.answerID);
        }
        else {
            answer.isSelected = true;
            this.previousSelected = answer;
            var responseDict = {};
            responseDict['questionID'] = this.props.question.questionID;
            responseDict['answerID'] = answer.answerID;
            this.questionResponseMap.set(answer.answerID, responseDict);
        }

        console.log("Size - " + this.questionResponseMap.size);
        this.setState({ submitDisabled: this.questionResponseMap.size == 0 });
        if (this.isSingleSelect) {
            this.submitResponses();
        }
    }

    clearSelection() {
        this.questionResponseMap.clear();
        this.props.answers.map((item, index) => {
            item.isSelected = false;
        });
    }

    getQuestionResponseList() {
        console.log("Size - " + this.questionResponseMap.size);
        let answerList = [];
        for (var [key, value] of this.questionResponseMap) {
            answerList.push(value);
        }
        return answerList;

    }
    submitResponses() {
        let context = this;
        this.props.onSumbitClick(this.getQuestionResponseList()).catch(() => {
            if (context.isSingleSelect) {
                context.clearSelection();
                context.setState({ submitDisabled: true });
            }
        });

    }
    renderAnswerBoxes(answer) {

        var _this = this;
        return (<TouchableHighlight
            style={[styles.answerBox, answer.isSelected ? { backgroundColor: '#47A0DC' } : { backgroundColor: '#FFFFFF' }]}
            key={answer.answerID}
            activeOpacity={0.6}
            onPress={() => {
                _this.handleOnClick(answer)
            }}>
            <View style={[{ flex: 1, flexDirection: 'row' }]}>
                <View style={{ width: 10, backgroundColor: answer.color }} />
                <View style={[styles.answerValueContainer]}>
                    <CustomText numberOfLines={1} ellipseMode={'tail'} style={[styles.answerText, , answer.isSelected ? { color: '#FFFFFF' } : { color: '#616970' }]}>{answer.answerText}</CustomText>
                </View>
            </View>

        </TouchableHighlight>
        );
    }

};

// QuestionWidget.propTypes = {
//     onAnswerSelect: React.PropTypes.func,
//     onSumbitClick: React.PropTypes.func,
//     titleText: React.PropTypes.string,
//     question: React.PropTypes.object,
//     answers: React.PropTypes.array,
//     survey: React.PropTypes.object,
//     questionType: React.PropTypes.string
// };

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: '#F7F7F7',
        paddingBottom: 10
    },
    titleContainer: {
        backgroundColor: '#EEF0EF',
        padding:5
    },
    titleText: {
        color: '#616970',
        justifyContent: 'center',
        marginLeft: 10,
        fontWeight: 'normal',
        fontSize: global.h3FontSize
    },
    answerText: {
        justifyContent: 'center',
        marginLeft: 10,
        fontWeight: 'normal',
        fontSize: global.h3FontSize
    },
    answerBox: {
        margin: 8,
        borderColor: '#B7B7B7',
        borderWidth: 1,
        marginTop: Math.round(factor * 0.036),
        marginLeft: Math.round(factor * 0.022),
        marginRight: Math.round(factor * 0.022),
        marginBottom: 0,
        flex: 1,
        height: Math.round(factor * 0.08)
    },
    answerContainer: {
        backgroundColor: '#F9F9F9',
        flex: 1,
        margin: 1
    },
    answerValueContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    submitButtonContainer: {
        marginBottom: 10,
        marginTop: 10
    },
    submitButtonText: {
        fontSize: global.h3FontSize,
        color: global.whiteFontColor,
        fontFamily: global.semiBoldText,
        textAlign: 'left',
        paddingHorizontal: 40,
        paddingVertical: 8
    }


});
