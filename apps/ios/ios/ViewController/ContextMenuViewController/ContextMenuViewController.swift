//
//  ContextMenuViewController.swift
//  QuestionProCommunities
//
//  Created by Jignesh Raiyani on 8/18/16.
//  Copyright © 2016 QuestionPro Pvt Ltd. All rights reserved.
//

import UIKit

protocol ContextMenuViewControllerDelegate: class {
    func closeContextViewWithAnimation()
    func closeContextViewWithDictionaryData(contextDict : [String:Any])
}

class ContextMenuViewController: UIViewController, UITableViewDelegate, UITableViewDataSource, UIGestureRecognizerDelegate{

     @IBOutlet weak var iTableView: UITableView!
     @IBOutlet weak var iTableBGView : UIView!
     @IBOutlet weak var iNavBar: UINavigationBar?
     @IBOutlet weak var iBootomFooter: UIView?
     @IBOutlet weak var iFooterImageView: UIImageView?
     @IBOutlet weak var iVersionLabel: UILabel?
     var iMMDrawerDelegate: MMDrawerContollerDelegate?
     var iOptionMenuList: [MenuLinks] = []
     weak var iDelegate:ContextMenuViewControllerDelegate?

    
    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
        self.edgesForExtendedLayout = []
        self.addGestureRecognizer()
        self.edgesForExtendedLayout = []
        self.view.backgroundColor = UIColor.clear
        self.iTableView.delegate = self
        self.iTableView.dataSource = self
        self.iTableView.tableFooterView = UIView()

        
        self.iNavBar?.barTintColor = GlobalData.getToolBarBGColorForContextMenu()
        self.iOptionMenuList = iOSManager.sharedInstance.iOptionMenuItems
        self.iOptionMenuList.sorted(by: { ($0.orderNumber?.intValue)! < ($1.orderNumber?.intValue)! })
        self.iTableView.register(UINib(nibName: "ContextMenuCell", bundle: nil), forCellReuseIdentifier: "Cell")
        self.iTableView.tableFooterView = UIView()
        self.view.bringSubview(toFront: self.iTableView)
        self.applyPlainShadow(view: self.iTableBGView)
        self.iTableView.rowHeight = GlobalData.getTableViewRowHeight()
        
        let footerImage : UIImage = UIImage(named:kFooterImageIcon)!
        self.iFooterImageView!.contentMode = .scaleAspectFit
        self.iFooterImageView!.image = footerImage
        
        self.iVersionLabel!.text = "Version " + GlobalData.getApplicationVersion()
        self.iVersionLabel?.font = GlobalData.getVersionLabelFontForMainMenu()
        self.iVersionLabel?.textColor = GlobalData.getSecondaryFontColorForMainMenu()
        
    }
    
    func applyPlainShadow(view: UIView) {
        let layer = view.layer
        layer.shadowColor = UIColor.black.cgColor
        layer.shadowOffset = CGSize.zero
        layer.shadowOpacity = 1
        layer.shadowRadius = 10
        
    }

    override func viewDidAppear(_ animated: Bool) {
        self.navigationController?.isNavigationBarHidden = true
        for j in 0..<self.iOptionMenuList.count {
            let menuLink = self.iOptionMenuList[j]
            if menuLink.active == 1 {
                let indexPath = IndexPath(row: j, section: 0)
                self.iTableView.scrollToRow(at: indexPath as IndexPath, at: .middle, animated: false)
            }
        }
    }
    
    
    func addGestureRecognizer() {
        
        let tap = UITapGestureRecognizer(target: self, action:#selector(self.handleTap(sender:)))
        tap.delegate = self
        tap.cancelsTouchesInView = false
        self.view.addGestureRecognizer(tap)
    }
    
    @objc func handleTap(sender: UITapGestureRecognizer? = nil) {
         self.iDelegate?.closeContextViewWithAnimation()
    }
    
    

    func gestureRecognizer(_ gestureRecognizer: UIGestureRecognizer, shouldReceive touch: UITouch) -> Bool {
        if touch.view is UINavigationBar {
            return true
        }else if touch.view!.isDescendant(of: self.iTableBGView) {
            return false
        }else if touch.view!.isDescendant(of: self.iBootomFooter!) {
            return false
        }
        return true
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return self.iOptionMenuList.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "Cell", for: indexPath) as! ContextMenuCell
        cell.separatorInset = UIEdgeInsets.zero
        cell.layoutMargins = UIEdgeInsets.zero
        cell.iQuestionTextLabel.textAlignment = .left
        let menuLink = self.iOptionMenuList[indexPath.row]
        cell.iQuestionTextLabel?.text = menuLink.questionTitle
        var categoryValue = ""
        if let category = menuLink.category,
            let title = menuLink.title, category.length > 0 && title.length > 0{
            categoryValue = category + ", " + title
        }else {
            if let title = menuLink.title, title.length > 0 {
                categoryValue = title
            }
        }
        cell.iTimeStampLabel?.text = categoryValue
        var count = 0
        if let response = menuLink.totalResponses {
            count = response.intValue
        }
        cell.iResponseTextLabel?.text = count > 1 ? String(count) + " Responses" : String(count) + " Response"
        if menuLink.active == 1 {
            self.iTableView.selectRow(at: indexPath, animated:true, scrollPosition: UITableViewScrollPosition.none)
        }
        return cell
    }
    
//     func tableView(tableView: UITableView, willDisplayCell cell: UITableViewCell,forRowAtIndexPath indexPath: NSIndexPath) {
//        let separatorThickness = CGFloat(1)
//        let separatorView = UIView(frame: CGRectMake(0,cell.frame.size.height - separatorThickness, cell.frame.size.width,separatorThickness))
//        separatorView.backgroundColor = GlobalData.getTableViewSeperatorColor()
//       // cell.addSubview(separatorView)
//    }
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 98.0
    }
    
    func tableView(_ tableView: UITableView, estimatedHeightForRowAt indexPath: IndexPath) -> CGFloat {
        return 98.0
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        
        
        let menuLink : MenuLinks = self.iOptionMenuList[indexPath.row]
        if let url = menuLink.url, menuLink.name == MenuTypes.SHARE.description {
            self.displayShareSheet(shareContent: url)
        }else{
            if let data = menuLink.data {
                self.iDelegate?.closeContextViewWithDictionaryData(contextDict:data)
            }
        }

    }
    
    func displayAlert(title: String, message: String) {
        let alertController = UIAlertController(title: title, message: message, preferredStyle: .alert)
        alertController.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
        present(alertController, animated: true, completion: nil)
        return
    }
    
    
    func displayShareSheet(shareContent:String) {
        let activityViewController = UIActivityViewController(activityItems: [shareContent as NSString], applicationActivities: nil)
        present(activityViewController, animated: true, completion: {})
    }

    
    @IBAction func backButtonClicked(sender: UIButton) {
        self.iDelegate?.closeContextViewWithAnimation()
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
