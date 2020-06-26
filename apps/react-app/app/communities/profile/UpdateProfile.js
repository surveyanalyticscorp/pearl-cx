import React, { Component } from 'react';
import ReactNative from 'react-native';
import { View, Text, TextInput, Dimensions, StyleSheet, TouchableHighlight, Platform, Image, ScrollView } from 'react-native';
import I18n from 'react-native-i18n';
import BaseComponentWithoutScroll from '../../global/components/BaseComponentWithoutScroll';
import CustomText from '../../global/ui/CustomText';
import SubView from '../../global/components/SubView';
import Button from 'react-native-button';

import PlatformAwareKeyboardSpacer from '../../global/ui/PlatformAwareKeyboardSpacer';
const { height, width } = Dimensions.get('window');
const factor = width > height ? height : width;
var ImagePicker = require('react-native-image-picker');
var CachedImage = require('../../global/ImageCache/CachedImage');
var ImageCacheProvider = CachedImage.ImageCacheProvider;

import { Actions } from 'react-native-router-flux';
import { utils } from '../../global/Utils';


import {
    ImagePickerManager
} from '../../global/native-modules/NativeModules';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { ActionCreators } from '../actions/index';


var AndroidKeyboardAdjust = require('NativeModules').AndroidKeyboardAdjust;



class UpdateProfile extends BaseComponentWithoutScroll {

    constructor(props) {
        super(props);
        this.state = {

            firstName: this.props.profileData.firstName ? this.props.profileData.firstName : '',
            lastName: this.props.profileData.lastName ? this.props.profileData.lastName : '',
            phoneNumber: this.props.profileData.phoneNumber ? this.props.profileData.phoneNumber : '',
            emailAddress: this.props.profileData.emailAddress ? this.props.profileData.emailAddress : '',
            profilePic: null,
            profilePicUpdated: this.props.profileData.profilePicUpdated ? this.props.profileData.profilePicUpdated : false,
            isConnected: true,
            showLoader: false
        };
        this.options = {
            title: '',
            customButtons: [
                {
                    title: I18n.t('take_photo',{locale:props.language}),
                    name: 'photo',
                    takePhotoButtonTitle: 'Take Photo',
                    mediaType: 'photo',
                    videoQuality: 'high'
                },
                {
                    title: I18n.t('choose_from_library',{locale:props.language}),
                    name: 'library',
                    chooseFromLibraryButtonTitle: 'Choose from library',
                    mediaType: 'photo',
                    videoQuality: 'high'
                },

            ],
            cancelButtonTitle:I18n.t('cancel',{locale:props.language}),
            storageOptions: {
                skipBackup: true,
                path: 'images'
            },
            allowsEditing: false,
            quality: 0.3
        };

    }

    getProfilePicUrl() {
        if (this.state.profilePic !== null) {
            let source;
            // You can display the image using either data...
            source = { uri: 'data:image/jpeg;base64,' + this.state.profilePic.data };
            // Or a reference to the platform specific asset location
            if (Platform.OS === 'android') {
                source = { uri: this.state.profilePic.uri };
            } else {
                source = { uri: this.state.profilePic.uri.replace('file://', '') };
            }
            return source
        } else if (this.state.profilePicUpdated) {

            return { uri: global.BASE_URL + this.props.profileData.profilePic };
        } else {
            return { uri: this.props.profileData.profilePic };
        }

    }

    componentWillMount() {

        if (Platform.OS != 'ios') {
            AndroidKeyboardAdjust.setAdjustResize();
        }
    }

    setProfileData() {
        let profileData = this.props.profileData;
        let firstName = profileData.firstName ? profileData.firstName : '';
        let lastName = profileData.lastName ? profileData.lastName : '';
        let phoneNumber = profileData.phoneNumber ? profileData.phoneNumber : '';
        let emaiiID = profileData.emailAddress ? profileData.emailAddress : '';
        let profilePicUpdated = profileData.profilePicUpdated ? profileData.profilePicUpdated : false;
        this.setState({ firstName: firstName, lastName: lastName, phoneNumber: phoneNumber, emailAddress: emaiiID, profilePic: null, profilePicUpdated: profilePicUpdated });
    }

    showImagePicker() {

        ImagePickerManager.showImagePicker(this.options, (response) => {
            console.log('Response = ', response);
            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else if (!(Object.keys(response).length === 0 && response.constructor === Object)) {
                this.setState({ profilePic: response });
            }
        });
    }

    getProfileData() {
        let requestData = {};
        if (this.state.firstName !== '') {
            requestData.firstName = this.state.firstName;
        }
        if (this.state.lastName !== '') {
            requestData.lastName = this.state.lastName;
        } if (this.state.phoneNumber !== '') {
            requestData.phoneNumber = this.state.phoneNumber;
        } if (this.state.emailAddress !== '') {
            requestData.emailAddress = this.state.emailAddress;
        } if (this.state.profilePic !== null) {
            requestData.profilePic = this.state.profilePic.data;
        }
        return requestData;
    }

    processAPIResponse(response) {
        let dataJSON = JSON.stringify(response);
        console.log("updated profile data" + dataJSON);
        if (response.body.message) {
            utils.showToastMessage(response.body.message);
            Actions.pop({ refresh: { refreshProfile: true } });
            this.props.updateProfileEvent();

            if (this.state.profilePic != null) {
                ImageCacheProvider.deleteProfilePicDirectory(global.BASE_URL).then((response) => {
                    console.log(response);
                })
            }

        }

    }

    updatePanelMemberDetails() {
        if (this.props.isConnected && !this.props.isLoading) {
            let uploadData = this.getProfileData();
            // apiHandler.updatePanelMemberDetails(this.processAPIResponse.bind(this), uploadData, (error) => {
            //     //this.handleError(error);
            // });
            this.props.updateProfileDetails(uploadData).then((response)=>{
                this.processAPIResponse(response);
            });
        }


    }

    componentWillUnmount() {
        console.log("I am also unmounting");
    }

    showUserDetails() {

        let profilePicURL = this.getProfilePicUrl();

        const {language} = this.props;
        return (
            <ScrollView keyboardShouldPersistTaps={'always'} ref='scrollView'>
                <View style={[styles.mainContainer]} >
                    <View style={styles.userDetailsContianer}>
                        <View style={styles.imageContainer}>
                            <TouchableHighlight onPress={this.showImagePicker.bind(this)}
                                style={styles.profileImage}
                                activeOpacity={0.4}
                                underlayColor={'#CCCCCC'}>
                                {this.getProfileImage(profilePicURL)}
                            </TouchableHighlight>
                        </View>
                        <View style={styles.textInputContainer}>
                            <TextInput style={styles.inputText}
                                ref='firstName'
                                onFocus={this.inputFocused.bind(this, 'firstName')}
                                       underlineColorAndroid={'transparent'}
                                autoCapitalize="none"
                                autoCorrect={false}
                                placeholder={I18n.t('first_name',{locale:language})}
                                placeholderTextColor='#b2b2b2'
                                value={this.state.firstName}
                                onChangeText={(firstName) => this.setState({ firstName })}>
                            </TextInput>
                            <View style={styles.lineViewContainer} />
                            <TextInput style={styles.inputText}
                                ref='lastName'
                                onFocus={this.inputFocused.bind(this, 'lastName')}
                                       underlineColorAndroid={'transparent'}
                                autoCapitalize="none"
                                autoCorrect={false}
                                placeholder={I18n.t('last_name',{locale:language})}
                                placeholderTextColor='#b2b2b2'
                                value={this.state.lastName}
                                onChangeText={(lastName) => this.setState({ lastName })}>
                            </TextInput>
                            <View style={styles.lineViewContainer} />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'column', backgroundColor: '#FFFFFF', marginTop: 15 }}>
                        <View style={[styles.textInputContainer]}>
                            <TextInput style={[styles.inputText, { textAlign: 'left' }]}
                                ref='phone'
                                onFocus={this.inputFocused.bind(this, 'phone')}
                                       underlineColorAndroid={'transparent'}
                                autoCapitalize="none"
                                autoCorrect={false}
                                placeholder={I18n.t('phone_number',{locale:language})}
                                placeholderTextColor='#b2b2b2'
                                value={this.state.phoneNumber}
                                onChangeText={(phoneNumber) => this.setState({ phoneNumber })}>
                            </TextInput>
                            <View style={styles.lineViewContainer} />
                            <TextInput style={[styles.inputText, { textAlign: 'left' }]}
                                ref='email'
                                onFocus={this.inputFocused.bind(this, 'email')}
                                       underlineColorAndroid={'transparent'}
                                autoCapitalize="none"
                                autoCorrect={false}
                                placeholder={I18n.t('email_id',{locale:language})}
                                placeholderTextColor='#b2b2b2'
                                value={this.state.emailAddress}
                                onChangeText={(emailAddress) => this.setState({ emailAddress })}>
                            </TextInput>
                            <View style={styles.lineViewContainer} />
                        </View>
                    </View>
                    <View style={styles.btnContainer}>
                        <Button
                            onPress={() => { this.updatePanelMemberDetails(); }}
                            containerStyle={styles.saveButtonStyle}
                            isDisabled={false}>
                            <CustomText style={{ color: '#1F3E65', fontWeight: 'bold', fontSize: global.h2FontSize }}>{I18n.t('save',{locale:language})}</CustomText>
                        </Button>
                    </View>
                    <PlatformAwareKeyboardSpacer />
                </View>
            </ScrollView>
        );
    }

    inputFocused(refName) {
        if (Platform.OS === 'ios') {
            setTimeout(() => {
                let scrollResponder = this.refs.scrollView.getScrollResponder();
                scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
                    ReactNative.findNodeHandle(this.refs[refName]),
                    150, //additionalOffset
                    true
                );
            }, 50);
        }
    }

    renderChild() {
        return (
            <SubView title={this.props.title}>
                {this.showUserDetails()}
            </SubView>);
    }

    getProfileImage(profilePicURL){
        return(
            <View >
                <CachedImage style={[styles.profileImage]} source={profilePicURL} isProfilePic={true} />
                   <Image style={styles.capturePhotoButton} resizeMode='center' source={Platform.OS!= 'ios'? require('../../global/images/communities/add_image_button.png') : {uri:'add_image_button.png' }}/>
            </View>
        )
    }
}

// UpdateProfile.propTypes = {
//     onPress: React.PropTypes.func,
//     firstName: React.PropTypes.string,
//     lastName: React.PropTypes.string,
//     phoneNumber: React.PropTypes.string,
//     emailAddress: React.PropTypes.string,
//     imageURL: React.PropTypes.string,
//     onFocus: React.PropTypes.func,
//     onBlur: React.PropTypes.func,
// };

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: '#FFFFFF',
        flex: 1,
        marginBottom: 8,
        marginLeft: 15,
        marginRight: 15
    },
    userDetailsContianer: {
        backgroundColor: "#FFFFFF",
        flexDirection: 'row',
        marginTop: 40
    },
    imageContainer: {
        alignItems: 'center',
        justifyContent:'center',
        backgroundColor: '#FFFFFF',
        margin: 5,
        height: Math.round(factor * 0.24),
        borderRadius: Math.round(factor * 0.24) / 2,
        width: Math.round(factor * 0.24)
    },
    profileImage: {
        height: Math.round(factor * 0.24),
        borderRadius: Math.round(factor * 0.24) / 2,
        width: Math.round(factor * 0.24),

    },
    textInputContainer: {
        flexDirection: 'column',
        flex: 1,
        backgroundColor: '#FFFFFF',
        marginHorizontal: 10,
        marginVertical: 12,
    },
    inputText: {
        flex: 1,
        paddingLeft: 5,
        borderBottomWidth: 1,
        color: 'black',
        borderColor: '#C6C6C6',
        backgroundColor: '#FFFFFF',
        padding: 5,
        height: Math.round(factor * 0.10),
        fontFamily: global.primaryText,
        fontSize: global.h2FontSize
    },
    lineViewContainer: {
        height: 1,
        marginBottom: 8,
        backgroundColor: '#E5E8E9'
    },
    btnContainer: {
        alignItems: 'flex-end',
        marginTop: 10
    },
    saveButtonStyle: {
        marginHorizontal: 10,
        borderWidth: 1,
        borderRadius: 22,
        backgroundColor: '#FFFFFF',
        borderColor: '#1F3E65',
        paddingVertical: 5,
        paddingHorizontal: 40,
        alignItems: 'center'
    },
    capturePhotoButton:{
        height:30,
        width:30,
        position:'absolute',
        right:0,
        bottom:2
    }
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
  return {
    profileData : state.panelProfileData.body,
    error: state.error.message,
    isConnected: state.network.isConnected,
    isLoading : state.isLoading,
      language: state.language.googleCode
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(UpdateProfile);
