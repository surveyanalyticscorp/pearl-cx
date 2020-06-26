import React from 'react';
import {
    Dimensions,
    Platform,
    TextInput,
    TouchableHighlight,
    TouchableWithoutFeedback,
    View,
    Keyboard,
    Button
} from 'react-native';
import Slider from 'react-native-slider';
import {Actions} from 'react-native-router-flux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import styles from './styles';
import AppStore from '../../../../index/AppStore';
import {ActionBarModule} from '../../../../global/native-modules/NativeModules';
import BaseComponentWithoutScroll from "../../../../global/components/BaseComponentWithoutScroll";
import ArrayUtils from "../../../../global/ArrayUtils";
import CustomText from "../../../../global/ui/CustomText";
import StringUtils from "../../../../global/StringUtils";

const {width} = Dimensions.get('window');
const sliderItemWidth = width / 3;

class UpdateFeedback extends BaseComponentWithoutScroll {

    constructor(props) {
        super(props);
        this.ticketStatuses = ArrayUtils.removeMatchingObjectAndReturnNewArray(props.ticketStatuses, 'id', -1);
        this.state = {
            input: "",
            value: props.data.ticketStatus > 0 ? this.ticketStatuses.map(function (e) {
                    return e.id;
                }).indexOf(props.data.ticketStatus)
                : 0,
        }
    }

    componentWillMount() {
        AppStore.DoneButtonStore.addDoneButtonListener(this.doneButtonAction.bind(this));
    }

    componentWillUnmount() {
        Actions.refresh();
        if (this.popTimeout) {
            clearTimeout(this.popTimeout);
        }

        ActionBarModule.updateTitleAndMenu(
            JSON.stringify({
                title: 'Feedback Details'
            })
        );
        ActionBarModule.toggleBackButton(true);
    }

    doneButtonAction() {
        if (this.props.isConnected && !this.props.isLoading) {
            this._press();
        }
    }

    _onSliderChange = value => {
        this.setState({
            value
        });
    }

    _checkEmpty(text) {
        this.setState({input: text});
    }

    _press = () => {
        if (this.isValidInput()) {
            Keyboard.dismiss();
            this.props.updateFeedback(this.buildFeedbackUpdateObject()).then(() => {
                this.showToastMessage("Ticket status updated successfully.");
                Actions.pop && Actions.pop();
            });

        } else {
            this.showToastMessage("Please enter comment to update the ticket.");
        }

    }

    buildFeedbackUpdateObject() {
        let selectedFeedback = this.props.feedbackDetail;
        return {
            ticketID: selectedFeedback.id,
            status: this.ticketStatuses[this.state.value].id,
            emailAddress: selectedFeedback.emailAddress,
            comment: this.state.input,
            storeId: selectedFeedback.businessUnitID,
            panelMemberID: selectedFeedback.panelMemberID,
            responseSetID: selectedFeedback.responseSetID,
        }
    }

    isValidInput() {

        return (!(this.state.input === ""));


    }

    _getImageUri(src) {
        if (Platform.OS === 'android') {
            return {uri: `asset:/${src}`};
        }

        return {uri: src};
    }

    getSliderContent() {
        let contents = [];
        this.ticketStatuses.map((item, index) => {
            let id = index;
            let text = item.text;
            let style = this.getStatusTextStyle(index);
            contents.push(
                <View key={'status_' + id}>
                    <CustomText onPress={() => {
                        this._onSliderChange(id)
                    }}
                          style={[styles.textMedium, style, {fontWeight: this.state.value === id ? 'bold' : 'normal'}]}>{text}</CustomText>
                    {this.state.value === index && <View style={styles.underline}/>}
                </View>
            )
        })
        return contents;
    }

    getStatusTextStyle(id) {
        switch (id) {
            case 0:
                return styles.grayText;
            case 1:
                return styles.orangeText;
            case 2:
                return styles.greenText;
            default:
                return styles.redText;
        }
    }

    renderChild() {
        const doneButtonVisible = StringUtils.isNotEmpty(this.state.input);
        return (
            <TouchableWithoutFeedback onPress={() => {
                Keyboard.dismiss();

            }}>
                <View style={styles.container}>
                    <View style={styles.textInputContainer}>
                        <KeyboardAwareScrollView ref="kascroll" scrollEnabled={false}>
                            <View style={styles.textInputWrapper}>
                                <TextInput
                                    multiline
                                    maxLength={500}
                                    underlineAndroidColor={'transparent'}
                                    autoFocus={true}
                                    autoCorrect={false}
                                    ref="feedbackInput"
                                    style={styles.textInput}
                                    value={this.state.input}
                                    placeholder={'Enter Comment...'}
                                    onChangeText={text => this._checkEmpty(text)}
                                />
                            </View>
                        </KeyboardAwareScrollView>
                    </View>
                    {this.getSliderContainer()}
                    {doneButtonVisible && this.getDoneButton()}
                </View>
            </TouchableWithoutFeedback>
        )
    }

    getDoneButton = () => {
        return (
            <View style={{alignItems:'center', justifyContent:'center'}}>
                <TouchableHighlight
                    style={{
                        backgroundColor: 'rgba(28,118,185,1)',
                        paddingHorizontal: 20, paddingVertical: 5
                    }} onPress={() => {
                    this._press();
                }}>
                    <View>
                        <CustomText style={{color: 'white', fontWeight: 'bold'}}>Submit</CustomText>
                    </View>
                </TouchableHighlight>
            </View>
        )
    }
    getSliderContainer = () => {
        return (
            <View style={styles.sliderContainer}>
                <View style={styles.sliderTextWrapper}>
                    {this.getSliderContent(this.ticketStatuses)}
                </View>
                <View style={styles.sliderWrapper}>
                    <Slider
                        step={1}
                        minimumValue={0}
                        maximumValue={3}
                        value={this.state.value}
                        minimumTrackTintColor="#eeeeee"
                        maximumTrackTintColor="#eeeeee"
                        thumbStyle={styles.slider}
                        onValueChange={value => this._onSliderChange(value)}
                    />
                </View>
                {this.state.value !== 0 && (
                    <TouchableWithoutFeedback
                        onPress={() => this._onSliderChange(0)}
                    >
                        <View style={[styles.sliderOverlay, {left: 0}]}/>
                    </TouchableWithoutFeedback>
                )}
                {this.state.value !== 1 && (
                    <TouchableWithoutFeedback
                        onPress={() => this._onSliderChange(1)}
                    >
                        <View style={[styles.sliderOverlay, {left: sliderItemWidth}]}/>
                    </TouchableWithoutFeedback>
                )}
                {this.state.value !== 2 && (
                    <TouchableWithoutFeedback
                        onPress={() => this._onSliderChange(2)}
                    >
                        <View
                            style={[styles.sliderOverlay, {left: sliderItemWidth * 2}]}
                        />
                    </TouchableWithoutFeedback>
                )}
                {this.state.value !== 3 && (
                    <TouchableWithoutFeedback
                        onPress={() => this._onSliderChange(5)}
                    >
                        <View
                            style={[styles.sliderOverlay, {left: sliderItemWidth * 3}]}
                        />
                    </TouchableWithoutFeedback>
                )}
            </View>
        )
    }
}

export default UpdateFeedback;
