//
//  GMDCircleLoader.swift
//  MobileCXFramework
//
//  Created by Prasad on 30/07/24.
//

import Foundation
import UIKit

public class GMDCircleLoader: UIView {
    public let GMD_SPINNER_COLOR = UIColor(red: 0.129, green: 0.455, blue: 0.627, alpha: 1.0)
    public static let GMD_SPINNER_FRAME = CGRect(x: 40.0, y: 40.0, width: 40.0, height: 40.0)
    public let GMD_SPINNER_IMAGE = CGRect(x: 15.0, y: 15.0, width: 30.0, height: 30.0)
    public let GMD_IMAGE = UIImage(named: "image")
    public let GMD_SPINNER_LINE_WIDTH = max(100.0 * 0.025, 1.0)
    
    public var backgroundLayer: CAShapeLayer!
    public var isSpinning: Bool = false

    //-----------------------------------
    // Add the loader to view
    //-----------------------------------
    public static func setOnView(_ view: UIView, withTitle title: String, animated: Bool) -> GMDCircleLoader {
        let hud = GMDCircleLoader(frame: GMD_SPINNER_FRAME)
        
        // You can add an image to the center of the spinner view
        // let img = UIImageView(frame: GMD_SPINNER_IMAGE)
        // img.image = GMD_IMAGE
        // hud.center = img.center
        // hud.addSubview(img)
        
        // let label = UILabel(frame: CGRect(x: -70.0, y: 40.0, width: 200.0, height: 42.0))
        // label.font = UIFont.boldSystemFont(ofSize: 18.0)
        // label.textColor = GMD_SPINNER_COLOR
        // label.textAlignment = .center
        // label.text = title
        // hud.addSubview(label)
        
        hud.start()
        view.addSubview(hud)
        let height = view.frame.size.height
        let width = view.frame.size.width
        let center = CGPoint(x: width / 2, y: height / 2)
        hud.center = center
        return hud
    }

    //------------------------------------
    // Hide the loader in view
    //------------------------------------
    public static func hideFromView(_ view: UIView, animated: Bool) -> Bool {
        if let hud = HUDForView(view) {
            hud.stop()
            hud.removeFromSuperview()
            return true
        }
        return false
    }

    //------------------------------------
    // Perform search for loader and hide it
    //------------------------------------
    public static func HUDForView(_ view: UIView) -> GMDCircleLoader? {
        for subview in view.subviews {
            if let hud = subview as? GMDCircleLoader {
                return hud
            }
        }
        return nil
    }

    //------------------------------------
    // Initialization
    //------------------------------------
    override init(frame: CGRect) {
        super.init(frame: frame)
        setup()
    }

    required init?(coder: NSCoder) {
        super.init(coder: coder)
        setup()
    }

    //------------------------------------
    // Setup
    //------------------------------------
    public func setup() {
        self.backgroundColor = .clear
        let GMD_SPINNER_COLOR = UIColor(red: 0.129, green: 0.455, blue: 0.627, alpha: 1.0)
        let GMD_SPINNER_FRAME = CGRect(x: 40.0, y: 40.0, width: 40.0, height: 40.0)
        let GMD_SPINNER_IMAGE = CGRect(x: 15.0, y: 15.0, width: 30.0, height: 30.0)
        let GMD_IMAGE = UIImage(named: "image")
        let GMD_SPINNER_LINE_WIDTH = max(self.frame.size.width * 0.025, 1.0)
        //---------------------------
        // Round Progress View
        //---------------------------
        backgroundLayer = CAShapeLayer()
        backgroundLayer.strokeColor = GMD_SPINNER_COLOR.cgColor
        backgroundLayer.fillColor = self.backgroundColor?.cgColor
        backgroundLayer.lineCap = .round
        backgroundLayer.lineWidth = GMD_SPINNER_LINE_WIDTH
        self.layer.addSublayer(backgroundLayer)
    }

    public override func draw(_ rect: CGRect) {
        //-------------------------
        // Make sure layers cover the whole view
        //-------------------------
        backgroundLayer.frame = self.bounds
    }

    //------------------------------------
    // Drawing
    //------------------------------------
    public  func drawBackgroundCircle(partial: Bool) {
        let startAngle = -CGFloat.pi / 2 // 90 Degrees
        var endAngle = 2 * CGFloat.pi + startAngle
        let center = CGPoint(x: self.bounds.size.width / 2, y: self.bounds.size.height / 2)
        let radius = (self.bounds.size.width - GMD_SPINNER_LINE_WIDTH) / 2
        
        //----------------------
        // Begin draw background
        //----------------------
        let processBackgroundPath = UIBezierPath()
        processBackgroundPath.lineWidth = GMD_SPINNER_LINE_WIDTH
        
        //---------------------------------------
        // Make end angle to 90% of the progress
        //---------------------------------------
        if partial {
            endAngle = 1.8 * CGFloat.pi + startAngle
        }
        processBackgroundPath.addArc(withCenter: center, radius: radius, startAngle: startAngle, endAngle: endAngle, clockwise: true)
        backgroundLayer.path = processBackgroundPath.cgPath
    }

    //------------------------------------
    // Spin
    //------------------------------------
    public func start() {
        isSpinning = true
        drawBackgroundCircle(partial: true)
        
        let rotationAnimation = CABasicAnimation(keyPath: "transform.rotation.z")
        rotationAnimation.toValue = NSNumber(value: Double.pi * 2.0)
        rotationAnimation.duration = 1
        rotationAnimation.isCumulative = true
        rotationAnimation.repeatCount = .greatestFiniteMagnitude
        backgroundLayer.add(rotationAnimation, forKey: "rotationAnimation")
    }

    public func stop() {
        drawBackgroundCircle(partial: false)
        backgroundLayer.removeAllAnimations()
        isSpinning = false
    }
}


