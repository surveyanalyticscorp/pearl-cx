import React, { Component } from 'react';
import ReactNative from 'react-native';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Navigator,
  ScrollView,
  ListView,
  DeviceEventEmitter,
  NativeEventEmitter,
  Dimensions,
  Animated,
  Image,
  RefreshControl,
  TouchableHighlight,
  NativeModules,
  Platform
} from 'react-native';
import ProfileField from './ProfileField';
import SupervisorField from './SupervisorField';
import { Actions, ActionConst } from 'react-native-router-flux';
import BaseComponentWithoutScroll from '../../../global/components/BaseComponentWithoutScroll';
import { apiHandler } from '../../../global/api/APIHandler';
import renderIf from '../../../global/renderIf';
import AppConstant from '../../../global/widgets/typography/AppConstant';
import CustomText from '../../../global/ui/CustomText';
import ScrollViewWithRefreshControl from '../../../global/ui/ScrollViewWithRefreshControl';
const { height, width } = Dimensions.get('window');
const factor = width > height ? height : width;
var ImagePicker = require('react-native-image-picker');
const CachedImage = require('../../../global/ImageCache/CachedImage');
const ImageCacheProvider = CachedImage.ImageCacheProvider;
import PlatformAwareKeyboardSpacer from '../../../global/ui/PlatformAwareKeyboardSpacer';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ImageWithLoader from '../../../global/widgets/ImageWithLoader';
const RNFS = require('react-native-fs');
import Button from 'react-native-button';
import {
  ImagePickerManager
} from '../../../global/native-modules/NativeModules';

var AndroidKeyboardAdjust = require('NativeModules').AndroidKeyboardAdjust;
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { ActionCreators } from '../../actions'

var options = {
  title: '',
  customButtons: [
    { title: 'Take Photo', name: 'photo', takePhotoButtonTitle: 'Take Photo', mediaType: 'photo', videoQuality: 'high' },
    { title: 'Choose from library', name: 'library', chooseFromLibraryButtonTitle: 'Choose from library', mediaType: 'photo', videoQuality: 'high' },

  ],
  cancelButtonTitle: 'Cancel',
  storageOptions: {
    skipBackup: true,
    path: 'images'
  },
  allowsEditing: false,
  quality: 0.3
};

class EmployeeProfile extends BaseComponentWithoutScroll {

  constructor(props) {
    super(props);

    this.state = {
      profilePicUpdated: props.data ? props.data.profilePicUpdated : false,
      profilePic: null,
      editMode: false,
      firstName: '',
      lastName: '',
      error: false,
    };
    this.requestData = { panelMemberID: global.appUser.ID, mode: 'show' }

  }
  memberCustomFields = [];

  updateProfileRequestData = {
    panelMemberID: global.appUser.ID,
    mode: "update",
    firstName: "",
    lastName: "",
    supervisorId: -1,
    supervisorEmail: "Unassigned",
    "profilePic": "",
    jsonRequest: {
      "memberCustomFields": this.memberCustomFields
    }
  };

  componentWillMount() {
    super.componentWillMount();
    if (Platform.OS != 'ios') {
      AndroidKeyboardAdjust.setAdjustResize();
    }
  }

  componetWillUpdate(nextProps, nextState) {
    console.log("Updating - " + this.memberCustomFields.length);
  }
  componentDidMount() {
    if (!this.props.data) {
      this.reloadContent();
    }
    else {
      this.updateLocalData(this.props.data);
    }
  }
  reloadContent() {
    this.getProfileDetails();
  }
  processAPIResponse() {
    if (this.props.error) {
      this.showErrorToastAndClear();
    }
    else {
      let response = this.props.data;
      if (response) {
        dataJSON = JSON.stringify(response);
        if (response.message) {
          this.showToastMessage(response.message);
        }
        this.setState({ profilePicUpdated: response.profilePicUpdated, dataLoaded: true, error: false, showLoader: false, editMode: false });
        this.updateLocalData(response);
      }
    }

  }
  updateSupervisorIDLocal(id) {
    global.appUser.parentMemberID = id;
  }

  updateLocalData(response) {
    if (response.memberSupervisorId) {
      this.updateSupervisorIDLocal(response.memberSupervisorId);
    }
    if (response.memberCustomFields) {
      this.memberCustomFields = [];
      response.memberCustomFields.map((item, index) => {
        field = { customFieldId: item.fieldId, choiceId: item.selectedChoiceId, choiceTitle: item.selectedChoiceTitle };
        this.memberCustomFields.push(field);
      });
    }
    this.updateProfileRequestData.supervisorId = response.memberSupervisorId;
    this.updateProfileRequestData.supervisorEmail = response.memberSupervisorEmail == "" ? "Unassigned" : response.memberSupervisorEmail;
    this.updateProfileRequestData.firstName = response.firstName;
    this.updateProfileRequestData.lastName = response.lastName;
    global.appUser.profilePic = this.props.data.profilePic;
  }
  getProfileDetails() {

    this.props.fetchEmployeeProfileData(this.requestData).then(() => { this.processAPIResponse() });

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

      return { uri: global.BASE_URL + this.props.data.profilePic };
    } else {
      return { uri: this.props.data.profilePic };
    }
  }


  showImagePicker() {

    ImagePickerManager.showImagePicker(options, (response) => {
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
  getEditIcon() {
    if (this.state.editMode) {
      if (Platform.OS != 'ios') {
        return require('../../../global/images/done_icon.png');
      } else {
        return { uri: 'done_icon.png' };
      }
    }
    else {
      if (Platform.OS != 'ios') {
        return require('../../../global/images/edit_profile.png');
      } else {
        return { uri: 'edit_profile.png' };
      }
    }
  }

  getCloseIcon() {
    if (this.state.editMode) {
      if (Platform.OS != 'ios') {
        return require('../../../global/images/close_grey.png');
      }
      return { uri: 'close_grey.png' };
    }
    return null;
  }

  renderChild() {

    console.log("Render Employee Profile-");
    if (this.props.data && JSON.stringify(this.props.data) != "{}") {

      let profileData = this.props.data;
      let firstName = profileData.firstName ? profileData.firstName : '';
      let lastName = profileData.lastName ? profileData.lastName : '';
      console.log("Length- " + this.memberCustomFields.length);
      return (

        <View style={{ flex: 1 }}>
          <View style={{
            padding: 2,
            backgroundColor: 'transparent',
            alignSelf: 'stretch',
            position:'absolute',
            top:0,
            right:0,
            zIndex:1,
            left:0,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Button
              containerStyle={{ padding: 10 }}
              onPress={() => {
                this.cancelEdit();
              }}
              isDisabled={false}>
              <Image source={this.getCloseIcon()} style={{ height: 15, width: 15 }}></Image>
            </Button>
            <Button
              containerStyle={{ padding: 10 }}
              onPress={() => {

                if (this.state.editMode) {
                  this.saveProfileDetails();
                } else {
                  this.toggleEditMode()
                }

              }}
              isDisabled={false}>
              <Image source={this.getEditIcon()} style={{ height: 18, width: 18 }}></Image>
            </Button>

          </View>
          <View style={{ flex: 1, alignSelf: 'stretch', zIndex:0 }}>
            {this.renderFields()}
          </View>

        </View>



      );
    }
    else {
      return (<View style={{ flex: 1 }}></View>);
    }

  }

  cancelEdit() {
    this.setState({ profilePic: null });
    this.toggleEditMode()
  }

  toggleEditMode() {
    this.setState({ editMode: !this.state.editMode });
  }
  renderFields() {
    if (this.state.editMode) {
      return this.renderEditableProfile();
    }
    return this.renderReadOnlyProfile();
  }
  renderReadOnlyProfile() {
    let profileData = this.props.data;
    let firstName = profileData.firstName ? profileData.firstName : '';
    let lastName = profileData.lastName ? profileData.lastName : '';

    return (


      <ScrollView
        keyboardShouldPersistTaps={'always'}
        style={{ flex: 1, alignSelf: 'stretch' }}
        keyboardDismissMode='interactive'
        refreshControl={
          <RefreshControl
            style={{ backgroundColor: 'transparent' }}
            refreshing={false}
            onRefresh={this.reloadContent.bind(this)}
            tintColor="#003566"
            title=""
            enabled={this.state.refreshEnabled}
            progressBackgroundColor="#fff"
          />
        }
        ref="scrollView">

        <View style={styles.mainContainer}>
          <View style={styles.imageContainer}>
            {this.getImageView()}
          </View>
          <View style={{ alignItems: 'center' }}>
            <CustomText style={styles.userNameText}>{firstName + " " + lastName}</CustomText>
            <CustomText style={styles.userIDText}>{global.appUser.emailID}</CustomText>
          </View>
          <View style={{ flexDirection: 'row', marginTop: 5 }}>
            <View style={styles.lineViewContainer} />
          </View>
          <View style={{ paddingVertical: 10, alignSelf: 'stretch' }}>
            <CustomText numberOfLines={1} style={{ color: 'black', fontFamily: global.boldText }}>{'Supervisor'}</CustomText>

            <CustomText style={[styles.itemText, { marginTop: 5 }]} numberOfLines={1}>{(!profileData.memberSupervisorEmail || profileData.memberSupervisorEmail == "") ? "Unassigned" : profileData.memberSupervisorEmail}</CustomText>

          </View>
          <View style={{ flexDirection: 'row' }}>
            <View style={styles.lineViewContainer} />
          </View>

          {this.getProfileFields()}

        </View>

      </ScrollView>


    );
  }
  getImageView() {

    return <CachedImage style={styles.profileImage} source={this.getProfilePicUrl()} isProfilePic={false} />
  }
  renderEditableProfile() {
    let profileData = this.props.data;
    let firstName = profileData.firstName ? profileData.firstName : '';
    let lastName = profileData.lastName ? profileData.lastName : '';
    let customField = profileData.memberCustomFields[0];
    return (

      <KeyboardAwareScrollView
        extraScrollHeight={200}
        style={{ flex: 1, alignSelf: 'stretch' }}
        keyboardShouldPersistTaps={'always'}
        ref="scrollView">

        <View style={[styles.mainContainer, { paddingBottom: 60 }]}>
          <View style={styles.imageContainer}>
            <TouchableHighlight onPress={this.showImagePicker.bind(this)}
              style={styles.profileImage}
              activeOpacity={0.4}
              underlayColor={'#CCCCCC'}>
              <View>
                {this.getImageView()}
              </View>
            </TouchableHighlight>
          </View>
          <View style={styles.userDetailsContainer}>
            <View style={{ ...border, height: 40, paddingVertical: 5, alignSelf: 'stretch', justifyContent: 'center' }}>
              <TextInput placeholder="First Name"
                autoCapitalize="words"
                         underlineColorAndroid={'transparent'}
                autoCorrect={false}
                onChangeText={text => this.updateProfileRequestData.firstName = text}
                placeholderTextColor='#b2b2b2' style={styles.textBox} ref={ref => this.firstName = ref} defaultValue={firstName} />
            </View>
            <View style={{ ...border, height: 40, paddingVertical: 5, marginTop: 5, alignSelf: 'stretch', justifyContent: 'center' }}>
              <TextInput placeholder="Last Name"
                autoCapitalize="words"
                         underlineColorAndroid={'transparent'}
                autoCorrect={false}
                onChangeText={text => this.updateProfileRequestData.lastName = text}
                placeholderTextColor='#b2b2b2' style={styles.textBox} ref={ref => this.lastName = ref} defaultValue={lastName} />
            </View>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <View style={styles.lineViewContainer} />
          </View>
          <View style={{ zIndex: this.memberCustomFields.length + 1, flexDirection: 'row', paddingVertical: 10 }}>
            <SupervisorField updateSupervisorListener={this.updateSupervisorListener.bind(this)}

              memberId={profileData.memberId}
              title={'Supervisor'}
              data={[]}

              inputFocusHandle={this.inputFocused.bind(this)}
              selectedChoice={(!profileData.memberSupervisorEmail || profileData.memberSupervisorEmail == "") ? "Unassigned" : profileData.memberSupervisorEmail} />
          </View>
          {this.getProfileFields()}

        </View>

      </KeyboardAwareScrollView>

    );

  }

  renderUserDetails() {
    let firstName = this.props.data.firstName;
    let lastName = this.props.data.lastName ? this.props.data.lastName : "";
    if (!this.state.editMode) {
      return (
        <View style={{ alignItems: 'center' }}>
          <CustomText style={styles.userNameText}>{firstName + " " + lastName}</CustomText>
        </View>
      );
    }
    else {
      return (
        <View style={styles.userDetailsContainer}>
          <View style={{ ...border, height: 40, padding: 5, alignSelf: 'stretch', justifyContent: 'center' }}>
            <TextInput placeholder="First Name"
              autoCapitalize="words"
              autoCorrect={false}
              onChangeText={text => this.updateProfileRequestData.firstName = text}
              placeholderTextColor='#b2b2b2' style={styles.textBox} ref={ref => this.firstName = ref} defaultValue={firstName} />
          </View>
          <View style={{ ...border, height: 40, padding: 5, marginTop: 5, alignSelf: 'stretch', justifyContent: 'center' }}>
            <TextInput placeholder="Last Name"
              autoCapitalize="words"
              autoCorrect={false}
              onChangeText={text => this.updateProfileRequestData.lastName = text}
              placeholderTextColor='#b2b2b2' style={styles.textBox} ref={ref => this.lastName = ref} defaultValue={lastName} />
          </View>
        </View>
      )
    }
  }
  saveProfileDetails() {
    if (this.validateEmail(this.updateProfileRequestData.supervisorEmail)) {
      this.toggleEditMode();

      this.props.updateProfileData(this.getUpdateProfileRequestData()).then(() => {
        if (!this.props.error) {
          if (this.state.profilePic != null) {
            console.log("Cached Path- " + ImageCacheProvider.getCachedImageFilePath(global.BASE_URL + this.props.data.profilePic));
            console.log("new Path- " + this.state.profilePic.uri);
            let catchedPath = ImageCacheProvider.getCachedImageFilePath(global.BASE_URL + this.props.data.profilePic);
            RNFS.unlink(catchedPath);
            RNFS.copyFile(this.state.profilePic.uri, catchedPath);
          }
          this.processAPIResponse()
        }
      });
    }
    else {
      this.showToastMessage('Please enter a valid supervisor email address');
    }
  }


  getUpdateProfileRequestData() {
    this.updateProfileRequestData.jsonRequest.memberCustomFields = this.memberCustomFields;
    if (this.state.profilePic != null) {
      this.updateProfileRequestData.profilePic = this.state.profilePic.data;
    }
    return this.updateProfileRequestData;
  }



  getProfileFields() {
    let profileFields = [];
    let zIndex = this.props.data.memberCustomFields.length;//length;
    this.props.data.memberCustomFields.map((item, index) => {
      profileFields.push(
        <View key={item.fieldId} style={{ zIndex: zIndex, flexDirection: 'row', paddingVertical: 10 }}>
          <ProfileField updateChoiceListener={this.updateChoiceListener.bind(this)}
            editMode={this.state.editMode}
            fieldId={item.fieldId}
            title={item.fieldName}
            data={item.fieldChoices}
            selectedChoiceId={item.selectedChoiceId}
            selectedChoiceMemberCount={item.selectedChoiceMemberCount}
            inputFocusHandle={this.inputFocused.bind(this)}
            selectedChoice={item.selectedChoiceTitle}
          />
        </View>
      );
      zIndex--;
    });
    return profileFields;
  }

  updateChoiceListener(fieldId, choiceId, choiceTitle) {
    for (i in this.memberCustomFields) {
      if (this.memberCustomFields[i].customFieldId == fieldId) {
        this.memberCustomFields[i].choiceId = choiceId;
        this.memberCustomFields[i].choiceTitle = choiceTitle;
        break;
      }
    }
  }


  updateSupervisorListener(id, email) {
    this.updateProfileRequestData.supervisorId = id;
    this.updateProfileRequestData.supervisorEmail = email;
    console.log("After editing email : " + email + " And ID: " + id);
  }
  validateEmail(email) {
    console.log("Email entered- " + email);
    if (email && email.length > 0) {
      var re = new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
      return re.test(email);
    }
    return true;
  }
  inputFocused(refName) {

  }

}
const border = {
  borderColor: '#b9b9b9',
  borderRadius: 1,
  borderWidth: 1
};
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: 'white',
    alignItems: 'center',
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10
  },
  itemText: {
    color: 'black',
    fontFamily: global.primaryText,
    fontSize: global.h2FontSize,
  },
  imageContainer: {
    height: Math.round(factor * 0.34),
    alignItems: 'center',
    backgroundColor: 'white',
    margin: Math.round(width * 0.036)
  },
  profileImage: {
    height: Math.round(factor * 0.34),
    borderRadius: Math.round(factor * 0.34) / 2,
    width: Math.round(factor * 0.34),

  },
  userDetailsContainer: {
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  userNameText: {
    fontSize: global.h1FontSize,
    color: 'black',
    fontFamily: global.semiBoldText,
    textAlign: 'center'
  },
  lineViewContainer: {
    height: 1,
    marginBottom: 10,
    flex: 1,
    backgroundColor: '#E5E8E9'
  },
  userIDText: {
    fontSize: global.h4FontSize,
    color: '#999999',
    fontFamily: global.boldText,
    textAlign: 'center'
  },
  saveButtonStyle: {
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: '#48A1DE',
    borderColor: '#48A1DE',
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center'
  },

  textBox: {
    height: 40,
    flex: 1,
    padding: 5,
    backgroundColor: 'transparent',
    color: 'black',
    fontFamily: global.primaryText,
    fontSize: global.h2FontSize
  }
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
  return {
    data: state.profileData.body,
    isLoading: state.isLoading,
    error: state.error.message,
    isConnected: state.network.isConnected,
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(EmployeeProfile);
