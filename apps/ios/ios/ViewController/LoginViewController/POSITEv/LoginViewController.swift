//
//  LoginViewController.swift
//  QuestionProCommunities
//
//  Created by Jignesh Raiyani on 8/18/16.
//  Copyright © 2016 QuestionPro Pvt Ltd. All rights reserved.
//

import UIKit


class LoginViewController: UIViewController, UITextFieldDelegate , AuthenticateServiceDelegate, DataCenterServiceDelegate {

    @IBOutlet weak var iEmailView: UIView?
    @IBOutlet weak var iEmailTextField: UITextField?
    @IBOutlet weak var iPasswordView: UIView?
    @IBOutlet weak var iPasswordTextField: UITextField?
    @IBOutlet weak var iShowHidePasswordButton: UIButton?
    @IBOutlet weak var iShowHideImageview : UIImageView?
    @IBOutlet weak var iMessageLabel: UILabel?
    @IBOutlet weak var iSignInButton: UIButton?
    @IBOutlet weak var iSignInWithLabel: UILabel?
    @IBOutlet weak var iForgotPasswordButton: UIButton?
    @IBOutlet weak var iBackButton: UIButton?
    @IBOutlet weak var iActivityIndicator: UIActivityIndicatorView?
    
    var iDelegate: MainViewDelegate?
    var companyCode: String?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.view.backgroundColor = UIColor.white
        self.hideActivityIndicator()
        let tap: UITapGestureRecognizer = UITapGestureRecognizer(target: self, action: #selector(dismissKeyboard))
        view.addGestureRecognizer(tap)
    }
    
    override func viewWillAppear(_ animated: Bool) {
        GlobalData.setGAIforView(aScreenName: kLoginScreen)
        self.edgesForExtendedLayout = []
        self.setTextFieldProperties()
        self.setButtonProperties()
        self.textFieldDidChange()
    }
    
    
    override func viewWillDisappear(_ animated: Bool) {
        self.iPasswordTextField?.text = ""
        self.iEmailTextField?.resignFirstResponder()
        self.iPasswordTextField?.resignFirstResponder()
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
            signInButton.backgroundColor = iOSAppManager.colorFromHexString(hexString: "1976D2")
            signInButton.titleLabel?.font = GlobalData.getPrimaryFontForButtonTitle()
            signInButton.setTitleColor(GlobalData.getButtonTitleColor(), for: UIControlState.normal)
        }
        if let forgotPasswordButton = self.iForgotPasswordButton{
            forgotPasswordButton.titleLabel?.font = GlobalData.getSecondaryFontForButtonTitle()
        }
        
        
    }
    
    
    func setTextFieldProperties() {
        
        if let emailTextField = self.iEmailTextField {
            emailTextField.delegate = self
            emailTextField.font = GlobalData.getPrimaryFontForTextField()
            emailTextField.keyboardType = UIKeyboardType.emailAddress
            emailTextField.leftViewMode = UITextFieldViewMode.always
            emailTextField.addTarget(self, action:#selector(self.textFieldDidChange), for: UIControlEvents.editingChanged)
            let emailPadding : UIView = UIView(frame: CGRect(x: 0, y: 0, width: 5, height: 20))
            self.addPadding(aTextField:emailTextField, aPaddingView: emailPadding)
            let userInfoDict = GlobalData.getUserInfoFromUserDefault(kUserInfo)
            if let emailID = userInfoDict[kEmailID] as? String {
                emailTextField.text = emailID
            }else{
                emailTextField.text = ""
            }
        }
        
        if let passwordTextField = self.iPasswordTextField {
            passwordTextField.delegate = self
            passwordTextField.font = GlobalData.getPrimaryFontForTextField()
            passwordTextField.isSecureTextEntry = true
            let passwordPadding : UIView = UIView(frame: CGRect(x: 0, y: 0, width: 5, height: 20))
            self.addPadding(aTextField: passwordTextField, aPaddingView: passwordPadding)
            passwordTextField.addTarget(self, action:#selector(self.textFieldDidChange), for: UIControlEvents.editingChanged)
        }
        
        if let messageLabel = self.iMessageLabel {
            messageLabel.text = ""
            messageLabel.font = GlobalData.getPrimaryFontForTextField()
            messageLabel.adjustsFontSizeToFitWidth = true
            messageLabel.textColor = UIColor.red
        }
        
    }
    
    func addPadding(aTextField : UITextField , aPaddingView: UIView)  {
        aTextField.leftView = aPaddingView
        aTextField.leftViewMode = UITextFieldViewMode.always
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
    
    @IBAction func backButtonClicked(sender: UIButton) {
        self.navigationController?.popViewController(animated: true)
    }
    
    //Calls this function when the tap is recognized.
    @objc func dismissKeyboard() {
        //Causes the view (or one of its embedded text fields) to resign the first responder status.
        view.endEditing(true)
    }
    
    @IBAction func signInClicked(sender: UIButton) {
        if let messageLabel = self.iMessageLabel {
            messageLabel.text = ""
        }
        if let passwordView = self.iPasswordView,
            let emailView = self.iEmailView {
            passwordView.layer.borderColor = UIColor.clear.cgColor
            emailView.layer.borderColor = UIColor.clear.cgColor
        }
        if let emailText = self.iEmailTextField?.text,
            let passwordText = self.iPasswordTextField?.text {
            self.checkAuthentication(aEmailID: emailText.trim(), aPassword: passwordText, aAccessCode:"", aSourceMode: "email")
        }
     }
    
    @IBAction func signupClicked(sender: UIButton) {
//        let signupViewController = SignupViewController(nibName: "SignupViewController", bundle: nil);
//        signupViewController.iDelegate = self
//        let signupNavController = UINavigationController(rootViewController: signupViewController)
//        signupNavController.navigationBar.hidden = true
//        self.presentViewController(signupNavController, animated:true, completion: nil)
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
        var emailString = ""
        if aEmailID.contains("@") {
             emailString = aEmailID
        }else{
            emailString = aEmailID + "@rti.org"
        }
        let authenticatConnection : Bool = WebServiceTXManager.invokeAuthenticateService(aDelegate: self, aEmailID:emailString, aPassword: aPassword, aAccessCode: aAccessCode, aSourceMode: aSourceMode)
        if !authenticatConnection {
            self.hideActivityIndicator()
        }
    }
    
    
    @IBAction func forgotPasswordClicked(sender: UIButton) {
        let forgotPasswordViewController = ForgotPasswordViewController(nibName: "ForgotPasswordViewController", bundle: nil);
        forgotPasswordViewController.iTitleText = "Forgot Password?"
        let forgotPasswordNavController = UINavigationController(rootViewController: forgotPasswordViewController)
        forgotPasswordNavController.modalPresentationStyle = .overCurrentContext
        self.present(forgotPasswordNavController, animated:true, completion: nil)
    }
    
    @IBAction func helpButtonClicked(sender: UIButton) {
        if let appDetailsDict = GlobalData.fetchAppDetailsDict(),
            let buttonTitle = appDetailsDict["kHelpButtonTitle"] as? String,
            let message = appDetailsDict["kHelpButtonMessage"] as? String {
            self.showHelpAlert(aTitle: buttonTitle, aMessage: message)
        }
    }

    
    @IBAction func showHidePasswordClicked(sender: UIButton) {
        
        if let passwordTextField = self.iPasswordTextField{
            passwordTextField.isSecureTextEntry = !(passwordTextField.isSecureTextEntry)
            let  originalText = passwordTextField.text
            passwordTextField.text = nil
            passwordTextField.text = originalText
            
            if let showHidePasswordButton = self.iShowHidePasswordButton,
                let showHideImageview = self.iShowHideImageview {
                    if showHidePasswordButton.tag == 0 {
                        showHidePasswordButton.tag = 1
                        showHideImageview.image = UIImage.init(named:"CheckDeselected")
                    }else {
                        showHidePasswordButton.tag = 0
                        showHideImageview.image = UIImage.init(named:"CheckSelected")
                    }
            }
            
        }
    }
    
    
    @objc func textFieldDidChange () {
        guard let signInbutton = self.iSignInButton else {
            return
        }
        
        if let emailText = self.iEmailTextField?.text,
            let passwordText = self.iPasswordTextField?.text,emailText.length > 0 && passwordText.length > 0{
            signInbutton.isEnabled = true
            signInbutton.alpha = 1.0
        }else{
            signInbutton.isEnabled = false
            signInbutton.alpha = 0.25
        }
    }
    
    //MARK: - Delegate Methods, GlobalDataCenterServiceDelegate
    
    func globalLoginAuthDidFinish(invocation: QPServiceDataCenterInvocation) -> Void {
        self.hideActivityIndicator()
         self.checkAuthentication(aEmailID: (self.iEmailTextField?.text)!.trim(), aPassword: (self.iPasswordTextField?.text)!, aAccessCode: "", aSourceMode: "")
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
        if  (self.iMessageLabel!.text!.caseInsensitiveCompare("Invalid Company Code") == ComparisonResult.orderedSame) || (self.iMessageLabel!.text!.caseInsensitiveCompare("Invalid Email Address/Password combination.") == ComparisonResult.orderedSame) {
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
    }
    
    func textFieldDidBeginEditing(_ textField: UITextField) {    //delegate method
        self.iMessageLabel?.text = ""
    }
    

    
    func textFieldShouldReturn(_ textField: UITextField) -> Bool {   //delegate method
        if textField == self.iEmailTextField {
            self.iPasswordTextField?.becomeFirstResponder()
        }
        if textField == self.iPasswordTextField {
            textField.resignFirstResponder()
            if let signInButton = self.iSignInButton, signInButton.isEnabled{
                self.signInClicked(sender: signInButton)
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
    
    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

}
