import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text, ActivityIndicator,
    Switch,
    TouchableOpacity, Image, TextInput, Dimensions, Platform, ScrollView, Keyboard,
} from 'react-native';
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button'
import Icon from "react-native-vector-icons/MaterialIcons";
import {Actions} from "react-native-router-flux";
import moment from "moment";
import BaseComponentWithoutScroll from "../../../../global/components/BaseComponentWithoutScroll";
import {utils} from "../../../../global/Utils";
import CustomText from "../../../../global/ui/CustomText";
import FadeInView from "../../review/FadeInView";
import styles from './addQuestionStyle';
const SELECTED_QUESTION_TYPE_SMILEY = 0;
const SELECTED_QUESTION_TYPE_THUMBS = 1;
var AndroidKeyboardAdjust = require('NativeModules').AndroidKeyboardAdjust;
let dataJSON = {};

export default class AddQuestion extends BaseComponentWithoutScroll {
    constructor(props) {
        super(props);
        if (Platform.OS === 'ios') {
            const keyboardShowEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
            const keyboardHideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
            this.keyboardDidShowListener = Keyboard.addListener(keyboardShowEvent, this._keyboardDidShow.bind(this));
            this.keyboardDidHideListener = Keyboard.addListener(keyboardHideEvent, this._keyboardDidHide.bind(this));
        }
        this.state = {
            marginBottom: 0,
            questionText: '',
            isDynamicComment: false,
            selectedQuestionType: SELECTED_QUESTION_TYPE_SMILEY,
            pointScale: 3,
            dynamicCommentText: 'Comment',
            scheduledDate: moment(props.item.date, 'DD-MM-YYYY hh:mm a z').format('dddd, MMMM DD, YYYY h:mm A'),
            addQuestionSuccess: false,
        }
    }

    componentWillMount() {
        //this.props.fetchQuestions();
        if (Platform.OS !== 'ios') {
            AndroidKeyboardAdjust.setAdjustPan();
        }
        if (this.popTimeout) {
            clearTimeout(this.popTimeout);
        }
    }

    componentWillUnmount() {
        if (Platform.OS === 'ios') {
            this.keyboardDidShowListener.remove();
            this.keyboardDidHideListener.remove();
        }
        if (this.popTimeout) {
            clearTimeout(this.popTimeout);
        }
    }

    _keyboardDidShow (event) {
        if (this.state.isDynamicComment) {
            this.setState({ marginBottom: event.endCoordinates.height})
        }
    }

    _keyboardDidHide () {
        if (this.state.isDynamicComment) {
            this.setState({ marginBottom: 0 })
        }
    }

    loading() {
        return <ActivityIndicator style={styles.loading} color="black"/>;
    }

    getQuestionView() {
        return (
            <View style={styles.questionContainer}>
                <View style={styles.questionTextStyle}>
                    <CustomText>
                        Question
                    </CustomText>
                </View>
                <View/>
                <TextInput style={styles.inputText}
                           onChangeText={(text) => {
                               this.setState({questionText: text})}}
                           ref={ref => this.textInput = ref}
                           onEndEditing={() => {
                           }}
                           placeholder="E.g. How was your week?"
                           placeholderTextColor='#B0B0B0'
                />
            </View>
        );
    }

    getThumbsQuestionImage() {
        if(this.state.selectedQuestionType === SELECTED_QUESTION_TYPE_THUMBS) {
            return require('../../../../global/images/thumb_icon_selected.png');
        } else {
            return require('../../../../global/images/thumb_icon.png');
        }
    }

    getSmileyQuestionImage() {
        if (this.state.selectedQuestionType === SELECTED_QUESTION_TYPE_SMILEY) {

            return require('../../../../global/images/smiley_icon_selected.png');

        } else {

            return require('../../../../global/images/smiley_icon.png');

        }
    }

    updateSelectedQuestionType(selectedQuestionType) {
        let pointScale;
        if (selectedQuestionType === SELECTED_QUESTION_TYPE_SMILEY) {
            pointScale = 3;
        } else {
            pointScale = 0;
        }
        this.setState({selectedQuestionType: selectedQuestionType, pointScale: pointScale})
    }

    getQuestionOptionsToSelect() {
        const {selectedQuestionType} = this.state;
        let smileyQuestionTypeState = selectedQuestionType === SELECTED_QUESTION_TYPE_SMILEY ? '#eaf5fc' : '#ffffff';
        let thumbsQuestionTypeState = selectedQuestionType === SELECTED_QUESTION_TYPE_THUMBS ? '#eaf5fc' : '#ffffff';
        let smileyQuestionTextColor = selectedQuestionType === SELECTED_QUESTION_TYPE_SMILEY ? '#3494e3' : '#dadada';
        let thumbQuestionTextColor = selectedQuestionType === SELECTED_QUESTION_TYPE_THUMBS ? '#3494e3' : '#dadada';
        return (
            <View style={styles.selectQuestionTypeContainer}>

                <TouchableOpacity
                    style={[styles.selectQuestionTypeView, {backgroundColor: smileyQuestionTypeState}]}
                    onPress={() => {
                        this.updateSelectedQuestionType(SELECTED_QUESTION_TYPE_SMILEY)
                    }}>
                    <View style={{flexDirection: 'row'}}>
                        {<Image source={this.getSmileyQuestionImage()} style={{height: 20, width: 20}}/>}
                        <CustomText style={{marginHorizontal: 10, color: smileyQuestionTextColor}}>
                            Smiley
                        </CustomText>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.selectQuestionTypeView, {backgroundColor: thumbsQuestionTypeState}]}
                    onPress={() => {
                        this.updateSelectedQuestionType(SELECTED_QUESTION_TYPE_THUMBS)
                    }}>
                    <View style={{flexDirection: 'row'}}>
                        {<Image source={this.getThumbsQuestionImage()} style={{height: 20, width: 20}}/>}
                        <CustomText style={{marginHorizontal: 10, color: thumbQuestionTextColor}}>
                            Thumbs
                        </CustomText>
                    </View>
                </TouchableOpacity>

            </View>
        );
    }

    getDynamicCommentsToggle() {
        return (
            <View style={styles.dynamicCommentToggleContainer}>
                <View style={styles.dynamicCommentTextStyle}>
                    <CustomText>
                        Dynamic Comment
                    </CustomText>
                </View>
                <View style={{alignItems: 'center',}}>
                    <Switch
                        trackColor={{false: '#EBEBEB', true: '#3494e3'}}
                        thumbColor='#ffffff'
                        style={{transform: [{scaleX: .8}, {scaleY: .8}]}}
                        ios_backgroundColor='#EBEBEB'
                        onValueChange={(value) => this.setState({isDynamicComment: value})}
                        value={this.state.isDynamicComment}
                    />
                </View>
            </View>
        );
    }

    getDynamicCommentBox() {
        return (
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
                        this.setState({dynamicCommentText: text});
                    }}
                    value={this.state.dynamicCommentText}
                    editable={true}
                    multiline={false}
                    autoFocus={true}
                    onSubmitEditing={() => {
                        if(this.checkForValidation()) {
                            this.buildAndSendAddQuestionObject();
                        }
                    }}
                    placeholder="Comment"
                    placeholderTextColor='#B0B0B0'
                    underlineColorAndroid={'transparent'}/>
            </View>
        );
    }

    checkForValidation () {
        const {questionText, isDynamicComment, dynamicCommentText} = this.state;
        if(questionText === "") {
            utils.showToastMessage("Please enter your Question");
            return false;
        }
        if(isDynamicComment && dynamicCommentText === "") {
            utils.showToastMessage("Please enter your comment");
            return false;
        }
        return true;
    }

    processAPIResponse(response) {
        dataJSON = JSON.stringify(response);
        this.setState({addQuestionSuccess: true});
        this.popTimeout = setTimeout(
            () => Actions.pop(),
            2000
        );
    }

    buildAndSendAddQuestionObject () {
        const {questionText, selectedQuestionType, isDynamicComment, dynamicCommentText, pointScale} = this.state;
        let subtype = selectedQuestionType === SELECTED_QUESTION_TYPE_SMILEY ? "G" : "F";

        const {questions, itemKey, item} = this.props;

        let addQuestionObject = {
            text: questionText,
            type: "U",
            subtype: subtype,
            pointScale: pointScale,
            enableDynamicComment: isDynamicComment,
            scheduledDate: item.date,
            commentText: dynamicCommentText
        };

        this.props.submitQuestion(addQuestionObject).then((response) => {
            this.processAPIResponse(response)
        }).catch(error => {
            console.log("Error- " + error);
            this.showErrorToastAndClear();
        });
    }

    getSubmitQuestionButton(employeeCount) {
        return (
            <View style={styles.submitButtonContainer}>
                <TouchableOpacity onPress={() => {
                    if(this.checkForValidation()) {
                        this.buildAndSendAddQuestionObject();
                    }
                }}>
                    <View style={styles.submitButtonView}>
                        <CustomText style={{
                            color: '#ffffff',
                            fontWeight: 'bold',
                        }}>{`Schedule for ${employeeCount} employees `}</CustomText>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    getCalendarImage() {
        return require('../../../../global/images/calendar_icon.png');
    }

    getPageHeaderView() {
        const {scheduledDate} = this.state;
        return (
            <View style={{
                marginTop: 15,
                flexDirection: 'row',
                justifyContent: 'flex-start',
            }}>

                <TouchableOpacity onPress={() => {
                    Actions.pop();
                }}>
                    <View style={{width: "100%", justifyContent: 'center'}}>
                        <Icon name="keyboard-arrow-left" color={"#646c76"} size={30}/>
                    </View>
                </TouchableOpacity>

                <View style={{ justifyContent: 'center'}}>
                    <Image source={this.getCalendarImage()} style={{height: 20, width: 20}}/>
                </View>

                <View style={{justifyContent: 'center', marginLeft: 10}}>
                    <Text style={{color: '#aaaaaa', fontWeight: 'bold',}}>{scheduledDate}</Text>
                </View>
            </View>
        );
    }

    onSelect(index, value) {
        this.setState({pointScale: value});
    }

    getSmileyQuestionSubView() {
        return (
            <View style={{marginHorizontal: 10, marginTop: 20,}}>
                <View style={{marginHorizontal: 10,}}>
                    <CustomText style={{color: '#afafaf', fontWeight: 'bold',}}>Scale</CustomText>
                </View>
                <RadioGroup
                    style={{flexDirection: 'row', marginHorizontal: 10,}}
                    size={24}
                    thickness={2}
                    onSelect={(index, value) => this.onSelect(index, value)}
                    selectedIndex={0}
                >
                    <RadioButton value={'3'}>
                        <CustomText style={{color: '#7e858c',}}>3 Point</CustomText>
                    </RadioButton>


                    <RadioButton value={'5'}>
                        <CustomText style={{color: '#7e858c',}}>5 Point</CustomText>
                    </RadioButton>

                </RadioGroup>
            </View>
        );
    }

    getSuccessImage() {
        return require('../../../../global/images/success_message.png');
    }

    getWhiteCalendarImage() {
        return require('../../../../global/images/calendar_icon_white.png');
    }

    addQuestionSuccessView () {
        return (
            <FadeInView delay={0} from={20} duration={2000} toValue={3000} style={{flex: 1,}}>
                <View style={{flex: 1, backgroundColor: '#007edd', flexDirection: 'column', alignItems:'center',  justifyContent: 'space-around'}}>

                    <View style={{flex: 0.7, alignItems:'center',  justifyContent: 'center', marginRight: 40}}>
                        <Image source={this.getSuccessImage()} />
                    </View>

                    <View style={{flex: 0.3, alignItems:'center',}}>
                        <View style={{ marginTop: 30,}}>
                            <CustomText style={{color: '#ffffff', fontWeight: 'bold', fontSize: 18}}>Success!</CustomText>
                        </View>

                        <View style={{ marginTop: 40}}>
                            <CustomText style={{color: '#ffffff', fontWeight: 'bold', fontSize: 16}}>Your question will be posted on</CustomText>
                        </View>

                        <View style={{ marginTop: 20, alignItems:'center', flexDirection: 'row',}}>
                            <Image source={this.getWhiteCalendarImage()} style={{height: 20, width: 20}}/>
                            <CustomText style={{marginLeft: 10, color: '#ffffff', fontWeight: 'bold',}}>{this.state.scheduledDate}</CustomText>
                        </View>
                    </View>
                </View>
            </FadeInView>
        );
    }

    renderChild() {
        const {questions} = this.props;
        return (
            <View style={{flex: 1, marginBottom: this.state.marginBottom}}>
                { !this.state.addQuestionSuccess &&
                <View style={{flex: 1, backgroundColor: '#e6e6e6', flexDirection: 'column'}}>
                    <View style={{flex: 1, margin: 6, backgroundColor: '#ffffff'}}>
                        <ScrollView style={{flexGrow: 1}} keyboardShouldPersistTaps={'always'} ref='scrollView'>
                            {this.getPageHeaderView()}
                            {this.getQuestionView()}
                            {this.getQuestionOptionsToSelect()}
                            {this.state.selectedQuestionType === SELECTED_QUESTION_TYPE_SMILEY && this.getSmileyQuestionSubView()}
                            {this.getDynamicCommentsToggle()}
                            {this.state.isDynamicComment && this.getDynamicCommentBox()}
                        </ScrollView>
                        {this.getSubmitQuestionButton(questions.employeeCount)}
                    </View>
                </View>
                }
                {this.state.addQuestionSuccess && this.addQuestionSuccessView()}
            </View>

        );
    }
}