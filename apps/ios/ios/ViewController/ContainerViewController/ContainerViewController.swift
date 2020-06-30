//
//  ContainerViewController.swift
//  QuestionProCommunities
//
//  Created by Jignesh Raiyani on 8/18/16.
//  Copyright © 2016 QuestionPro Pvt Ltd. All rights reserved.
//

import UIKit
import WebKit
//import React

let kActivityIndicatorTag = 99
let kContextViewTag = 199
let kContextViewTopPortrait = 29
let kContextViewTopLandscape = 2
let objAndGoalsTag = 211

class ContainerViewController: UIViewController, ContextMenuViewControllerDelegate {
    
    
    
    @IBOutlet weak var iReactRootView: UIView?
    var iLeftButton : UIButton?
    var iRightButton : UIButton?
    var iNavBarTitle : UILabel?
    var isToggleButton : Bool = false
    var iMMDrawerDelegate: MMDrawerContollerDelegate?
    var iDelegate: MainViewDelegate?
    var rootView : RCTRootView!
    let iNavigationManager = NavigationManager()
    let iContextMenuManager = ContextMenuManager()
    var contextMenuViewController : ContextMenuViewController!
    var lastSelectedIndexPath: IndexPath?
    var iOverlayView: UIView?
    var fromLogin : Bool = false
    
    // @sujan Show employee image or static done button on the navigation bar.
    var rightButtonImg: String?
    var isStatic = false
    
    // @sujan For portions of objectives and goals.
    var fromObjAndGoals = false
    var showContextMenu = false
    var showStat = false
    var showCloseButton = false
    //var objAndGoalsController: ObjAndGoalsViewController!
    var contextMenuOpen: Bool = false
    // @sujan Prevent multiple back press.
    var preNavClickTime: UInt64 = 0
    
    override func viewDidLoad() {
        
        super.viewDidLoad()
        UIApplication.shared.statusBarStyle = .lightContent
        GlobalData.setGAIforView(aScreenName: kHomeScreen)
        self.edgesForExtendedLayout = []
        self.navigationController?.isNavigationBarHidden = false
        self.setNavigationBarTitle()
        
        if #available(iOS 10.0, *){
            self.addReactRootView()
        }else {
            UIApplication.shared.registerForRemoteNotifications()
            DispatchQueue.main.asyncAfter(deadline: .now() + 1.0, execute: {
                self.addReactRootView()
            })
        }
        let appDelegate = UIApplication.shared.delegate as! AppDelegate
        appDelegate.iStatusBar?.backgroundColor=UIColor.white
        if (appDelegate.appType == PocketAppType.POSITEv_APP || appDelegate.appType == PocketAppType.QUESTIONPRO_COMMUNITY_APP){
            WebServiceTXManager.invokeLocationDataService(aDelegate: self)
        }
        if (appDelegate.appType == PocketAppType.QUESTIONPRO_PULSE_APP){
            self.view.backgroundColor = UIColor.init(red: 18/255, green: 63/255, blue: 104/255, alpha: 1.0)
        }
    }
    
    override func viewWillAppear(_ animated: Bool) {
        print("container view will appear")
        self.edgesForExtendedLayout = []
        self.view.layoutIfNeeded()
    }
    
    
    func setNavigationBarTitle() {
        self.iNavBarTitle = UILabel(frame: CGRect(x:0, y:0, width:self.view.frame.width, height:44))
        self.iNavBarTitle!.textAlignment = NSTextAlignment.left
        self.iNavBarTitle?.font = GlobalData.getFontForNavigationBarTitle()
        self.iNavBarTitle?.textColor = UIColor.white
        self.navigationItem.titleView = self.iNavBarTitle
        self.iNavBarTitle?.backgroundColor = UIColor.clear
    }
    
    override func viewDidAppear(_ animated: Bool) {
        NotificationCenter.default.addObserver(self, selector: #selector(self.updateNavigationBarInfo(notification:)), name: NSNotification.Name(kUpdateActionBarInfo), object:nil)
        NotificationCenter.default.addObserver(self, selector:#selector(self.updateBackButton(notification:)), name:NSNotification.Name(kUpdateBackButton), object: nil)
        NotificationCenter.default.addObserver(self, selector:#selector(self.logoutUser), name:NSNotification.Name(kLogoutUser), object: nil)
        NotificationCenter.default.addObserver(self, selector:#selector(self.reloadPulseHomeScreen), name:NSNotification.Name("reloadPulseHome"), object: nil)
        NotificationCenter.default.addObserver(self, selector:#selector(self.reloadNotificationContent(notification:)), name:NSNotification.Name(kNotificationReload), object: nil)
        NotificationCenter.default.addObserver(self, selector:#selector(self.updateUIForLanguageInfo(notification:)), name:NSNotification.Name(kUpdateLanguageInfo), object: nil)
        NotificationCenter.default.addObserver(self, selector:#selector(self.fetchUserLocation(notification:)), name:NSNotification.Name(kDatabaseLocation), object: nil)
        // @sujan Notification to show contents on the context menu for objective and goals.
        
        if let appDetailsDict = GlobalData.fetchAppDetailsDict(),
            let isWhiteLableApp : Bool = appDetailsDict["isWhiteLabel"] as? Bool, isWhiteLableApp{
            self.setNavigationBarItem(leftImageName: kLeftSideMenuImage, rightImageName: kQPIcon, titleText: "", enableRightButton: false)
        }else{
            self.setNavigationBarItem(leftImageName: kLeftSideMenuImage, rightImageName: "", titleText: "", enableRightButton: false)
        }
        
    }
    
    @objc func reloadNotificationContent(notification : NSNotification) {
        self.iNavigationManager.notificationReload(notification.userInfo)
    }
    
    @objc func reloadPulseHomeScreen() {
        //self.iContextMenuManager.reloadHomeScreenForPulse();
    }
    
    @objc func updateUIForLanguageInfo(notification : NSNotification) {
        self.iContextMenuManager.reloadHomeScreenForPulse();
    }
    
    override func setNavigationBarItem(leftImageName : String, rightImageName : String, titleText : String, enableRightButton : Bool) {
        let appDelegate = UIApplication.shared.delegate as! AppDelegate
        if leftImageName.length > 0 {
            var leftImage = UIImage(named:leftImageName)
            leftImage = leftImage?.withRenderingMode(UIImageRenderingMode.alwaysOriginal)
            self.addLeftBarButtonWithImage(leftImage!)
        }
        if rightImageName.length > 0 {
            var rightImage = UIImage(named:rightImageName)
            rightImage = rightImage?.withRenderingMode(UIImageRenderingMode.alwaysOriginal)
            self.addRightBarButtonWithImage(buttonImage: rightImage!, enableRightButton:enableRightButton)
        }// @sujan Display employee image or done button in the navigation bar for review.
        else if let imageString = rightButtonImg, (appDelegate.appType == PocketAppType.QUESTIONPRO_PULSE_APP || appDelegate.appType == PocketAppType.QUESTIONPRO_CX_APP) && imageString.length > 0 {
            if isStatic {
                var imageName = imageString
                if imageString == "arrowRightWhite" {
                    imageName = kArrowRight
                }
                var image = UIImage(named: imageName)
                image = image?.withRenderingMode(UIImageRenderingMode.alwaysOriginal)
                self.addRightBarButtonWithImage(buttonImage: image!, enableRightButton:enableRightButton)
            } else {
                let imageURL = URL(string: imageString)
                if let data = try? Data(contentsOf: imageURL!){
                    var image = UIImage(data: data)
                    image = image?.withRenderingMode(UIImageRenderingMode.alwaysOriginal)
                    self.addRightBarButtonWithImage(buttonImage: image!, enableRightButton:enableRightButton)
                } else {
                    navigationItem.rightBarButtonItem = nil
                }
            }
        } // @sujan
        else {
            navigationItem.rightBarButtonItem = nil;
        }
        
        if titleText.length > 0 { // Localization Handled
            let nameOfLProj = Localize.currentLanguage()
            print("hello " + nameOfLProj)
            
            if nameOfLProj == "en" || nameOfLProj == "pt" {
                self.iNavBarTitle?.text = titleText.localized()
            } else {
                let navString = getLocalizationValue(value: titleText)
                if navString.isEmpty {
                    self.iNavBarTitle?.text = titleText
                } else {
                  self.iNavBarTitle?.text = navString
                }
                
            }
            //self.iNavBarTitle?.text = titleText
        }
    }
    
    override func addLeftBarButtonWithImage(_ buttonImage: UIImage) {
        navigationItem.leftBarButtonItem = nil
        let leftButton: UIBarButtonItem = UIBarButtonItem(image: buttonImage, style: UIBarButtonItemStyle.plain, target: self, action:#selector(self.backButtonClicked))
        navigationItem.leftBarButtonItem = leftButton;
    }
    
    func addRightBarButtonWithImage(buttonImage: UIImage, enableRightButton: Bool) {
        
        let appDelegate = UIApplication.shared.delegate as! AppDelegate
        var rightButton = UIBarButtonItem()
        if let imageString = rightButtonImg,  (appDelegate.appType == PocketAppType.QUESTIONPRO_PULSE_APP || appDelegate.appType == PocketAppType.QUESTIONPRO_CX_APP) && imageString.length > 0 {
            // @sujan Show employee image in the navigation bar in review.
            if isStatic {
                rightButton = UIBarButtonItem(image: buttonImage, style: UIBarButtonItemStyle.plain, target: self, action:#selector(self.doneButtonEvent))
            }else {
                // [TG-339 Since image was coming to big, we reduced it to the size we needed]
                if enableRightButton { //[TG-339 we added this tp show image clearly]
                    let button = self.getBarButtonForImage(buttonImage: buttonImage)
                    rightButton = UIBarButtonItem(customView: button)
                } else {
                    let imageView = self.getUserImageViewForImage(userImage: buttonImage)
                    rightButton = UIBarButtonItem(customView: imageView)
                }
            }
        } else if fromObjAndGoals {
            rightButton = UIBarButtonItem(image: buttonImage, style: UIBarButtonItemStyle.plain, target: self, action:#selector(self.sendContextMenuEvent))
        } else{
            rightButton = UIBarButtonItem(image: buttonImage, style: UIBarButtonItemStyle.plain, target: self, action:#selector(self.openContextMenuWithAnimation))
        }
        rightButton.isEnabled = isStatic ? isStatic : enableRightButton // @sujan Enable right button
        navigationItem.rightBarButtonItem = rightButton
        
        self.isStatic = false
        self.rightButtonImg = ""
        self.fromObjAndGoals = false
    }
    
    func getUserImageViewForImage(userImage: UIImage) -> UIImageView {
        let imageView = UIImageView.init(frame: CGRect(x: 0, y: 0, width: 30, height: 30))
        let tmpImage = userImage
        let hasAlpha = false
        let scale: CGFloat = 0.0 // Automatically use scale factor of main screen
        
        UIGraphicsBeginImageContextWithOptions(imageView.frame.size, !hasAlpha, scale)
        tmpImage.draw(in: CGRect(origin: CGPoint.zero, size: imageView.frame.size))
        
        let scaledImage = UIGraphicsGetImageFromCurrentImageContext()
        UIGraphicsEndImageContext()
        
        imageView.layer.masksToBounds = false
        imageView.layer.cornerRadius = imageView.frame.height/2
        imageView.clipsToBounds = true
        imageView.image = scaledImage
        
        
        return imageView
    }
    
    func getBarButtonForImage(buttonImage: UIImage) -> UIButton {
        let button = UIButton.init(frame: CGRect(x: 0, y: 0, width: 30, height: 30))
        let tmpImage = buttonImage
        let hasAlpha = false
        let scale: CGFloat = 0.0 // Automatically use scale factor of main screen
        UIGraphicsBeginImageContextWithOptions(button.frame.size, !hasAlpha, scale)
        tmpImage.draw(in: CGRect(origin: CGPoint.zero, size: button.frame.size))
        
        let scaledImage = UIGraphicsGetImageFromCurrentImageContext()
        UIGraphicsEndImageContext()
        
        button.setImage(scaledImage, for: .normal)
        button.layer.masksToBounds = false
        
        button.imageView?.contentMode = .scaleAspectFit
        button.layer.cornerRadius = button.frame.width / 2
        button.clipsToBounds = true
        button.addTarget(self, action: #selector(self.doneButtonEvent), for: UIControlEvents.touchUpInside)
        return button
    }
    
    
    /* by ankit */
    @objc func fetchUserLocation(notification : NSNotification) {
        //        let appDelegate = UIApplication.shared.delegate as! AppDelegate
        //        if let dbPath = notification.object as? String, appDelegate.appType == PocketAppType.QUESTIONPRO_COMMUNITY_APP || appDelegate.appType == PocketAppType.POSITEv_APP {
        //            LocationHandler.sharedLocationHandler.iDBPath = dbPath
        //            LocationHandler.sharedLocationHandler.startMonitoringLocation(isContinuous: true)
        //        }
    }
    
    func addReactRootView()  {
        if self.rootView != nil {
            self.rootView.removeFromSuperview()
        }
     //  var jsCodeLocation :NSURL = NSURL()
        //        #if DEBUG
      //  jsCodeLocation = Bundle.main.url(forResource: "main", withExtension: "jsbundle")! as NSURL
        //        #else
        // let text = "http://localhost:8081/index.ios.bundle?platform=ios"
      let jsCodeLocation = URL(string: "http://localhost:8081/index.ios.bundle?platform=ios")
        //        #endif
        // let jsCodeLocation = RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index.ios", fallbackResource: nil)
        var showSurveyPage = false;
        if let value = UserDefaults.standard.value(forKey: kUpdateToSurveyPage) as? Bool, value == true {
            showSurveyPage = true;
            self.iContextMenuManager.refreshProfileScreenWithdata("Surveys", withTitle: "Surveys");
            UserDefaults.standard.set(false, forKey: kUpdateToSurveyPage)
            UserDefaults.standard.synchronize()
        }
    
        
        var pushToken : String = "" 
        if  GlobalData.getPushTokenFromUserDefault(key: kPushToken).length > 0{
            pushToken =   GlobalData.getPushTokenFromUserDefault(key: kPushToken)
        }
        
        var baseURL : String = ""
        if let appDetailsDict = GlobalData.fetchAppDetailsDict(),
            let serviceHost = appDetailsDict["kServiceHost"] as? String {
            baseURL = serviceHost
        }
        var languageID : String = ""
        if GlobalData.getPreferredLanguage(key: kPreferedLanguageID).length > 0 {
            languageID = GlobalData.getPreferredLanguage(key: kPreferedLanguageID)
        }
        let scene = showSurveyPage ? "Surveys" : "Home"
        let propsDict = ["APP_NAME": GlobalData.getApplicationName(), "APP_VERSION":GlobalData.getApplicationVersion(), "BASE_URL" : baseURL, "TOKEN":pushToken, "fromLogin" : self.fromLogin, "LANGUAGE_ID" : languageID, "scene": scene
            ] as [String : Any]
        print(propsDict)
        self.rootView = RCTRootView(bundleURL: jsCodeLocation as URL?, moduleName:"ReactApp", initialProperties: propsDict as [NSObject : AnyObject], launchOptions: nil)
        self.rootView.translatesAutoresizingMaskIntoConstraints = false
        self.iReactRootView!.addSubview(self.rootView)
        let views:[String:Any] = ["rootView": rootView]
        var constraints = NSLayoutConstraint.constraints(withVisualFormat: "V:|-00-[rootView]-00-|", options: NSLayoutFormatOptions(rawValue: 0), metrics: nil, views: views)
        constraints += NSLayoutConstraint.constraints(withVisualFormat: "H:|-00-[rootView]-00-|", options: NSLayoutFormatOptions(rawValue: 0), metrics: nil, views: views)
        self.iReactRootView?.backgroundColor = UIColor.white
        self.iReactRootView!.addConstraints(constraints)
        self.iReactRootView!.layoutIfNeeded()
    }


    
    func getProfileTabMenu() -> [String] {
        let appDelegate = UIApplication.shared.delegate as! AppDelegate
        var profileTabMenu: [String] = []
        if(appDelegate.appType == PocketAppType.ENERGIZER_IDEA_LAB) {
            profileTabMenu.append("myProfile");
            profileTabMenu.append("myRewards");
        } else {
            profileTabMenu.append("myProfile");
            profileTabMenu.append("myRewards");
            profileTabMenu.append("shareWithFriend");
        }
        return profileTabMenu
    }

    
    func viewDidDisappear(animated: Bool) {
        NotificationCenter.default.removeObserver(self)
        self.view.viewWithTag(kActivityIndicatorTag)?.removeFromSuperview()
    }
    
    @objc func logoutUser() {
        self.iDelegate?.popLoginView!()
    }
    
    @objc func backButtonClicked() {
        // @sujan Prevent multiple press of back button.
        let postNavClickTime = UInt64(NSDate().timeIntervalSince1970 * 1000.0);
        if (postNavClickTime - UInt64(preNavClickTime) > 500) { // Prevent double tab
            if isToggleButton {
                self.iNavigationManager.callBackEvent()
                isToggleButton = false
            }else {
                slideMenuController()?.toggleLeft()
            }
        }
    }
    
    
    @objc func updateBackButton(notification : NSNotification) {
        
        let isBackButtonEnable : Bool = notification.object as! Bool
        if isBackButtonEnable == true {
            self.isToggleButton = true
            var leftImage = UIImage(named:kBackButtonImage)
            leftImage = leftImage?.withRenderingMode(UIImageRenderingMode.alwaysOriginal)
            self.addLeftBarButtonWithImage(leftImage!)
        }else {
            self.isToggleButton = false
        }
    }
    
    @objc func updateNavigationBarInfo(notification : NSNotification) {
        if let navigationBarInfo = notification.object as? [String:Any] {
            let objWebPage = WebPage.fromJSON(responseDict: navigationBarInfo)
            var title = ""
            
            if let ttl = objWebPage.title {
                title = ttl
            }else {
                title = ""
            }
            
            // @sujan Display static or dynamic image on the navigation bar.
            if let rightButtonImg = objWebPage.rightButtonImg {
                self.rightButtonImg = rightButtonImg
                self.isStatic = objWebPage.isStatic
            }
            
            // @sujan Show filter options or edit menu on context menu for objectives ang goals.
            self.showStat = objWebPage.showStat
            self.showContextMenu = objWebPage.showMenuIcon
            self.fromObjAndGoals = objWebPage.showMenuIcon
            self.showCloseButton = objWebPage.showCloseButton
            NotificationCenter.default.post(name: NSNotification.Name(rawValue: kEmployInfoUpdateNotification), object: nil)
            if objWebPage.contextMenu.count > 0 {
                iOSManager.sharedInstance.iOptionMenuItems = objWebPage.contextMenu[0].menuItems
                self.addButtonToToolbar(isToggleEnable: self.isToggleButton, titleText:title, isOptionMenuEnable: true)
            }else {
                iOSManager.sharedInstance.iOptionMenuItems = []
                self.addButtonToToolbar(isToggleEnable: self.isToggleButton, titleText:title, isOptionMenuEnable: false || self.showContextMenu)
            }
        }
    }
    
    func addButtonToToolbar(isToggleEnable : Bool, titleText : String, isOptionMenuEnable : Bool) -> Void {
        
        var leftButton  = String()
        if isToggleEnable {
            leftButton = kBackButtonImage
            self.navigationController?.interactivePopGestureRecognizer?.isEnabled = false
            
        }else {
            leftButton = kLeftSideMenuImage
            self.navigationController?.interactivePopGestureRecognizer?.isEnabled = false
            
        }
        
        var rightButton  = String()
        if isOptionMenuEnable {
            rightButton = self.showCloseButton ? kCloseIcon : kRightSideMenuImage
            self.iMMDrawerDelegate!.enableRightDrawer!()
        }else {
            rightButton = ""
            self.iMMDrawerDelegate?.disableRightDrawer!()
        }
        
        if  rightButton.length > 0 {
            self.setNavigationBarItem(leftImageName: leftButton, rightImageName: rightButton, titleText: titleText, enableRightButton: true)
        }else {
            if let appDetailsDict = GlobalData.fetchAppDetailsDict(),
                let isWhiteLabelApp = appDetailsDict["isWhiteLabel"] as? Bool, isWhiteLabelApp {
                self.setNavigationBarItem(leftImageName: leftButton, rightImageName:kQPIcon, titleText: titleText, enableRightButton: false)
            }else {
                self.setNavigationBarItem(leftImageName: leftButton, rightImageName:rightButton, titleText: titleText, enableRightButton: false)
            }
        }
    }
    
    
    @objc func openContextMenuWithAnimation() {
        
        self.contextMenuViewController = ContextMenuViewController(nibName: "ContextMenuViewController", bundle: nil)
        UIApplication.shared.keyWindow?.addSubview(self.contextMenuViewController.view)
        self.contextMenuViewController.iDelegate = self
        self.contextMenuViewController.view.tag = kContextViewTag
        let topHeight = self.view.frame.height*0.023
        print("top height is = \(topHeight)")
        self.contextMenuViewController.view.frame = CGRect(x:self.view.frame.origin.x + self.view.frame.width ,y:self.getTopSpaceForContextMenu(), width:self.view.frame.width, height:self.view.frame.height + 20 - CGFloat(kContextViewTopPortrait))
        UIView.transition(with: self.contextMenuViewController.view, duration: 0.3, options: UIViewAnimationOptions.curveEaseIn, animations: {
            
            // animation
            self.contextMenuViewController.view.frame = CGRect(x:self.view.frame.origin.x, y:self.getTopSpaceForContextMenu(), width:self.view.frame.width, height:self.view.frame.height + 66 - CGFloat(kContextViewTopPortrait))
        }, completion:{ finished in
            self.contextMenuViewController.view.backgroundColor = UIColor.clear
            
            if (self.iOverlayView == nil) {
                self.iOverlayView = UIView()
            }
            self.iOverlayView!.frame = self.iReactRootView!.frame
            self.view.addSubview(self.iOverlayView!)
            self.iOverlayView!.backgroundColor = GlobalData.getContextMenuBGColor().withAlphaComponent(0.3)
        })
    }
    
    
    func closeContextViewWithAnimation() {
        
        if (self.contextMenuViewController != nil) {
            self.contextMenuViewController.view.backgroundColor = UIColor.clear
            UIView.transition(with: self.contextMenuViewController.view, duration: 0.3, options: UIViewAnimationOptions.curveEaseIn, animations: {
                // animation
                self.contextMenuViewController.view.frame = CGRect(x:self.view.frame.origin.x + self.view.frame.width, y:CGFloat(kContextViewTopPortrait), width:self.view.frame.width, height:self.view.frame.height + 20 - CGFloat(kContextViewTopPortrait) )
            }, completion: { finished in
                self.iOverlayView!.backgroundColor = UIColor.clear
                if (self.iOverlayView != nil) {
                    self.iOverlayView?.removeFromSuperview()
                }
                UIApplication.shared.keyWindow?.viewWithTag(kContextViewTag)?.removeFromSuperview()
            })
        }
    }
    
    func getTopSpaceForContextMenu() -> CGFloat {
        var topSpace : CGFloat = 0.0
        if DeviceMatrixHelper.isIpad {
            topSpace = CGFloat(kContextViewTopPortrait)
        }
        else {
            switch UIDevice.current.orientation {
            case .landscapeLeft, .landscapeRight:
                topSpace = CGFloat(kContextViewTopLandscape)
            case .portrait, .portraitUpsideDown:
                topSpace = CGFloat(kContextViewTopPortrait)
            default:
                topSpace = CGFloat(kContextViewTopPortrait)
            }
        }
        return topSpace
    }
    
    func closeContextViewWithDictionaryData(contextDict: [String:Any]) {
        self.iContextMenuManager.refreshContextMenuWithdata(contextDict)
        //        self.iContextMenuManager.refreshContextMenuWithdata(aContextMenuDict: contextDict)
        self.closeContextViewWithAnimation()
    }
    
    override func didRotate(from fromInterfaceOrientation: UIInterfaceOrientation) {
        
        if self.contextMenuViewController != nil {
            self.contextMenuViewController.view.frame = CGRect(x:self.view.frame.origin.x, y:self.getTopSpaceForContextMenu(), width:self.view.frame.width, height:self.view.frame.height + 66)
        }
        if self.iReactRootView != nil && self.iOverlayView != nil{
            self.iOverlayView!.frame = self.iReactRootView!.frame
        }
    }
    
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
}

extension ContainerViewController {
    
    @objc func doneButtonEvent() {
        self.iNavigationManager.doneAction()
    }
    
    @objc func sendContextMenuEvent() {
        showStat ? self.iNavigationManager.contextAction() : self.iNavigationManager.objEditAction()
    }
    
    // @sujan Method to hide the context menu for objective and goals.
    func closeObjAndGoals() {
    } // @sujan
}

extension ContainerViewController : LocationDataServiceDelegate {
    
    func LocationDataDidFinish(invocation: QPLocationDataServiceInvocation, aDBPath: String) -> Void {
        if aDBPath.length > 0 {
            LocationHandler.sharedLocationHandler.iDBPath = aDBPath
            LocationHandler.sharedLocationHandler.startMonitoringLocation(isContinuous: true)
        }
    }
    
}
