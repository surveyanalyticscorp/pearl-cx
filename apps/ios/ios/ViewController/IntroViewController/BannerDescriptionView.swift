//
//  BannerDescriptionView.swift
//  QuestionProCommunities
//
//  Created by Jignesh Raiyani on 8/16/16.
//  Copyright © 2016 QuestionPro Pvt Ltd. All rights reserved.
//

import UIKit

class BannerDescriptionView: UIView {
    var  lineView : UIView?
    var  headerLable : UILabel?
    var  sepratorLabel : UILabel?
    var descriptionLabel : UILabel?

    func drawBannerDescriptionView() {
        
         let appDelegate = UIApplication.shared.delegate as! AppDelegate
        
        /*************Configuring LineView Description ***************/
        
        self.lineView = UIView()
        if let lineView = self.lineView {
            self.addSubview(lineView)
            lineView.translatesAutoresizingMaskIntoConstraints = false
        
        // Width constraint : 100% of the "bannerLabelView" width
        let lineViewWidthConstraint = NSLayoutConstraint(item:lineView, attribute: NSLayoutAttribute.width, relatedBy: NSLayoutRelation.equal, toItem:self, attribute: NSLayoutAttribute.width, multiplier:0.7 , constant: 0.0)
        self.addConstraint(lineViewWidthConstraint)
        
        
        // X coordiante constraint (horizontal)
        let lineViewXCordinateConstraint = NSLayoutConstraint(item:lineView, attribute: NSLayoutAttribute.centerX, relatedBy: NSLayoutRelation.equal, toItem:self, attribute: NSLayoutAttribute.centerX, multiplier:1.0, constant: 0.0)
        self.addConstraint(lineViewXCordinateConstraint)
        
        // Height constraint
        let lineViewHeightConstraint = NSLayoutConstraint(item: lineView, attribute: NSLayoutAttribute.height, relatedBy: NSLayoutRelation.equal, toItem:self, attribute: NSLayoutAttribute.height, multiplier:0.0, constant: 2.0)
        self.addConstraint(lineViewHeightConstraint)
        
        // // Y coordiante constraint (vertical)
        let lineViewTopConstraint = NSLayoutConstraint(item:lineView, attribute: NSLayoutAttribute.centerY, relatedBy: NSLayoutRelation.equal, toItem:self, attribute: NSLayoutAttribute.centerY, multiplier:0.3, constant: 0.0)
        self.addConstraint(lineViewTopConstraint)
        if appDelegate.appType == PocketAppType.HEALTHTRUST_APP || appDelegate.appType == PocketAppType.HEALTHTRUST_COLLABORATIVES {
            lineView.backgroundColor = GlobalData.getLineViewBGColorForIntroScreen()
        }else {
            lineView.backgroundColor = UIColor.clear
        }
    }

        self.headerLable = UILabel()
        if let headerLable = self.headerLable {
            self.addSubview(headerLable)
            headerLable.translatesAutoresizingMaskIntoConstraints = false
            
            // Width constraint : 100% of the "bannerLabelView" width
            let widthConstraint = NSLayoutConstraint(item: headerLable, attribute: NSLayoutAttribute.width, relatedBy: NSLayoutRelation.equal, toItem:self, attribute: NSLayoutAttribute.width, multiplier:1.0 , constant: 0.0)
            self.addConstraint(widthConstraint)
            
            // X coordiante constraint (horizontal)
            let xCordinateConstraint = NSLayoutConstraint(item: headerLable, attribute: NSLayoutAttribute.centerX, relatedBy: NSLayoutRelation.equal, toItem:self, attribute: NSLayoutAttribute.centerX, multiplier:1.0, constant: 0.0)
            self.addConstraint(xCordinateConstraint)
            
            // Height constraint : 30% of the "bannerLabelView" height
             let heightConstraint = NSLayoutConstraint(item: headerLable, attribute: NSLayoutAttribute.height, relatedBy: NSLayoutRelation.equal, toItem:self, attribute: NSLayoutAttribute.height, multiplier:0.25, constant: 0.0)
            self.addConstraint(heightConstraint)
            
            
            // Pinning the center of the header label to the center of the "bannerLabelView"
            let topConstraint = NSLayoutConstraint(item: headerLable, attribute: NSLayoutAttribute.top, relatedBy: NSLayoutRelation.equal, toItem:lineView, attribute: NSLayoutAttribute.bottom, multiplier:1.0, constant: 30.0)
            self.addConstraint(topConstraint)
            
            headerLable.backgroundColor = UIColor.clear
           
            if appDelegate.appType == PocketAppType.MYPINION_APP{
                headerLable.textColor = iOSAppManager.colorFromHexString(hexString: "#FFCE00");
            }else {
                headerLable.textColor = UIColor.white
            }
            
            headerLable.textAlignment = NSTextAlignment.center
            headerLable.font = GlobalData.getPrimaryFontForIntroTitle()
            headerLable.numberOfLines = 2
            headerLable.lineBreakMode = NSLineBreakMode.byWordWrapping
        
        }
        
        /* below seprator label code is added by ankit for design update for vizient app i.e. adding a label yellow colored in between header and description */
        
        /*************Configuring Seprator Label ***************/

        if appDelegate.appType == PocketAppType.QUESTIONPRO_VIZIENTINC_APP {

            self.sepratorLabel = UILabel()
            self.sepratorLabel?.layer.masksToBounds = true
            self.sepratorLabel?.layer.cornerRadius = 4
            self.sepratorLabel?.backgroundColor = iOSAppManager.colorFromHexString(hexString: "#FABE42");

            if let sepratorLabel = self.sepratorLabel {
                self.addSubview(sepratorLabel)
                sepratorLabel.translatesAutoresizingMaskIntoConstraints = false
            
                // Width constraint : 100% of the "bannerLabelView" width
                let widthConstraintForSepratorLabel = NSLayoutConstraint(item: sepratorLabel, attribute: NSLayoutAttribute.width, relatedBy: NSLayoutRelation.equal, toItem:self, attribute: NSLayoutAttribute.width, multiplier:0.80 , constant: 0.0)
                self.addConstraint(widthConstraintForSepratorLabel)
            
                // X coordiante constraint (horizontal)
                let xCordinateConstraintForSepratorLabel = NSLayoutConstraint(item: sepratorLabel, attribute: NSLayoutAttribute.centerX, relatedBy: NSLayoutRelation.equal, toItem:self, attribute: NSLayoutAttribute.centerX, multiplier:1.0, constant: 0.0)
                self.addConstraint(xCordinateConstraintForSepratorLabel)

                // Height constraint : 30% of the "bannerLabelView" height
                let heightConstraintForSepratorLabel = NSLayoutConstraint(item: sepratorLabel, attribute: NSLayoutAttribute.height, relatedBy: NSLayoutRelation.equal, toItem:self, attribute: NSLayoutAttribute.height, multiplier:0.015, constant: 0.0)
                self.addConstraint(heightConstraintForSepratorLabel)

                // Pinning the center of the header label to the center of the "bannerLabelView"
                    let topConstraintForSepratorLabel = NSLayoutConstraint(item: sepratorLabel, attribute: NSLayoutAttribute.top, relatedBy: NSLayoutRelation.equal, toItem:headerLable, attribute: NSLayoutAttribute.bottom, multiplier:DeviceMatrixHelper.isIpad ? 0.80 : 0.30, constant: DeviceMatrixHelper.isIpad ? 10.0 : 90.0)
                    self.addConstraint(topConstraintForSepratorLabel)
            }
        }
           /*************Configuring Banner Description ***************/
        
        self.descriptionLabel = UILabel()
        if let descriptionLabel = self.descriptionLabel {
            self.addSubview(descriptionLabel)
            descriptionLabel.translatesAutoresizingMaskIntoConstraints = false
            
            // Width constraint : 100% of the "bannerLabelView" width
            let descriptionWidthConstraint = NSLayoutConstraint(item:descriptionLabel, attribute: NSLayoutAttribute.width, relatedBy: NSLayoutRelation.equal, toItem:self, attribute: NSLayoutAttribute.width, multiplier:1.0 , constant: 0.0)
            self.addConstraint(descriptionWidthConstraint)
            
            
            // X coordiante constraint (horizontal)
            let descriptionXCordinateConstraint = NSLayoutConstraint(item:descriptionLabel, attribute: NSLayoutAttribute.centerX, relatedBy: NSLayoutRelation.equal, toItem:self, attribute: NSLayoutAttribute.centerX, multiplier:1.0, constant: 0.0)
            self.addConstraint(descriptionXCordinateConstraint)
            
            // // Y coordiante constraint (vertical)
            let descriptionTopConstraint = NSLayoutConstraint(item:descriptionLabel, attribute: NSLayoutAttribute.top, relatedBy: NSLayoutRelation.equal, toItem:headerLable, attribute: NSLayoutAttribute.bottom, multiplier:1.0, constant: 10.0)
            self.addConstraint(descriptionTopConstraint)
            
            descriptionLabel.backgroundColor = UIColor.clear
            descriptionLabel.isUserInteractionEnabled = false
            descriptionLabel.textColor = UIColor.white
            descriptionLabel.textAlignment = NSTextAlignment.center
            descriptionLabel.font = GlobalData.getPrimaryFontForIntroSubTitle()
            descriptionLabel.lineBreakMode = NSLineBreakMode.byWordWrapping
            descriptionLabel.numberOfLines = 0
        }
}

    func updateHeaderLabel(aHeaderText : String , aDescriptionText : String) {
        self.headerLable?.text=aHeaderText as String
        self.descriptionLabel?.text=aDescriptionText as String
    }
}


