//
//  QPProtocol.swift
//  QuestionProCommunities
//
//  Created by Jignesh Raiyani on 9/1/16.
//  Copyright © 2016 QuestionPro Pvt Ltd. All rights reserved.
//

import Foundation

@objc protocol MainViewDelegate {
    
    @objc optional func pushLoginViewFromMainViewController() -> Void
    @objc optional func pushSocialSignInViewFromMainViewController() -> Void
    @objc optional func pushHomeViewFromMainViewController() -> Void
    @objc optional func popLoginView() -> Void
}


@objc protocol MMDrawerContollerDelegate {
    
    @objc optional func disableRightDrawer() -> Void
    @objc optional func enableRightDrawer() -> Void
    @objc optional func openLeftMenu() -> Void
    @objc optional func openRightMenu() -> Void
    @objc optional func rightMenuItemClicked(eventData : NSDictionary) -> Void
    @objc optional func reloadCenterDrawer() -> Void
    @objc optional func loadProfileScreen(profileData : String, aTitle : String) -> Void
    
}

