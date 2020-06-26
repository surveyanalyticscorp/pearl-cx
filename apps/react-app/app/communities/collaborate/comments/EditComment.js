import React, {Component} from 'react';

import {
    StyleSheet,
    View,
    Image,

    TextInput,
    Platform, Keyboard
} from 'react-native';
import BaseComponentWithoutScroll from "../../../global/components/BaseComponentWithoutScroll";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {ActionCreators} from "../../actions/index";
import SubViewBaseComponent from "../../../global/components/SubView";
import I18n from "react-native-i18n";
import {ImagePickerManager} from "../../../global/native-modules/NativeModules";
const CachedImage = require('../../../global/ImageCache/CachedImage');
import Icon from 'react-native-vector-icons/MaterialIcons';
import Button from 'react-native-button';
import CustomText from "../../../global/ui/CustomText";
import {Actions} from "react-native-router-flux";
import {utils} from "../../../global/Utils";
class EditComment extends  BaseComponentWithoutScroll{
    constructor(props){
        super(props);
        this.state = {
            currentComment: props.comment.commentText,
            selectedImageFile: props.commentImageURL
        };
        this.options = {
            title: '',
            customButtons: [
                {
                    title: I18n.t('take_photo', {locale: props.language}),
                    name: 'photo',
                    takePhotoButtonTitle: 'Take Photo',
                    mediaType: 'photo',
                    videoQuality: 'high'
                },
                {
                    title: I18n.t('choose_from_library', {locale: props.language}),
                    name: 'library',
                    chooseFromLibraryButtonTitle: 'Choose from library',
                    mediaType: 'photo',
                    videoQuality: 'high'
                },

            ],
            cancelButtonTitle: I18n.t('cancel', {locale: props.language}),
            storageOptions: {
                skipBackup: true,
                path: 'images'
            },
            allowsEditing: false,
            quality: 0.3,

        };
        this.deleteImage = false;
    }
    renderChild(){
        const {comment, profileImageURL} = this.props;

        return (
            <View style={{flex: 1, padding : 10}}>
                <SubViewBaseComponent title={"Edit Comment"}>
                    <View style={{flexDirection: 'row'}}>
                        {this.renderAuthorProfileImage(profileImageURL)}
                        {this.renderInputBox()}

                    </View>
                    {this.renderActionButtons()}
                    {this.state.selectedImageFile &&
                        this.renderSelectedImage(this.state.selectedImageFile)
                    }
                </SubViewBaseComponent>
            </View>
        )

    }
    renderActionButtons(){
        const {language, comment,updateComment} = this.props;
        return (
            <View style={{flexDirection: 'row', justifyContent:'flex-end', margin: 10}}>
                <Button containerStyle={[styles.cancelButton,{marginRight: 10}]}
                        onPress={() => {
                            Actions.pop();
                        }}>
                    <CustomText style={styles.cancelButtonText}> {I18n.t('cancel', {locale: language})}</CustomText>
                </Button>
                <Button containerStyle={styles.button}
                        onPress={() => {
                            updateComment(this.state.currentComment, this.state.selectedImageFile,comment.commentID, comment.parentCommentID );
                            Actions.pop();
                        }}>
                    <CustomText style={styles.buttonText}> {I18n.t('submit', {locale: language})}</CustomText>
                </Button>

            </View>
        )
    }

    renderSelectedImage(){
        return (
            <View style={{margin: 30, height: 110, width: 110, padding: 1,
                    backgroundColor:'#f8f8f8', justifyContent:'center', alignItems:'center'}}>
                    <CachedImage source={this.state.selectedImageFile} style={{height: 100, width: 100,borderRadius:15}}/>
                    <Button containerStyle={{
                        position: 'absolute',
                        right: 0,
                        top: 0,

                    }} title={""} onPress={() => {
                        this.setState({selectedImageFile: undefined})
                    }
                    }>
                        <Icon name="close"/>

                    </Button>
                </View>

        )
    }
    renderInputBox(){

        return (
            <View style={{flex:1,flexDirection: 'row',marginLeft:10, borderWidth:1, borderColor: '#e9e9e9', borderRadius:15,justifyContent: 'center',alignItems:'flex-start',minHeight: 50}}>

                <TextInput
                    ref={ref => this.textInput = ref}
                    placeholder={this.props.placeholder}
                    placeholderTextColor="#b2b2b2"
                    multiline={true}
                    autoCorrect={false}
                    autoFocus={this.props.shouldFocus}
                    onChange={(e) => {
                        this.setState({currentComment: e.nativeEvent.text});
                    }}
                    style={[styles.textInput]}
                    value={this.state.currentComment}
                    enablesReturnKeyAutomatically={true}
                    underlineColorAndroid="transparent"

                />

                {this.renderAddImage()}




            </View>
        )
    }

    renderAddImage() {
        return (
            <Button
                containerStyle={{
                    marginTop:10,
                    justifyContent: 'flex-end',
                }}
                onPress={() => {
                    this.showImagePicker();
                }}
            >
                <Image source={this.getAddImageIcon()} style={{height: 30, width: 30, margin: 5}}/>
            </Button>
        )
    }
    getAddImageIcon() {
        if (Platform.OS !== 'ios') {
            return require('../../../global/images/communities/add_image_button.png');
        } else {
            return {uri: 'add_image_button.png'};
        }

    }
    renderAuthorProfileImage(profileImageURL) {
        return (
            <View style={{marginTop: 10}}>
                <CachedImage style={styles.profileImage} source={profileImageURL}
                             isProfilePic={false}/>
            </View>
        )
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
                if (this.props.isEdit) {
                    ImageCacheProvider.deleteFile(ImageCacheProvider.getCachedImageFilePath(global.BASE_URL + this.props.idea.ideaImageURL))
                    this.deleteImage = true;
                }
                this.setState({selectedImageFile: response});
            }

        });
    }

}

const border = {
    borderColor:'#e9e9e9',
    borderWidth: 0.5,
    borderRadius: 15,

}
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        paddingVertical: 10,

    },

    profileImage: {
        backgroundColor: '#ffffff',
        height: 24,
        borderRadius: 12,
        width: 24,

    },
    textInput: {
        flex: 1,
        marginLeft: 10,
        color: 'black',
        fontSize: global.h2FontSize,
        lineHeight: global.h2FontSize,
        marginTop: Platform.select({
            ios: 6,
            android: 0,
        }),
        marginBottom: Platform.select({
            ios: 6,
            android: 4,
        }),
    },
    button: {
        ...border,
        backgroundColor: '#47A0DC',
        paddingHorizontal: 10,
        marginVertical: 2,
        paddingVertical: 5,
        alignSelf: 'flex-end'
    },
    buttonText: {
        fontSize: global.h4FontSize,
        color: 'white',
        fontFamily: global.semiBoldText
    },
    cancelButton:{
        ...border,
        backgroundColor: 'white',
        paddingHorizontal: 10,
        marginVertical: 2,
        paddingVertical: 5,
        alignSelf: 'flex-end'
    },
    cancelButtonText: {
        fontSize: global.h4FontSize,
        color: '#a9a9a9',
        fontFamily: global.semiBoldText
    },

})

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}


function mapStateToProps(state) {
    return {
        isLoading: state.isLoading,
        error: state.error.message,
        isConnected: state.network.isConnected,
        language: state.language.googleCode

    };
}


export default connect(mapStateToProps, mapDispatchToProps)(EditComment);