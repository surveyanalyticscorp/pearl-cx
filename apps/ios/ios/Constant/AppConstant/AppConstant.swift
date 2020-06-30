//
//  AppConstant.swift
//  QuestionProCommunities
//
//  Created by Jignesh Raiyani on 8/21/16.
//  Copyright © 2016 QuestionPro Pvt Ltd. All rights reserved.
//

import Foundation

 // lab URL
 //let kServiceHost = "http://labs.questionpro.com"
 // let kServiceHost = "http://labs.surveyanalytics.com"
 //let kServiceHost = "http://dev.surveyanalytics.com"
 //   let kServiceHost = "http://wf-api.questionpro.com"

// QA URL
//let kServiceHost = "http://qa.questionpro.com"
//let kServiceHost = "http://192.168.5.62"
//let kServiceHost = "http://qa.surveyanalytics.com"
  let kServiceHost = "https://api.questionpro.com"


// API for slack integration.

let kSlackAuthorizeUrl = "https://slack.com/oauth/authorize"
let kSlackAccessTokenUrl = "https://slack.com/api/oauth.access"
let kConnectingServer  = "Connecting Server"


// API for sign up  for communities and health trust
let kMemberSignUp = "/a/nativehtml/panel.auth.PanelMemberSignUp"




// MARK: Key used for Plist.

let kAppDetails  = "AppDetails"

let kMenuSetting  = "MenuSetting"

// MARK: Key used for Analytics

let kGATrackID = "kGATrackID"

let kLoginScreen = "Login Screen"

let kHomeScreen = "App Home Screen"

let kSignUpScreen = "Sign Up Screen"

// MARK: Key used for NSUserDefault.

let kAuthResponse = "authResponse"

let kPushToken = "pushToken"

let kUserInfo = "userInfo"

let kSocialSignInInfo = "socialSignInInfo"

let kEmailID = "emailID"

let kProfilePic = "profilePic"
//[TG339]
let kCollaborateTabMenu = "CollaborateTabMenu"

let kPassword = "password"

let kAccessCode = "accessCode"

let kAuthToken = "authToken"

let kBody = "body"

let kEmployees = "Employees"

let kPreferedLanguageID = "PreferedLanguageID"

let kLocationSurvey = "LocationSurvey"

let kLastSyncTime = "LastSyncTime"

let kFenceList = "FenceList"

let kLocationTimeStamp = "LocationTimeStamp"

let kLocationResponseUniqueKey = "LocationResponseUniqueKey"

let kPasswordMisMatchError = "Password and Confirm Password don't match."

//Types of push notification triggers
let kPushNotificationTypeSurveyAvailable = "NewSurveyAvailableNotificationTrigger"
let kPushNotificationTypeBadge = "NewBadgeAvailableNotificationTrigger"
let kPushNotificationTypeAdminMessage = "NewAdminMessageAvailableNotificationTrigger"
let kPushNotificationTypeLocationSurveyAvailable = "NewLocationSurveyAvailableNotificationTrigger"
let kPushNotificationTypeProfileUpdate = "ProfileNeedsUpdateNotificationTrigger"
let kPushNotificationTypeRewardsAdded = "RewardsAddedNotificationTrigger"
let kPushNotificationTypeTopicAdded = "TopicAddedNotificationTrigger"
let kPushNotificationTypeCommentedOnTopic = "CommentAddedNotificationTrigger"
let kPushNotificationTypeNewsAvailabel = "NewsAvailableNotificationTrigger"
let kRemoteNotificationReceivedNotification = "RemoteNotificationReceivedWhileRunning"

/************ Employ Info   **************/
let kEmployInfoUpdateNotification = "EmployInfoUpdateNotification"

/************ iPhone X   **************/
let kiPhoneXSize = 2436



//Badge notification keys to be stored in user defaults
let kTopicsBadgeUserDefaultsKey = "TopicBadgeKey"
let kCommentsBadgeUserDefaultsKey = "CommentsBadgeKey"
let kProfileUpdateBadgeUserDefaultsKey = "ProfileUpdateBadgeKey"
let kNewsBadgeUserDefaultsKey = "NewsBadgeKey"
let kBadgeAvailableKey = "ShowBadgeOnTabKey"


// MARK: Key used for Fonts

let kBoldFont = "ProximaNovaA-Bold"

let kSemiBoldFont = "ProximaNovaA-Semibold"

let kRegularFont = "ProximaNova-Regular"

let kLightFont = "ProximaNova-Light"

// MARK: Key used for color.

let kNavigationBarColor = "navigationBarColor"

let kButtonBG = "buttonBG"

let kButtonTitleColor = "buttonTitleColor"


// MARK: Color HEX value.

let kThemesBackgroundClor = "#FE4D00"

let kLineViewColorIntroScreen = "#f28b20"

let kPrimaryFontColorMainMenu = "#303030"

let kSecondaryFontColorMainMenu = "#7e7e7e"

let kTableViewCellSeperatorColorMainMenu = "#b2b2b2"

let kTableViewCellSelectionColorMainMenu = "#E3E3E3"

let kSelectionColorMainMenu = "#2476B8"

let kSelectionColorMainMenuVizient = "#FE4D00"

let kFooterColorIntroScreen = "#3B495B"

let kContextMenuBGColor = "#757575"

let kToolBarBGContextMenu = "#363636"

let kTableViewCellSelectionColor = "#EFEFEF"

let kTableViewCellSeperatorColor = "#E4E4E4"

// Mark: String used in Application.

let kForgotPasswordOTP = "Please enter the One Time Password received on your email."

let kOTPPlaceHolder = "One Time Password (OTP)"

let kValidEmailError = "Please enter valid email address."


// Mark: Constant for Notification

let kUpdateActionBarInfo = "UpdateActionBarInfo"
let kUpdateBackButton = "UpdateBackButton"
let kUpdateLanguageInfo = "UpdateLanguageInfo"
let kLogoutUser = "LogoutUser"
let kNotificationReload = "notificationOpened" //"NotificationReload"
let kUpdateToSurveyPage = "UpdateToSurveyPage"
let kUpdateToSurveyPageFromBackground = "UpdateToSurveyPageFromBackground"
let kUpdateAsk = "UpdateToAskMenu"
let kUpdateMenuTitle = "UpdateMenuTitle"
// Mark: DB Constant

// location table constant

let kID = "id"
let kLongitude = "longitude"
let kLatitude = "latitude"
let kLocation_id = "location_id"
let kLocation_group_id = "location_group_id"
let kAddress = "address"


// location group table

let kPanelID = "panel_id"
let kSurvey_id_list = "survey_id_list"
let kName = "name"
let kQ_point = "q_point"
let kRadius = "radius"
let kTimer = "timer"
let kStartDate = "start_date"
let kEndDate = "end_date"


let kSignupValidationMSG = "Account has been created successfully. Please check your inbox for the verification email."
let kMemberStatus = "memberStatus"
