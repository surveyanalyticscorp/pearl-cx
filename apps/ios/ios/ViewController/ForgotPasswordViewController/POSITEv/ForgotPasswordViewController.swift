//
//  ForgotPasswordViewController.swift
//  QuestionProCommunities
//
//  Created by Jignesh Raiyani on 8/22/16.
//  Copyright © 2016 QuestionPro Pvt Ltd. All rights reserved.
//

import UIKit

class ForgotPasswordViewController: UIViewController  {
    
    @IBOutlet weak var iTitleLabel: UILabel?
    @IBOutlet weak var iMessageTextView: UITextView?
    @IBOutlet weak var iGotItButton: UIButton?
    var iTitleText : String = ""
    
    override func viewDidLoad() {
        super.viewDidLoad()
        UIApplication.shared.statusBarStyle = .lightContent
        self.navigationController?.navigationBar.isHidden = true
        self.iTitleLabel?.text = self.iTitleText
        if #available(iOS 10.0, *) {
            self.iMessageTextView?.adjustsFontForContentSizeCategory = true
        } else {
            // Fallback on earlier versions
        }
        self.view.isOpaque = false
        self.view.backgroundColor = UIColor.clear
    }
    
//    override func viewWillAppear(_ animated: Bool) {
//        view.isOpaque = false
//        view.backgroundColor = UIColor.clear
//    }
//
    override func viewDidAppear(_ animated: Bool) {
        self.view.isOpaque = false
        self.view.backgroundColor = UIColor.white.withAlphaComponent(0.25)
    }


    @IBAction func gotItButtonClicked(sender: UIButton) {
        self.dismiss(animated: true, completion: nil)
    }
    
    func backButtonClicked(sender : UIButton)  {
        self.dismissView()
    }
    
    func dismissView()  {
//        self.navigationController?.dismissViewControllerAnimated(true, completion: nil)
    }
    
    
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        UIApplication.shared.statusBarStyle = UIStatusBarStyle.default
    }
    
    //Calls this function when the tap is recognized.
    func dismissKeyboard() {
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
