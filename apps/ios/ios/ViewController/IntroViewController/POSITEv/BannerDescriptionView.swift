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
    var  iconImage : UIImageView?
    var  headerLable : UILabel?
    var descriptionLabel : UILabel?
        
    func drawBannerDescriptionView(imageName : String) {
        
        /*************Configuring LineView Description ***************/
        
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
            
            // Height constraint : 25% of the "headerLable" height
             let heightConstraint = NSLayoutConstraint(item: headerLable, attribute: NSLayoutAttribute.height, relatedBy: NSLayoutRelation.equal, toItem:self, attribute: NSLayoutAttribute.height, multiplier:0.25, constant: 0.0)
            self.addConstraint(heightConstraint)
            
            
            //top constraint of  "headerLable"
            let topConstraint = NSLayoutConstraint(item: headerLable, attribute: NSLayoutAttribute.top, relatedBy: NSLayoutRelation.equal, toItem:self, attribute: NSLayoutAttribute.top, multiplier:1.0, constant:5.0)
            self.addConstraint(topConstraint)

            
            headerLable.backgroundColor = UIColor.clear
            headerLable.textColor = UIColor.white
            headerLable.textAlignment = NSTextAlignment.center
            headerLable.font = UIFont(name: kBoldFont, size:DeviceMatrixHelper.isIpad ? 34:30)!
            headerLable.numberOfLines = 2
            headerLable.lineBreakMode = NSLineBreakMode.byWordWrapping
            
            if imageName.length > 0 {
                let bgimage: UIImage = UIImage(named: imageName)!
                self.iconImage = UIImageView(image: bgimage)
                if let iconImage = self.iconImage {
                    iconImage.contentMode = UIViewContentMode.scaleAspectFit
                    self.addSubview(iconImage)
                    iconImage.translatesAutoresizingMaskIntoConstraints = false
                    
                    // Width constraint : 100% of the "bannerLabelView" width
                    let iconImageWidthConstraint = NSLayoutConstraint(item:iconImage, attribute: NSLayoutAttribute.width, relatedBy: NSLayoutRelation.equal, toItem:self, attribute: NSLayoutAttribute.width, multiplier:1.0 , constant: 0.0)
                    self.addConstraint(iconImageWidthConstraint)
                    
                    
                    // X coordiante constraint (horizontal)
                    let iconImageXCordinateConstraint = NSLayoutConstraint(item:iconImage, attribute: NSLayoutAttribute.centerX, relatedBy: NSLayoutRelation.equal, toItem:self, attribute: NSLayoutAttribute.centerX, multiplier:1.0, constant: 0.0)
                    self.addConstraint(iconImageXCordinateConstraint)
                    
                    // Height constraint
                    let iconImageHeightConstraint = NSLayoutConstraint(item: iconImage, attribute: NSLayoutAttribute.height, relatedBy: NSLayoutRelation.equal, toItem:self, attribute: NSLayoutAttribute.height, multiplier:0.2, constant:0.0)
                    self.addConstraint(iconImageHeightConstraint)
                    
                    // top constraint (vertical)
                    let iconImageTopConstraint = NSLayoutConstraint(item:iconImage, attribute: NSLayoutAttribute.top, relatedBy: NSLayoutRelation.equal, toItem:headerLable, attribute: NSLayoutAttribute.bottom, multiplier:1.0, constant: 5.0)
                    self.addConstraint(iconImageTopConstraint)
                    iconImage.backgroundColor = UIColor.clear
                }
            }
            self.descriptionLabel = UILabel()
            if let descriptionLabel = self.descriptionLabel {
                self.addSubview(descriptionLabel)
                descriptionLabel.translatesAutoresizingMaskIntoConstraints = false
                
                // Width constraint : 100% of the "bannerLabelView" width
                let descriptionWidthConstraint = NSLayoutConstraint(item:descriptionLabel, attribute: NSLayoutAttribute.width, relatedBy: NSLayoutRelation.equal, toItem:self, attribute: NSLayoutAttribute.width, multiplier:0.7 , constant: 0.0)
                self.addConstraint(descriptionWidthConstraint)
                
                
                // X coordiante constraint (horizontal)
                let descriptionXCordinateConstraint = NSLayoutConstraint(item:descriptionLabel, attribute: NSLayoutAttribute.centerX, relatedBy: NSLayoutRelation.equal, toItem:self, attribute: NSLayoutAttribute.centerX, multiplier:1.0, constant: 0.0)
                self.addConstraint(descriptionXCordinateConstraint)
                
                // // top constraint (vertical)
                let descriptionTopConstraint = NSLayoutConstraint(item:descriptionLabel, attribute: NSLayoutAttribute.top, relatedBy: NSLayoutRelation.equal, toItem: imageName.length > 0 ? iconImage : headerLable, attribute: NSLayoutAttribute.bottom, multiplier:1.0, constant:imageName.length > 0 ? 30.0 : 2.0)
                self.addConstraint(descriptionTopConstraint)
                
                // // bottom constraint (vertical)
                if imageName.length == 0 {
                    let descriptionBottomConstraint = NSLayoutConstraint(item:descriptionLabel, attribute: NSLayoutAttribute.bottom, relatedBy: NSLayoutRelation.equal, toItem: self, attribute: NSLayoutAttribute.bottom, multiplier:1.0, constant:0.0)
                    self.addConstraint(descriptionBottomConstraint)
                }
                
                descriptionLabel.backgroundColor =  UIColor.clear
                descriptionLabel.isUserInteractionEnabled = false
                descriptionLabel.textColor =  UIColor.white
                descriptionLabel.textAlignment = NSTextAlignment.center
                descriptionLabel.font = UIFont(name: kRegularFont, size:DeviceMatrixHelper.isIpad ? 22:17)
                descriptionLabel.numberOfLines = 0
                descriptionLabel.adjustsFontSizeToFitWidth = true
            }
        }
    }
    
    func updateHeaderLabel(aHeaderText : String , aDescriptionText : String) {
        if let headerLabel = self.headerLable {
            headerLabel.text = aHeaderText
        }
        if let descriptionLabel = self.descriptionLabel {
            descriptionLabel.text = aDescriptionText
        }
    }
}


