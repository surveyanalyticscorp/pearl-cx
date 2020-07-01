//
//  MenuViewController.swift
//  QuestionProCommunities
//
//  Created by Jignesh Raiyani on 8/18/16.
//  Copyright © 2016 QuestionPro Pvt Ltd. All rights reserved.
//

import UIKit
import MessageUI

protocol MenuViewControllerDelegate: class {
    func updateContainerToProfielScreen(profileDict : NSDictionary)
}

class MenuViewController: UIViewController, UITableViewDelegate, UITableViewDataSource, MFMailComposeViewControllerDelegate{
    

    @IBOutlet weak var iTableView: UITableView!
    @IBOutlet weak var iUserIcon: UIImageView?
    @IBOutlet weak var iHeaderBGView: UIImageView?
    @IBOutlet weak var iEmailSelection: UIImageView?
    @IBOutlet weak var iUserDetailsButton: UIButton?
    @IBOutlet weak var iBootomFooter: UIView?
    @IBOutlet weak var iFooterImageView: UIImageView?
    @IBOutlet weak var iVersionLabel: UILabel?
    var iMMDrawerDelegate: MMDrawerContollerDelegate?
    var iMenuViewDelegate: MenuViewControllerDelegate?
    var iDelegate: MainViewDelegate?
    var lastSelectedIndexPath: IndexPath?
    var menuList : NSMutableArray = []
    var isShowingMainTable : Bool = true
    let iContextMenuManager = ContextMenuManager()
    var dropperView = Dropper(width: 0, height: 0)
    let appDelegate = UIApplication.shared.delegate as! AppDelegate
    
    override func viewDidLoad() {
        
        super.viewDidLoad()
        
    
        UIApplication.shared.statusBarStyle = .lightContent
        
        let backgroundImage : UIImage = UIImage(named:kMainMenuBackground)!
        self.view.backgroundColor = UIColor(patternImage: backgroundImage)
        self.edgesForExtendedLayout = []
        let userImage : UIImage = UIImage(named:kSideMenuLogo)!
        self.iUserIcon!.contentMode = .scaleAspectFit
        self.iUserIcon!.image = userImage
        self.iTableView.separatorColor = UIColor.clear
        let footerImage : UIImage = UIImage(named:kFooterImageIcon)!
        self.iFooterImageView!.contentMode = .scaleAspectFit
        self.iFooterImageView!.image = footerImage
        
        self.iVersionLabel!.text = "V " + GlobalData.getApplicationVersion()
        //self.iVersionLabel?.font = GlobalData.getVersionLabelFontForMainMenu()
        //self.iVersionLabel?.textColor = GlobalData.getSecondaryFontColorForMainMenu()
        
        let userInfoDict = GlobalData.getUserInfoFromUserDefault(kUserInfo)
        var organizationName :String = ""
        if let emailID = userInfoDict[kEmailID] as? String{
            if let bodyDict : NSDictionary = userInfoDict[kBody] as? NSDictionary,
                let orgName = bodyDict["organizationName"] as? String{
                organizationName = orgName
            }
            self.iUserDetailsButton?.setAttributedTitle(GlobalData.getAttributedStringForMainMenu(emailText: emailID, detailText:organizationName), for: .normal)
        }else{
            //self.iUserDetailsButton?.text = ""
        }
        
        if self.isShowingMainTable {
            self.iEmailSelection?.image = UIImage(named: kArrowDown)
        }else{
            self.iEmailSelection?.image = UIImage(named: kArrowUp)
        }
        
        
        let appUserInfo :AppUser = iOSManager.sharedInstance.appUserInfo
        if let appDetailsDict = GlobalData.fetchAppDetailsDict(),
            let relativeURL = appDetailsDict["kServiceHost"] as? String,
            let companyLogoUrl = appUserInfo.companyLogoUrl, companyLogoUrl.length > 0,
            let url = URL(string: relativeURL + companyLogoUrl){
            URLSession.shared.dataTask(with: url, completionHandler: { (data, response, error) -> Void in
                if error != nil {
                    self.iFooterImageView?.isHidden = true
                }
                DispatchQueue.main.async(execute: { () -> Void in
                    if let imageData = data{
                        self.iUserIcon?.image = UIImage(data: imageData)
                    }
                })
            }).resume()
        }else {
            self.iFooterImageView?.isHidden = true
        }
        
        
        if let appDetailsDict = GlobalData.fetchAppDetailsDict(),
            let isWhiteLabelApp = appDetailsDict["isWhiteLabel"] as? Bool, isWhiteLabelApp{
            self.iFooterImageView?.isHidden = false
        }
        
        
        let path = Bundle.main.path(forResource: kMenuSetting, ofType: "plist")
        self.menuList = NSMutableArray(contentsOfFile: path!)!
        
        self.iTableView.register(UINib(nibName: "MenuCell", bundle: nil), forCellReuseIdentifier: "Cell")
        //self.iTableView.tableFooterView = self.iBootomFooter
        //self.iTableView.separatorStyle = UITableViewCellSeparatorStyle.singleLine
        self.iTableView.separatorColor = GlobalData.getTableViewCellSelectionColorForMainMenu()
        let px = 1 / UIScreen.main.scale
        let frame = CGRect(x: 0, y: 0, width: self.iTableView.frame.size.width, height: px)
        let line: UIView = UIView(frame: frame)
        self.iTableView.tableHeaderView = line
        line.backgroundColor = self.iTableView.separatorColor
        
        if let value = UserDefaults.standard.value(forKey: kUpdateToSurveyPageFromBackground) as? Bool, value == true {
            self.lastSelectedIndexPath = IndexPath(row: 1, section: 0)
            UserDefaults.standard.setValue(false, forKey: kUpdateToSurveyPageFromBackground);
            UserDefaults.standard.setValue(false, forKey: kUpdateToSurveyPage);
            UserDefaults.standard.synchronize();
        } else if let value = UserDefaults.standard.value(forKey: kUpdateToSurveyPage) as? Bool, value == true {
            self.lastSelectedIndexPath = IndexPath(row: 1, section: 0)
        } else {
            self.lastSelectedIndexPath = IndexPath(row: 0, section: 0)
        }
        self.iTableView.rowHeight = GlobalData.getTableViewRowHeight()
        NotificationCenter.default.addObserver(self, selector: #selector(self.updateLeftSlideMenuLabels), name: NSNotification.Name(rawValue: kEmployInfoUpdateNotification), object: nil)
        self.dropperView = Dropper(width: self.iTableView.frame.width , height: self.iTableView.frame.height)
        
    }
    
    @objc func updateLeftSlideMenuLabels()  {
        if  self.menuList.count > 0 {
            self.menuList.removeAllObjects()
            self.menuList = GlobalData.fetchMenuSettingList()
        }
        self.iTableView.reloadData()
    }
    
    @objc func updateUIForLanguageInfo(notification : NSNotification) {
        let languageInfo : String = notification.object as! String
        if languageInfo.length > 0 {
            GlobalData.setPreferredLanguage(languageID: languageInfo, key: kPreferedLanguageID)
            self.iTableView.reloadData()
        }
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return self.menuList.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "Cell", for: indexPath as IndexPath) as! MenuCell
        cell.separatorInset = UIEdgeInsets.zero
        cell.layoutMargins = UIEdgeInsets.zero
        cell.iNameLabel.font = GlobalData.getPrimaryFontForMainMenu()
        let menuDict : NSMutableDictionary  = self.menuList[indexPath.row] as! NSMutableDictionary
        if let title =  menuDict["Title"] as? String{
            
            let nameOfLProj = Localize.currentLanguage()
            print("hello " + nameOfLProj)
            
            if nameOfLProj == "en" || nameOfLProj == "pt" {
                cell.iNameLabel?.text = title.localized()
            }
            else{
                cell.iNameLabel?.text = getLocalizationValue(value: title)
            }
            
            
        }else{
            cell.iNameLabel.text = ""
        }
        if let count = menuDict["Count"] as? String {
            cell.iInfoLabel?.text =  count
        }
        self.iTableView.selectRow(at: lastSelectedIndexPath, animated:false, scrollPosition: UITableViewScrollPosition.none)
        let iconImage : UIImage = UIImage(named: cell.isSelected ? menuDict["Image"] as! String + "Selected" : menuDict["Image"] as! String )!
        cell.imageView?.image = iconImage
        cell.imageView?.contentMode = .scaleAspectFit
        
        let itemSize = CGSize(width: 20, height: 20)
        UIGraphicsBeginImageContextWithOptions(itemSize, false, UIScreen.main.scale);
        let imageRect = CGRect(x: 0.0, y: 0.5, width: itemSize.width, height: itemSize.height)
        cell.imageView?.image!.draw(in: imageRect)
        cell.imageView?.image! = UIGraphicsGetImageFromCurrentImageContext()!;
        UIGraphicsEndImageContext();
        return cell
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        self.iTableView.reloadData()
        if let menuDict = self.menuList[indexPath.row] as? [String : Any] {
            if let menuType =  menuDict["Type"]{
                if menuType as! String == "Logout" {
                    slideMenuController()?.closeLeft()
                    self.showLogoutPromt()
                }else{
                    self.lastSelectedIndexPath = indexPath
                    slideMenuController()?.closeLeft()
                    if let title =  menuDict["Title"] as? String{
                        self.iMMDrawerDelegate?.loadProfileScreen!(profileData: title, aTitle: title.localized())
                    }
                }
            }
        }
    }
    
    func showLogoutPromt()  {
        let alertController = UIAlertController(title: "Logout".localized(), message: "Do you really want to logout?".localized(), preferredStyle: .alert)
        let cancelAction = UIAlertAction(title: "Cancel".localized(), style: .default) {
            UIAlertAction in
            
        }
        let okAction = UIAlertAction(title: "Yes".localized(), style: .default) {
            
            UIAlertAction in
            GlobalData.clearPreferredLanguage(key: kPreferedLanguageID)
            let locationResponses = DataBaseController.fetchLocationResponse()
            if let appDetailsDict = GlobalData.fetchAppDetailsDict(),
                let dataUploadWhileLogout = appDetailsDict["dataUploadWhileLogout"] as? Bool , dataUploadWhileLogout && locationResponses.count > 0 {
                WebServiceTXManager.uploadLocationDataService(aDelegate: self)
            }else{
                self.logoutUser()
            }
        }
        alertController.addAction(cancelAction)
        alertController.addAction(okAction)
        present(alertController, animated: true, completion: nil)
    }
    
    @IBAction func emailInfoClicked(sender: UIButton) {
        self.showDetialTableView()
    }
    
    func showDetialTableView()  {
        
        if dropperView.status ==  Dropper.Status.hidden{
            self.dropperView.frame = CGRect(x: 0, y: 0, width: self.iTableView.frame.width, height: self.iTableView.frame.height)
            self.dropperView.maxHeight = self.iTableView.frame.height
            self.dropperView.menuList =  self.contextMenuData() as! NSMutableArray
            self.dropperView.theme = Dropper.Themes.white
            self.dropperView.delegate = self
            self.dropperView.showWithAnimation(0.15, options: .center, position: .bottom, button: self.iUserDetailsButton!)
            UIView.animate(withDuration: 0.2) { () -> Void in
                self.iEmailSelection!.transform = CGAffineTransform(rotationAngle: (180.0 * CGFloat(Double.pi)) / 180.0)
                self.iTableView.isHidden = true
            }
        }else {
            self.dropperView.hideWithAnimation(0.1)
            UIView.animate(withDuration: 0.2) { () -> Void in
                self.iEmailSelection!.transform = CGAffineTransform(rotationAngle: 0)
                self.iTableView.isHidden = false
            }
        }
    }
    
    
    func contextMenuData() -> AnyObject {
        let contextMenuList: NSMutableArray = []
        let userInfoDict = GlobalData.getUserInfoFromUserDefault(kUserInfo)
        if let bodyDict : NSDictionary = userInfoDict[kBody] as? NSDictionary {
            if let firstName = bodyDict["firstName"] as? String,
                let lastName = bodyDict["lastName"] as? String{
                let strUserName = firstName  + " " + lastName
                if strUserName.length > 0 {
                    let contextMenudict = ["Title":strUserName,"Image":kUserIcon]
                    contextMenuList.add(contextMenudict)
                }
            }
            if let orgName = bodyDict["organizationName"] {
                let contextMenudict = ["Title":orgName ,"Image":kBlockIcon]
                contextMenuList.add(contextMenudict)
            }
        }
        
        if let emailID  = userInfoDict[kEmailID] {
            let contextMenudict2 = ["Title":emailID,"Image":kEmailIcon]
            contextMenuList.add(contextMenudict2)
        }
        return contextMenuList
    }
    
    func exportCoreData() {
        
        
        if( MFMailComposeViewController.canSendMail() ) {
            print("Can send email.")
            
            let mailComposer = MFMailComposeViewController()
            mailComposer.mailComposeDelegate = self
            
            //Set the subject and message of the email
            mailComposer.setSubject("Data Export - location responses")
            mailComposer.setMessageBody("", isHTML: false)
            let path = NSSearchPathForDirectoriesInDomains(.applicationSupportDirectory, .userDomainMask, true)[0] as String
            let url = NSURL(fileURLWithPath: path)
            let sqliteFilePath = url.appendingPathComponent("iOS.sqlite")!.path
            let sqliteShmFilePath = url.appendingPathComponent("iOS.sqlite-shm")!.path
            let sqliteWalFilePath = url.appendingPathComponent("iOS.sqlite-wal")!.path
            let fileManager = FileManager.default
            if fileManager.fileExists(atPath: sqliteFilePath) {
                if let fileData = NSData(contentsOfFile:sqliteFilePath) {
                    mailComposer.addAttachmentData(fileData as Data, mimeType: "application/x-sqlite3", fileName: "ios.sqlite")
                }
                if let fileData = NSData(contentsOfFile:sqliteShmFilePath) {
                    mailComposer.addAttachmentData(fileData as Data, mimeType: "application/x-sqlite3", fileName: "iOS.sqlite-shm")
                }
                if let fileData = NSData(contentsOfFile:sqliteWalFilePath) {
                    mailComposer.addAttachmentData(fileData as Data as Data, mimeType: "application/x-sqlite3", fileName: "iOS.sqlite-wal")
                }
                
            } else {
                print("FILE NOT AVAILABLE")
            }
            
            self.present(mailComposer, animated: true, completion: nil)
        }
    }
    
    func syncLocatioResponses()  {
        //  WebServiceTXManager.uploadLocationDataService(self)
    }
    
    private func mailComposeController(controller: MFMailComposeViewController!, didFinishWithResult result: MFMailComposeResult, error: Error!) {
        self.dismiss(animated: true, completion: nil)
    }
    
    override func didRotate(from fromInterfaceOrientation: UIInterfaceOrientation) {
        self.dropperView.frame = CGRect(x : 0, y : (self.iHeaderBGView?.frame.height)!, width : self.iTableView.frame.width, height : self.iTableView.frame.height)
    }
    
    override func viewDidDisappear(_ animated: Bool) {
        //  UIApplication.sharedApplication().unregisterForRemoteNotifications()
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    func logoutUser()  {
        LocationHandler.sharedLocationHandler.locationManager.stopUpdatingLocation()
        GlobalData.removeLocationSurveyFromUserDefault()
        GlobalData.setLocationSurveyToUserDefault(aValue: "")
        self.iDelegate?.popLoginView!()
    }
    
}

extension MenuViewController: DropperDelegate {
    func DropperSelectedRow(path: IndexPath, contents: NSDictionary) {
        print("selected row = \("contents")")
        UIView.animate(withDuration: 0.2) { () -> Void in
            // self.iEmailSelection!.transform = CGAffineTransformMakeRotation(0)
            // self.iTableView.hidden = false
            self.slideMenuController()?.closeLeft()
        }
    }
}

extension MenuViewController: UploadResponseDelegate {
    //MARK: - Delegate Methods, UploadResponseDelegate
    func uploadResponseDidFinish(invocation: QPUploadResponseInvocation) {
        self.logoutUser()
    }
    
    func uploadResponseDidFinishWithError( error: String, invocation: QPUploadResponseInvocation) -> Void {
        if error.length > 0 {
            let appDelegate = UIApplication.shared.delegate as! AppDelegate
            appDelegate.iWindow?.makeToast(error, duration: 3.0, position: .top)
        }
    }
}
