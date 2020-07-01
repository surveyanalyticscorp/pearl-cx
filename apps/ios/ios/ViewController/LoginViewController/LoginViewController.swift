//
//  LoginViewController.swift
//  QuestionProCommunities
//
//  Created by Jignesh Raiyani on 8/18/16.
//  Copyright © 2016 QuestionPro Pvt Ltd. All rights reserved.
//

import UIKit
import CoreGraphics

class LoginViewController: UIViewController, UITextFieldDelegate, DataCenterServiceDelegate, AuthenticateServiceDelegate {
    
    @IBOutlet weak var iEmailView: UIView?
    @IBOutlet weak var iEmailTextField: UITextField?
    @IBOutlet weak var iPasswordView: UIView?
    @IBOutlet weak var iPasswordTextField: UITextField?
    @IBOutlet weak var iAccessCodeView: UIView?
    @IBOutlet weak var iAccessCodeTextField: UITextField?
    @IBOutlet weak var iShowHidePasswordButton: UIButton?
    @IBOutlet weak var iShowHideImageview : UIImageView?
    @IBOutlet weak var iHelpButton: UIButton?
    @IBOutlet weak var iHelpImageview : UIImageView?
    @IBOutlet weak var iMessageLabel: UILabel?
    @IBOutlet weak var iSignInButton: UIButton?
    @IBOutlet weak var iSignUpView: UIView?
    @IBOutlet weak var iSignInWithLabel: UILabel?
    @IBOutlet weak var iForgotPasswordButton: UIButton?
    @IBOutlet weak var iBackButton: UIButton?
    @IBOutlet weak var iActivityIndicator: UIActivityIndicatorView?
    @IBOutlet var iTopSpaceConstrint: NSLayoutConstraint?
    @IBOutlet var iHeightConstraintAccessCode: NSLayoutConstraint?
    @IBOutlet weak var iBottomImageLogo: UIImageView!
    @IBOutlet weak var iHeaderLogo: UIImageView!
    @IBOutlet weak var labelVizient: UILabel!
    var appType : PocketAppType?
    
    
    var iDelegate: MainViewDelegate?
    //@sujan Company code from previous screen for CX module
    var companyCode: String?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        self.view.backgroundColor = UIColor.white
        
        self.hideActivityIndicator()
        let tap: UITapGestureRecognizer = UITapGestureRecognizer(target: self, action: #selector(dismissKeyboard))
        view.addGestureRecognizer(tap)
        
        
        let appDetailsDict = GlobalData.fetchAppDetailsDict()
        
        if let isSignUp = appDetailsDict?["hasSignUp"] as? Bool, isSignUp  {
            
            self.iSignUpView?.isHidden = false;
        }else {
            self.iSignUpView?.isHidden = true;
        }
    }
    
    override func viewWillAppear(_ animated: Bool) {
        GlobalData.setGAIforView(aScreenName: kLoginScreen)
        self.edgesForExtendedLayout = []
        self.setTextFieldProperties()
        self.setButtonProperties()
        self.textFieldDidChange()
        
        let appDelegate = UIApplication.shared.delegate as! AppDelegate
        if (appDelegate.appType == PocketAppType.QUESTIONPRO_CX_APP) {
            self.setPropertiesForCX()
        }
        if(appDelegate.appType == PocketAppType.QUESTIONPRO_VIZIENTINC_APP){
            self.view.backgroundColor = iOSAppManager.colorFromHexString(hexString: kThemesBackgroundClor)
        }
        
    }
    
    
    override func viewWillDisappear(_ animated: Bool) {
        self.iPasswordTextField?.text = ""
        self.iAccessCodeTextField?.text = ""
        self.iEmailTextField?.resignFirstResponder()
        self.iPasswordTextField?.resignFirstResponder()
        self.iAccessCodeTextField?.resignFirstResponder()
    }
    
    func setButtonProperties() {
        
        if let showHidePasswordButton = self.iShowHidePasswordButton {
            showHidePasswordButton.tag = 0
        }
        if let showHideImageview = self.iShowHideImageview {
            showHideImageview.image = UIImage.init(named:"CheckSelected")
        }
        if let signInButton = self.iSignInButton {
            signInButton.isEnabled = false
            signInButton.showsTouchWhenHighlighted = true
            signInButton.alpha = 0.25;
            signInButton.backgroundColor = GlobalData.getButtonBGColor()
            signInButton.titleLabel?.font = GlobalData.getPrimaryFontForButtonTitle()
            signInButton.setTitleColor(GlobalData.getButtonTitleColor(), for: UIControlState.normal)
        }
        if let forgotPasswordButton = self.iForgotPasswordButton{
            forgotPasswordButton.titleLabel?.font = GlobalData.getSecondaryFontForButtonTitle()
            if let title = forgotPasswordButton.titleLabel?.text{
                forgotPasswordButton.underlineButton(text: title)
            }
        }
        if let signInLable = self.iSignInWithLabel{
            signInLable.font = GlobalData.getPrimaryFontForButtonTitle()
        }
        
        /* below if else code is written by ankit to verify that if vizientinc app is in action then hide some of the images from xib */
        let appDelegate = UIApplication.shared.delegate as! AppDelegate
        let aVariable = appDelegate.appType
        
        if aVariable == PocketAppType.QUESTIONPRO_VIZIENTINC_APP{
            iBottomImageLogo.isHidden=false
            iHeaderLogo.isHidden=true
            labelVizient.isHidden=false
        }
        else{
            iBottomImageLogo.isHidden=true;
            iHeaderLogo.isHidden=false;
            labelVizient.isHidden=true
        }
    }
    
    
    func setTextFieldProperties() {
       
        if let emailTextField = self.iEmailTextField {
            emailTextField.delegate = self
            emailTextField.textColor = UIColor.black
            emailTextField.font = GlobalData.getPrimaryFontForTextField()
            emailTextField.keyboardType = UIKeyboardType.emailAddress
            emailTextField.leftViewMode = UITextFieldViewMode.always
            emailTextField.addTarget(self, action:#selector(self.textFieldDidChange), for: UIControlEvents.editingChanged)
            let emailPadding : UIView = UIView(frame: CGRect(x: 0, y: 0, width: 5, height: 20))
            self.addPadding(aTextField:emailTextField, aPaddingView: emailPadding)
            let userInfoDict = GlobalData.getUserInfoFromUserDefault(kUserInfo)
            if let emailID = userInfoDict[kEmailID] as? String {
                emailTextField.text = emailID
            }
            if #available(iOS 13.0, *) {
                emailTextField.overrideUserInterfaceStyle = .light
            }
        }
        
        if let passwordTextField = self.iPasswordTextField {
            passwordTextField.delegate = self
            passwordTextField.textColor = UIColor.black
            passwordTextField.font = GlobalData.getPrimaryFontForTextField()
            passwordTextField.isSecureTextEntry = true
            let passwordPadding : UIView = UIView(frame: CGRect(x: 0, y: 0, width: 5, height: 20))
            self.addPadding(aTextField: passwordTextField, aPaddingView: passwordPadding)
            passwordTextField.addTarget(self, action:#selector(self.textFieldDidChange), for: UIControlEvents.editingChanged)
            if #available(iOS 13.0, *) {
                passwordTextField.overrideUserInterfaceStyle = .light
            }
        }
        
        if let accessCodeTextField = self.iAccessCodeTextField {
            accessCodeTextField.delegate = self
            accessCodeTextField.textColor = UIColor.black
            accessCodeTextField.font = GlobalData.getPrimaryFontForTextField()
            let accessCodePadding : UIView = UIView(frame: CGRect(x: 0, y: 0, width: 5, height: 20))
            self.addPadding(aTextField: accessCodeTextField, aPaddingView: accessCodePadding)
            accessCodeTextField.addTarget(self, action:#selector(self.textFieldDidChange), for: UIControlEvents.editingChanged)
            if #available(iOS 13.0, *) {
                accessCodeTextField.overrideUserInterfaceStyle = .light
            }
        }
        
        if let messageLabel = self.iMessageLabel {
            messageLabel.text = ""
            messageLabel.font = GlobalData.getPrimaryFontForTextField()
            messageLabel.adjustsFontSizeToFitWidth = true
            messageLabel.textColor = UIColor.red
        }
        
        if let appDetailsDict = GlobalData.fetchAppDetailsDict(),
            let isAccessCodeEnable = appDetailsDict["AccessCode"] as? Bool ,!isAccessCodeEnable {
            self.iAccessCodeTextField?.isHidden = true
            self.iHelpButton?.isHidden = true
            self.iHelpImageview?.isHidden = true
            self.iHeightConstraintAccessCode?.constant = 0
            self.view.layoutIfNeeded()
            self.iTopSpaceConstrint?.constant = -((self.self.iAccessCodeView?.bounds.height)!+5)
        }
        if let appDetailsDict = GlobalData.fetchAppDetailsDict(),
            let placeHolder = appDetailsDict["AccessCodePlaceHolder"] as? String {
            self.iAccessCodeTextField?.placeholder = placeHolder
        }
    }
    
    func addPadding(aTextField : UITextField , aPaddingView: UIView)  {
        aTextField.leftView = aPaddingView
        aTextField.leftViewMode = UITextFieldViewMode.always
    }
    
    //@sujan For CX module
    func setPropertiesForCX() {
        self.iSignInButton?.setTitle("Log In", for:UIControlState.normal)
        if let companyCode = self.companyCode {
            self.iAccessCodeTextField?.text = companyCode
        }
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    func showAlertView(title: String, message: String) {
        let alert = UIAlertController(title: title, message: message, preferredStyle: UIAlertControllerStyle.alert)
        alert.addAction(UIAlertAction(title: "Close", style: UIAlertActionStyle.default, handler: nil))
        self.present(alert, animated: true, completion: nil)
    }
    
    @IBAction func backButtonClicked(_ sender: Any) {
        self.navigationController?.popViewController(animated: true)
    }
    
    //Calls this function when the tap is recognized.
    @objc func dismissKeyboard() {
        //Causes the view (or one of its embedded text fields) to resign the first responder status.
        view.endEditing(true)
    }
    
    @IBAction func signInClicked(_ sender: Any) {
        self.iMessageLabel?.text = ""
        self.iAccessCodeView?.layer.borderColor = UIColor.clear.cgColor
        self.iPasswordView?.layer.borderColor = UIColor.clear.cgColor
        self.iEmailView?.layer.borderColor = UIColor.clear.cgColor
        
        let isValidEmail = (self.iEmailTextField?.text?.isValidEmailAddress())! as Bool
        if isValidEmail {
            if let appDetailsDict = GlobalData.fetchAppDetailsDict(),
                let isGlobalLogin = appDetailsDict["GlobalLogin"] as? Bool, isGlobalLogin {
                self.checkGlobalLogin(aAccessCode: (self.iAccessCodeTextField?.text)!)
            }else{
                self.checkAuthentication(aEmailID: (self.iEmailTextField?.text)!.trim(), aPassword: (self.iPasswordTextField?.text)!, aAccessCode: (self.iAccessCodeTextField?.text)!.trim(), aSourceMode: "email")
            }
        }else{
            self.iMessageLabel?.text = kValidEmailError
        }
    }
    
    func checkGlobalLogin(aAccessCode: String)  {
        self.showActivityIndicator()
        let globalLoginConnection : Bool = WebServiceTXManager.invokeGlobalLoginService(aDelegate: self as DataCenterServiceDelegate, aAccessCode: aAccessCode);
        if !globalLoginConnection {
            self.hideActivityIndicator()
        }
    }
    
    func checkAuthentication(aEmailID:String, aPassword: String, aAccessCode: String, aSourceMode : String)  {
        self.showActivityIndicator()
        let authenticatConnection : Bool = WebServiceTXManager.invokeAuthenticateService(aDelegate: self, aEmailID:aEmailID, aPassword: aPassword, aAccessCode: aAccessCode, aSourceMode: aSourceMode)
        if !authenticatConnection {
            self.hideActivityIndicator()
        }
    }
    
    @IBAction func forgotPasswordClicked(_ sender: Any) {
        let forgotPasswordViewController = ForgotPasswordViewController(nibName: "ForgotPasswordViewController", bundle: nil);
        forgotPasswordViewController.iTitleText = "Forgot Password?"
        let forgotPasswordNavController = UINavigationController(rootViewController: forgotPasswordViewController)
        self.present(forgotPasswordNavController, animated:true, completion: nil)
    }
    
    @IBAction func helpButtonClicked(_ sender: Any) {
        if let appDetailsDict = GlobalData.fetchAppDetailsDict(),
            let buttonTitle = appDetailsDict["kHelpButtonTitle"] as? String,
            let message = appDetailsDict["kHelpButtonMessage"] as? String {
            self.showHelpAlert(aTitle: buttonTitle, aMessage: message)
        }
    }
    
    @IBAction func showHidePasswordClicked(_ sender: Any) {
        self.iPasswordTextField?.isSecureTextEntry = !((self.iPasswordTextField?.isSecureTextEntry)!)
        let  originalText = self.iPasswordTextField?.text
        self.iPasswordTextField?.text = nil
        self.iPasswordTextField?.text = originalText
        
        if self.iShowHidePasswordButton!.tag == 0 {
            self.iShowHidePasswordButton!.tag = 1
            self.iShowHideImageview?.image = UIImage.init(named:"CheckDeselected")
        }else {
            self.iShowHidePasswordButton!.tag = 0
            self.iShowHideImageview!.image = UIImage.init(named:"CheckSelected")
        }
    }
    
    @objc func textFieldDidChange () {
        
        if let appDetailsDict = GlobalData.fetchAppDetailsDict(),
            let isAccessCodeEnable = appDetailsDict["AccessCode"] as? Bool, !isAccessCodeEnable {
            if self.iEmailTextField!.text!.length > 0 && self.iPasswordTextField!.text!.length > 0  {
                self.iSignInButton?.isEnabled = true
                self.iSignInButton!.alpha = 1.0;
            }else{
                self.iSignInButton?.isEnabled = false
                self.iSignInButton!.alpha = 0.25;
            }
        }else {
            if self.iEmailTextField!.text!.length > 0 && self.iPasswordTextField!.text!.length > 0 && self.iAccessCodeTextField!.text!.length > 0 {
                self.iSignInButton?.isEnabled = true
                self.iSignInButton!.alpha = 1.0;
            }else{
                self.iSignInButton?.isEnabled = false
                self.iSignInButton!.alpha = 0.25;
            }
        }
    }
    
    //MARK: - Delegate Methods, GlobalDataCenterServiceDelegate
    
    func globalLoginAuthDidFinish(invocation: QPServiceDataCenterInvocation) -> Void {
        self.hideActivityIndicator()
        self.checkAuthentication(aEmailID: (self.iEmailTextField?.text)!.trim(), aPassword: (self.iPasswordTextField?.text)!, aAccessCode: (self.iAccessCodeTextField?.text)!.trim(), aSourceMode: "")
    }
    
    func globalLoginAuthDidFinishWithError( error: String, invocation: QPServiceDataCenterInvocation) -> Void {
        if error.length > 0 {
            self.iMessageLabel?.text = error as String
            self.hideActivityIndicator()
            self.addShakeEffect()
        }
    }
    
    //MARK: - Delegate Methods, AuthenticateServiceDelegate
    func authenticateDidFinish(invocation: QPServiceAuthenticateInvocation) -> Void {
        GlobalData.setSocialSignInfoToUserDefault(key: kSocialSignInInfo, aSocialSignInEnable: false)
        self.hideActivityIndicator()
        self.iDelegate?.pushHomeViewFromMainViewController!()
        
    }
    
    func authenticateDidFinishWithError( error: String, invocation: QPServiceAuthenticateInvocation) -> Void {
        self.iMessageLabel?.text = error as String
        if  (self.iMessageLabel!.text!.caseInsensitiveCompare("Invalid Company Code") == ComparisonResult.orderedSame) {
            self.iAccessCodeView?.layer.borderColor = UIColor.red.cgColor
            self.iAccessCodeView?.layer.borderWidth = 1.0
        }else if(self.iMessageLabel!.text!.caseInsensitiveCompare("Invalid Email Address/Password combination.") == ComparisonResult.orderedSame) {
            self.iPasswordView?.layer.borderColor = UIColor.red.cgColor
            self.iPasswordView?.layer.borderWidth = 1.0
            self.iEmailView?.layer.borderColor = UIColor.red.cgColor
            self.iEmailView?.layer.borderWidth = 1.0
        }
        self.hideActivityIndicator()
        self.addShakeEffect()
    }
    
    
    func showActivityIndicator()   {
        self.iActivityIndicator?.isHidden = false
        self.iActivityIndicator?.startAnimating()
    }
    
    func hideActivityIndicator()   {
        self.iActivityIndicator?.isHidden = true
        self.iActivityIndicator?.stopAnimating()
    }
    
    func addShakeEffect()  {
        self.iEmailView?.shake()
        self.iPasswordView?.shake()
        self.iAccessCodeView?.shake()
    }
    
    func textFieldDidBeginEditing(_ textField: UITextField) {    //delegate method
        self.iMessageLabel?.text = ""
    }
    
    
    func textFieldShouldReturn(_ textField: UITextField) -> Bool {   //delegate method
        
        if textField == self.iEmailTextField {
            self.iPasswordTextField?.becomeFirstResponder()
        }
        if textField == self.iPasswordTextField {
            if let appDetailsDict = GlobalData.fetchAppDetailsDict(),
                let isAccessCodeEnable = appDetailsDict["AccessCode"] as? Bool, !isAccessCodeEnable  {
                self.iPasswordTextField?.resignFirstResponder()
                if let signInButton = self.iSignInButton, signInButton.isEnabled{
                    self.signInClicked(signInButton)
                }
            }else {
                self.iAccessCodeTextField?.becomeFirstResponder()
            }
        }
        if textField == self.iAccessCodeTextField {
            self.iAccessCodeTextField?.resignFirstResponder()
            if self.iSignInButton!.isEnabled == true {
                self.signInClicked(self.iSignInButton!)
            }
        }
        return true
    }
    
    func showHelpAlert(aTitle:String, aMessage:String) {
        let alert=UIAlertController(title: aTitle, message: aMessage, preferredStyle: UIAlertControllerStyle.alert);
        alert.addAction(UIAlertAction(title: "Ok", style: UIAlertActionStyle.default, handler: nil));
        self.present(alert, animated: true, completion: nil)
    }
    
    func registerDidFinish(isSuccessed: Bool) {
        if isSuccessed {
            GlobalData.setSocialSignInfoToUserDefault(key: kSocialSignInInfo, aSocialSignInEnable: false)
            self.iDelegate?.pushHomeViewFromMainViewController!()
        }
    }
    
    @IBAction func signUp(_ sender: Any) {
        
//        let signupViewController = SignUpViewController(nibName: "SignUpViewController", bundle: nil)
//        signupViewController.iDelegate = self
//        let signupNavController = UINavigationController(rootViewController: signupViewController)
//        signupNavController.navigationBar.isHidden = true
//        self.present(signupNavController, animated:true, completion: nil)
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

