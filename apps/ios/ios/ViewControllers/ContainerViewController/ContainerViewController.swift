//
//  ContainerViewController.swift
//  QuestionProCommunities
//
//  Created by Jignesh Raiyani on 8/18/16.
//  Copyright © 2016 QuestionPro Pvt Ltd. All rights reserved.
//

import UIKit
import WebKit

let kActivityIndicatorTag = 99
let kContextViewTag = 199
let kContextViewTopPortrait = 22
let kContextViewTopLandscape = 2

class ContainerViewController: UIViewController, ContextMenuViewControllerDelegate {
    
    @IBOutlet weak var iReactRootView: UIView?
    var iLeftButton : UIButton?
    var iRightButton : UIButton?
    var iNavBarTitle : UILabel?
    var isToggleButton : Bool = false
    var iMMDrawerDelegate: MMDrawerContollerDelegate?
    var iDelegate: MainViewDelegate?
    var rootView : RCTRootView!
    var iNavigationManager : NavigationManager!
    var iContextMenuManager : ContextMenuManager!
    var contextMenuViewController : ContextMenuViewController!
    var lastSelectedIndexPath: NSIndexPath?
    var iOverlayView: UIView?
    var fromLogin : Bool = false

    override func viewDidLoad() {
        
        super.viewDidLoad()
        GlobalData.setGAIforView(kHomeScreen)
        self.edgesForExtendedLayout = UIRectEdge.None
        self.iNavigationManager = NavigationManager()
        self.iContextMenuManager = ContextMenuManager()
        self.navigationController?.navigationBarHidden = false
        self.setNavigationBarTitle()
        
        if #available(iOS 10.0, *){
            self.addReactRootView()
        }else {
            UIApplication.sharedApplication().registerForRemoteNotifications()
            let time = dispatch_time(dispatch_time_t(DISPATCH_TIME_NOW), 5 * Int64(NSEC_PER_SEC))
            dispatch_after(time, dispatch_get_main_queue()) {
                // Put your code which should be executed with a delay here
                self.addReactRootView()
            }
        }
    }
    
    override func viewWillAppear(animated: Bool) {
        print("container view will appear")
        self.edgesForExtendedLayout = UIRectEdge.None
        self.view.layoutIfNeeded()
    }
    
    
    func setNavigationBarTitle() {
        
        self.iNavBarTitle = UILabel(frame: CGRectMake(0, 0, self.view.frame.width, 44))
        self.iNavBarTitle!.textAlignment = NSTextAlignment.Left
        self.iNavBarTitle?.font = GlobalData.getFontForNavigationBarTitle()
        self.iNavBarTitle?.textColor = UIColor.whiteColor()
        self.navigationItem.titleView = self.iNavBarTitle
        self.iNavBarTitle?.backgroundColor = UIColor.clearColor()

    }
    
    override func viewDidAppear(animated: Bool) {
        
        NSNotificationCenter.defaultCenter().addObserver(self, selector:#selector(self.updateNavigationBarInfo(_:)), name:"updateActionBarInfo", object: nil)
        NSNotificationCenter.defaultCenter().addObserver(self, selector:#selector(self.updateBackButton(_:)), name:"updateBackButton", object: nil)
        NSNotificationCenter.defaultCenter().addObserver(self, selector:#selector(self.logoutUser), name:"logoutUser", object: nil)


        let appDetailsDict = GlobalData.fetchAppDetailsDict()
        if appDetailsDict["isWhiteLabel"] as! Bool == true {
            self.setNavigationBarItem(kLeftSideMenuImage, rightImageName: kQPIcon, titleText: "", enableRightButton: false)
        }else{
            self.setNavigationBarItem(kLeftSideMenuImage, rightImageName: "", titleText: "", enableRightButton: false)
        }
    }

    
    func updateUIForLanguageInfo(notification : NSNotification) {
        self.iContextMenuManager.reloadHomeScreenForPulse();        
    }
    
    override func setNavigationBarItem(leftImageName : String, rightImageName : String, titleText : String, enableRightButton : Bool) {
        
        if leftImageName.characters.count > 0 {
            var leftImage = UIImage(named:leftImageName)
            leftImage = leftImage?.imageWithRenderingMode(UIImageRenderingMode.AlwaysOriginal)
            self.addLeftBarButtonWithImage(leftImage!)
        }
        if rightImageName.characters.count > 0 {
            var rightImage = UIImage(named:rightImageName)
            rightImage = rightImage?.imageWithRenderingMode(UIImageRenderingMode.AlwaysOriginal)
            self.addRightBarButtonWithImage(rightImage!, enableRightButton:enableRightButton)
        }else {
            navigationItem.rightBarButtonItem = nil;
        }
        
        if titleText.characters.count > 0 {
            self.iNavBarTitle?.text = titleText
        }
    }
    
    override func addLeftBarButtonWithImage(buttonImage: UIImage) {
        navigationItem.leftBarButtonItem = nil
        let leftButton: UIBarButtonItem = UIBarButtonItem(image: buttonImage, style: UIBarButtonItemStyle.Plain, target: self, action:#selector(self.backButtonClicked))
        navigationItem.leftBarButtonItem = leftButton;
    }
    
    override func addRightBarButtonWithImage(buttonImage: UIImage, enableRightButton: Bool) {
        let rightButton: UIBarButtonItem = UIBarButtonItem(image: buttonImage, style: UIBarButtonItemStyle.Plain, target: self, action:#selector(self.openContextMenuWithAnimation))
        rightButton.enabled = enableRightButton;
        navigationItem.rightBarButtonItem = rightButton;
    }

   
    
    func addReactRootView()  {
        
        if self.rootView != nil {
            self.rootView.removeFromSuperview()
        }
        var jsCodeLocation :NSURL = NSURL()
//        #if DEBUG
         // jsCodeLocation = NSBundle.mainBundle().URLForResource("main", withExtension: "jsbundle")!
//        #else
            let text = "http://localhost:8081/index.ios.bundle?platform=ios"
            jsCodeLocation = NSURL(string:text)!
//        #endif
        
        let userInfoDict = GlobalData.getUserInfoFromUserDefault(kUserInfo)
        var bodyDict : NSDictionary = [:]
        if (userInfoDict.valueForKey(kBody) != nil) {
             bodyDict = userInfoDict.valueForKey(kBody) as! NSDictionary
         }
        
        var pushToken : String = ""
        if  GlobalData.getPushTokenFromUserDefault(kPushToken).length > 0{
            pushToken = GlobalData.getPushTokenFromUserDefault(kPushToken)
            print("print token is = \(pushToken)")
        }
        
        let appDetailsDict = GlobalData.fetchAppDetailsDict()
        var baseURL : String = ""
        if (appDetailsDict["kLoginService"] != nil && appDetailsDict["kServiceHost"] != nil) {
            baseURL = appDetailsDict["kServiceHost"]! as! String
        }
        
        var languageID : String = ""
        if GlobalData.getPreferredLanguage(kPreferedLanguageID).length > 0 {
            languageID = GlobalData.getPreferredLanguage(kPreferedLanguageID)
        }
        let propsDict = ["APP_NAME": GlobalData.getApplicationName(), "APP_VERSION":GlobalData.getApplicationVersion(), "BASE_URL" : baseURL, "APP_USER":bodyDict, "TOKEN":pushToken, "fromLogin" : self.fromLogin, "LANGUAGE_ID" : languageID]
        self.rootView = RCTRootView(bundleURL: jsCodeLocation, moduleName:"ReactApp", initialProperties: propsDict as [NSObject : AnyObject], launchOptions: nil)
        rootView.translatesAutoresizingMaskIntoConstraints = false
        self.iReactRootView!.addSubview(rootView)
        
        let views = ["rootView": rootView]
        var constraints = NSLayoutConstraint.constraintsWithVisualFormat("V:|-00-[rootView]-00-|", options: NSLayoutFormatOptions(rawValue: 0), metrics: nil, views: views)
        constraints += NSLayoutConstraint.constraintsWithVisualFormat("H:|-00-[rootView]-00-|", options: NSLayoutFormatOptions(rawValue: 0), metrics: nil, views: views)
        self.iReactRootView?.backgroundColor = UIColor.lightGrayColor()
        self.iReactRootView!.addConstraints(constraints)
        self.iReactRootView!.layoutIfNeeded()
        
    }

    
    override func viewDidDisappear(animated: Bool) {
//        if #available(iOS 10.0, *){
//            
//        }else {
//            UIApplication.sharedApplication().unregisterForRemoteNotifications()
//        }
        NSNotificationCenter.defaultCenter().removeObserver(self)
        self.view.viewWithTag(kActivityIndicatorTag)?.removeFromSuperview()
    }
    
    func logoutUser() {
        self.iDelegate?.popLoginView!()
    }
    
    func backButtonClicked() {
        
        if isToggleButton {
             self.iNavigationManager.callBackEvent()
            isToggleButton = false
        }else {
            slideMenuController()?.toggleLeft()
        }
    }
    
    
    func updateBackButton(notification : NSNotification) {

        let isBackButtonEnable : Bool = notification.object as! Bool
        if isBackButtonEnable == true {
            self.isToggleButton = true
            var leftImage = UIImage(named:kBackButtonImage)
            leftImage = leftImage?.imageWithRenderingMode(UIImageRenderingMode.AlwaysOriginal)
            self.addLeftBarButtonWithImage(leftImage!)
        }else {
            self.isToggleButton = false
        }
    }
    
    func updateNavigationBarInfo(notification : NSNotification) {
        let navigationBarInfo : NSDictionary = notification.object as! NSDictionary
        let objWebPage = WebPage.fromJSON(navigationBarInfo)
        var title = ""
        
        if objWebPage.title != nil{
            title = objWebPage.title
        }else {
            title = ""
        }

        
        if objWebPage.contextMenu.count > 0 {
            iOSManager.sharedInstance.iOptionMenuItems = objWebPage.contextMenu[0].menuItems
            self.addButtonToToolbar(self.isToggleButton, titleText:title, isOptionMenuEnable: true)
        }else {
            iOSManager.sharedInstance.iOptionMenuItems = []
            self.addButtonToToolbar(self.isToggleButton, titleText:title, isOptionMenuEnable: false)
        }
    }
    
    func addButtonToToolbar(isToggleEnable : Bool, titleText : String, isOptionMenuEnable : Bool) -> Void {
        
        var leftButton  = String()
        if isToggleEnable {
            leftButton = kBackButtonImage
             self.navigationController?.interactivePopGestureRecognizer?.enabled = false

        }else {
            leftButton = kLeftSideMenuImage
             self.navigationController?.interactivePopGestureRecognizer?.enabled = false

        }
        
        var rightButton  = String()
        if isOptionMenuEnable {
            rightButton = kRightSideMenuImage
            self.iMMDrawerDelegate!.enableRightDrawer!()
        }else {
            rightButton = ""
            self.iMMDrawerDelegate?.disableRightDrawer!()
        }
        
        if  rightButton.characters.count > 0 {
            self.setNavigationBarItem(leftButton, rightImageName: rightButton, titleText: titleText, enableRightButton: true)
        }else {
            let appDetailsDict = GlobalData.fetchAppDetailsDict()
            if appDetailsDict["isWhiteLabel"] as! Bool == true {
                self.setNavigationBarItem(leftButton, rightImageName:kQPIcon, titleText: titleText, enableRightButton: false)
            }else {
                self.setNavigationBarItem(leftButton, rightImageName:rightButton, titleText: titleText, enableRightButton: false)
            }
        }
    }
    
    
    func openContextMenuWithAnimation() {
        
        self.contextMenuViewController = ContextMenuViewController(nibName: "ContextMenuViewController", bundle: nil)
        UIApplication.sharedApplication().keyWindow?.addSubview(self.contextMenuViewController.view)
        self.contextMenuViewController.iDelegate = self
        self.contextMenuViewController.view.tag = kContextViewTag
        let topHeight = self.view.frame.height*0.023
        print("top height is = \(topHeight)")
        self.contextMenuViewController.view.frame = CGRectMake(self.view.frame.origin.x + self.view.frame.width ,self.getTopSpaceForContextMenu(), self.view.frame.width, self.view.frame.height + 66 - CGFloat(kContextViewTopPortrait))
        UIView.transitionWithView(self.contextMenuViewController.view, duration: 0.3, options: UIViewAnimationOptions.CurveEaseIn, animations: {
            
            // animation
            self.contextMenuViewController.view.frame = CGRectMake(self.view.frame.origin.x,self.getTopSpaceForContextMenu(), self.view.frame.width, self.view.frame.height + 66 - CGFloat(kContextViewTopPortrait))
            }, completion:{ finished in
                self.contextMenuViewController.view.backgroundColor = UIColor.clearColor()
                
                if (self.iOverlayView == nil) {
                    self.iOverlayView = UIView()
                }
                self.iOverlayView!.frame = self.iReactRootView!.frame
                self.view.addSubview(self.iOverlayView!)
                self.iOverlayView!.backgroundColor = GlobalData.getContextMenuBGColor().colorWithAlphaComponent(0.3)
        })
    }

    
    func closeContextViewWithAnimation() {
        
        if (self.contextMenuViewController != nil) {
            self.contextMenuViewController.view.backgroundColor = UIColor.clearColor()
            UIView.transitionWithView(self.contextMenuViewController.view, duration: 0.3, options: UIViewAnimationOptions.CurveEaseIn, animations: {
                // animation
                self.contextMenuViewController.view.frame = CGRectMake(self.view.frame.origin.x + self.view.frame.width, CGFloat(kContextViewTopPortrait), self.view.frame.width, self.view.frame.height + 66-CGFloat(kContextViewTopPortrait) )
                }, completion: { finished in
                    self.iOverlayView!.backgroundColor = UIColor.clearColor()
                    if (self.iOverlayView != nil) {
                    self.iOverlayView?.removeFromSuperview()
                    }
                    UIApplication.sharedApplication().keyWindow?.viewWithTag(kContextViewTag)?.removeFromSuperview()
            })
        }
    }
    
    func getTopSpaceForContextMenu() -> CGFloat {
        let topSpace : CGFloat
        if DeviceMatrixHelper.isIpad {
           topSpace = CGFloat(kContextViewTopPortrait)
        }
        else {
            if UIDevice.currentDevice().orientation.isPortrait {
                topSpace = CGFloat(kContextViewTopPortrait)
            }else if UIDevice.currentDevice().orientation.isFlat {
                topSpace = CGFloat(kContextViewTopPortrait)
            }else {
                topSpace = CGFloat(kContextViewTopLandscape)
            }
            
        }
        return topSpace
    }
    
    func closeContextViewWithDictionaryData(contextDict: NSDictionary) {
        
        self.iContextMenuManager.refreshContextMenuWithdata(contextDict as [NSObject : AnyObject])
        self.closeContextViewWithAnimation()
    }
    
    override func didRotateFromInterfaceOrientation(fromInterfaceOrientation: UIInterfaceOrientation) {
       
        if self.contextMenuViewController != nil {
            self.contextMenuViewController.view.frame = CGRectMake(self.view.frame.origin.x, self.getTopSpaceForContextMenu(), self.view.frame.width, self.view.frame.height + 66)
        }
        if self.iReactRootView != nil && self.iOverlayView != nil{
            self.iOverlayView!.frame = self.iReactRootView!.frame
        }
    }
    
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    
    /*
    // MARK: - Navigation
    
    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
    // Get the new view controller using segue.destinationViewController.
    // Pass the selected object to the new view controller.
    }
    */
    
}
