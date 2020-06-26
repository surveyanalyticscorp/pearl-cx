//
//  ForgotPasswordViewController.swift
//  QuestionProCommunities
//
//  Created by Jignesh Raiyani on 8/22/16.
//  Copyright © 2016 QuestionPro Pvt Ltd. All rights reserved.
//

import UIKit

class ForgotPasswordViewController: UIViewController, UITextFieldDelegate, ResetPasswordServiceDelegate, OTPServiceDelegate, DataCenterServiceDelegate {
    
    @IBOutlet weak var iContentTextView: UITextView?
    @IBOutlet weak var iEmailView: UIView?
    @IBOutlet weak var iEmailTextField: UITextField?
    @IBOutlet weak var iAccessCodeView: UIView?
    @IBOutlet weak var iAccessCodeTextField: UITextField?
    @IBOutlet weak var iMessageLabel: UILabel?
    @IBOutlet weak var iForgotPasswordButton: UIButton?
    @IBOutlet weak var iActivityIndicator: UIActivityIndicatorView?
    @IBOutlet var iTopSpaceConstrint: NSLayoutConstraint?
    @IBOutlet var iHeightConstraintAccessCode: NSLayoutConstraint?
     var iOTPTextField: UITextField?

    var iTitleText : String = ""
    
    override func viewDidLoad() {
        super.viewDidLoad()
        UIApplication.shared.statusBarStyle = .lightContent
        self.title = self.iTitleText
        self.view.backgroundColor = UIColor.white
        self.hideActivityIndicator()
        self.addLeftBarButtonWithImage()
        
        let tap: UITapGestureRecognizer = UITapGestureRecognizer(target: self, action: #selector(dismissKeyboard))
        view.addGestureRecognizer(tap)
        // Do any additional setup after loading the view.
    }
    
    override func viewWillAppear(_ animated: Bool) {
        self.edgesForExtendedLayout = []
        self.setTextFieldProperties()
        self.setButtonProperties()
        self.textFieldDidChange()
    }
    
    func addLeftBarButtonWithImage() {
        var buttonImage = UIImage(named:kBackButtonImage)
        buttonImage = buttonImage?.withRenderingMode(UIImageRenderingMode.alwaysOriginal)
        navigationItem.leftBarButtonItem = nil
        let leftButton: UIBarButtonItem = UIBarButtonItem(image: buttonImage, style: UIBarButtonItemStyle.plain, target: self, action:#selector(backButtonClicked(sender:)))
        navigationItem.leftBarButtonItem = leftButton;
    }

    
    @objc func backButtonClicked(sender : UIButton)  {
        self.dismissView()
    }
    
    func dismissView()  {
        self.navigationController?.dismiss(animated: true, completion: nil)
    }
    
    func setButtonProperties() {
        
        self.iForgotPasswordButton?.tag = 0
        self.iForgotPasswordButton?.isEnabled = false
        self.iForgotPasswordButton?.showsTouchWhenHighlighted = true
        self.iForgotPasswordButton!.alpha = 0.25;
        self.iForgotPasswordButton!.backgroundColor = GlobalData.getButtonBGColor()
        self.iForgotPasswordButton?.titleLabel?.font = GlobalData.getPrimaryFontForButtonTitle()
        self.iForgotPasswordButton?.setTitleColor(GlobalData.getButtonTitleColor(), for: .normal)
        
    }

    
    func setTextFieldProperties() {
        
        self.iContentTextView?.font = GlobalData.getPrimaryFontForTextField()
        // self.iContentTextView?.sizeToFit()

        self.iEmailTextField?.delegate = self
        self.iAccessCodeTextField?.delegate = self
        self.iEmailTextField?.font = GlobalData.getPrimaryFontForTextField()
        self.iAccessCodeTextField?.font = GlobalData.getPrimaryFontForTextField()
        
        if #available(iOS 13.0, *) {
            self.iEmailTextField?.overrideUserInterfaceStyle = .light
            self.iAccessCodeTextField?.overrideUserInterfaceStyle = .light
    
        }
        
        let emailPadding : UIView = UIView(frame: CGRect(x : 0, y : 0, width : 5, height : 20))
        self.addPadding(aTextField: self.iEmailTextField!, aPaddingView: emailPadding)
        
        self.iEmailTextField!.leftViewMode = UITextFieldViewMode.always
        self.iEmailTextField!.addTarget(self, action:#selector(textFieldDidChange), for: UIControlEvents.editingChanged)
        self.iEmailTextField?.becomeFirstResponder()
        
        let accessCodePadding : UIView = UIView(frame: CGRect(x : 0, y : 0, width : 5, height : 20))
        self.addPadding(aTextField: self.iAccessCodeTextField!, aPaddingView: accessCodePadding)
        self.iAccessCodeTextField!.addTarget(self, action:#selector(textFieldDidChange), for: UIControlEvents.editingChanged)
        
        self.iMessageLabel?.text = ""
        self.iMessageLabel?.font = GlobalData.getPrimaryFontForTextField()
        self.iMessageLabel?.textColor = UIColor.red
        
        if  let appDetailsDict = GlobalData.fetchAppDetailsDict() {
            if let forgotPasswordContent = appDetailsDict["kForgotPasswordContent"] as? String {
                self.iContentTextView?.text = forgotPasswordContent
                self.iContentTextView?.textContainer.lineBreakMode = NSLineBreakMode.byWordWrapping
            }
            if let isAccessCodeEnable = appDetailsDict["AccessCode"] as? Bool, !isAccessCodeEnable {
                self.iAccessCodeTextField?.isHidden = true
                self.iAccessCodeView?.isHidden = true
                self.iHeightConstraintAccessCode?.constant = 0
                self.view.layoutIfNeeded()
                self.iTopSpaceConstrint?.constant = -((self.self.iAccessCodeView?.bounds.height)!+5)
            }
            if let accessCodePlaceHolder = appDetailsDict["AccessCodePlaceHolder"] as? String {
                self.iAccessCodeTextField?.placeholder = accessCodePlaceHolder
            }
        }
    }
    
    @objc func textFieldDidChange () {
        if let appDetailsDict = GlobalData.fetchAppDetailsDict(),
            let isAccessCodeEnable = appDetailsDict["AccessCode"] as? Bool, isAccessCodeEnable {
            if (self.iEmailTextField!.text?.length)! > 0 && self.iAccessCodeTextField!.text!.length > 0  {
                self.iForgotPasswordButton?.isEnabled = true
                self.iForgotPasswordButton!.alpha = 1.0;
            }else{
                self.iForgotPasswordButton?.isEnabled = false
                self.iForgotPasswordButton!.alpha = 0.25;
            }
        }else {
            if self.iEmailTextField!.text!.length > 0 {
                self.iForgotPasswordButton?.isEnabled = true
                self.iForgotPasswordButton!.alpha = 1.0;
            }else{
                self.iForgotPasswordButton?.isEnabled = false
                self.iForgotPasswordButton!.alpha = 0.25;
            }
        }
    }
    
    func addPadding(aTextField : UITextField , aPaddingView: UIView)  {
        aTextField.leftView = aPaddingView
        aTextField.leftViewMode = UITextFieldViewMode.always
    }
    
    func showActivityIndicator()   {
        self.iActivityIndicator?.isHidden = false
        self.iActivityIndicator?.startAnimating()
    }
    
    func hideActivityIndicator()   {
        self.iActivityIndicator?.isHidden = true
        self.iActivityIndicator?.stopAnimating()
    }
    
    func textFieldShouldReturn(_ textField: UITextField) -> Bool {   //delegate method
        
        if textField == self.iEmailTextField {
            
            if let appDetailsDict = GlobalData.fetchAppDetailsDict(),
                let isAccessCodeEnable = appDetailsDict["AccessCode"] as? Bool, isAccessCodeEnable {
                self.iAccessCodeTextField?.becomeFirstResponder()
            }else {
                self.iEmailTextField?.resignFirstResponder()
                if self.iForgotPasswordButton?.isEnabled == true {
                    self.forgotPasswordClicked(self.iForgotPasswordButton!)
                }
            }
        }
        if textField == self.iAccessCodeTextField {
            self.iAccessCodeTextField?.resignFirstResponder()
            if self.iForgotPasswordButton?.isEnabled == true {
                self.forgotPasswordClicked(self.iForgotPasswordButton!)
            }
        }
        return true
    }
    
    func textField(_ textField: UITextField, shouldChangeCharactersIn range: NSRange, replacementString string: String) -> Bool {
        
        if textField == self.iOTPTextField {
            if string.rangeOfCharacter(from: NSCharacterSet.letters) != nil {
                return false
            } else {
                return true
            }
        }else {
            return true
        }
        
    }

    @IBAction func forgotPasswordClicked(_ sender: Any) {
        self.iMessageLabel?.text = ""
        self.iAccessCodeView?.layer.borderColor = UIColor.clear.cgColor
        self.iEmailView?.layer.borderColor = UIColor.clear.cgColor
        
        self.showActivityIndicator()
        if let appDetailsDict = GlobalData.fetchAppDetailsDict(),
            let isGLobalLoginEnable = appDetailsDict["GlobalLogin"] as? Bool, isGLobalLoginEnable {
            self.checkGlobalLogin(aAccessCode: (self.iAccessCodeTextField?.text)!)
        }else{
            self.checkResetPassword(aEmailID: (self.iEmailTextField?.text)!, aAccessCode: (self.iAccessCodeTextField?.text)!)
        }
    }
    
    func checkGlobalLogin(aAccessCode: String)  {
        let globalLoginConnection : Bool = WebServiceTXManager.invokeGlobalLoginService(aDelegate: self, aAccessCode: aAccessCode);
        if !globalLoginConnection {
            self.hideActivityIndicator()
        }
    }

    func checkResetPassword(aEmailID:String,aAccessCode: String)  {
        let resetPasswordConnection : Bool = WebServiceTXManager.invokeResetPasswordService(aDelegate: self, aEmailID: aEmailID, aAccessCode: aAccessCode)
        if  !resetPasswordConnection {
            self.hideActivityIndicator()
        }
        
    }
    
    func checkOTPVerification(aEmailID:String, aAccessCode: String, aOTP: String)  {
        let otpConnection : Bool = WebServiceTXManager.invokeOTPService(aDelegate: self, aEmailID: aEmailID, aAccessCode: aAccessCode, aOTP : aOTP)
        if  !otpConnection {
            self.hideActivityIndicator()
        }
        
    }
    
    //MARK: - Delegate Methods, GlobalDataCenterServiceDelegate
    
    func globalLoginAuthDidFinish(invocation: QPServiceDataCenterInvocation) -> Void {
        self.hideActivityIndicator()
        self.checkResetPassword(aEmailID: (self.iEmailTextField?.text)!, aAccessCode: (self.iAccessCodeTextField?.text)!)
    }
    
    func globalLoginAuthDidFinishWithError( error: String, invocation: QPServiceDataCenterInvocation) -> Void {
        if error.length > 0 {
            self.iMessageLabel?.text = error as String
            self.hideActivityIndicator()
        }
        
    }
    
    //MARK: - Delegate Methods, ForgotPasswordServiceDelegate
    func reserPasswordDidFinish(invocation: QPResetPasswordServiceInvocation) -> Void {
        
        self.hideActivityIndicator()
        self.showOTPAlert(errorMessage: "")
        //self.dismissView()
    }
    
    func reserPasswordDidFinishWithError( error: String, invocation: QPResetPasswordServiceInvocation) -> Void {
        self.iMessageLabel?.text = error as String
        self.hideActivityIndicator()
        
    }
    
    
    //MARK: - Delegate Methods, OTPServiceDelegate
    func otpServiceDidFinish(invocation: QPOTPServiceInvocation) -> Void {
        self.hideActivityIndicator()
        self.pushUpdatePasswordViewController()
    }
    
    func otpServiceDidFinishWithError( error: String, invocation: QPOTPServiceInvocation) -> Void {
        self.hideActivityIndicator()
        self.showOTPAlert(errorMessage: error as String)
        
        
    }
    
     func pushUpdatePasswordViewController() {
        
        let updatePasswordViewController = UpdatePasswordViewController(nibName: "UpdatePasswordViewController", bundle: nil);
        updatePasswordViewController.iTitleText = "Update Password"
    
        if let accessCodeText = self.iAccessCodeTextField?.text {
            updatePasswordViewController.iAccessCodeText = accessCodeText
        }else{
            updatePasswordViewController.iAccessCodeText = ""
        }
        if let emailIDText = self.iEmailTextField?.text {
            updatePasswordViewController.iEmailText = emailIDText
        }else{
            updatePasswordViewController.iEmailText = ""
        }
        self.navigationController?.pushViewController(updatePasswordViewController, animated:true)
        
    }
    
    func showOTPAlert(errorMessage : String) {
        
        let titleString = NSMutableAttributedString(string: kForgotPasswordOTP)
        titleString.addAttribute(NSAttributedStringKey.font, value:GlobalData.getPrimaryFontForMainMenu(), range:NSRange(location:0,length:titleString.length))

        let alertController = UIAlertController(title: kForgotPasswordOTP, message: "" , preferredStyle: .alert)
        
        alertController.setValue(NSAttributedString(string: kForgotPasswordOTP, attributes: [NSAttributedStringKey.font : GlobalData.getPrimaryFontForMainMenu()]), forKey: "attributedTitle")
        alertController.setValue(NSAttributedString(string: errorMessage, attributes: [NSAttributedStringKey.font : GlobalData.getPrimaryFontForMainMenu(),NSAttributedStringKey.foregroundColor : UIColor.red]), forKey: "attributedMessage")

        let cancelAction = UIAlertAction(title: "Cancel", style: .default, handler: {
            (action : UIAlertAction!) -> Void in
        })
        
        let doneAction = UIAlertAction(title: "Done", style:.default , handler: {
            alert -> Void in
            self.showActivityIndicator()
            self.checkOTPVerification(aEmailID: (self.iEmailTextField?.text)!,aAccessCode:(self.iAccessCodeTextField?.text)!, aOTP: (self.iOTPTextField?.text)!)
        })
                
        alertController.addTextField { (textField : UITextField!) -> Void in
            self.iOTPTextField = alertController.textFields![0] as UITextField
            self.iOTPTextField?.delegate = self
            self.iOTPTextField!.placeholder = kOTPPlaceHolder
            self.iOTPTextField?.keyboardType = UIKeyboardType.numberPad
        }
        alertController.addAction(cancelAction)
        alertController.addAction(doneAction)
        self.present(alertController, animated: true, completion: nil)
    }

    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        UIApplication.shared.statusBarStyle = UIStatusBarStyle.default
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
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

}
