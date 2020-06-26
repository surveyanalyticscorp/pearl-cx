//
//  AppDelegate.swift
//  ios
//
//  Created by Jignesh on 06/09/17.
//  Copyright © 2017 Jignesh. All rights reserved.
//

import UIKit
import UserNotifications

// defined constant for Appdelegate file
let kStatusBar = 111

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate, UNUserNotificationCenterDelegate {
    
    var iWindow: UIWindow?
    var iNavigationController:UINavigationController?
    var appType : PocketAppType?
    // var iTracker : GAITracker?
    var iStatusBar : UIView?
    var state: String = "active"
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?) -> Bool {
        if #available(iOS 13.0, *) {
            self.iWindow?.overrideUserInterfaceStyle = .light
        }
        // Override point for customization after application launch.
        self.iWindow = UIWindow(frame: UIScreen.main.bounds)
        self.CheckApplicationType()
        self.initiateDefaultSetup()
        self.registerForPushNotification(application: application)
        self.launchMainView()
        if launchOptions?[UIApplicationLaunchOptionsKey.location] != nil {
            if self.appType == PocketAppType.QUESTIONPRO_COMMUNITY_APP || self.appType == PocketAppType.POSITEv_APP {
                LocationHandler.sharedLocationHandler.startMonitoringLocation(isContinuous: true)
            }
        }
        return true
    }
    
    private func application(application: UIApplication,openURL url: URL, options: [AnyHashable: Any]) -> Bool {
        /*
         Nehal : uncomment 
         */
        //        if #available(iOS 9.0, *) {
        //            let googleDidHandle = GIDSignIn.sharedInstance()?.handle(url)
        ////                GIDSignIn.sharedInstance().handle(url as URL?,sourceApplication: options[UIApplicationOpenURLOptionsKey.sourceApplication] as? String,  annotation: options[UIApplicationOpenURLOptionsKey.annotation])
        //            return googleDidHandle ?? false
        //        } else {
        //            return false
        //            // Fallback on earlier versions
        //        }
        return false
    }
    
    func application(_ application: UIApplication, performFetchWithCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void) {
        DispatchQueue.main.async {
            if (GlobalData.isNextSyncAvaliable()){
                WebServiceTXManager.uploadLocationDataService(aDelegate: self)
                WebServiceTXManager.invokeLocationDataService(aDelegate: self)
            }
        }
        completionHandler(UIBackgroundFetchResult.newData)
    }
    
    //    func application(application: UIApplication,openURL url: NSURL, sourceApplication: String?, annotation: AnyObject?) -> Bool {
    //        if #available(iOS 9.0, *) {
    //            var options: [String: AnyObject] = [UIApplicationOpenURLOptionsSourceApplicationKey: sourceApplication!,
    //                                                UIApplicationOpenURLOptionsAnnotationKey: annotation!]
    //            if (sourceApplication == "com.apple.SafariViewService") {
    //                // Here we pass the response to the SDK which will automatically
    //                // complete the authentication process.
    //                return true
    //            }
    //        } else {
    //            // Fallback on earlier versions
    //        }
    //        return GIDSignIn.sharedInstance().handleURL(url,
    //                                                    sourceApplication: sourceApplication,
    //                                                    annotation: annotation)
    //    }
    
    func applicationWillResignActive(_ application: UIApplication) {
        // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
        // Use this method to pause ongoing tasks, disable timers, and invalidate graphics rendering callbacks. Games should use this method to pause the game.
    }
    
    func applicationDidEnterBackground(_ application: UIApplication) {
        state = "background"
        // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
        // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
    }
    
    func applicationWillEnterForeground(_ application: UIApplication) {
        state = "background"
        // Called as part of the transition from the background to the active state; here you can undo many of the changes made on entering the background.
    }
    
    func applicationDidBecomeActive(_ application: UIApplication) {
        // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
        application.applicationIconBadgeNumber = 0
        NotificationCenter.default.post(name: NSNotification.Name(rawValue: "reloadPulseHome"), object: nil)
        //Handle the notification
        let appUserInfo : AppUser = AppUser.fromJSON(responseDict: GlobalData.getAuthResponseFromUserDefault(key: kAuthResponse))
        if let value = UserDefaults.standard.value(forKey: kUpdateToSurveyPage) as? Bool, value == true , state == "background" {
            let contextManager = ContextMenuManager()
            contextManager.refreshProfileScreenWithdata("Surveys", withTitle: "Surveys")
            UserDefaults.standard.setValue(true, forKey: kUpdateToSurveyPageFromBackground);
            UserDefaults.standard.synchronize();
        }
        if let authToken = appUserInfo.authToken, (authToken.length > 0 && self.appType == PocketAppType.POSITEv_APP || self.appType == PocketAppType.QUESTIONPRO_COMMUNITY_APP) {
            DispatchQueue.main.asyncAfter(deadline: .now() + 1.0, execute: {
                LocationHandler.sharedLocationHandler.checkLocationPermission()
            })
        }
        if GlobalData.isNextSyncAvaliable() {
            WebServiceTXManager.uploadLocationDataService(aDelegate: self)
            WebServiceTXManager.invokeLocationDataService(aDelegate: self)
        }
    }
    
    func applicationWillTerminate(_ application: UIApplication) {
        // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
    }
    
    func CheckApplicationType()  {
        let appName = Bundle.main.infoDictionary![kCFBundleNameKey as String] as! String
        if appName == "CX" {
            self.appType = PocketAppType.QUESTIONPRO_CX_APP
        }
        if appName == "HealthTrust" {
            self.appType = PocketAppType.HEALTHTRUST_APP
        }
        if appName == "Pulse" {
            self.appType = PocketAppType.QUESTIONPRO_PULSE_APP
        }
        //ADD for Energizer also
        #if QUESTIONPRO_SURVEY
        self.appType = PocketAppType.QUESTIONPRO_SURVEY_APP
        #elseif QUESTIONPRO_CX
        self.appType = PocketAppType.QUESTIONPRO_CX_APP
        #elseif QUESTIONPRO_PULSE
        self.appType = PocketAppType.QUESTIONPRO_PULSE_APP
        #elseif QUESTIONPRO_COMMUNITY
        self.appType = PocketAppType.QUESTIONPRO_COMMUNITY_APP
        #elseif VIZIENTINC
        self.appType = PocketAppType.QUESTIONPRO_VIZIENTINC_APP
        #elseif MYPINION
        self.appType = PocketAppType.MYPINION_APP
        #elseif HEALTHTRUST
        self.appType = PocketAppType.HEALTHTRUST_APP
        #elseif POSITEv
        self.appType = PocketAppType.POSITEv_APP
        #elseif ENERGIZER_IDER_LABS
        self.appType = PocketAppType.ENERGIZER_IDEA_LAB
        #elseif HEALTHTRUST_COLLABORATIVES
        self.appType = PocketAppType.HEALTHTRUST_COLLABORATIVES
        
        #else
        print("no target found");
        #endif
    }
    
    func applicationType() -> PocketAppType {
        if let applicationType = self.appType {
            return applicationType
        }else {
            return PocketAppType.QUESTIONPRO_COMMUNITY_APP
        }
    }
    
    func initiateDefaultSetup()  {
        
        self.addAnalyticsConstituent()
        GlobalData.overWriteMenuSettingPlistFileOnAppLaunch()
        
        GlobalData.getPreferredLanguage(key: kPreferedLanguageID)
        let appUserInfo : AppUser = AppUser.fromJSON(responseDict: GlobalData.getAuthResponseFromUserDefault(key: kAuthResponse))
        iOSManager.sharedInstance.appUserInfo = appUserInfo
        if let authToken = appUserInfo.authToken, authToken.length == 0 {
            GlobalData.overWriteAppDetailsPlistFileOnAppLaunch()
        }
        // NotificationCenter.default.addObserver(self, selector:#selector(orientationChanges), name: NSNotification.Name.UIDeviceOrientationDidChange, object: nil)
        UIDevice.current.isBatteryMonitoringEnabled = true
        UIApplication.shared.setMinimumBackgroundFetchInterval(600)
        
    }
    
    func addAnalyticsConstituent() {
        
        //        GAI.sharedInstance().dispatchInterval = 120
        //        GAI.sharedInstance().trackUncaughtExceptions = true
        //        if let appDetailsDict = GlobalData.fetchAppDetailsDict() {
        //            if let trackerID : String = appDetailsDict[kGATrackID] as? String {
        //                self.iTracker = GAI.sharedInstance().tracker(withTrackingId: trackerID)
        //            }
        //        }
    }
    
    func registerForPushNotification(application: UIApplication)  {
        
        if #available(iOS 10.0, *){
            let center  = UNUserNotificationCenter.current()
            center.delegate = self as UNUserNotificationCenterDelegate
            center.requestAuthorization(options: [.badge, .sound, .alert], completionHandler: {(granted, error) in
                if (granted) {
                    DispatchQueue.main.async(execute: {
                        let settings = UIUserNotificationSettings(types: [.alert, .badge, .sound], categories: nil)
                        
                        UIApplication.shared.registerUserNotificationSettings(settings)
                        UIApplication.shared.registerForRemoteNotifications()
                    })
                }
            })
        }else {
            let notificationTypes : UIUserNotificationType = [UIUserNotificationType.alert, UIUserNotificationType.badge, UIUserNotificationType.sound]
            application.registerUserNotificationSettings(UIUserNotificationSettings(types: notificationTypes, categories: nil))
            UIApplication.shared.registerForRemoteNotifications()
        }
        UIApplication.shared.applicationIconBadgeNumber = 0
    }
    
    @available(iOS 10.0, *)
    func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification, withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
        
        let appUserInfo : AppUser = AppUser.fromJSON(responseDict: GlobalData.getAuthResponseFromUserDefault(key: kAuthResponse))
        if let authToken = appUserInfo.authToken, authToken.length > 0 {
            completionHandler([.alert, .badge, .sound])
        }
    }
    
    @available(iOS 10.0, *)
    func userNotificationCenter(_ center: UNUserNotificationCenter, didReceive response: UNNotificationResponse, withCompletionHandler completionHandler: @escaping () -> Void) {
        let userInfoDict = GlobalData.getUserInfoFromUserDefault(kUserInfo)
        if let bodyDict : NSDictionary = userInfoDict[kBody] as? NSDictionary, let ID = bodyDict["ID"] as? CLong {
            if let memberDict = response.notification.request.content.userInfo["info"] as? NSDictionary, let memberID = memberDict["memberID"] as? CLong , ID == memberID  {
                if let type = memberDict["type"] as? Int , type == 1 {
                    UserDefaults.standard.set(true, forKey: kUpdateToSurveyPage)
                    UserDefaults.standard.synchronize()
                } else {
                    UIApplication.shared.applicationIconBadgeNumber = 0
                    NotificationCenter.default.post(name: NSNotification.Name(rawValue: kNotificationReload), object: nil, userInfo: response.notification.request.content.userInfo)
                }
            }
        }
    }
    
    func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
        let tokenString = deviceToken.reduce("", {$0 + String(format: "%02X", $1)})
        if tokenString.length > 0 {
            GlobalData.setPushTokenToUserDefault(key: kPushToken, pushToken: tokenString)
        }
        print("TOKEN: " + tokenString)
    }
    
    private func application(application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: NSError) {
        print("REGISTRATION ERROR = \(error)")
    }
    
    private func application(application: UIApplication, didReceiveRemoteNotification userInfo: [AnyHashable : Any]) {
        
        let userInfoDict = GlobalData.getUserInfoFromUserDefault(kUserInfo)
        if let bodyDict : NSDictionary = userInfoDict[kBody] as? NSDictionary, let ID = bodyDict["ID"] as? CLong {
            if let memberDict = userInfo["info"] as? NSDictionary, let memberID = memberDict["memberID"] as? CLong {
                if ID == memberID && application.applicationState == UIApplicationState.active {
                    if let apsDict =  userInfo["aps"] as? NSDictionary , let alertMessage : String = apsDict["alert"] as? String {
                        DispatchQueue.main.async(execute: {
                            UIApplication.shared.applicationIconBadgeNumber = 0
                            self.iWindow?.makeToast(alertMessage, duration: 3.0, position: .top)
                        })
                    }
                }else {
                    if let type = memberDict["type"] as? Int , type == 1{
                        self.setSurveyPage(applicationState: application.applicationState)
                    }
                    NotificationCenter.default.post(name: NSNotification.Name(rawValue: kNotificationReload), object: nil, userInfo: userInfo)
                }
            }
        }
    }
    
    
    func setSurveyPage(applicationState: UIApplicationState) {
        UserDefaults.standard.set(true, forKey: kUpdateToSurveyPage)
        UserDefaults.standard.synchronize();
    }
    
    func launchMainView()  {
        let mainViewController = MainViewController();
        iNavigationController = UINavigationController(rootViewController: mainViewController);
        iNavigationController?.navigationController?.interactivePopGestureRecognizer?.isEnabled = false
        self.setNavigationBarProperties()
        self.iWindow?.rootViewController = self.iNavigationController;
        self.iWindow?.makeKeyAndVisible()
        
        
    }
    
    func setNavigationBarProperties()  {
        UINavigationBar.appearance().barTintColor = GlobalData.getNavigationbarColor()
        UINavigationBar.appearance().titleTextAttributes = [NSAttributedStringKey.foregroundColor : UIColor.white]
        UIApplication.shared.statusBarStyle = .lightContent
    }
    
}

extension AppDelegate: UploadResponseDelegate , LocationDataServiceDelegate{
    //MARK: - Delegate Methods, UploadResponseDelegate
    func uploadResponseDidFinish(invocation: QPUploadResponseInvocation) {
    }
    
    func uploadResponseDidFinishWithError( error: String, invocation: QPUploadResponseInvocation) -> Void {
        
    }
    
    func LocationDataDidFinish(invocation: QPLocationDataServiceInvocation, aDBPath: String) -> Void {
        if aDBPath.length > 0 {
            
        }
    }
    
}

