//
//  IntroViewController.swift
//  QuestionProCommunities
//
//  Created by Jignesh Raiyani on 8/16/16.
//  Copyright © 2016 QuestionPro Pvt Ltd. All rights reserved.
//

import UIKit

class IntroViewController: UIViewController, UIScrollViewDelegate {

    @IBOutlet weak var iScrollView: UIScrollView?
    @IBOutlet weak var iBottomView: UIView?
    @IBOutlet weak var iPageControl: DDPageControl?
    @IBOutlet weak var iSignInButton: UIButton?
    @IBOutlet var iCentralConstraintPageControl: NSLayoutConstraint?
    @IBOutlet var iTrailingConstraintSignInButton: NSLayoutConstraint?
    var iDelegate: MainViewDelegate?

    
    var currentBannerNumber = NSNumber()
    var bgImageView:UIImageView?

    
    override func viewDidLoad() {
        
        super.viewDidLoad()

        // Do any additional setup after loading the view.
        self.navigationController?.isNavigationBarHidden = true
        if let bottomView = self.iBottomView {
            bottomView.backgroundColor = UIColor.clear
        }
        if let bgimage = UIImage(named: kIntroViewBackground) {
            self.bgImageView = UIImageView(image: bgimage)
            if let bgImageView = self.bgImageView{
                bgImageView.contentMode = UIViewContentMode.scaleAspectFill
                self.view.addSubview(bgImageView)
                self.view.sendSubview(toBack: bgImageView)
                //Prep auto layout
                bgImageView.translatesAutoresizingMaskIntoConstraints = false
                
                let views = Dictionary(dictionaryLiteral: ("bgImageView",bgImageView))
                //Vertical constraints
                let verticalConstraints = NSLayoutConstraint.constraints(withVisualFormat: "V:|-0-[bgImageView]-0-|", options: NSLayoutFormatOptions.init(rawValue: 0), metrics: nil, views: views)
                self.view.addConstraints(verticalConstraints)
                
                //Horizontal constraints
                let horizontalConstraints = NSLayoutConstraint.constraints(withVisualFormat: "H:|-0-[bgImageView]-0-|", options: NSLayoutFormatOptions.init(rawValue: 0), metrics: nil, views: views)
                self.view.addConstraints(horizontalConstraints)
            }
        }
        
        if let signInButton = self.iSignInButton {
            signInButton.layer.borderWidth = 1.5
            signInButton.layer.borderColor = UIColor.white.cgColor
            signInButton.titleLabel?.font = GlobalData.getPrimaryFontForButtonTitle()
        }
        /*
         *  The following array contains the data (Banner Header, Banner Description, Banner image name) realted to banners on IntroViewController.
         *  The data is fetched from the localized "Banners.plist" file
         */
        let bannerList  = [["header" : "Welcome", "description" : "Welcome to the Point of Sale Intervention for Tobacco Evaluation Study!","image" : "MarketingOne"],["header" : "Introduction", "description" : "Thank you for agreeing to participate in the smartphone app portion of the study. \n\nThis new approach to research uses your phone's techonology to determine how often you go to stores that sell tobacco products. \n\nThe app will also ask you to complete a short questionnaire (5 minutes or less) three times over the next year and a half.","image" : ""]]
       
        
        if  bannerList.count > 0 {
            let numberOfPages = bannerList.count
            
                if let scrollView = self.iScrollView {
                    // define the scroll view content size and enable paging
                    scrollView.isPagingEnabled = true
                    scrollView.showsHorizontalScrollIndicator = false
                    scrollView.alwaysBounceVertical = false
                    scrollView.showsVerticalScrollIndicator = false
                    scrollView.backgroundColor = UIColor.clear
                    scrollView.bounces = false
                    scrollView.delegate = self
                
                //Configuring page control
                    //Configuring page control
                    if let pageControl = self.iPageControl{
                        pageControl.currentPage = 0
                        pageControl.numberOfPages = numberOfPages
                        pageControl.defersCurrentPageDisplay = true
                        pageControl.type = DDPageControlTypeOnFullOffEmpty
                        pageControl.onColor = UIColor.white
                        pageControl.offColor = UIColor.white
                        pageControl.indicatorSpace = DeviceMatrixHelper.isIpad ? 12 : 8
                        pageControl.indicatorDiameter = DeviceMatrixHelper.isIpad ? 14 :10
                        
                        pageControl.backgroundColor = UIColor.clear
                        pageControl.addTarget(self, action: #selector(pageControlClicked(sender:)), for: UIControlEvents.valueChanged)
                        pageControl.isUserInteractionEnabled = false
                    }

                var previousContainer : UIView?
                scrollView.backgroundColor = UIColor.clear
                self.currentBannerNumber = 0;
                for i in 0 ..< bannerList.count {
                    
                    //Initializing page container and setting up its constraints
                    let container = UIView()
                    scrollView.addSubview(container)
                    container.translatesAutoresizingMaskIntoConstraints = false;
                    container.backgroundColor = UIColor.clear
                    container.layer.borderColor = UIColor.red.cgColor
                    let containerViews = Dictionary(dictionaryLiteral: ("container",container))
                    
                    scrollView.addConstraints(NSLayoutConstraint.constraints(withVisualFormat: "V:|-0-[container]-0-|", options:NSLayoutFormatOptions.init(rawValue:0), metrics: nil, views:["container":container]))
                    
                    // Adding horizontal constraint (left) to the container
                    if let tempContainer = previousContainer {
                        //If this is any other page than the first one then pin the left edge to the previous page container
                        let containerLit = Dictionary(dictionaryLiteral:("previousContainer",tempContainer), ("container",container))
                        scrollView.addConstraints(NSLayoutConstraint.constraints(withVisualFormat: "H:[previousContainer]-0-[container]", options:NSLayoutFormatOptions.init(rawValue:0), metrics: nil, views:containerLit))
                    }else{
                        //If this is the firt page then pin the left to the conteview
                        scrollView.addConstraints(NSLayoutConstraint.constraints(withVisualFormat: "H:|-0-[container]", options:NSLayoutFormatOptions.init(rawValue:0), metrics: nil, views:containerViews))
                    }
                    
                    //Adding width constraint to container
                    self.view.addConstraint(NSLayoutConstraint(item: container, attribute: NSLayoutAttribute.width, relatedBy: NSLayoutRelation.equal, toItem:self.view, attribute: NSLayoutAttribute.width, multiplier:1.0 , constant: 0.0))
                    
                    //Adding height constraint to container
                    self.view.addConstraint(NSLayoutConstraint(item: container, attribute: NSLayoutAttribute.height, relatedBy: NSLayoutRelation.equal, toItem:self.view, attribute: NSLayoutAttribute.height, multiplier:0.85 , constant: 0.0))
                    
                    previousContainer = container;
                    
                    // setting the banner image
                    let bannerDict = bannerList[i]
                    
                    let titleLbl : UILabel = UILabel()
                    titleLbl.backgroundColor = UIColor.clear
                    titleLbl.translatesAutoresizingMaskIntoConstraints = false
                    titleLbl.textAlignment = NSTextAlignment.center
                    titleLbl.textColor = UIColor.white
                    titleLbl.font = UIFont.systemFont(ofSize: DeviceMatrixHelper.isIpad ? 64:56)
                    titleLbl.text = GlobalData.getApplicationName()
                    container.addSubview(titleLbl)
            
                    //Setting constraints for image view
                    let marketingViews = Dictionary(dictionaryLiteral: ("titleLabel",titleLbl))
                    container.addConstraints(NSLayoutConstraint.constraints(withVisualFormat: "H:|-0-[titleLabel]-0-|", options:NSLayoutFormatOptions.init(rawValue:0), metrics: nil, views:marketingViews))
                
                    let heightConstraint : NSLayoutConstraint?
                        // Height constraint : 30% of the "bannerLabelView" height
                    heightConstraint = NSLayoutConstraint(item: titleLbl, attribute: NSLayoutAttribute.height, relatedBy: NSLayoutRelation.equal, toItem:container, attribute: NSLayoutAttribute.height, multiplier:0.25, constant: 0.0)
                    let topConstraint = NSLayoutConstraint(item: titleLbl, attribute: NSLayoutAttribute.centerY, relatedBy: NSLayoutRelation.equal, toItem:container, attribute: NSLayoutAttribute.centerY, multiplier:0.2, constant: 0.0)
                    container.addConstraint(topConstraint)
                    if let constraint = heightConstraint {
                        container.addConstraint(constraint)
                    }
                    
                    let bannerView = BannerDescriptionView()
                    bannerView.translatesAutoresizingMaskIntoConstraints = false
                    if let image = bannerDict["image"] {
                        bannerView.drawBannerDescriptionView(imageName: image)
                    }
                    if let headerText = bannerDict["header"], let descriptionText = bannerDict["description"] {
                        bannerView.updateHeaderLabel(aHeaderText: headerText ,aDescriptionText:descriptionText)
                    }
                    bannerView.backgroundColor = UIColor.black.withAlphaComponent(0.08)

                    /*************Configuring Banner Label View ***************/
                    // Width constraint : 95% of the "container" width
                    container.addSubview(bannerView)
                    container.addConstraint(NSLayoutConstraint(item: bannerView, attribute: NSLayoutAttribute.width, relatedBy: NSLayoutRelation.equal, toItem:container, attribute: NSLayoutAttribute.width, multiplier:1.00 , constant: 0.0))
                    
                    // Height constraint : 55% of the "container" height
                    container.addConstraint(NSLayoutConstraint(item: bannerView, attribute: NSLayoutAttribute.height, relatedBy: NSLayoutRelation.equal, toItem:container, attribute: NSLayoutAttribute.height, multiplier:0.78 , constant: 0.0))
                    
                    // X coordiante constraint (horizontal)
                    container.addConstraint(NSLayoutConstraint(item: bannerView, attribute: NSLayoutAttribute.centerX, relatedBy: NSLayoutRelation.equal, toItem:container, attribute: NSLayoutAttribute.centerX, multiplier:1.0 , constant: 0.0))

                    
                    // Y coordiante constraint (vertical)
                    container.addConstraint(NSLayoutConstraint(item: bannerView, attribute: NSLayoutAttribute.centerY, relatedBy: NSLayoutRelation.equal, toItem:container, attribute: NSLayoutAttribute.centerY, multiplier:1.15, constant: 0.0))
                    
                }

                //Adding right edge constraints to last banner view
                let preViews = Dictionary(dictionaryLiteral: ("previousContainer",previousContainer!))
                    scrollView.addConstraints(NSLayoutConstraint.constraints(withVisualFormat: "H:[previousContainer]-0-|", options:NSLayoutFormatOptions.init(rawValue:0), metrics: nil, views:preViews))
            }
        }
    }
    
    
    override func viewDidAppear(_ animated: Bool) {
        
        self.navigationController?.isNavigationBarHidden = true
        if let centerConstraintPageControl = self.iCentralConstraintPageControl,
            let bottomView = self.iBottomView, currentBannerNumber == 0 {
            centerConstraintPageControl.constant = bottomView.frame.origin.x
        }
    }
    
    @IBAction func pageControlClicked(sender: UIPageControl) {
        // we need to scroll to the new index
        if let scrollView = self.iScrollView {
            let pageWidth = scrollView.bounds.size.width * CGFloat(sender.currentPage)
            scrollView.setContentOffset(CGPoint(x : pageWidth, y : scrollView.contentOffset.y), animated: true)
        }
    }
    
    
    func scrollViewDidEndDecelerating(_ scrollView: UIScrollView) {
        
        let pageWidth: CGFloat = scrollView.bounds.size.width
        let fractionalPage : Float = Float(scrollView.contentOffset.x / pageWidth)
        let nearestNumber: NSInteger = lroundf(fractionalPage)
        if let pageControl = self.iPageControl, pageControl.currentPage != nearestNumber {
            pageControl.currentPage = nearestNumber
            self.currentBannerNumber = NSNumber(value:nearestNumber)
            pageControl.updateCurrentPageDisplay()
        }
        if let pageControl = self.iPageControl,
            let bottomView = self.iBottomView,
            let centerConstraintPageControl = self.iCentralConstraintPageControl,
            let trailingConstraintSignInButton = self.iTrailingConstraintSignInButton,
            let signInButton = self.iSignInButton {
            if pageControl.currentPage == pageControl.numberOfPages-1 {
                UIView.transition(with: pageControl, duration: 0.7, options: .curveEaseOut, animations: {
                    // animation
                    centerConstraintPageControl.constant = -bottomView.frame.width/2 + (pageControl.bounds.size.width)/2
                    trailingConstraintSignInButton.constant = 20
                    self.view.layoutIfNeeded()
                }, completion: {finished in })
            }else{
                UIView.transition(with:pageControl, duration:0.3, options: UIViewAnimationOptions.curveEaseIn, animations: {
                centerConstraintPageControl.constant = bottomView.frame.origin.x
                trailingConstraintSignInButton.constant = -(signInButton.frame.width+100)
                self.view.layoutIfNeeded()
                }, completion: { finished in
                // animation
                })
            }
        }

    }
    
    override func viewDidLayoutSubviews() {
        
        if let pageControl = self.iPageControl,
            let bottomView = self.iBottomView,
            let centerConstraintPageControl = self.iCentralConstraintPageControl,
            let trailingConstraintSignInButton = self.iTrailingConstraintSignInButton,
            let signInButton = self.iSignInButton,
            let scrollView = self.iScrollView {
            
            scrollView.contentOffset = CGPoint(x : CGFloat(scrollView.bounds.size.width)*CGFloat(pageControl.currentPage), y : scrollView.contentOffset.y)
            if (pageControl.currentPage == numberOfPages()-1){
                centerConstraintPageControl.constant = -bottomView.frame.width/2 + pageControl.bounds.size.width/2
                trailingConstraintSignInButton.constant = 20
            }else{
                trailingConstraintSignInButton.constant = -(signInButton.frame.width+100)
            }
            self.view.layoutIfNeeded()
        }
    }
    
    func numberOfPages() -> Int {
        if let pageControl = self.iPageControl {
            return pageControl.numberOfPages //number of pages
        }else{
            return 0
        }
    }

    
    @IBAction func getStartedClicked(sender: UIButton) {
        if let appDetailsDict = GlobalData.fetchAppDetailsDict(),
            let isSocialSignInEnable = appDetailsDict["kSocialSignIn"] as? Bool, isSocialSignInEnable  {
            self.iDelegate?.pushSocialSignInViewFromMainViewController!()
        }else {
            self.iDelegate?.pushLoginViewFromMainViewController!()
        }
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
