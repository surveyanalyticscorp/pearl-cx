import React from 'react';
import {
    StyleSheet,
    ToolbarAndroid,
    Text,
    View,
    ScrollView,
    TouchableWithoutFeedback,
    ActivityIndicator,
    TextInput,
    TouchableHighlight,
    Modal,
    Dimensions,
    TouchableOpacity,
    Platform,
    Image,
    RefreshControl
} from 'react-native';
import { ActionBarModule } from '../../../global/native-modules/NativeModules';
import BaseComponentWithoutScroll from '../../../global/components/BaseComponentWithoutScroll';
import CustomText from "../../../global/ui/CustomText";
import QuestionRow from "../ask/components/QuestionRow";
import SmileyQuestionWidget from "../../../global/widgets/smiley-question/SmileyQuestionWidget";
import ThumbsQuestionWidget from "../../../global/widgets/thumbs-questions/ThumbsQuestionWidget";
import {utils} from '../../../global/Utils';
import {Actions} from "react-native-router-flux";
import ScrollViewWithRefreshControl from "../../../global/ui/ScrollViewWithRefreshControl";
import styles from './askHomePageStyle';

export default class Ask extends BaseComponentWithoutScroll {
    constructor(props) {
        super(props);

        this.state = {
          isModalVisible: false,
          questionToDisplay: undefined,
          isResponseAdded: false,
          dynamicCommentAnswer: '',
          requestData: {},
          isLastQuestion: false,
          selectedQuestionIndex: 0,
          isProcessingAPI: false,
          pendingQuestionsCount: 0,
        };
    }

    parseAPIResponse (response) {
        if(response.body && response.body.questions) {
            this.setState({isProcessingAPI: false});
            if(response.body.questions.length > 1) {
                this.setState({questionToDisplay: response.body.questions[0], isLastQuestion: false,
                    selectedQuestionIndex: 0, pendingQuestionsCount: response.body.questions.length})
            } else if (response.body.questions.length === 1) {
                this.setState({questionToDisplay: response.body.questions[0], isLastQuestion: true,
                    selectedQuestionIndex: 0, pendingQuestionsCount: 1 })
            } else {
                this.setState({ pendingQuestionsCount: 0 })
            }
        }
    }

    reloadContent () {
        this.setState({isProcessingAPI: true});
        this.props.getPendingQuestionList().then((response) => {
            this.parseAPIResponse(response);
        }).catch(error => {
            utils.showToastMessage(error.message);
        });
    }

    componentDidMount () {
        this.props.navigationStateHandler.registerFocusHook(this);
        this.reloadContent();
    }

    componentWillUnmount() {
        this.props.navigationStateHandler.unregisterFocusHook(this);
    }

    handleNavigationSceneFocus() {
        if(!this.props.isLoading) {
            this.reloadContent();
        }
    }

    getQuestionList(pendingQuestions) {
        let questionList = [];
        const {selectedQuestionIndex} = this.state;
        questionList.push(pendingQuestions.questions.map((item, key) => {
            let backgroundColor = '#f5f5f5';
            if(key === selectedQuestionIndex) {
                backgroundColor = '#ffffff';
            }
            return (
                <View style={{flex: 1, backgroundColor: backgroundColor, marginHorizontal: 20}}>
                    <QuestionRow item={item.question} key={key}
                                 rightIcon={''}
                                 rightIconClickable={false}
                                 onPressRightIcon={() => {

                                 }}
                                 onPress={() => { this.setState({selectedQuestionIndex: key, questionToDisplay: pendingQuestions.questions[key], isModalVisible: false} );
                                 }}
                    />
                </View>
            );
        }));

        return questionList;
    }

    onResponseAdded (data) {
        const {questionToDisplay} = this.state;
        this.setState({isResponseAdded: true, requestData: data}, () => {
            if ( !questionToDisplay.question.dynamicCommentEnable) {
                if(this.checkForValidation()) {
                    setTimeout(() => {
                        this.buildAndSendResponseObject();
                    }, 800);
                }
            }
        });
    }

    currentQuestionHeaderView (questionData) {
        return (
            <View style={{backgroundColor: '#ffffff'}}>
            <QuestionRow item={questionData}
                         rightIcon={''}
                         onPress={() => { }}
            />
            </View>
        );
    }

    getSmileyQuestionView (currentQuestion) {
        return (
            <SmileyQuestionWidget question={currentQuestion.question}
                                  isFromAskModule={true}
                                  title={this.currentQuestionHeaderView(currentQuestion.question)}
                                  logID={currentQuestion.logID}
                                  onSelect = {(data) => {
                                           this.onResponseAdded(data);
                                       } }>
            </SmileyQuestionWidget>
        );
    }

    getThumbsUpDownQuestionView (currentQuestion) {
        return (
            <ThumbsQuestionWidget question={currentQuestion.question}
                                  title={this.currentQuestionHeaderView(currentQuestion.question)}
                                  logID={currentQuestion.logID}
                                  onSelect = {(data) => {
                                           this.onResponseAdded(data);
                                       } }
            />
        );
    }

    hideQuestionListModal () {
        this.setState({isModalVisible: false})
    }

    getCloseModalIcon() {
        return require('../../../global/images/close_pending_question_list.png');
    }

    getOpenModalIcon() {
        return require('../../../global/images/open_pending_question_list.png');
    }

    showPendingQuestionListModal (questionList) {
        return (
            <Modal
                style={{flex: 1}}
                animationType={'slide'}
                transparent={false}
                visible={this.state.isModalVisible}
                onRequestClose={() => {
                    this.hideQuestionListModal()
                }}
            >
                <View style={styles.mainModalContainerStyle}>
                    <ScrollView style={{flex: 1, marginTop: 50,
                        marginBottom: 45}}>
                        {questionList}
                    </ScrollView>
                    <TouchableWithoutFeedback onPress={() => {
                        this.hideQuestionListModal()
                    }}>
                        <Image source ={this.getCloseModalIcon()}
                               style ={styles.bottomButtonStyle}/>
                    </TouchableWithoutFeedback>
                </View>
            </Modal>
        );
    }

    getDynamicCommentBox() {
        const {questionToDisplay} = this.state;
        return (
            <View style={{marginTop: 10, marginLeft: 15, marginRight: 15}}>
                <CustomText style={{fontSize: 14, flexWrap: 'wrap',}}>
                    {questionToDisplay.question.commentText}
                </CustomText>
                <View style={styles.dynamicCommentTextInputStyle}>
                    <TextInput
                        style={{
                            fontSize: 14,
                            padding: 5,
                            color: 'black',
                            flexWrap: 'wrap',
                            textAlignVertical: 'top'
                        }}
                        onChangeText={(text) => {
                            this.setState({dynamicCommentAnswer: text});
                        }}
                        value={this.state.dynamicCommentAnswer}
                        editable={true}
                        multiline={true}
                        scrollEnabled={true}
                        autoFocus={true}
                        placeholder=""
                        placeholderTextColor='#B0B0B0'
                        underlineColorAndroid={'transparent'}/>
                </View>
                {this.getSubmitQuestionButton()}
            </View>
        );
    }

    buildAndSendResponseObject () {
        this.setState({isProcessingAPI: true});
        const {requestData, dynamicCommentAnswer} = this.state;
        requestData.dynamicComment = dynamicCommentAnswer;
        console.log('Add response object'+requestData);
        this.props.addQuestionResponse(requestData).then((response) => {
            if(response.statusCode === 200) {
                utils.showToastMessage('Answer submitted successfully');
                this.setState({isResponseAdded: false, requestData: {}, dynamicCommentAnswer: ''});
            }
            this.reloadContent();
        }).catch(error => {
            console.log("Error- " + error);
            this.showErrorToastAndClear();
        });
    }

    checkForValidation () {
        const {dynamicCommentAnswer, questionToDisplay, isResponseAdded} = this.state;

        if(!isResponseAdded) {
            utils.showToastMessage("Please select an answer");
            return false;
        }
        if(questionToDisplay.question.dynamicCommentEnable && dynamicCommentAnswer === '') {
            utils.showToastMessage("Please enter your comment");
            return false;
        }
        return true;
    }

    getSubmitQuestionButton() {
        return (
            <View style={{flex: 1,  justifyContent: 'flex-end', marginTop: 20}}>
                <TouchableHighlight
                    activeOpacity={0.6}
                    underlayColor={'#CCCCCC'}
                    onPress={() => {
                    if(this.checkForValidation()) {
                        this.buildAndSendResponseObject();
                    }
                }}>
                    <View style={styles.submitButtonView}>
                        <CustomText style={{
                            color: '#ffffff',
                            fontWeight: 'bold',
                        }}>
                            {'Submit'}
                        </CustomText>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }

    getLastQuestionSubView () {
        return (
            <View style={{marginTop: 20, justifyContent: 'center', alignItems: 'center'}}>
                <CustomText style={{
                    color: '#9e9e9e',
                    fontSize: 14,
                    fontWeight: 'bold'
                }}>
                    This is the last question. Keep it up!
                </CustomText>
            </View>
        );
    }

    getQuestionCountView () {
        let questionCountText = `Questions pending (${this.state.pendingQuestionsCount})`;
        return (
            <View style={{marginTop: 20, justifyContent: 'center', alignItems: 'center'}}>
                <CustomText style={{
                    color: '#9e9e9e',
                    fontSize: 14,
                    fontWeight: 'bold'
                }}>
                    {questionCountText}
                </CustomText>
            </View>
        );
    }

    getEmptyViewBottom () {
        return (
            <View style ={{
                height: 36,
                marginHorizontal: 20,
                width: Dimensions.get('window').width - 20,
                borderColor: '#1B87E6',
                justifyContent: 'center',
                backgroundColor: '#1B87E6'}}>
                <TouchableOpacity onPress={() => {
                    ActionBarModule.updateSelectedMenuItem('Ask');
                    Actions.askedQuestionList();
                }}
                >
                    <CustomText style={{
                        textAlign: 'center',
                        color: '#ffffff',
                        fontWeight: 'bold',
                        fontSize: 14,
                    }}>
                        Go to Ask
                    </CustomText>
                </TouchableOpacity>
            </View>
        );
    }

    getBottomButtonView () {
        return (
            <View style={{bottom: 5, justifyContent: 'center', alignItems: 'center'}}>
                {this.state.pendingQuestionsCount === 0 ? this.getEmptyViewBottom() :
                    <TouchableWithoutFeedback onPress={() => {
                        this.setState({isModalVisible: true})
                    }}>
                        <Image source ={this.getOpenModalIcon()} style ={styles.bottomButtonStyle}/>
                    </TouchableWithoutFeedback>
                }
            </View>
        );
    }

    getNoPendingQuestionsView () {
        return (
            <View style={{flex: 1,}}>
                <ScrollViewWithRefreshControl
                    contentContainerStyle={{ flexGrow: 1 }}
                    onRefresh={this.reloadContent.bind(this)}
                >
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'column', backgroundColor: '#f5f5f5'}}>
                <CustomText style={{
                    color: '#aaaaaa',
                    fontSize: 16,
                    fontWeight: 'bold'
                }}>
                    There are no questions right now
                </CustomText>

                <CustomText style={{
                    marginTop: 40,
                    color: '#666c77',
                    fontSize: 18,
                    fontWeight: 'bold'
                }}>
                    Do you want to ask a new question?
                </CustomText>

            </View >
                {this.getBottomButtonView()}
                </ScrollViewWithRefreshControl>
            </View>
        );
    }

    getQuestionMainView (questionToDisplay) {
        return (
            <View style={{flex: 1}}>
                    {
                        questionToDisplay.question.subType === 'G' ? this.getSmileyQuestionView(questionToDisplay)
                            : this.getThumbsUpDownQuestionView(questionToDisplay)
                    }
                    {questionToDisplay.question.dynamicCommentEnable && this.state.isResponseAdded && this.getDynamicCommentBox()}
                    {this.state.pendingQuestionsCount > 1 && this.getQuestionCountView()}
                    {this.state.isLastQuestion && this.getLastQuestionSubView()}
            </View>
        );
    }

    renderChild() {

        const {isProcessingAPI} = this.state;
        if(isProcessingAPI)
            return (
                <ScrollViewWithRefreshControl
                    keyboardShouldPersistTaps="always"
                    contentContainerStyle={{ flexGrow: 1 }}
                    onRefresh={this.reloadContent.bind(this)}/>
            );

        if (!this.props.isLoading) {
            const {pendingQuestions} = this.props;
            const {questionToDisplay, pendingQuestionsCount} = this.state;
            if(questionToDisplay && pendingQuestions && pendingQuestions.questions && pendingQuestions.questions.length) {
                let pendingQuestionsList = this.getQuestionList(pendingQuestions);

                return(
                    <View style={{flex:1, zIndex:10, backgroundColor: '#f5f5f5'}}>
                        <ScrollViewWithRefreshControl
                            contentContainerStyle={{ flexGrow: 1 }}
                            onRefresh={this.reloadContent.bind(this)}
                        >
                        {this.showPendingQuestionListModal(pendingQuestionsList)}
                        <View style={{flex: 1}}>
                            {this.getQuestionMainView(questionToDisplay)}
                        </View>
                        {pendingQuestionsCount > 1 && this.getBottomButtonView()}
                        </ScrollViewWithRefreshControl>
                    </View>
                );
            }
            return (
                <View style={{flex: 1}}>
                    {this.getNoPendingQuestionsView()}
                </View>
            );
        }
    }
}