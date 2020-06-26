//
//  SignUpViewController.swift
//  Communities
//
//  Created by QuestionPro on 12/7/18.
//  Copyright © 2018 Jignesh. All rights reserved.
//

import UIKit
protocol SignUpViewDelegate {
    func registerDidFinish(isSuccessed : Bool)
}

class SignUpViewController: UIViewController, UITextFieldDelegate, SignUpServiceDelegate, DataCenterServiceDelegate{

    @IBOutlet weak var iFNameView: UIView?
    @IBOutlet weak var iFNameTextField: UITextField?
    @IBOutlet weak var iLNameView: UIView?
    @IBOutlet weak var iLNameTextField: UITextField?
    @IBOutlet weak var iEmailView: UIView?
    @IBOutlet weak var iEmailTextField: UITextField?
    @IBOutlet weak var iPasswordView: UIView?
    @IBOutlet weak var iPasswordTextField: UITextField?
    @IBOutlet weak var iConfirmPasswordView: UIView?
    @IBOutlet weak var iConfirmPasswordTextField: UITextField?
    @IBOutlet weak var iAccessCodeView: UIView?
    @IBOutlet weak var iAccessCodeTextField: UITextField?
    @IBOutlet weak var iMessageLabel: UILabel?
    @IBOutlet weak var iRegisterButton: UIButton?
    @IBOutlet weak var iLoginButton: UIButton?
    @IBOutlet weak var iBackButton: UIButton?
    @IBOutlet weak var iActivityIndicator: UIActivityIndicatorView?
    @IBOutlet var iHeightConstraintAccessCode: NSLayoutConstraint?
    @IBOutlet var iTopSpaceConstrint: NSLayoutConstraint?
    
    var iDelegate: SignUpViewDelegate?
    
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Do any additional setup after loading the view.
        self.view.backgroundColor = UIColor.white
        self.hideActivityIndicator()
        let tap: UITapGestureRecognizer = UITapGestureRecognizer(target: self, action: #selector(self.dismissKeyboard))
        view.addGestureRecognizer(tap)
    }
    
    
    override func viewWillAppear(_ animated: Bool) {
        GlobalData.setGAIforView(aScreenName: kSignUpScreen)
        self.edgesForExtendedLayout = []
        self.setTextFieldProperties()
        self.setButtonProperties()
        self.textFieldDidChange()
    }
    
    func setButtonProperties() {
        
        self.iRegisterButton?.isEnabled = false
        self.iRegisterButton?.showsTouchWhenHighlighted = true
        self.iRegisterButton!.alpha = 0.25;
        self.iRegisterButton!.backgroundColor = GlobalData.getButtonBGColor()
        self.iRegisterButton?.titleLabel?.font = GlobalData.getPrimaryFontForButtonTitle()
        self.iRegisterButton?.setTitleColor(GlobalData.getButtonTitleColor(), for: .normal)
        
        self.iLoginButton?.titleLabel?.font = GlobalData.getSecondaryFontForButtonTitle()
    }
    
    func setTextFieldProperties() {
        if #available(iOS 13.0, *) {
            self.iFNameTextField?.overrideUserInterfaceStyle = .light
            self.iLNameTextField?.overrideUserInterfaceStyle = .light
            self.iEmailTextField?.overrideUserInterfaceStyle = .light
            self.iPasswordTextField?.overrideUserInterfaceStyle = .light
            self.iAccessCodeTextField?.overrideUserInterfaceStyle = .light
            self.iConfirmPasswordTextField?.overrideUserInterfaceStyle = .light
        }
        self.iFNameTextField?.delegate = self
        self.iLNameTextField?.delegate = self
        self.iEmailTextField?.delegate = self
        self.iPasswordTextField?.delegate = self
        self.iConfirmPasswordTextField?.delegate = self
        self.iAccessCodeTextField?.delegate = self
        self.iPasswordTextField?.isSecureTextEntry = true
        self.iConfirmPasswordTextField?.isSecureTextEntry = true
        
        self.iFNameTextField?.font = GlobalData.getPrimaryFontForTextField()
        self.iLNameTextField?.font = GlobalData.getPrimaryFontForTextField()
        self.iEmailTextField?.font = GlobalData.getPrimaryFontForTextField()
        self.iEmailTextField!.keyboardType = UIKeyboardType.emailAddress
        self.iPasswordTextField?.font = GlobalData.getPrimaryFontForTextField()
        self.iConfirmPasswordTextField?.font = GlobalData.getPrimaryFontForTextField()
        
        let fNamePadding : UIView = UIView(frame: CGRect(x: 0, y: 0, width: 5, height: 20))
        self.addPadding(aTextField: self.iFNameTextField!, aPaddingView: fNamePadding)
        
        self.iFNameTextField!.leftViewMode = UITextFieldViewMode.always
        self.iFNameTextField!.addTarget(self, action:#selector(self.textFieldDidChange), for: UIControlEvents.editingChanged)
        
        let lNamePadding : UIView = UIView(frame: CGRect(x: 0, y: 0, width: 5, height: 20))
        self.addPadding(aTextField: self.iLNameTextField!, aPaddingView: lNamePadding)
        
        self.iLNameTextField!.leftViewMode = UITextFieldViewMode.always
        self.iLNameTextField!.addTarget(self, action:#selector(self.textFieldDidChange), for: UIControlEvents.editingChanged)
        
        
        let emailPadding : UIView = UIView(frame: CGRect(x: 0, y: 0, width: 5, height: 20))
        self.addPadding(aTextField: self.iEmailTextField!, aPaddingView: emailPadding)
        
        self.iEmailTextField!.leftViewMode = UITextFieldViewMode.always
        self.iEmailTextField!.addTarget(self, action:#selector(self.textFieldDidChange), for: UIControlEvents.editingChanged)
        
        let passwordPadding : UIView = UIView(frame: CGRect(x: 0, y: 0, width: 5, height: 20))
        self.addPadding(aTextField: self.iPasswordTextField!, aPaddingView: passwordPadding)
        self.iPasswordTextField!.addTarget(self, action:#selector(self.textFieldDidChange), for: UIControlEvents.editingChanged)
        
        let confirmPasswordPadding : UIView = UIView(frame: CGRect(x: 0, y: 0, width: 5, height: 20))
        self.addPadding(aTextField:self.iConfirmPasswordTextField!, aPaddingView: confirmPasswordPadding)
        self.iConfirmPasswordTextField!.addTarget(self, action:#selector(self.textFieldDidChange), for: UIControlEvents.editingChanged)
        
        let accessCodePadding : UIView = UIView(frame: CGRect(x: 0, y: 0, width: 5, height: 20))
        self.addPadding(aTextField: self.iAccessCodeTextField!, aPaddingView: accessCodePadding)
        self.iAccessCodeTextField!.addTarget(self, action:#selector(self.textFieldDidChange), for: UIControlEvents.editingChanged)
        
        self.iMessageLabel?.text = ""
        self.iMessageLabel?.font = GlobalData.getPrimaryFontForTextField()
        self.iMessageLabel?.adjustsFontSizeToFitWidth = true
        self.iMessageLabel?.textColor = UIColor.red
        
        let appDetailsDict = GlobalData.fetchAppDetailsDict()
        if appDetailsDict?["AccessCode"] as! Bool == false  {
            self.iHeightConstraintAccessCode?.constant = 0
            self.iTopSpaceConstrint?.constant = -((self.iAccessCodeView?.bounds.height)!+5)
            self.iAccessCodeTextField?.isHidden = true
            self.view.layoutIfNeeded()
        }
    }
    
    @objc func textFieldDidChange () {
        
        let appDetailsDict = GlobalData.fetchAppDetailsDict()
        if appDetailsDict?["AccessCode"] as! Bool == true {
      
            
            if let iFNameText = self.iFNameTextField?.text, !iFNameText.isEmpty, let iLNameText = self.iLNameTextField?.text, !iLNameText.isEmpty , let iEmailText = self.iEmailTextField?.text, !iEmailText.isEmpty , let iPasswordText = self.iPasswordTextField?.text, !iPasswordText.isEmpty, let iConfirmPasswordText = self.iConfirmPasswordTextField?.text, !iConfirmPasswordText.isEmpty, let iAccessCodeText = self.iAccessCodeTextField?.text, !iAccessCodeText.isEmpty   {
                
                self.iRegisterButton?.isEnabled = true
                self.iRegisterButton!.alpha = 1.0;
            }else{
                self.iRegisterButton?.isEnabled = false
                self.iRegisterButton!.alpha = 0.25;
            }
        }else {
            
             if let iFNameText = self.iFNameTextField?.text, !iFNameText.isEmpty, let iLNameText = self.iLNameTextField?.text, !iLNameText.isEmpty , let iEmailText = self.iEmailTextField?.text, !iEmailText.isEmpty , let iPasswordText = self.iPasswordTextField?.text, !iPasswordText.isEmpty, let iConfirmPasswordText = self.iConfirmPasswordTextField?.text, !iConfirmPasswordText.isEmpty   {

                self.iRegisterButton?.isEnabled = true
                self.iRegisterButton!.alpha = 1.0;
            }else{
                self.iRegisterButton?.isEnabled = false
                self.iRegisterButton!.alpha = 0.25;
            }
        }
    }
    
    
    func addPadding(aTextField : UITextField , aPaddingView: UIView)  {
        aTextField.leftView = aPaddingView
        aTextField.leftViewMode = UITextFieldViewMode.always
    }
    
    @IBAction func backButtonClicked(sender: UIButton) {
        self.dismissView()
    }
    
    @IBAction func loginButtonClicked(sender: UIButton) {
        self.dismissView()
    }
    
    @IBAction func signupButtonClicked(sender: UIButton) {
        let isValidEmail = (self.iEmailTextField?.text?.isValidEmailAddress())! as Bool
        if isValidEmail {
            
            if let iPasswordText = self.iPasswordTextField?.text, !iPasswordText.isEmpty, let iConfirmPasswordText = self.iConfirmPasswordTextField?.text, !iConfirmPasswordText.isEmpty   {
                
                if  iPasswordText == iConfirmPasswordText   {
                    
                    let appDetailsDict = GlobalData.fetchAppDetailsDict()
                    if appDetailsDict?["GlobalLogin"] as! Bool == true {
                        self.checkGlobalLogin(aAccessCode: (self.iAccessCodeTextField?.text)!)
                    }else{
                        self.checkSignupService(aFirstName: (self.iFNameTextField?.text)!.trim(), aLastName: (self.iLNameTextField?.text)!.trim(), aEmailID: (self.iEmailTextField?.text)!.trim(), aPassword: (self.iPasswordTextField?.text)!.trim(), aAccessCode: (self.iAccessCodeTextField?.text)!.trim())
                    }
                }
                else {
                    self.iMessageLabel?.text = kPasswordMisMatchError
                }
            }
        }else{
            self.iMessageLabel?.text = kValidEmailError
        }
    }
    
    func checkGlobalLogin(aAccessCode: String)  {
        
        self.showActivityIndicator()
        let globalLoginConnection : Bool = WebServiceTXManager.invokeGlobalLoginService(aDelegate: self, aAccessCode: aAccessCode);
        if !globalLoginConnection {
            self.hideActivityIndicator()
        }
    }
    
    func checkSignupService(aFirstName : String, aLastName : String, aEmailID:String, aPassword: String, aAccessCode: String)  {
        self.showActivityIndicator()
        let authenticatConnection : Bool = WebServiceTXManager.invokeSignupService(aDelegate: self, aFirstName: aFirstName, aLastName: aLastName, aEmailID: aEmailID, aPassword: aPassword, aAccessCode: aAccessCode)
        if !authenticatConnection {
            self.hideActivityIndicator()
        }
        
    }
    
    func showActivityIndicator()   {
        self.iActivityIndicator?.isHidden = false
        self.iActivityIndicator?.startAnimating()
    }
    
    func hideActivityIndicator()   {
        self.iActivityIndicator?.isHidden = true
        self.iActivityIndicator?.stopAnimating()
    }
    
    func dismissView()  {
        self.navigationController?.dismiss(animated: true, completion: nil)
    }
    
    //MARK: - Delegate Methods, GlobalDataCenterServiceDelegate
    
    func globalLoginAuthDidFinish(invocation: QPServiceDataCenterInvocation) -> Void {
        self.hideActivityIndicator()
        self.checkSignupService(aFirstName: (self.iFNameTextField?.text)!.trim(), aLastName: (self.iLNameTextField?.text)!.trim(), aEmailID: (self.iEmailTextField?.text)!.trim(), aPassword: (self.iPasswordTextField?.text)!.trim(), aAccessCode: (self.iAccessCodeTextField?.text)!.trim())
    }
    
    func globalLoginAuthDidFinishWithError( error: String, invocation: QPServiceDataCenterInvocation) -> Void {
        if error.length > 0 {
            self.iMessageLabel?.text = error
            self.hideActivityIndicator()
        }
        
    }
    
    //MARK: - Delegate Methods, signupDidFinishServiceDelegate
    func signupDidFinish(invocation: SignupServiceInvocation) -> Void {
        GlobalData.setSocialSignInfoToUserDefault(key: kSocialSignInInfo, aSocialSignInEnable: false)
        self.hideActivityIndicator()
        if let delegate = self.iDelegate {
            delegate.registerDidFinish(isSuccessed: true)
        }
        self.navigationController?.dismiss(animated: false, completion: nil)
    }
    
    func signupDidFinishWithError( error: String, invocation: SignupServiceInvocation) -> Void {
        self.iMessageLabel?.text = error
        self.hideActivityIndicator()
    }
    
    func signupDidFinishWithStatus(statusMessage: String, invocation: SignupServiceInvocation) {
        //Toast.showToastWithMessageFromTop(statusMessage as String, forDuration: 3)
        self.hideActivityIndicator()
        self.dismissView()
    }
    
    func textFieldShouldReturn(_ textField: UITextField) -> Bool {   //delegate method
        
        if textField == self.iFNameTextField {
            self.iLNameTextField?.becomeFirstResponder()
        }
        if textField == self.iLNameTextField {
            self.iEmailTextField?.becomeFirstResponder()
        }
        if textField == self.iEmailTextField {
            self.iPasswordTextField?.becomeFirstResponder()
        }
        if textField == self.iPasswordTextField {
            self.iConfirmPasswordTextField?.becomeFirstResponder()
        }
        if textField == self.iConfirmPasswordTextField {
            let appDetailsDict = GlobalData.fetchAppDetailsDict()
            if appDetailsDict?["AccessCode"] as! Bool == true  {
                self.iAccessCodeTextField?.becomeFirstResponder()
            }else {
                self.iConfirmPasswordTextField?.resignFirstResponder()
                if self.iRegisterButton?.isEnabled == true {
                    self.signupButtonClicked(sender: self.iRegisterButton!)
                }
            }
        }
        if textField == self.iAccessCodeTextField {
            self.iAccessCodeTextField?.resignFirstResponder()
            if self.iRegisterButton!.isEnabled == true {
                self.signupButtonClicked(sender: self.iRegisterButton!)
            }
        }
        return true
    }
    
    //Calls this function when the tap is recognized.
    @objc func dismissKeyboard() {
        //Causes the view (or one of its embedded text fields) to resign the first responder status.
        view.endEditing(true)
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    
    /*
     // MARK: - Navigation
     // In a storyboard-based application, you will often want to do a little preparation before navigation
     override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
     // Get the new view controller using segue.destinationViewController.
     // Pass the selected object to the new view controller.
     }
     */
    
}


