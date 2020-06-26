//
//  GlobalData.swift
//  ios
//
//  Created by Jignesh on 06/09/17.
//  Copyright © 2017 Jignesh. All rights reserved.
//

import UIKit
import Reachability
//import Localize_Swift

@objc class GlobalData : NSObject{
    
    // MARK: Fetch unique UUID from Device.
    /*
     *  @Author         : Jignesh Raiyani
     *  @Description    : Use this method to fetch UUID properties stores in keychain.
     */
    
    class func getUUIDForDevice() -> String{
        let retrievedString: String? = KeychainWrapper.standard.string(forKey: "com.positev.uuid")
        if let uuid = retrievedString, uuid.length > 0 {
            return uuid;
        }else{
            let uuid = NSUUID().uuidString.lowercased()
            if KeychainWrapper.standard.set(uuid, forKey: "com.positev.uuid"){
                return uuid
            }else{
                return ""
            }
        }
    }
    
    // MARK: Fetch Application specific info from AppDetails plist.
    /*
     *  @Author         : Jignesh Raiyani
     *  @Description    : Use this method to fetch application specific properties stores in AppDetails.plist.
     */
    
    class func fetchAppDetailsDict() -> NSDictionary? {
        
        var myDict: NSDictionary = NSDictionary.init()
        //        let paths = NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true) as NSArray
        //        let documentsDirectory = paths.object(at: 0) as! NSString
        //        let path = documentsDirectory.appendingPathComponent(kAppDetails + ".plist")
        //
        //        if let dict = NSDictionary(contentsOfFile: path){
        //            myDict = dict
        //        }else{
        //            if let path = Bundle.main.path(forResource: kAppDetails, ofType: "plist") {
        //                myDict = NSDictionary(contentsOfFile: path)
        //            }
        //        }
        
        if let path = Bundle.main.path(forResource: kAppDetails, ofType: "plist") {
            myDict = NSDictionary(contentsOfFile: path) ?? NSDictionary.init()
        }
        return myDict
    }
    
    class func getProfileTabMenuForTheApp() -> String {
          let details = self.fetchAppDetailsDict()
        if let profile = details?["profileTabMenu"] as? [String] {
            let profileTabMenuStr = GlobalData().convertIntoJSONString(arrayObject: profile)
            return profileTabMenuStr ?? ""
        } else {
            var profileTabMenu: [String] = []
                        profileTabMenu.append("myProfile");
                                         profileTabMenu.append("myRewards");
                                         profileTabMenu.append("shareWithFriend");
                       let profileTabMenuStr = GlobalData().convertIntoJSONString(arrayObject: profileTabMenu)
                       return profileTabMenuStr ?? ""
        }
    }
    
    class func getLeaderBoardItemForTheApp() -> String {
        let details = self.fetchAppDetailsDict()
        if let leaderboard = details?["leaderBoardMenu"] as? [String] {
            let leaderboardMenuStr = GlobalData().convertIntoJSONString(arrayObject: leaderboard)
            return leaderboardMenuStr ?? ""
        } else {
            var leaderboardMenu: [String] = []
            leaderboardMenu.append("recent")
            leaderboardMenu.append("popular")
            leaderboardMenu.append("posted_by_me")
            leaderboardMenu.append("favorites")
            let leaderboardMenuStr = GlobalData().convertIntoJSONString(arrayObject: leaderboardMenu)
            return leaderboardMenuStr ?? ""
        }
    }
    class func getTopicBoardItemForTheApp() -> String {
        let details = self.fetchAppDetailsDict()
        if let leaderboard = details?["leaderBoardMenu"] as? [String] {
            let leaderboardMenuStr = GlobalData().convertIntoJSONString(arrayObject: leaderboard)
            return leaderboardMenuStr ?? ""
        } else {
            var leaderboardMenu: [String] = []
            leaderboardMenu.append("recent")
            leaderboardMenu.append("popular")
            leaderboardMenu.append("posted_by_me")
            leaderboardMenu.append("favorites")
            let leaderboardMenuStr = GlobalData().convertIntoJSONString(arrayObject: leaderboardMenu)
            return leaderboardMenuStr ?? ""
        }
    }
    
    class func getCollaborateMenuForTheApp() -> String {
        let details = self.fetchAppDetailsDict()
        if let collaborate = details?["collabrateMenu"] as? [String] {
            let collaborateMenuStr = GlobalData().convertIntoJSONString(arrayObject: collaborate)
            return collaborateMenuStr ?? ""
        } else {
            var collaborateTabMenu: [String] = []
            collaborateTabMenu.append("topic");
            collaborateTabMenu.append("ideaboard");
            collaborateTabMenu.append("chat");
            let collaborateTabMenuStr = GlobalData().convertIntoJSONString(arrayObject: collaborateTabMenu)
            return collaborateTabMenuStr ?? ""
        }
    }
    
    class func getifTranslationsRequiredForTheApp() -> String {
        let details = self.fetchAppDetailsDict()
        if let useTranslationsForTabs = details?["useTranslationsForTabs"] as? String {
            return useTranslationsForTabs
        }
        return "true"
    }
    
    func convertIntoJSONString(arrayObject: [Any]) -> String? {
        
        do {
            let jsonData: Data = try JSONSerialization.data(withJSONObject: arrayObject, options: [])
            if  let jsonString = NSString(data: jsonData, encoding: String.Encoding.utf8.rawValue) {
                return jsonString as String
            }
            
        } catch let error as NSError {
            print("Array convertIntoJSON - \(error.description)")
        }
        return nil
    }
    
    /*
     *  @Author         : Jignesh Raiyani
     *  @Description    : Use this method to rewrite menusetting.plist while app launch.
     */
    
    class func overWriteMenuSettingPlistFileOnAppLaunch() {
        
        let paths = NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true) as NSArray
        let documentsDirectory = paths.object(at: 0) as! NSString
        let path = documentsDirectory.appendingPathComponent(kMenuSetting + ".plist")
        print("plist file path" + path)
        let fileManager = FileManager.default
        do {
            if fileManager.fileExists(atPath: path) {
                try fileManager.removeItem(atPath: path)
            }
        } catch {
            print(error)
        }
        do {
            let bundle : NSString = Bundle.main.path(forResource: kMenuSetting, ofType: "plist")! as NSString
            try fileManager.copyItem(atPath: bundle as String, toPath: path)
        } catch let error as NSError {
            print(error.description)
        }
    }
    
    /*
     *  @Author         : Jignesh Raiyani
     *  @Description    : Use this method to rewrite appDetails.plist while app launch.
     */
    
    class func overWriteAppDetailsPlistFileOnAppLaunch() {
        
        let paths = NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true) as NSArray
        let documentsDirectory = paths.object(at: 0) as! NSString
        let path = documentsDirectory.appendingPathComponent(kAppDetails + ".plist")
        print("plist file path" + path)
        let fileManager = FileManager.default
        do {
            if fileManager.fileExists(atPath: path) {
                try fileManager.removeItem(atPath: path)
            }
        } catch {
            print(error)
        }
        do {
            let bundle : NSString = Bundle.main.path(forResource: kAppDetails, ofType: "plist")! as NSString
            try fileManager.copyItem(atPath: bundle as String, toPath: path)
        } catch let error as NSError {
            print(error.description)
        }
    }
    
    /*
     *  @Author         : Jignesh Raiyani
     *  @Date           : 3rd july  2017
     *  @Description    : Use this method to get the  language ID set by user
     */
    
    class func getPreferredLanguage (key : String) -> String {
        
        let userDefaults = UserDefaults.standard
        var userDefaultSelectedLanguageID : String = ""
        if let languageID : String = userDefaults.value(forKey: key) as? String {
            userDefaultSelectedLanguageID = languageID
            //   Localize.setCurrentLanguage(languageID)
        }else{
            let localizeLanguage = "en"
            userDefaultSelectedLanguageID = localizeLanguage
            userDefaults.set(localizeLanguage, forKey: key)
            //  Localize.setCurrentLanguage(localizeLanguage)
        }
        return userDefaultSelectedLanguageID
    }
    
    /*
     *  @Author         : Jignesh Raiyani
     *  @Date           : 3rd july  2017
     *  @Description    : Use this method to set preferred language ID
     */
    
    class func setPreferredLanguage (languageID : String , key : String) {
        
        let userDefaults = UserDefaults.standard
        userDefaults.set(languageID, forKey:key)
        userDefaults.synchronize()
        Localize.setCurrentLanguage(languageID)
        
    }
    
    /*
     *  @Author         : Jignesh Raiyani
     *  @Date           : 3rd july  2017
     *  @Description    : Use this method to clear preferred language ID
     */
    
    class func clearPreferredLanguage (key : String) {
        
        let userDefaults = UserDefaults.standard
        userDefaults.removeObject(forKey: key)
        userDefaults.synchronize()
        Localize.resetCurrentLanguageToDefault()
        
    }
    
    /*
     *  @Author         : Jignesh Raiyani
     *  @Description    : Use this method to saves PushToken into NSUserDefaults.
     *  @Params
     *      key         : This parameter is used as key to save userInfo in NSUserDefaults.
     *      PushToken    : This parameter contains PushToken as string.
     *
     */
    
    class func setPushTokenToUserDefault(key:String, pushToken:String) {
        
        let userDefaults = UserDefaults.standard
        userDefaults.set(pushToken, forKey:key)
        userDefaults.synchronize()
    }
    
    /*
     *  @Author         : Jignesh Raiyani
     *  @Description    : Use this method to get PushToken from NSUserDefaults.
     *  @Params
     *      key         : This parameter is used as key to fetch pushToken from NSUserDefaults.
     *
     */
    
    class func getPushTokenFromUserDefault(key:String) -> String {
        
        let userDefaults = UserDefaults.standard
        var pushToken :String = ""
        if  let token : String = userDefaults.value(forKey: key) as? String {
            pushToken = token
        }
        return  pushToken
    }
    
    /*
     *  @Author         : Jignesh Raiyani
     *  @Description    : Use this method to saves AuthResponse into NSUserDefaults after response comes from the login service.
     *  @Params
     *      key         : This parameter is used as key to save userInfo in NSUserDefaults.
     *      authResponse    : This parameter contains authResponse as NSDictionary.
     *
     */
    
    class func setAuthResponseToUserDefault(key:String, authResponse:[String:Any]) {
        
        let userDefaults = UserDefaults.standard
        userDefaults.set(authResponse, forKey:key)
        userDefaults.synchronize()
    }
    
    /*
     *  @Author         : Jignesh Raiyani
     *  @Description    : Use this method to get AuthResponse from NSUserDefaults.
     *  @Params
     *      key         : This parameter is used as key to fetch authResponse from NSUserDefaults.
     *
     */
    
    class func getAuthResponseFromUserDefault(key:String) -> [String:Any] {
        
        let userDefaults = UserDefaults.standard
        var authResponse = [String:Any]()
        if let userDict = userDefaults.value(forKey: key) as? [String:Any] {
            authResponse = userDict
        }
        return  authResponse
    }
    
    /*
     *  @Author         : Jignesh Raiyani
     *  @Description    : Use this method to remove AuthResponse from NSUserDefaults.
     *  @Params
     *      key         : This parameter is used as key to remove authResponse from NSUserDefaults.
     *
     */
    
    class func removeAuthResponseFromUserDefault(key:String) {
        
        let userDefaults = UserDefaults.standard
        userDefaults.removeObject(forKey: key)
        userDefaults.synchronize()
    }
    
    
    /*
     *  @Author         : Jignesh Raiyani
     *  @Description    : Use this method to saves user related details into NSUserDefaults after response comes from the login service.
     *  @Params
     *      key         : This parameter is used as key to save userInfo in NSUserDefaults.
     *      userInfo    : This parameter contains user related info as NSMutableDictionary.
     *
     */
    
    class func setUserInfoToUserDefault(key:String, userInfo:[String:Any]) {
        
        let userDefaults = UserDefaults.standard
        userDefaults.set(userInfo, forKey:key)
        userDefaults.synchronize()
    }
    
    
    /*
     *  @Author         : Jignesh Raiyani
     *  @Description    : Use this method to get user related details from NSUserDefaults.
     *  @Params
     *      key         : This parameter is used as key to get userInfo from NSUserDefaults.
     *
     */
    
    class func getUserInfoFromUserDefault(_ key:String) -> [String:Any] {
        
        let userDefaults = UserDefaults.standard
        var userInfo = [String:Any]()
        if let userInfoDict = userDefaults.value(forKey: key) as? [String:Any] {
            userInfo = userInfoDict
        }
        return userInfo
    }
    
    /*
     *  @Author         : Jignesh Raiyani
     *  @Description    : Use this method to remove UserInfo from NSUserDefaults.
     *  @Params
     *      key         : This parameter is used as key to remove UserInfo from NSUserDefaults.
     *
     */
    
    class func removeUserInfoFromUserDefault(key:String) {
        let userDefaults = UserDefaults.standard
        userDefaults.removeObject(forKey: key)
        userDefaults.synchronize()
    }
    
    
    class func setLocationTimeStampToUserDefault(aLocationTimeStamp:Int64) {
        let userDefaults = UserDefaults.standard
        userDefaults.set(aLocationTimeStamp, forKey: kLocationTimeStamp)
        userDefaults.synchronize()
    }
    
    class func getLocationTimeStampFromUserDefault() -> Int64 {
        let userDefaults = UserDefaults.standard
        if let aLocationTimeStamp : Int64 = userDefaults.value(forKey: kLocationTimeStamp) as? Int64{
            return aLocationTimeStamp
        }else{
            return  0
        }
    }
    
    class func removeLocationTimeStampFromUserDefault() {
        
        let userDefaults = UserDefaults.standard
        userDefaults.removeObject(forKey: kLocationTimeStamp)
        userDefaults.synchronize()
    }
    
    /*
     *  @Author         : Jignesh Raiyani
     *  @Description    : Use this method to saves social signin info after response comes from the login service.
     *  @Params
     *      key         : This parameter is used as key to save social signin info in NSUserDefaults.
     *      aSocialSignInEnable    : This parameter contains bool value as social signin enable or not.
     *
     */
    
    class func setSocialSignInfoToUserDefault(key:String, aSocialSignInEnable:Bool) {
        
        let userDefaults = UserDefaults.standard
        userDefaults.set(aSocialSignInEnable, forKey:key)
        userDefaults.synchronize()
    }
    
    
    /*
     *  @Author         : Jignesh Raiyani
     *  @Description    : Use this method to get social signin info  from NSUserDefaults.
     *  @Params
     *      key         : This parameter is used as key to get social signin info  from NSUserDefaults.
     *
     */
    
    class func getSocialSignInfoFromUserDefault(key:String) -> Bool {
        
        let userDefaults = UserDefaults.standard
        if let socialSignInInfo : Bool = userDefaults.value(forKey: key) as? Bool{
            return socialSignInInfo
        }else{
            return  false
        }
    }
    
    /*
     *  @Author         : Jignesh Raiyani
     *  @Description    : Use this method to remove social signin info from NSUserDefaults.
     *  @Params
     *      key         : This parameter is used as key to remove social signin info from NSUserDefaults.
     *
     */
    
    
    class func removeSocialSignInInfoFromUserDefault(key:String) {
        
        let userDefaults = UserDefaults.standard
        userDefaults.removeObject(forKey: key)
        userDefaults.synchronize()
    }
    
    /*
     *  @Author         : Jignesh Raiyani
     *  @Description    : Use this method to get statusbarBG color.
     */
    
    class func getStatusBarBGColor() -> UIColor {
        return UIColor.white
    }
    
    
    /*
     *  @Author         : Jignesh Raiyani
     *  @Description    : Use this method to get context menu background color.
     */
    
    class func getContextMenuBGColor() -> UIColor {
        return iOSAppManager.colorFromHexString(hexString: kContextMenuBGColor)
    }
    
    /*
     *  @Author         : Jignesh Raiyani
     *  @Description    : Use this method to get toolbar background color for contextmenu.
     */
    
    class func getToolBarBGColorForContextMenu() -> UIColor {
        return iOSAppManager.colorFromHexString(hexString: kToolBarBGContextMenu)
    }
    
    // MARK: Set colors used in application from AppDetails.plist.
    
    /*
     *  @Author         : Jignesh Raiyani
     *  @Description    : Use this method to get NavigationBar color.
     */
    
    class func getNavigationbarColor() -> UIColor {
        
        var navBarColor: String = ""
        if let path = Bundle.main.path(forResource: kAppDetails, ofType: "plist") {
            if let  myDict : NSDictionary = NSDictionary(contentsOfFile: path), let color = myDict[kNavigationBarColor] as? String {
                navBarColor = color
            }
        }
        return iOSAppManager.colorFromHexString(hexString: navBarColor)
    }
    
    /*
     *  @Author         : Jignesh Raiyani
     *  @Description    : Use this method to get line View color for intro screen.
     */
    
    class func getLineViewBGColorForIntroScreen() -> UIColor {
        return iOSAppManager.colorFromHexString(hexString: kLineViewColorIntroScreen)
    }
    
    /*
     *  @Author         : Jignesh Raiyani
     *  @Description    : Use this method to get footer color.
     */
    
    class func getFooterBGColorForIntroScreen() -> UIColor {
        return iOSAppManager.colorFromHexString(hexString: kFooterColorIntroScreen)
    }
    
    /*
     *  @Author         : Jignesh Raiyani
     *  @Description    : Use this method to get selection color for mainmenu.
     */
    
    class func getSelectionColorForMainMenu() -> UIColor {
        
        let appDelegate = UIApplication.shared.delegate as! AppDelegate
        let aVariable = appDelegate.appType
        
        if aVariable == PocketAppType.QUESTIONPRO_VIZIENTINC_APP{
            return iOSAppManager.colorFromHexString(hexString: kSelectionColorMainMenuVizient)
        }
        else{
            return iOSAppManager.colorFromHexString(hexString: kSelectionColorMainMenu)
        }
    }
    
    
    /*
     *  @Author         : Jignesh Raiyani
     *  @Description    : Use this method to get cell selection color for main menu.
     */
    
    class func getTableViewCellSelectionColorForMainMenu() -> UIColor {
        return iOSAppManager.colorFromHexString(hexString: kTableViewCellSelectionColorMainMenu)
    }
    
    /*
     *  @Author         : Jignesh Raiyani
     *  @Description    : Use this method to get tableview cell seperator color for main menu.
     */
    
    class func getTableViewSeperatorColorForMainMenu() -> UIColor {
        return iOSAppManager.colorFromHexString(hexString: kTableViewCellSeperatorColorMainMenu)
    }
    
    // MARK: GET selection color For cell.
    
    /*
     *  @Author         : Jignesh Raiyani
     *  @Description    : Use this method to get primary font for context menu screen.
     */
    
    class func getTableViewCellSelectionColor() -> UIColor {
        return iOSAppManager.colorFromHexString(hexString: kTableViewCellSelectionColor)
    }
    
    /*
     *  @Author         : Jignesh Raiyani
     *  @Description    : Use this method to get buttonBG color.
     */
    
    class func getButtonBGColor() -> UIColor {
        
        var buttonBGColor: String = ""
        if let path = Bundle.main.path(forResource: kAppDetails, ofType: "plist"),
            let myDict = NSDictionary(contentsOfFile: path),
            let buttonBG = myDict[kButtonBG] as? String{
            buttonBGColor = buttonBG
        }
        return iOSAppManager.colorFromHexString(hexString: buttonBGColor)
    }
    
    
    /*
     *  @Author         : Jignesh Raiyani
     *  @Description    : Use this method to get button title color.
     */
    
    class func getButtonTitleColor() -> UIColor {
        
        var buttonTitlColor: String = ""
        if let path = Bundle.main.path(forResource: kAppDetails, ofType: "plist"),
            let myDict = NSDictionary(contentsOfFile: path),
            let buttonTitle = myDict[kButtonTitleColor] as? String{
            buttonTitlColor = buttonTitle
        }
        return iOSAppManager.colorFromHexString(hexString: buttonTitlColor)
    }
    
    
    // MARK: GET Primary Font For Button Title.
    
    /*
     *  @Author         : Jignesh Raiyani
     *  @Description    : Use this method to get  primary font for button title.
     */
    
    class func getPrimaryFontForButtonTitle() -> UIFont {
        return UIFont(name:kRegularFont, size:DeviceMatrixHelper.isIpad ? 20:16)!
    }
    
    // MARK: GET Primary Font For TextField.
    
    /*
     *  @Author         : Jignesh Raiyani
     *  @Description    : Use this method to get  primary font for IntroTitle.
     */
    
    class func getPrimaryFontForIntroTitle() -> UIFont {
        return UIFont(name: kBoldFont, size:DeviceMatrixHelper.isIpad ? 26:22)!
    }
    
    /*
     *  @Author         : Jignesh Raiyani
     *  @Description    : Use this method to get  primary font for IntroSubTitle.
     */
    
    class func getPrimaryFontForIntroSubTitle() -> UIFont {
        return UIFont(name: kRegularFont, size:DeviceMatrixHelper.isIpad ? 22:18)!
    }
    
    /*
     *  @Author         : Jignesh Raiyani
     *  @Description    : Use this method to get  primary font for textfield.
     */
    
    class func getPrimaryFontForTextField() -> UIFont {
        return UIFont(name: kRegularFont, size:DeviceMatrixHelper.isIpad ? 20:16)!
    }
    
    /*
     *  @Author         : Jignesh Raiyani
     *  @Description    : Use this method to get secondary font for button title.
     */
    
    class func getSecondaryFontForButtonTitle() -> UIFont {
        return UIFont(name:kRegularFont, size:DeviceMatrixHelper.isIpad ? 18:14)!
    }
    
    class func setGAIforView(aScreenName : String) {
        let appDetailsDict = GlobalData.fetchAppDetailsDict()
        if let trackerID = appDetailsDict![kGATrackID] as? String {
            let tracker = GAI.sharedInstance().tracker(withTrackingId: trackerID)
            tracker?.set(kGAIScreenName, value: aScreenName)
            let build = GAIDictionaryBuilder.createScreenView().set(aScreenName, forKey: kGAIScreenName).build()
            tracker?.send(build as? [AnyHashable : Any])
        }
    }
    
    /*
     *  @Author         : Jignesh Raiyani
     *  @Description    : Use this method to check the internet connection in the app.
     */
    
    class func checkInternetConnection() -> Bool {
        do {
            let reachability = try Reachability()
            if reachability.connection == .unavailable {
                return false
            }
        }
        catch {
        }
        return true
    }

    
    class func getTableViewRowHeight() -> CGFloat {
        return CGFloat(DeviceMatrixHelper.isIpad ? 54 : 44)
    }
    
    /*
     *  @Author         : Jignesh Raiyani
     *  @Description    : Use this method to save global login url in appdetails.plist after response comes from the global data service.
     *  @Params
     *      key         : This parameter is used as key to save data in plist.
     *      globalURL    : This parameter contains global login URL as String.
     *
     */
    
    class func writeGlobalLoginURLToPlist(key:String, globalURL:String) {
        
        let paths = NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true) as NSArray
        let documentsDirectory = paths.object(at: 0) as! NSString
        let path = documentsDirectory.appendingPathComponent(kAppDetails + ".plist")
        
        if let dict = NSMutableDictionary(contentsOfFile: path){
            dict.setObject(globalURL, forKey: key as NSString)
            if dict.write(toFile: path, atomically: true){
                print("plist_write")
            }else{
                print("plist_write_error")
            }
        }else{
            if let privPath = Bundle.main.path(forResource: kAppDetails, ofType: "plist"){
                if let dict = NSMutableDictionary(contentsOfFile: privPath){
                    dict.setObject(globalURL, forKey: key as NSString)
                    if dict.write(toFile: path, atomically: true){
                        print("plist_write")
                    }else{
                        print("plist_write_error")
                    }
                }else{
                    print("plist_write")
                }
            }else{
                print("error_find_plist")
            }
        }
    }
    
    /*
     *  @Author         : Jignesh Raiyani
     *  @Description    : Use this method to save employ detials in menusetting.plist.
     *  @Params
     *      key         : This parameter is used as key to save data in plist.
     *      globalURL    : This parameter contains global login URL as String.
     *
     */
    
    class func writeEmployDetailsToPlist(memberCount:String) {
        
        let paths = NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true) as NSArray
        let documentsDirectory = paths.object(at: 0) as! NSString
        let path = documentsDirectory.appendingPathComponent(kMenuSetting + ".plist")
        let fileManager = FileManager.default
        if (!(fileManager.fileExists(atPath: path))){
            do {
                let bundle : NSString = Bundle.main.path(forResource: kMenuSetting, ofType: "plist")! as NSString
                try fileManager.copyItem(atPath: bundle as String, toPath: path)
            } catch let error as NSError {
                print(error.description)
            }
        }
        if let plistArray = NSMutableArray(contentsOfFile: path) {
            for i in 0..<plistArray.count {
                if let dict = plistArray[i] as? NSMutableDictionary,
                    let title = dict["Title"] as? String, title == kEmployees{
                    dict["Count"] = memberCount
                    plistArray.write(toFile: path, atomically: false)
                }
            }
        }
    }
    
    // MARK: GET  Font For Navigationbar Title.
    
    /*
     *  @Author         : Jignesh Raiyani
     *  @Description    : Use this method to get  font for navigationbar title.
     */
    
    
    class func getFontForNavigationBarTitle() -> UIFont {
        return UIFont(name:kRegularFont, size:DeviceMatrixHelper.isIpad ? 22:18)!
    }
    
    // MARK: GET Font For MainSideMenu.
    
    /*
     *  @Author         : Jignesh Raiyani
     *  @Description    : Use this method to get bold primary font for main menu screen.
     */
    
    class func getBoldPrimaryFontForMainMenu() -> UIFont {
        return UIFont(name: kBoldFont, size:DeviceMatrixHelper.isIpad ? 16:12)!
    }
    
    
    /*
     *  @Author         : Jignesh Raiyani
     *  @Description    : Use this method to get primary font for main menu screen.
     */
    
    class func getPrimaryFontForMainMenu() -> UIFont {
        
        return UIFont(name: kRegularFont, size:DeviceMatrixHelper.isIpad ? 20:16)!
    }
    
    
    /*
     *  @Author         : Jignesh Raiyani
     *  @Description    : Use this method to get secondary font for main menu screen.
     */
    
    class func getSecondaryFontForMainMenu() -> UIFont {
        return UIFont(name: kRegularFont, size:DeviceMatrixHelper.isIpad ? 16:12)!
    }
    
    // MARK: GET Font For ContextSideMenu.
    
    /*
     *  @Author         : Jignesh Raiyani
     *  @Description    : Use this method to get primary font for context menu screen.
     */
    
    class func getPrimaryFontForContextMainMenu() -> UIFont {
        return UIFont(name:kRegularFont, size:DeviceMatrixHelper.isIpad ? 20:14)!
    }
    
    /*
     *  @Author         : Jignesh Raiyani
     *  @Description    : Use this method to get font for version number in main menu screen.
     */
    
    
    class func getVersionLabelFontForMainMenu() -> UIFont {
        return UIFont(name: kRegularFont, size:DeviceMatrixHelper.isIpad ? 12:8)!
    }
    
    /*
     *  @Author         : Jignesh Raiyani
     *  @Description    : Use this method to get primary font color for mainmenu.
     */
    
    
    class func getPrimaryFontColorForMainMenu() -> UIColor {
        return iOSAppManager.colorFromHexString(hexString: kPrimaryFontColorMainMenu)
    }
    
    /*
     *  @Author         : Jignesh Raiyani
     *  @Description    : Use this method to get secondary font color for mainmenu.
     */
    
    class func getSecondaryFontColorForMainMenu() -> UIColor {
        return iOSAppManager.colorFromHexString(hexString: kSecondaryFontColorMainMenu)
    }
    
    // MARK: GET attributed string For MainSideMenu.
    
    /*
     *  @Author         : Jignesh Raiyani
     *  @Description    : Use this method to get attributed string for mainside menu .
     */
    
    class func getAttributedStringForMainMenu(emailText: String, detailText: String) -> NSMutableAttributedString {
        
        let emailString = NSMutableAttributedString(string: emailText)
        emailString.addAttribute(NSAttributedStringKey.font, value:self.getBoldPrimaryFontForMainMenu(), range:NSRange(location:0,length:emailString.length))
        emailString.addAttribute(NSAttributedStringKey.foregroundColor, value:self.getPrimaryFontColorForMainMenu() ,range:NSRange(location:0,length:emailString.length))
        
        
        let detailString = NSMutableAttributedString(string: detailText)
        detailString.addAttribute(NSAttributedStringKey.font, value:self.getSecondaryFontForMainMenu(), range:NSRange(location:0,length:detailString.length))
        detailString.addAttribute(NSAttributedStringKey.foregroundColor, value:self.getSecondaryFontColorForMainMenu() ,range:NSRange(location:0,length:detailString.length))
        
        let attributeString = NSMutableAttributedString()
        
        attributeString.append(emailString)
        attributeString.append(NSAttributedString(string:"\n", attributes: nil))
        attributeString.append(detailString)
        
        let paragraphStyl = NSMutableParagraphStyle()
        paragraphStyl.lineSpacing = 2
        attributeString.addAttributes([.paragraphStyle: paragraphStyl], range: NSRange(location: 0, length: attributeString.length))
        return attributeString
    }
    
    /*
     *  @Author         : Jignesh Raiyani
     *  @Description    : Use this method to fetch menu setting array from MenuSetting.plist.
     */
    
    class func fetchMenuSettingList() -> NSMutableArray {
        var menuList = NSMutableArray()
        let paths = NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true) as NSArray
        let documentsDirectory = paths.object(at: 0) as! NSString
        let path = documentsDirectory.appendingPathComponent(kMenuSetting + ".plist")
        
        if let plist = NSMutableArray(contentsOfFile: path){
            menuList = plist
        }else{
            if let path = Bundle.main.path(forResource: kMenuSetting, ofType: "plist"),
                let pList = NSMutableArray(contentsOfFile: path){
                menuList = pList
            }
        }
        return menuList
    }
    
    // MARK: Fetch Application name from CFBundleName.
    
    /*
     *  @Author         : Jignesh Raiyani
     *  @Description    : Use this method to get Application name from CFBundleName.
     */
    
    class func getApplicationName() -> String {
        var appName = ""
        if let name = Bundle.main.infoDictionary?["CFBundleName"] as? String {
            appName = name
        }
        return appName
    }
    
    // MARK: Fetch Application version from CFBundleShortVersionString.
    
    /*
     *  @Author         : Jignesh Raiyani
     *  @Description    : Use this method to get Application version from CFBundleShortVersionString.
     */
    
    class func getApplicationVersion() -> String {
        var appVersion = ""
        if let version = Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String {
            appVersion = version
        }
        return appVersion
    }
    
    class func setLocationSurveyToUserDefault (aValue : String ) {
        let userDefaults = UserDefaults.standard
        userDefaults.set(aValue, forKey:kLocationSurvey)
        userDefaults.synchronize()
    }
    
    class func getLocationSurveyFromUserDefault() -> String {
        let userDefaults = UserDefaults.standard
        var locationID : String = ""
        if let ID = userDefaults.value(forKey: kLocationSurvey) as? String{
            locationID = ID
        }
        return locationID
    }
    
    class func removeLocationSurveyFromUserDefault() {
        let userDefaults = UserDefaults.standard
        userDefaults.removeObject(forKey: kLocationSurvey)
        userDefaults.synchronize()
    }
    
    class func setLocationResponseUniqueKeyToUserDefault (key : String , aValue : Int64 ) {
        let userDefaults = UserDefaults.standard
        userDefaults.set(aValue, forKey:key)
        userDefaults.synchronize()
    }
    
    class func getLocationResponseUniqueKeyFromUserDefault(key : String) -> Int64 {
        let userDefaults = UserDefaults.standard
        var locationUniqueID : Int64 = 0
        if let uniqueValue = userDefaults.value(forKey: key) as? Int64{
            locationUniqueID = uniqueValue
        }
        return locationUniqueID
    }
    
    class func removeLocationResponseUniqueKeyFromUserDefault(key : String) {
        let userDefaults = UserDefaults.standard
        userDefaults.removeObject(forKey: key)
        userDefaults.synchronize()
    }
    
    class func convertDateToMiliSecond(date : Date ) -> Int64 {
        let since1970 = date.timeIntervalSince1970
        return Int64(since1970 * 1000)
    }
    
    class func setLastSyncTimeToUserDefault (aValue : Date ) {
        let userDefaults = UserDefaults.standard
        userDefaults.set(aValue, forKey:kLastSyncTime)
        userDefaults.synchronize()
    }
    
    class func getLastSyncTimeFromUserDefault() -> Date? {
        let userDefaults = UserDefaults.standard
        var lastSyncTime : Date?
        if let date = userDefaults.value(forKey: kLastSyncTime) as? Date{
            lastSyncTime = date
        }
        return lastSyncTime
    }
    
    
    class func isNextSyncAvaliable() -> Bool {
        var lastSyncDate : Date
        if let date = GlobalData.getLastSyncTimeFromUserDefault() {
            lastSyncDate = date
        }else{
            lastSyncDate = Date()
            GlobalData.setLastSyncTimeToUserDefault(aValue: lastSyncDate)
        }
        let currentDate = Date()
        let seconds = Int((currentDate.timeIntervalSince1970 - lastSyncDate.timeIntervalSince1970))
        if seconds > 43200 {
            GlobalData.setLastSyncTimeToUserDefault(aValue: Date())
            let appDelegate = UIApplication.shared.delegate as! AppDelegate
            if appDelegate.appType == PocketAppType.QUESTIONPRO_COMMUNITY_APP || appDelegate.appType == PocketAppType.POSITEv_APP {
                return true
            }else{
                return false
            }
        }else{
            return false
        }
    }
    
    
    class func addFenceEntryToUserDefault (aKey : String) -> Bool{
        var entry = false
        guard aKey.length > 0 else {
            return false
        }
        var fenceList = [String]()
        let userDefaults = UserDefaults.standard
        if let list = userDefaults.value(forKey: kFenceList) as? [String] {
            fenceList = list
            if !fenceList.contains(aKey) {
                entry = true
                fenceList.append(aKey)
            }
        }else {
            entry = true
            fenceList.append(aKey)
        }
        userDefaults.set(fenceList, forKey:kFenceList)
        userDefaults.synchronize()
        return entry
    }
    
    class func removeFenceEntryFromUserDefault(aKey : String) -> (Bool, Bool) {
        var exit = false
        var storeExist = false
        guard aKey.length > 0 else {
            return (false, false)
        }
        var fenceList = [String]()
        let userDefaults = UserDefaults.standard
        if let list = userDefaults.value(forKey: kFenceList) as? [String] {
            fenceList = list
            if fenceList.contains(aKey) {
                exit = true
                fenceList = fenceList.filter({ $0 != aKey })
            }
        }
        userDefaults.set(fenceList, forKey:kFenceList)
        userDefaults.synchronize()
        if fenceList.count > 0 {
            storeExist = true
        }
        return (exit, storeExist)
    }
    
    
}
