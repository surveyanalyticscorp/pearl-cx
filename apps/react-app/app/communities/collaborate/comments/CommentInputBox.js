import React, {Component} from 'react';
import {View, TextInput, Platform, StyleSheet, Image} from 'react-native';
import Button from 'react-native-button';
import I18n from "react-native-i18n";
import {ImagePickerManager} from "../../../global/native-modules/NativeModules";

const CachedImage = require('../../../global/ImageCache/CachedImage');
const ImageCacheProvider = CachedImage.ImageCacheProvider;
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class CommentInputBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentComment: '',
            selectedImageFile: undefined
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

    renderSend() {
        // if the TextInput isn't empty
        if ((this.state.currentComment.length > 0 || this.state.selectedImageFile) && this.props.isConnected) {
            return (
                <Button
                    style={{
                        flex: 1,
                        justifyContent: 'flex-end',
                    }}

                    onPress={() => {
                        this.props.onSend(this.state.currentComment, this.state.selectedImageFile);
                        this.setState({currentComment: "", selectedImageFile: undefined});
                    }}
                >
                    <Image source={this.getSendIconImage()} style={{height: 30, width: 30, margin: 5}}/>
                </Button>
            );
        }
        return <View/>;
    }

    render() {
        return (
            <View>
                <View style={{flexDirection: 'row', backgroundColor: 'white', justifyContent: 'center',alignItems:'center',minHeight: 50}}>

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
                        style={[styles.textInput, this.props.textInputStyle]}
                        value={this.state.currentComment}
                        enablesReturnKeyAutomatically={true}
                        underlineColorAndroid="transparent"

                    />

                        {this.renderAddImage()}


                        {this.renderSend()}

                </View>
                {this.state.selectedImageFile &&
                    this.renderSelectedImage()
                }
            </View>
        );
    }

    renderSelectedImage(){
        return (
            <View>
                <View style={{margin: 20, height: 60, width: 60, padding: 1,
                    backgroundColor:'#f8f8f8', justifyContent:'center', alignItems:'center'}}>
                    <Image source={this.state.selectedImageFile} style={{height: 50, width: 50}}/>
                    <Button containerStyle={{
                        position: 'absolute',
                        right: 0,
                        top: 0,

                    }} onPress={() => {
                        this.setState({selectedImageFile: undefined})
                    }
                    }>
                        <Icon name="close"/>

                    </Button>
                </View>
            </View>
        )
    }

    renderAddImage() {
        return (
            <Button
                style={{
                    flex: 1,
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
        if (Platform.OS != 'ios') {
            return require('../../../global/images/communities/add_image_button.png');
        } else {
            return {uri: 'add_image_button.png'};
        }

    }

    getSendIconImage() {
        if (Platform.OS != 'ios') {
            return require('../../../global/images/communities/send_icon.png');
        } else {
            return {uri: 'send_icon.png'};
        }

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

const styles = StyleSheet.create({
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
});