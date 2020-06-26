import React, {Component} from 'react';
import {Dimensions, Image, Platform, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import {ActionConst, Actions} from 'react-native-router-flux';
import GridView from 'react-native-gridview';
import CustomText from '../../global/ui/CustomText';
import ScrollViewWithRefreshControl from '../../global/ui/ScrollViewWithRefreshControl';
import I18n from 'react-native-i18n';


const { height, width } = Dimensions.get('window');
const factor = width > height ? height : width;
const CachedImage = require('../../global/ImageCache/CachedImage');

export default class MyProfile extends Component {

  constructor(props) {
    super(props);
    this.state = {
      accountStats: [],
      dataLoaded: false,
      requestData: {},
      showLoader: false,
      isConnected: true,
      profilePic: global.appUser.profilePic
    };
  }



  componentWillUnmount() {
    this.props.navigationStateHandler.unregisterFocusHook(this)
  }

  handleNavigationSceneFocus() {
    console.log("handleNavigationSceneFocus- MyProfile " + this.props.isConnected && !this.state.showLoader);
    //this.reloadContent();
  }

  componentDidMount() {
    this.props.navigationStateHandler.registerFocusHook(this);
    if (!this.props.profileData || JSON.stringify(this.props.profileData) === '{}') {
      this.reloadContent();
    }
  }

  reloadContent() {
    this.getProfileDetails();
  }

  processAPIResponse(response) {
    dataJSON = JSON.stringify(response);
    this.setState({ data: response.body, dataLoaded: true, error: false, showLoader: false });
    global.appUser.profilePic = this.state.data.profilePic;
    this.forceUpdate();
  }

  getProfileDetails() {
    this.props.onPress();
  }


  getProfilePicUrl(responseData) {
    if (responseData.profilePicUpdated) {
      let profilePic = responseData.profilePic;
      profilePic = profilePic.substring(1)
      return global.BASE_URL + profilePic;
    } else {
      return responseData.profilePic;
    }

  }


  getButtonImage() {
    if (Platform.OS != 'ios') {
      return require('../../global/images/arrow_right_blue.png');
    }
    let iosImage = { uri: 'arrow_right_blue.png' };
    return iosImage;
  }



  renderAccountStatsContainer(accountStatsList) {
    return (
      <GridView
        data={accountStatsList}
        itemsPerRow={2}
        renderItem={this.renderItem.bind(this)} />
    );
  }

  renderItem(item) {
    return (
      <TouchableHighlight
        style={styles.squareBoxContainer}
        key={item.id}
      >
        <View style={[{ flex: 1, flexDirection: 'row' }]}>
          <View style={{ flex: 0.6, justifyContent: 'center', alignItems: 'flex-start' }}>
            <CustomText style={styles.titleText}>{item.title}</CustomText>
          </View>
          <View style={{ flex: 0.4, justifyContent: 'center', alignItems: 'center', backgroundColor: item.color }}>
            <CustomText style={styles.responseText}>{item.count}</CustomText>
          </View>
        </View>

      </TouchableHighlight>
    );
  }


  render() {
    const {language} = this.props;
    if (this.props.profileData && JSON.stringify(this.props.profileData) != '{}') {
      const myProfileProps = this.props;
      let profileData = this.props.profileData.body;
      let firstName = profileData.firstName ? profileData.firstName : '';
      let lastName = profileData.lastName ? profileData.lastName : '';
      let qPoints = profileData.qPoints ? profileData.qPoints : '0';
      var activtyHistory = I18n.t('activity_history',{locale:language});
      var activtyMyContactDetails =I18n.t('my_contact_details',{locale:language});
      return (
        <ScrollViewWithRefreshControl onRefresh={() => { this.reloadContent() }}>
          <View style={styles.mainContainer}>
            <View style={styles.imageContainer}>
              <CachedImage style={styles.profileImage} source={{ uri: this.getProfilePicUrl(profileData) }} isProfilePic={true} />
            </View>

            <View style={styles.userDetailsContainer}>
              <Text style={styles.userNameText}>{firstName + " " + lastName}</Text>
              <CustomText style={styles.userIDText}>{profileData.emailAddress}</CustomText>
            </View>

            <View style={styles.rewardPointContainer}>
              <View style={{ flex: 3, flexDirection: 'row', justifyContent: 'flex-start' }}>
                <CustomText style={styles.titleText}>{I18n.t('level_achieved',{locale:language})}</CustomText>
                <CustomText style={styles.boldText}>{profileData.level ? profileData.level : 'Wizard'}</CustomText>
              </View>
              <View style={{ flex: 2, flexDirection: 'row', justifyContent: 'flex-end' }}>
                <CustomText style={styles.titleText}>{I18n.t('total_points',{locale:language})}: </CustomText>
                <CustomText style={styles.boldText}>{qPoints + ' '}</CustomText>
              </View>
            </View>

            <View style={{ flexDirection: 'row' }}>
              <View style={styles.lineViewContainer} />
            </View>

            <View style={styles.accountStatsContainer}>
              <View style={{ flex: 1 }}>
                {this.renderAccountStatsContainer(profileData.accountStats)}
              </View>

            </View>

            <View style={{ flexDirection: 'row' }}>
              <View style={styles.lineViewContainer} />
            </View>

            <TouchableHighlight onPress={() => { Actions.activityhistory({ title: activtyHistory }) }}
              style={{ marginTop: 10, padding: 10 }}
              activeOpacity={0.6}
              underlayColor={'#CCCCCC'}>
              <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                <CustomText style={[styles.normalText, { flex: 1 }]}>{I18n.t('activity_history',{locale:language})}</CustomText>
                <Image source={this.getButtonImage()} style={styles.arrowStyle} />
              </View>

            </TouchableHighlight>


            <View style={{ flexDirection: 'row' }}>
              <View style={styles.lineViewContainer} />
            </View>

            <TouchableHighlight onPress={() => {
              Actions.editProfile({ title: activtyMyContactDetails,  type: ActionConst.PUSH, updateProfileEvent: this.props.onPress })
            }}
              style={{ marginTop: 10, padding: 10 }}
              activeOpacity={0.6}
              underlayColor={'#CCCCCC'}>
              <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                <CustomText style={[styles.normalText, { flex: 1 }]}>{I18n.t('contact_information',{locale:language})}</CustomText>
                <Image source={this.getButtonImage()} style={styles.arrowStyle} />
              </View>

            </TouchableHighlight>


          </View>
        </ScrollViewWithRefreshControl>);
    } else {
      return (<View style={{ flex: 1 }}></View>);
    }
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingTop: 10,
    paddingLeft: 40,
    paddingRight: 40,
    paddingBottom: 10
  },
  imageContainer: {

    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: Math.round(width * 0.036)
  },
  profileImage: {
    backgroundColor: '#ffffff',
    height: Math.round(factor * 0.34),
    borderRadius: Math.round(factor * 0.34) / 2,
    width: Math.round(factor * 0.34),

  },
  userDetailsContainer: {

    alignItems: 'center'
  },
  userNameText: {
    fontSize: global.h1FontSize,
    color: global.primaryFontColorForCommunities,
    fontFamily: global.semiBoldText,
    textAlign: 'center'
  },
  userIDText: {
    fontSize: global.h3FontSize,
    color: global.secondaryFontColorForCommunities,
    fontFamily: global.semiBoldText,
    textAlign: 'center'
  },
  rewardPointContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 15
  },
  normalText: {
    fontSize: global.h4FontSize,
    color: global.primaryFontColorForCommunities,
    fontFamily: global.primaryText,
    textAlign: 'left'
  },
  boldText: {
    fontSize: global.h4FontSize,
    color: global.primaryFontColorForCommunities,
    fontFamily: global.boldText,
    textAlign: 'left'
  },
  semiBoldText: {
    fontSize: global.h4FontSize,
    color: global.primaryFontColorForCommunities,
    fontFamily: global.semiBoldText,
    textAlign: 'left'
  },
  lineViewContainer: {
    height: 1,
    marginTop: 10,
    flex: 1,
    backgroundColor: '#E5E8E9'
  },
  accountStatsContainer: {
    marginTop: 10,
    flexDirection: 'row'
  },
  squareBoxContainer: {
    backgroundColor: 'transparent',
    borderColor: '#B7B7B7',
    borderWidth: 1,
    marginTop: Math.round(factor * 0.018),
    marginLeft: Math.round(factor * 0.022),
    marginRight: Math.round(factor * 0.022),
    marginBottom: Math.round(factor * 0.018),
    flex: 1,
    height: Math.round(width * 0.08)
  },

  contactInfoContainer: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: Math.round(width * 0.8)
  },
  titleContainer: {
    flex: 0.65,
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF'
  },
  titleText: {
    fontSize: global.h4FontSize,
    color: global.secondaryFontColorForCommunities,
    fontFamily: global.primaryText,
    textAlign: 'left',
    marginLeft: 5
  },
  responseContainer: {
    flex: 0.35,
    justifyContent: 'center',
    alignItems: 'center'
  },
  responseText: {
    fontSize: global.h4FontSize,
    color: global.whiteFontColor,
    fontFamily: global.semiBoldText,
    textAlign: 'left'
  },
  arrowStyle: {
    height: 12,
    width: 12,
    marginLeft: 4,
    marginRight: 4
  },
  arrowImage: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  rowTitleContainer: {
    marginLeft: 10,
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF'
  }

});


