//
//  IntroViewController.swift
//  QuestionProCommunities
//
//  Created by Jignesh Raiyani on 8/16/16.
//  Copyright © 2016 QuestionPro Pvt Ltd. All rights reserved.
//

import UIKit

class IntroViewController: UIViewController, UIScrollViewDelegate {

    @IBOutlet weak var backgroundImageView: UIImageView!
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
            bottomView.backgroundColor = GlobalData.getFooterBGColorForIntroScreen()
        }
        

        if UIDevice().userInterfaceIdiom == .phone &&  UIScreen.main.nativeBounds.height == 2436 {
            
            let appDelegate = UIApplication.shared.delegate as! AppDelegate
            let aVariable = appDelegate.appType
            if aVariable == PocketAppType.QUESTIONPRO_VIZIENTINC_APP{
                self.backgroundImageView.image = UIImage(named: kIntroViewBackground)
            }
            else{
            
            
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
                    let verticalConstraints = NSLayoutConstraint.constraints(withVisualFormat: "V:|-0-[bgImageView]-50-|", options: NSLayoutFormatOptions.init(rawValue: 0), metrics: nil, views: views)
                    self.view.addConstraints(verticalConstraints)
                    
                    //Horizontal constraints
                    let horizontalConstraints = NSLayoutConstraint.constraints(withVisualFormat: "H:|-0-[bgImageView]-0-|", options: NSLayoutFormatOptions.init(rawValue: 0), metrics: nil, views: views)
                    self.view.addConstraints(horizontalConstraints)
                }
                }
            }
        }
        else{
        
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
        }

        if let signInButton = self.iSignInButton {
            self.iSignInButton?.layer.borderWidth = 1.5
            self.iSignInButton?.layer.borderColor = UIColor.white.cgColor
            self.iSignInButton?.titleLabel?.font = GlobalData.getPrimaryFontForButtonTitle()
        }
              /*
         *  The following array contains the data (Banner Header, Banner Description, Banner image name) realted to banners on IntroViewController.
         *  The data is fetched from the localized "Banners.plist" file
         */
        
        if let path = Bundle.main.path(forResource: "Banners", ofType: "plist") ,let  bannerList: NSArray  = NSArray(contentsOfFile: path) {
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

                    // Adding vertical constraints to the container
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
                    //let  bannerDict : NSDictionary = bannerList[i] as? NSDictionary
                    
                    if let bannerDict = bannerList[i] as? [String:Any],
                        let image = bannerDict["image"] as? String,
                        let marketingImage = UIImage(named:(image)) {
                            let pageImageView = UIImageView(image:marketingImage )
                            pageImageView.contentMode = UIViewContentMode.scaleAspectFit
                            container.addSubview(pageImageView)
                            pageImageView.backgroundColor = UIColor.clear
                            pageImageView.translatesAutoresizingMaskIntoConstraints = false

                        
                        /* below condition added by ankit to set the background color of iBottomView,pagecontrol and iSignInButton's text color and border color*/
                        let appDelegate = UIApplication.shared.delegate as! AppDelegate
                        let aVariable = appDelegate.appType
                        if aVariable == PocketAppType.QUESTIONPRO_VIZIENTINC_APP{
                            self.iBottomView?.backgroundColor = iOSAppManager.colorFromHexString(hexString: "#FFEDE6");

                            
                            self.iSignInButton?.setTitleColor(.white, for: .normal)
                            self.iSignInButton?.layer.borderColor = UIColor.clear.cgColor
                            self.iSignInButton?.backgroundColor = UIColor( red: CGFloat(254/255.0), green: CGFloat(77/255.0), blue: CGFloat(0/255.0), alpha: CGFloat(1.0) )
                            
                            self.iPageControl?.onColor = UIColor.gray
                            self.iPageControl?.offColor = UIColor.gray
                        }

                        
                        
                        //Setting constraints for image view
                        let marketingViews = Dictionary(dictionaryLiteral: ("pageImageView",pageImageView))
                        container.addConstraints(NSLayoutConstraint.constraints(withVisualFormat: "H:|-0-[pageImageView]-0-|", options:NSLayoutFormatOptions.init(rawValue:0), metrics: nil, views:marketingViews))

                        let heightConstraint : NSLayoutConstraint?
                        if appDelegate.appType == PocketAppType.MYPINION_APP || appDelegate.appType == PocketAppType.QUESTIONPRO_VIZIENTINC_APP {
                            // Height constraint : 30% of the "bannerLabelView" height
                            heightConstraint = NSLayoutConstraint(item: pageImageView, attribute: NSLayoutAttribute.height, relatedBy: NSLayoutRelation.equal, toItem:container, attribute: NSLayoutAttribute.height, multiplier:0.50, constant: 0.0)
                        }else{
                            // Height constraint : 30% of the "bannerLabelView" height
                            heightConstraint = NSLayoutConstraint(item: pageImageView, attribute: NSLayoutAttribute.height, relatedBy: NSLayoutRelation.equal, toItem:container, attribute: NSLayoutAttribute.height, multiplier:0.20, constant: 0.0)
                        }
                        let topConstraint = NSLayoutConstraint(item: pageImageView, attribute: NSLayoutAttribute.centerY, relatedBy: NSLayoutRelation.equal, toItem:container, attribute: NSLayoutAttribute.centerY, multiplier:0.8, constant: 0.0)
                        container.addConstraint(topConstraint)
                        if let constraint = heightConstraint {
                            container.addConstraint(constraint)
                        }
                    }
                    let bannerView = BannerDescriptionView()
                    bannerView.translatesAutoresizingMaskIntoConstraints = false
                    bannerView.drawBannerDescriptionView()
                    if let bannerDict = bannerList[i] as? [String:Any],
                        let headerText = bannerDict["header"] as? String, let descriptionText = bannerDict["description"] as? String  {
                        bannerView.updateHeaderLabel(aHeaderText: headerText ,aDescriptionText:descriptionText)
                    }
                    bannerView.backgroundColor = UIColor.clear

                    /*************Configuring Banner Label View ***************/
                    // Width constraint : 95% of the "container" width
                    container.addSubview(bannerView)
                    container.addConstraint(NSLayoutConstraint(item: bannerView, attribute: NSLayoutAttribute.width, relatedBy: NSLayoutRelation.equal, toItem:container, attribute: NSLayoutAttribute.width, multiplier:0.70 , constant: 0.0))

                    // Height constraint : 55% of the "container" height
                    container.addConstraint(NSLayoutConstraint(item: bannerView, attribute: NSLayoutAttribute.height, relatedBy: NSLayoutRelation.equal, toItem:container, attribute: NSLayoutAttribute.height, multiplier:0.55 , constant: 0.0))


                    // X coordiante constraint (horizontal)
                    container.addConstraint(NSLayoutConstraint(item: bannerView, attribute: NSLayoutAttribute.centerX, relatedBy: NSLayoutRelation.equal, toItem:container, attribute: NSLayoutAttribute.centerX, multiplier:1.0 , constant: 0.0))


                    // Y coordiante constraint (vertical)
                    container.addConstraint(NSLayoutConstraint(item: bannerView, attribute: NSLayoutAttribute.centerY, relatedBy: NSLayoutRelation.equal, toItem:container, attribute: NSLayoutAttribute.centerY, multiplier:1.5, constant: 0.0))


                }

                //Adding right edge constraints to last banner view
                let preViews = Dictionary(dictionaryLiteral: ("previousContainer",previousContainer))
                    scrollView.addConstraints(NSLayoutConstraint.constraints(withVisualFormat: "H:[previousContainer]-0-|", options:NSLayoutFormatOptions.init(rawValue:0), metrics: nil, views:preViews))
                }
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
    
    @objc func pageControlClicked(sender: UIPageControl) {
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
    
    @IBAction func signInClicked(_ sender: Any) {
        if let appDetailsDict = GlobalData.fetchAppDetailsDict(),
            let isSocialSignInEnable = appDetailsDict["kSocialSignIn"] as? Bool, isSocialSignInEnable  {
                self.iDelegate?.pushSocialSignInViewFromMainViewController!()
            }else {
                self.iDelegate?.pushLoginViewFromMainViewController!()
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
}
