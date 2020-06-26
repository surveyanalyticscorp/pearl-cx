//
//  ResetPasswordViewController.swift
//  ios
//
//  Created by Jignesh Raiyani on 12/20/16.
//  Copyright © 2016 QuestionPro Pvt Ltd. All rights reserved.
//

import UIKit

class UpdatePasswordViewController: UIViewController, UITextFieldDelegate, UpdatePasswordServiceDelegate {

    @IBOutlet weak var iContentTextView: UITextView?
    @IBOutlet weak var iPasswordView: UIView?
    @IBOutlet weak var iPasswordTextField: UITextField?
    @IBOutlet weak var iConfirmPasswordView: UIView?
    @IBOutlet weak var iConfirmPasswordTextField: UITextField?
    @IBOutlet weak var iMessageLabel: UILabel?
    @IBOutlet weak var iUpdatePasswordButton: UIButton?
    @IBOutlet weak var iActivityIndicator: UIActivityIndicatorView?

    var iTitleText : String = ""
    var iAccessCodeText : String = ""
    var iEmailText : String = ""
    
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
        
        self.iUpdatePasswordButton?.tag = 0
        self.iUpdatePasswordButton?.isEnabled = false
        self.iUpdatePasswordButton?.showsTouchWhenHighlighted = true
        self.iUpdatePasswordButton!.alpha = 0.25;
        self.iUpdatePasswordButton!.backgroundColor = GlobalData.getButtonBGColor()
        self.iUpdatePasswordButton?.titleLabel?.font = GlobalData.getPrimaryFontForButtonTitle()
        self.iUpdatePasswordButton?.setTitleColor(GlobalData.getButtonTitleColor(), for: .normal)
        
    }
    
    func setTextFieldProperties() {
        
        self.iContentTextView?.font = GlobalData.getPrimaryFontForTextField()
        self.iContentTextView?.sizeToFit()
        
        self.iPasswordTextField?.delegate = self
        self.iConfirmPasswordTextField?.delegate = self
        self.iPasswordTextField?.font = GlobalData.getPrimaryFontForTextField()
        self.iConfirmPasswordTextField?.font = GlobalData.getPrimaryFontForTextField()
        
        let passwordPadding : UIView = UIView(frame: CGRect(x : 0, y : 0, width : 5, height : 20))
        self.addPadding(aTextField: self.iPasswordTextField!, aPaddingView: passwordPadding)
        
        self.iPasswordTextField!.leftViewMode = UITextFieldViewMode.always
        self.iPasswordTextField!.addTarget(self, action:#selector(textFieldDidChange), for: UIControlEvents.editingChanged)
        self.iPasswordTextField!.becomeFirstResponder()
        
        let confirmPasswordPadding : UIView = UIView(frame: CGRect(x : 0, y : 0, width : 5, height : 20))
        self.addPadding(aTextField: self.iConfirmPasswordTextField!, aPaddingView: confirmPasswordPadding)
        self.iConfirmPasswordTextField!.addTarget(self, action:#selector(textFieldDidChange), for: UIControlEvents.editingChanged)
        
        self.iMessageLabel?.text = ""
        self.iMessageLabel?.font = GlobalData.getPrimaryFontForTextField()
        self.iMessageLabel?.textColor = UIColor.red
        
        if let appDetailsDict = GlobalData.fetchAppDetailsDict(),
           let updatePasswordContent = appDetailsDict["kUpdatePasswordContent"] as? String {
            self.iContentTextView?.text = updatePasswordContent
        }
    }
    
    
    @objc func textFieldDidChange () {
        self.checkTextFieldValidation()
    }
    
    func  checkTextFieldValidation() -> Bool {
        if self.iPasswordTextField!.text!.length > 0 && self.iConfirmPasswordTextField!.text!.length > 0  && (self.iPasswordTextField?.text == self.iConfirmPasswordTextField?.text){
            self.iUpdatePasswordButton?.isEnabled = true
            self.iUpdatePasswordButton?.alpha = 1.0;
            
            return true
        }else {
            self.iUpdatePasswordButton?.isEnabled = false
            self.iUpdatePasswordButton!.alpha = 0.25;
            
            return false
        }

    }
    
    @IBAction func updatePasswordClicked(_ sender: Any) {
        if self.iUpdatePasswordButton?.isEnabled == true && self.checkTextFieldValidation(){
            self.checkUpdatePassword(aEmailID: self.iEmailText, aPassword:(self.iConfirmPasswordTextField?.text)!, aAccessCode:self.iAccessCodeText)
        }
    }
    
    func checkUpdatePassword(aEmailID:String, aPassword: String, aAccessCode: String)  {
        self.showActivityIndicator()
        let updatePasswordConnection : Bool = WebServiceTXManager.invokeUpdatePasswordService(aDelegate: self, aEmailID: aEmailID, aPassword:aPassword, aAccessCode : aAccessCode)
        if  !updatePasswordConnection {
            self.hideActivityIndicator()
        }
        
    }
    
    //MARK: - Delegate Methods, UpdatePasswordServiceDelegate
    func updatePasswordDidFinish(invocation: QPUpdatePasswordServiceInvocation, aMessage:String) -> Void {
        
        self.hideActivityIndicator()
        self.showSuccessfulPasswordAlert(aMessage: aMessage)
        self.dismissView()
        
    }
    
    func updatePasswordDidFinishWithError( error: String, invocation: QPUpdatePasswordServiceInvocation) -> Void {
        self.iMessageLabel?.text = error as String
        self.hideActivityIndicator()
        
    }
    
    func addPadding(aTextField : UITextField , aPaddingView: UIView)  {
        aTextField.leftView = aPaddingView
        aTextField.leftViewMode = UITextFieldViewMode.always
    }
    
    func showActivityIndicator()   {
        self.iMessageLabel?.text = ""
        self.iActivityIndicator?.isHidden = false
        self.iActivityIndicator?.startAnimating()
    }
    
    func hideActivityIndicator()   {
        self.iActivityIndicator?.isHidden = true
        self.iActivityIndicator?.stopAnimating()
    }
    
    func textFieldShouldReturn(_ textField: UITextField) -> Bool {   //delegate method
        
        if textField == self.iPasswordTextField {
            self.iConfirmPasswordTextField?.becomeFirstResponder()
        }
        if textField == self.iConfirmPasswordTextField {
            self.iConfirmPasswordTextField?.resignFirstResponder()
            if self.iUpdatePasswordButton?.isEnabled == true && self.checkTextFieldValidation(){
                self.checkUpdatePassword(aEmailID: self.iEmailText, aPassword:(self.iConfirmPasswordTextField?.text)!, aAccessCode:self.iAccessCodeText)
            }
        }
        return true
    }
    
    func showSuccessfulPasswordAlert(aMessage:String) {
        let appDelegate = UIApplication.shared.delegate as! AppDelegate
        appDelegate.iWindow?.makeToast(aMessage, duration: 3.0, position: .top)
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
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

}
