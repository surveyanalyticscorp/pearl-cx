import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    Platform,
    TouchableHighlight,
    ScrollView,
    Text,
    ActivityIndicator,
    Dimensions
} from 'react-native';


import QuestionWidget from '../../global/widgets/QuestionWidget';
import { apiHandler } from '../../global/api/APIHandler';
import renderIf from '../../global/renderIf';
import { utils } from '../../global/Utils'
import moment from 'moment';

export default class PollQuestionWidget extends Component {
    constructor(props) {
        super(props);
        this.state = { showLoading: false, error: false }
    }
    render() {
        return (
            <View>{
                renderIf(this.state.showLoading)(
                    <View style={{
                        flex: 1,
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        zIndex: 1,
                        justifyContent: 'center',
                        alignItems: 'stretch',
                        position: 'absolute'
                    }}>
                        <ActivityIndicator
                            color={'#003566'}
                            animating={true}
                            size="large"
                            style={{ flex: 1 }}
                        />
                    </View>
                )}

                <View style={{ flex: 1, zIndex: -1 }}>
                    <QuestionWidget
                        title={this.props.title}
                        question={this.props.question}
                        answers={this.props.answers}
                        survey={this.props.survey}
                        questionType={this.props.questionType}
                        onSumbitClick={(answerList) => {
                            return this.submitPollResult(answerList);
                           // console.log('submit button clicked ');
                        }}>
                    </QuestionWidget>
                </View>

            </View>

        );
    }



    getCurrentTime() {
        return moment().format();
    }
    createUploadResponseArray(answerList) {

        this.uploadResponseArray = [];
        var currentSurveyResponseDict = {};

        var surveyDataList = [];
        var surveyDataDict = {};
        if (global.appUser.ID) {
            surveyDataDict['memberID'] = global.appUser.ID;
        }
        if (global.appUser.panelID) {
            surveyDataDict['panelID'] = global.appUser.panelID;
        }
        surveyDataDict['score'] = 0;
        surveyDataDict['isComplete'] = 1;
        surveyDataDict['creationDate'] = this.getCurrentTime();
        surveyDataDict['timestamp'] = this.getCurrentTime();
        surveyDataDict['timesTaken'] = 1;
        surveyDataDict['results'] = answerList;
        surveyDataList[0] = surveyDataDict;

        currentSurveyResponseDict['id'] = this.props.survey.surveyID;
        var surveyResponse = [];
        surveyResponse[0] = surveyDataDict;
        currentSurveyResponseDict['responses'] = surveyResponse;
        this.uploadResponseArray[0] = currentSurveyResponseDict;



    }
    submitPollResult(answerList) {
        var uploadResponse = {};
        this.createUploadResponseArray(answerList);
        uploadResponse['upload'] = this.uploadResponseArray;
        if (!this.state.showLoading) {
            //update state to start loading
            // this.prepareForNetworkRequest();
            this.setState({ showLoading: true });
            return new Promise((resolve, reject) => {
                apiHandler.submitPollResult((response)=>{this.processPollSubmitResponse(response); resolve();}, uploadResponse, (error) => {
                    this.handleError(error);
                    reject();
                });
            });

        }
    }
    processPollSubmitResponse(response) {
        this.setState({ showLoading: false });
        this.props.onSubmitResult(response.body.pollResult);


    }
    handleError(error) {
        this.setState({ showLoading: false });
        utils.showToastMessage(error.message);
    }
}
var styles = StyleSheet.create({

});