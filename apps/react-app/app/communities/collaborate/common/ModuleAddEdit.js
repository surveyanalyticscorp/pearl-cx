/**
 * Created by sachinsable on 18/07/17.
 */
import React from 'react';
import {
    StyleSheet,
    View,
    TextInput,
    TouchableHighlight,
    Image,
    Platform,
    ScrollView
} from 'react-native';
import I18n from 'react-native-i18n';
import CustomText from "../../../global/ui/CustomText";
import {Actions} from 'react-native-router-flux';
import Button from 'react-native-button';
import ModalDropdown from '../../../global/widgets/ModalDropdown';
import DocumentPicker from 'react-native-document-picker';
import {ImagePickerManager} from "../../../global/native-modules/NativeModules";
import SubView from '../../../global/components/SubView';
import BaseComponentWithoutScroll from '../../../global/components/BaseComponentWithoutScroll';
import {utils} from '../../../global/Utils';

const CachedImage = require('../../../global/ImageCache/CachedImage');
const ImageCacheProvider = CachedImage.ImageCacheProvider;
var AndroidKeyboardAdjust = require('NativeModules').AndroidKeyboardAdjust;
var RNFS = require('react-native-fs');
export default class ModuleAddEdit extends BaseComponentWithoutScroll {
    constructor(props) {
        super(props);
        if (props.item && props.isEdit) {
            this.state = {
                selectedCategory: props.selectedCategory,
                selectedCategoryID: props.selectedCategoryID,
                title: props.title,
                description: props.description,
                selectedImageFile: props.selectedImageFile,
                documentFile: props.documentFileItem,
                documentChanges: false,
            }
        } else {
            this.state = {
                documentFile: undefined,
                selectedCategory: props.selectedCategory,
                selectedCategoryID: props.selectedCategoryID,
                title: '',
                description: '',
                selectedImageFile: undefined,
                documentChanges: false,
            }
        }
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
        this.showDocumentPicker.bind(this)
    }

    componentWillMount() {

        if (Platform.OS !== 'ios') {
            AndroidKeyboardAdjust.setAdjustResize();
        }
    }

    renderChild() {
        let {item, title, selectedCategory, module} = this.props;
        let titleDisplay = title;
        if (item) {
            titleDisplay = "Edit : " + title;
        } else {
            titleDisplay = "Add " + module + ": " + selectedCategory;
        }
        return (<SubView title={titleDisplay}>
            {this.renderForm()}
        </SubView>);
    }

    renderForm() {
        const {language, isLoading, submitModule, addDocument} = this.props;
        return (
            <ScrollView pointerEvents={isLoading ? 'none' : 'auto'}>
                <View style={{backgroundColor: 'white', justifyContent: 'flex-start', padding: 20, flex: 1}}>
                    <View style={styles.textBox}>
                        <TextInput placeholder={I18n.t('title', {locale: language})}
                                   autoCapitalize="words"
                                   autoCorrect={false}
                                   underlineColorAndroid="transparent"
                                   onChangeText={text => {
                                       this.setState({title: text});
                                   }}
                                   textAlignVertical={'center'}
                                   placeholderTextColor='#b2b2b2'
                                   style={styles.textInput}
                                   ref={ref => this.title = ref}
                                   defaultValue={this.state.title}/>
                    </View>
                    {this.renderCategoryDropdown()}
                    {this.renderImageView()}
                    {addDocument && this.renderDocumentView()}
                    <View style={[styles.textBox, {justifyContent: 'flex-start', height: 130}]}>
                        <TextInput placeholder={I18n.t('description', {locale: language})}
                                   autoCorrect={false}
                                   onChangeText={text => {
                                       this.setState({description: text});
                                   }}
                                   textAlignVertical={'top'}
                                   placeholderTextColor='#b2b2b2'
                                   underlineColorAndroid="transparent"
                                   style={[styles.textInput, {height: 120}]}
                                   multiline={true}
                                   ref={ref => this.desc = ref}
                                   defaultValue={this.state.description}/>
                    </View>

                    <Button containerStyle={styles.button}
                            onPress={() => {
                                if (this.validateForm()) {
                                    submitModule(this.buildRequestData(), this.state.selectedCategoryID, this.state.documentFile, this.state.documentChanges);
                                }
                            }}>
                        <CustomText style={styles.buttonText}> {I18n.t('submit', {locale: language})}</CustomText>
                    </Button>

                </View>
            </ScrollView>
        )
    }


    renderDocumentView() {
        const {language} = this.props;
        return (
            <View style={{
                ...border,
                padding: 5,
                minHeight: 40,
                marginVertical: 10,
                flexDirection: 'row',
                alignItems: 'center',
            }}>
                <View style={{flex: 1}}>
                    <CustomText numberOfLines={1} ellipsizeMode="middle" style={{
                        color: this.state.documentFile ? 'green' : '#b2b2b2',
                        fontSize: global.h3FontSize,
                        textDecorationLine: this.state.selectedImageFile ? 'underline' : 'none'
                    }}>
                        {
                            this.state.documentFile ? this.state.documentFile.uri
                                : ("Document" + '(' + I18n.t('optional', {locale: language}) + ')')
                        }
                    </CustomText>
                </View>

                {
                    !this.state.documentFile &&
                    <CustomText style={{color: '#b2b2b2', fontSize: global.h3FontSize}}>
                        ({I18n.t('no_file_chosen', {locale: language})})
                    </CustomText>
                }
                <Button containerStyle={{backgroundColor: 'transparent', marginLeft: 20}}
                        onPress={() => {
                            this.showDocumentPicker().then(() => {
                            });
                        }}>
                    <CustomText style={{
                        fontFamily: global.boldText,
                        color: '#47A0DC',
                        fontSize: global.h3FontSize
                    }}>+Document</CustomText>
                </Button>
            </View>
        )
    }

    renderImageView() {
        const {language} = this.props;
        return (
            <View style={{
                ...border,
                padding: 5,
                minHeight: 40,
                marginVertical: 10,
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <TouchableHighlight
                    style={{flex: 1}}
                    activeOpacity={0.6}
                    underlayColor={'#CCCCCC'}
                    onPress={() => {
                        if (this.state.selectedImageFile) {
                            Actions.imageDetail({source: this.state.selectedImageFile});
                        }

                    }}>
                    <View>
                        <CustomText numberOfLines={1} ellipsizeMode="middle" style={{
                            color: this.state.selectedImageFile ? 'green' : '#b2b2b2',
                            fontSize: global.h3FontSize,
                            textDecorationLine: this.state.selectedImageFile ? 'underline' : 'none'
                        }}>
                            {
                                this.state.selectedImageFile ? this.state.selectedImageFile.uri
                                    : (I18n.t('image', {locale: language}) + '(' + I18n.t('optional', {locale: language}) + ')')
                            }
                        </CustomText>
                    </View>
                </TouchableHighlight>

                {
                    !this.state.selectedImageFile &&
                    <CustomText style={{color: '#b2b2b2', fontSize: global.h3FontSize}}>
                        ({I18n.t('no_file_chosen', {locale: language})})
                    </CustomText>
                }
                <Button containerStyle={{backgroundColor: 'transparent', marginLeft: 20}}
                        onPress={() => {
                            this.showImagePicker();
                        }}>
                    <CustomText style={{
                        fontFamily: global.boldText,
                        color: '#47A0DC',
                        fontSize: global.h3FontSize
                    }}>+{I18n.t('image', {locale: language})}</CustomText>
                </Button>
            </View>
        )
    }

    handleSubmitIdeaResponse(response) {
        if (response.body.message) {
            utils.showToastMessage(response.body.message);
        }
        this.props.onIdeaEdited && this.props.onIdeaEdited(response.body);
        Actions.pop();
    }

    buildRequestData() {
        const {imageLabel} = this.props;
        let deleteImage = !this.state.selectedImageFile
        let data = {
            title: this.state.title,
            description: this.state.description,
            tags: [],
            deleteImage: deleteImage,
        };
        if (!deleteImage && this.state.selectedImageFile.data) {
            return {...data, [`${imageLabel}`]: this.state.selectedImageFile.data}
        }
        return data;

    }

    validateForm() {
        if (this.state.title === '') {
            utils.showToastMessage("Please enter title.");
            return false;
        } else if (this.state.description === '') {
            utils.showToastMessage("Please enter description.");
            return false;
        } else if (this.state.selectedCategoryID === -1) {
            utils.showToastMessage("Please select category.");
            return false;
        }
        return true;
    }


    renderCategoryDropdown() {
        const {categories, categoryLabel} = this.props;
        return (
            <ModalDropdown style={styles.dropdown_2}
                           textStyle={styles.dropdown_2_text}
                           dropdownStyle={styles.dropdown_2_dropdown}
                           accessible={true}
                           options={categories}
                           renderRow={this.renderOptionsRow.bind(this)}
                           adjustFrame={style => this._dropdown_3_adjustFrame(style)}
                           onSelect={(rowId, rowData) => {
                               this.setState({
                                   selectedCategory: rowData[`${categoryLabel}`],
                                   selectedCategoryID: rowData.ID
                               });
                           }}
                           renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => {
                               if (rowID < categories.length - 1) {
                                   return this.renderSeparator(sectionID, rowID, adjacentRowHighlighted);
                               } else {
                                   return null;
                               }
                           }}
            >
                <View style={{
                    ...border,
                    paddingVertical: 5,
                    paddingHorizontal: 5,
                    height: 40,
                    alignItems: 'center',
                    flexDirection: 'row',
                    alignSelf: 'stretch'
                }}>
                    <CustomText numberOfLines={1} style={[styles.itemText, {
                        flex: 1,
                        color: ((this.state.selectedCategoryID === -1) ? '#b2b2b2' : global.primaryFontColorForCommunities)
                    }]}>{this.state.selectedCategory}</CustomText>
                    <Image source={this.getDropdownImage()} style={{height: 10, width: 10}}/>
                </View>
            </ModalDropdown>
        );
    }

    _dropdown_3_adjustFrame(style) {
        console.log(`frameStyle={width:${style.width}, height:${style.height}, top:${style.top}, left:${style.left}}`);
        style.top += Platform.OS != 'ios' ? 56 : 64;
        return style;
    }

    getDropdownImage() {
        if (Platform.OS != 'ios') {
            return require('../../../global/images/dropdown.png');
        }
        return {uri: 'dropdown.png'};
    }

    renderOptionsRow(rowData, rowID, highlighted) {

        const {categoryLabel} = this.props;
        return (
            <TouchableHighlight key={rowID} activeOpacity={0.7} underlayColor='rgba(255,255,255,0.8)'>
                <View style={[styles.dropdown_2_row]}>

                    <CustomText style={styles.itemText}>
                        {rowData[`${categoryLabel}`]}
                    </CustomText>
                </View>
            </TouchableHighlight>
        );
    }

    renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
        return (<View key={rowID} style={{flexDirection: 'row', zIndex: -1}}>
            <View style={styles.lineViewContainer}/>
        </View>);
    }

    showImagePicker() {

        ImagePickerManager.showImagePicker(this.options, (response) => {
            console.log('Response = ', response);
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else if (!(Object.keys(response).length === 0 && response.constructor === Object)) {
                if (this.props.isEdit && this.props.selectedImageFile) {
                    ImageCacheProvider.deleteFile(ImageCacheProvider.getCachedImageFilePath(this.props.selectedImageFile.uri))
                    this.deleteImage = true;
                }
                this.setState({selectedImageFile: response});
            }

        });
    }

    validFileType = (filename) => {
        const allowedFileTypes = ['doc', 'docx', 'xml', 'txt', 'rtf', 'ppt', 'pptx', 'xls', 'xlsx', 'csv', 'pdf'];
        const extn = filename.substring(filename.lastIndexOf('.') + 1, filename.length);
        return allowedFileTypes.includes(extn);
    };

    validFileSize = (fileSize) => {
        //Allowed file size - 5MB
        return fileSize / 1024 / 1024 < 5;
    };


    async showDocumentPicker() {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });
            if (this.validFileType(res.name) && this.validFileSize(res.size)) {

                var path = RNFS.DocumentDirectoryPath + '/' + res.name;
                let uri = (Platform.OS != 'ios') ? res.uri :  res.uri.replace("file://", "");
                if ((Platform.OS === 'ios')) {
                    let exist = await RNFS.exists(path);
                    if (!exist) {
                        RNFS.copyFile(uri, path).then(() => {
                            res.uri = path;
                            this.setState({documentFile: res, documentChanges: true});
                        });
                    } else {
                        res.uri = path;
                        this.setState({documentFile: res, documentChanges: true});
                    }
                } else {
                    this.setState({documentFile: res, documentChanges: true});
                }
            } else {
                if (!this.validFileType(res.name)) {
                    alert("Please select valid file type.")
                } else {
                    alert("Please select file below 5MB.")
                }

            }
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
            } else {
                throw err;
            }
        }
    }
}

const border = {
    borderColor: '#b9b9b9',
    borderRadius: 1,
    borderWidth: 1
};
const styles = StyleSheet.create({
    textBox: {
        ...border,

        padding: 5,
        alignSelf: 'stretch',
        backgroundColor: 'transparent',
        marginVertical: 10,
        justifyContent: 'center',
        minHeight: 40,
        maxHeight: 160,
        height: 40,

    },
    textInput: {
        color: global.primaryFontColorForCommunities,
        fontFamily: global.primaryText,
        fontSize: global.h3FontSize,
        backgroundColor: 'transparent',

        minHeight: 40,
        maxHeight: 120,
    },
    button: {
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
    dropdown_2: {
        alignSelf: 'stretch',
        backgroundColor: 'white',
    },
    dropdown_2_text: {
        marginVertical: 10,
        marginHorizontal: 6,
        fontSize: global.h4FontSize,
        color: 'black',
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    dropdown_2_dropdown: {
        alignSelf: 'stretch',
        ...border,
    },
    lineViewContainer: {
        height: 1,
        marginTop: 10,
        flex: 1,
        backgroundColor: '#E5E8E9'
    },
    dropdown_2_row: {
        alignSelf: 'stretch',
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center',
        height: 30,
        padding: 5,
        alignItems: 'center',
    },
    dropdown_2_image: {
        marginLeft: 4,
        width: 30,
        height: 30,
    },
    dropdown_2_row_text: {
        marginHorizontal: 4,
        fontSize: 16,
        color: 'navy',
        textAlignVertical: 'center',
    },
    dropdown_2_separator: {
        height: 1,
        backgroundColor: '#E5E8E9',
    },
    itemText: {
        color: global.primaryFontColorForCommunities,
        fontFamily: global.primaryText,
        fontSize: global.h3FontSize,
        textAlign: 'left'

    },


});
