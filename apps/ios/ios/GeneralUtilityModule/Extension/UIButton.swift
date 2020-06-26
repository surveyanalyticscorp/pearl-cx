//
//  UIButton.swift
//  ios
//
//  Created by Jignesh Raiyani on 10/20/16.
//  Copyright © 2016 QuestionPro Pvt Ltd. All rights reserved.
//

import Foundation
import UIKit

extension UIButton {
    func underlineButton(text: String) {
        let titleString = NSMutableAttributedString(string: text)
        titleString.addAttribute(NSAttributedStringKey.underlineStyle, value: NSUnderlineStyle.styleSingle.rawValue, range: NSMakeRange(0, text.characters.count))
        titleString.addAttribute(NSAttributedStringKey.foregroundColor, value:UIColor.white, range: NSMakeRange(0, text.characters.count))
        self.setAttributedTitle(titleString, for:UIControlState.normal)
    }
    
    func roundCornersWithLayerMask(cornerRadii: CGFloat, corners: UIRectCorner) {
        let path = UIBezierPath(roundedRect: bounds,byRoundingCorners: corners,
                                cornerRadii: CGSize(width: cornerRadii, height: cornerRadii))
        let maskLayer = CAShapeLayer()
        maskLayer.path = path.cgPath
        layer.mask = maskLayer
    }
}
