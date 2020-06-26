import React, { Component } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Image, Platform, TextInput, KeyboardAvoidingView, Modal, Keyboard } from "react-native";
import Button from "react-native-button";
import { Actions } from "react-native-router-flux";
import SupervisorField from '../profile/SupervisorField';
import CustomText from '../../../global/ui/CustomText';
import BaseComponentWithoutScroll from '../../../global/components/BaseComponentWithoutScroll';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { apiHandler } from '../../../global/api/APIHandler';
import renderIf from '../../../global/renderIf';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { ActionCreators } from '../../actions'
var {
  height: deviceHeight,
    width: deviceWidth
} = Dimensions.get("window");

var styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "transparent",
        justifyContent: "center",
        zIndex:3,
        alignItems: "center",
    },
    inputText: {


        height: 40,

        padding: 5,

        flex: 1,
        backgroundColor: 'transparent',
        color: 'black',
        fontFamily: global.primaryText,
        fontSize: global.h2FontSize

    },

});

class SupervisorModal extends BaseComponentWithoutScroll {
    updateProfileRequestData = {
        supervisorId: -1,
        panelMemberID: global.appUser.ID,
        supervisorEmail: "Unassigned",
        mode: "update",
        jsonRequest: {
            "memberCustomFields": []
        }
    };
    constructor(props) {
        super(props);

        this.state = {
            offset: new Animated.Value(-deviceHeight),
            emailText: ''
        };
    }
    componentWillMount() {
        super.componentWillMount();
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);

    }
    _keyboardDidShow() {
        console.log('Keyboard Shown');
    }

    _keyboardDidHide() {
        console.log('Keyboard Hidden');
    }
    componentDidMount() {
        Animated.timing(this.state.offset, {
            duration: 150,
            toValue: 0
        }).start();
    }
    componentWillUnmount() {
        super.componentWillUnmount();
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }


    closeModal() {
        Animated.timing(this.state.offset, {
            duration: 150,
            toValue: -deviceHeight
        }).start(Actions.pop);
    }
    updateSupervisor() {
        if (!this.state.showLoader) {

            if (this.validateEmail(this.state.emailText)) {
                this.prepareForNetworkRequest();
                this.props.fetchEmployeeProfileData(this.updateProfileRequestData).then(() => { this.processAPIResponse() });
            }
            else {
                this.showToastMessage('Please enter a valid supervisor email address');
            }

        }
    }
    getEditIcon() {

        if (Platform.OS != 'ios') {
            return require('../../../global/images/done_icon.png');
        } else {
            return { uri: 'done_icon.png' };
        }

    }

    getCloseIcon() {

        if (Platform.OS != 'ios') {
            return require('../../../global/images/close_grey.png');
        }
        return { uri: 'close_grey.png' };

    }
    validateEmail(email) {
        console.log("Email entered- " + email);
        if (email && email.length > 0) {
            var re = new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
            return re.test(email);
        }
        return false;
    }
    updateSupervisorIDLocal(id) {
        global.appUser.parentMemberID = id;
    }
    processAPIResponse() {
        let response = this.props.data;
        if (response) {
            if (response.message) {
                this.showToastMessage("Supervisor updated successfully.");
            }
            this.setState({ dataLoaded: true, error: false, showLoader: false });
            if (response.memberSupervisorId) {
                this.updateSupervisorIDLocal(response.memberSupervisorId);
            }
            this.closeModal();
        }
    }
    getCloseIconImage() {
        if (Platform.OS != 'ios') {
            return require('../../../global/images/close_grey.png');
        } else {
            return { uri: 'close_grey.png' };
        }
    }

    renderChild() {
        return (

            <Animated.View style={[styles.container, { backgroundColor: "rgba(52,52,52,0.9)" },
            { transform: [{ translateY: this.state.offset }] }]}>

                <View style={{
                    width: deviceWidth * 0.8,
                    height: deviceHeight * 0.294,
                    justifyContent: "flex-start",
                    alignItems: 'center',
                    backgroundColor: "white"
                }}>
                    <Button
                        containerStyle={{ padding: 10, position: 'absolute', right: 0, top: 0 }}
                        onPress={this.closeModal.bind(this)}
                        isDisabled={false}>
                        <Image source={this.getCloseIcon()} style={{ height: 15, width: 15 }}></Image>
                    </Button>
                    <CustomText style={{ textAlign: 'left', marginTop: 20, marginHorizontal: 10, fontFamily: global.boldText }}>Supervisor</CustomText>
                    <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: '#7e7e7e', alignSelf: 'stretch', marginHorizontal: 10, marginVertical: 20, alignItems: 'center', }}>

                        <TextInput style={styles.inputText}
                            onFocus={() => {
                                this.setState({ isFocused: true });
                            }}
                            onChangeText={(text) => this.setState({ emailText: text })}
                            keyboardType='email-address'
                            ref={ref => this.textInput = ref}

                            onSubmitEditing={() => {
                                if (this.props.isConnected)
                                    this.saveSupervisor();
                            }}
                            placeholder="Enter your supervisor email address"
                            placeholderTextColor='#b2b2b2'
                        />

                        {renderIf(this.state.emailText.length > 0)(
                            <Button
                                onPress={() => {

                                    this.textInput.setNativeProps({ text: '' });
                                    this.setState({ emailText: '' })
                                    //this.updateSupervisorListener(-1, '');
                                }
                                }
                                containerStyle={{ padding: 10 }}
                                isDisabled={false}>
                                <Image source={this.getCloseIconImage()} style={{ height: 8, width: 8 }} />
                            </Button>
                        )
                        }

                    </View>

                    <View style={{ alignItems: 'center', borderColor: '#0097DC', backgroundColor: '#0097DC', borderWidth: 0.5, borderRadius: 10 }}>
                        <Button
                            containerStyle={{ paddingHorizontal: 40, paddingVertical: 5, backgroundColor: '#0097DC' }}
                            onPress={() => {
                                if (this.props.isConnected)
                                    this.saveSupervisor();
                            }
                            }
                            containerStyle={{ padding: 10 }}
                            isDisabled={false}>
                            <CustomText style={{ color: 'white', fontFamily: global.boldText }}>Save</CustomText>
                        </Button>
                    </View>


                </View>



            </Animated.View>


        );
    }
    saveSupervisor() {
        this.buildRequestData(this.state.emailText);
        this.updateSupervisor();
    }
    buildRequestData(email) {
        this.updateProfileRequestData.supervisorId = -1;
        this.updateProfileRequestData.supervisorEmail = email;
        console.log("After editing email : " + email);
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
    return {
        data: state.profileData.body,
        isLoading: state.isLoading,
        error: state.error.message,
        isConnected : state.network.isConnected
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(SupervisorModal);