//
//  MainViewController.swift
//  QuestionProCommunities
//
//  Created by Jignesh Raiyani on 8/30/16.
//  Copyright © 2016 QuestionPro Pvt Ltd. All rights reserved.
//

import UIKit



class MainViewController: UIViewController, MainViewDelegate, MMDrawerContollerDelegate {
    
    var containerViewController: ContainerViewController?
    let iContextMenuManager = ContextMenuManager()

    override func viewDidLoad() {
        
        super.viewDidLoad()
        self.launchIntroView()
        self.view.backgroundColor = UIColor.white
        let appDelegate = UIApplication.shared.delegate as! AppDelegate
        UIApplication.shared.statusBarStyle = .lightContent
        let appUserInfo : AppUser = iOSManager.sharedInstance.appUserInfo
        if let authToken = appUserInfo.authToken, authToken.length > 0 {
            self.launchSocialSignInView()
            let socialSignInInfo : Bool = GlobalData.getSocialSignInfoFromUserDefault(key: kSocialSignInInfo)
            if !socialSignInInfo {
                if (appDelegate.appType == PocketAppType.QUESTIONPRO_CX_APP) {
                    self.launchCXLoginView()
                }else{
                    self.launchLoginView()
                }
            }
            self.navigationController!.navigationBar.isHidden = true
            self.setupHomePageAfterSignIn(fromLogin: false)
        }
        // Do any additional setup after loading the view.
    }

    
    func launchIntroView()  {
        let introViewController = IntroViewController(nibName:"IntroViewController", bundle: nil);
        introViewController.iDelegate = self
        self.navigationController?.pushViewController(introViewController, animated:false)
    }
    
    func launchSocialSignInView() {
        if let appDetailsDict = GlobalData.fetchAppDetailsDict(),
            let isSocialSignInEnable = appDetailsDict["kSocialSignIn"] as? Bool, isSocialSignInEnable  {
            let socialSignInViewController = SocialSignInViewController(nibName: "SocialSignInViewController", bundle: nil)
            socialSignInViewController.iDelegate = self
            self.navigationController?.pushViewController(socialSignInViewController, animated:false)
        }
    }
    
    func launchLoginView()  {
        let loginViewController = LoginViewController(nibName: "LoginViewController", bundle: nil);
        loginViewController.iDelegate = self
        self.navigationController?.pushViewController(loginViewController, animated:false)
    }
    
    //@sujan Launch login view controllers for cx
    func launchCXLoginView() {
        let storyBoard = UIStoryboard(name: "CXLogin", bundle: nil)
        let loginViewController : LoginWithCompanyCodeVC = storyBoard.instantiateViewController(withIdentifier: "LoginWithCompanyCodeVC") as! LoginWithCompanyCodeVC
        loginViewController.delegate = self
        self.navigationController?.pushViewController(loginViewController, animated: false)
    }
    
    func setupHomePageAfterSignIn(fromLogin : Bool)  {

        self.containerViewController = ContainerViewController(nibName: "ContainerViewController", bundle: nil);
        self.containerViewController!.iMMDrawerDelegate = self
        self.containerViewController?.iDelegate = self
        self.containerViewController?.fromLogin = fromLogin
        let menuViewController = MenuViewController(nibName: "MenuViewController", bundle: nil);
        menuViewController.iMMDrawerDelegate = self
        menuViewController.iDelegate = self
        let viewController = UIViewController()
        

        let centerNav = UINavigationController(rootViewController: self.containerViewController!)
        centerNav.navigationBar.isHidden = false
        centerNav.interactivePopGestureRecognizer?.isEnabled = false
        let slideMenuController = ExSlideMenuController(mainViewController:centerNav, leftMenuViewController: menuViewController, rightMenuViewController: viewController)
        slideMenuController.automaticallyAdjustsScrollViewInsets = true
        self.navigationController?.interactivePopGestureRecognizer?.isEnabled = false
        self.navigationController?.pushViewController(slideMenuController, animated:false)

    }
    
    func pushSocialSignInViewFromMainViewController() {
        self.launchSocialSignInView()
    }
    
    func pushLoginViewFromMainViewController()  {
        let appDelegate = UIApplication.shared.delegate as! AppDelegate
        if (appDelegate.appType == PocketAppType.QUESTIONPRO_CX_APP) {
            self.launchCXLoginView()
        }else{
            self.launchLoginView()
        }
    }
    
    func pushHomeViewFromMainViewController() {
        self.setupHomePageAfterSignIn(fromLogin: true)
    }
    
    func popLoginView() {

        self.iContextMenuManager.logoutUser()
        GlobalData.removeUserInfoFromUserDefault(key: kBody)
        GlobalData.removeSocialSignInInfoFromUserDefault(key: kSocialSignInInfo)
        GlobalData.removeAuthResponseFromUserDefault(key: kAuthResponse)
        self.navigationController?.popViewController(animated: false)
    }
    
    func disableRightDrawer() {
        // self.centerContainer?.rightDrawerViewController = nil
    }
    
    func reloadCenterDrawer() {
        self.containerViewController?.addReactRootView()
    }
    
    func loadProfileScreen(profileData : String, aTitle : String)  {
        self.iContextMenuManager.refreshProfileScreenWithdata(profileData as String, withTitle: aTitle)
//        self.iContextMenuManager.refreshProfileScreenWithdata(aProfileMenu: profileData as NSString, aTitle: aTitle as NSString)
    }
    
    func enableRightDrawer() {

        //        let rightViewController = ContextMenuViewController(nibName: "ContextMenuViewController", bundle: nil)
        //        rightViewController.iMMDrawerDelegate = self
        //        let rightNav = UINavigationController(rootViewController: rightViewController)
        //        self.centerContainer?.rightDrawerViewController = rightNav

    }
    
    
//    func rightMenuItemClicked(eventData : NSDictionary)  {
//        // self.containerViewController?.optionMenuItemClicked(eventData)
//    }
    
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


