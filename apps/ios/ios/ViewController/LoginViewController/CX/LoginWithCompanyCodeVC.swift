//
//  LoginWithCompanyCodeVC.swift
//  ios
//
//  Created by Sujan Vaidya on 2/6/18.
//  Copyright © 2018 QuestionPro Pvt Ltd. All rights reserved.
//

import UIKit

class LoginWithCompanyCodeVC: UIViewController, UITextFieldDelegate{
    
    @IBOutlet weak var companyCodeTF: UITextField!
    @IBOutlet weak var nextButton: UIButton!
    @IBOutlet weak var errLabel: UILabel!
    
    var delegate: MainViewDelegate?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        let tapGesture = UITapGestureRecognizer(target: self, action: #selector(self.hideKeyboard))
        self.view.addGestureRecognizer(tapGesture)
        setButtonProperties()
        setupTextFieldProps()
        if #available(iOS 13.0, *) {
        self.companyCodeTF?.overrideUserInterfaceStyle = .light
        }
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    
    @objc func hideKeyboard() {
        view.endEditing(true)
    }
    
    func setButtonProperties() {
        if let nextButton = self.nextButton {
            nextButton.isEnabled = false
            nextButton.showsTouchWhenHighlighted = true
            nextButton.alpha = 0.25;
            nextButton.backgroundColor = GlobalData.getButtonBGColor()
            nextButton.titleLabel?.font = GlobalData.getPrimaryFontForButtonTitle()
            nextButton.setTitleColor(GlobalData.getButtonTitleColor(), for: UIControlState.normal)
        }
    }
    
    func setupTextFieldProps() {
        self.companyCodeTF?.font = GlobalData.getPrimaryFontForTextField()
        self.companyCodeTF.delegate = self
        let companyCodePadding : UIView = UIView(frame: CGRect(x: 0, y: 0, width: 5, height: 20))
        self.addPadding(aTextField: self.companyCodeTF!, aPaddingView: companyCodePadding)
        self.companyCodeTF!.addTarget(self, action:#selector(self.textFieldDidChange), for: UIControlEvents.editingChanged)
        
    }
    
    @objc func textFieldDidChange () {
        if self.companyCodeTF!.text!.length > 1 {
            self.nextButton?.isEnabled = true
            self.nextButton!.alpha = 1.0;
        }else{
            self.nextButton?.isEnabled = false
            self.nextButton!.alpha = 0.25;
        }
    }
    
    // delegate method
    func textFieldShouldReturn(_ textField: UITextField) -> Bool {
        if textField == self.companyCodeTF {
            self.companyCodeTF?.resignFirstResponder()
            if self.nextButton!.isEnabled == true {
                self.nextButtonClicked(self.nextButton!)
            }
        }
        return true
    }
    
    func addPadding(aTextField : UITextField , aPaddingView: UIView)  {
        aTextField.leftView = aPaddingView
        aTextField.leftViewMode = UITextFieldViewMode.always
    }
    
    @IBAction func backButtonAction(_ sender: Any) {
        self.navigationController?.popViewController(animated: true)
    }
   
    // TODO: Validate the company code with api request
    @IBAction func nextButtonClicked(_ sender: Any) {
        self.hideKeyboard()
        let loginViewController = LoginViewController(nibName: "LoginViewController", bundle: nil);
        loginViewController.iDelegate = self
        loginViewController.companyCode = self.companyCodeTF.text!
        self.navigationController?.pushViewController(loginViewController, animated:true)
    }
   

    @IBAction func helpButtonClicked(_ sender: Any) {
        if let appDetailsDict = GlobalData.fetchAppDetailsDict(),
            let buttonTitle = appDetailsDict["kHelpButtonTitle"] as? String,
            let message = appDetailsDict["kHelpButtonMessage"] as? String {
            self.showHelpAlert(aTitle: buttonTitle, aMessage: message)
        }
    }

    func showHelpAlert(aTitle:String, aMessage:String) {
        let alert=UIAlertController(title: aTitle, message: aMessage, preferredStyle: UIAlertControllerStyle.alert);
        alert.addAction(UIAlertAction(title: "Ok", style: UIAlertActionStyle.default, handler: nil));
        self.present(alert, animated: true, completion: nil)
    }
    
}

extension LoginWithCompanyCodeVC: MainViewDelegate {
    
    func pushHomeViewFromMainViewController() {
        self.delegate?.pushHomeViewFromMainViewController!()
    }
    
}
