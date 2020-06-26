//
//  iOSAppManager.swift
//  ios
//
//  Created by Jignesh Raiyani on 9/27/16.
//  Copyright © 2016 QuestionPro Pvt Ltd. All rights reserved.
//

import UIKit

class iOSAppManager: NSObject {

    // MARK: HexString to UIColor conversion.
    
    /*
     *  @Author         : Jignesh Raiyani
     *  @Description    : Use this method to convert Hexstring to UIColor .
     */
    
    class func colorFromHexString(hexString: String, alpha:CGFloat? = 1.0) -> UIColor {
        // Convert hex string to an integer
        let hexint = Int(colorInteger(fromHexString: hexString))
        let red = CGFloat((hexint & 0xff0000) >> 16) / 255.0
        let green = CGFloat((hexint & 0xff00) >> 8) / 255.0
        let blue = CGFloat((hexint & 0xff) >> 0) / 255.0
        let alpha = alpha!
        
        // Create color object, specifying alpha as well
        let color = UIColor(red: red, green: green, blue: blue, alpha: alpha)
        return color
    }
    
    private static func colorInteger(fromHexString: String) -> UInt32 {
        var hexInt: UInt32 = 0
        // Create scanner
        let scanner: Scanner = Scanner(string: fromHexString)
        // Tell scanner to skip the # character
        scanner.charactersToBeSkipped = CharacterSet(charactersIn: "#")
        // Scan hex value
        scanner.scanHexInt32(&hexInt)
        return hexInt
    }
    
//    // MARK: UIColor to UIImage conversion.
//
//    /*
//     *  @Author         : Jignesh Raiyani
//     *  @Description    : Use this method for UIColor to UIImage conversion .
//     */
//
//    class func imageFromColor(colour: UIColor) -> UIImage {
//        let rect = CGRectMake(0, 0, 1, 1)
//        UIGraphicsBeginImageContext(rect.size)
//        let context = UIGraphicsGetCurrentContext()
//        CGContextSetFillColorWithColor(context!, colour.CGColor)
//        CGContextFillRect(context!, rect)
//        let image = UIGraphicsGetImageFromCurrentImageContext()
//        UIGraphicsEndImageContext()
//        return image!
//    }

}
