//
//  DropperDelegate.swift
//  Pods
//
//  Created by Ozzie Kirkby on 2016-05-14.
//
//

import Foundation

public protocol DropperDelegate {
    func DropperSelectedRow(_ path: IndexPath, contents: NSDictionary)
    func DropperSelectedRow(_ path: IndexPath, contents: NSDictionary, tag: Int)
}

public extension DropperDelegate {
    func DropperSelectedRow(_ path: IndexPath, contents: NSDictionary) {}
    func DropperSelectedRow(_ path: IndexPath, contents: NSDictionary, tag: Int) {}
}
