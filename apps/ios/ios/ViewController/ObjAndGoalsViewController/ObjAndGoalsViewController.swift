//
//  ObjAndGoalsViewController.swift
//  ios
//
//  Created by Sujan Vaidya on 10/23/17.
//  Copyright © 2017 QuestionPro Pvt Ltd. All rights reserved.
//

import UIKit

protocol Closable: NSObjectProtocol {
    func closeView()
    func applyFilter(option: String)
    func editAction()
}

enum GoalContext: String {
    case Status
    case Edit
}

enum GoalStatus: Int {
    case Active = 0, Archived
    
    var title: String! {
        switch self {
        case .Active :
            return "Active"
            
        case .Archived:
            return "Archived"
        }
    }
    
    static var count = 2
}

class ObjAndGoalsViewController: UIViewController {
    
    weak var delegate: Closable!
    
    @IBOutlet weak var navBar: UIView!
    @IBOutlet weak var tableView: UITableView!
    
    var statDict: [String:Any]?
    var context: GoalContext = .Status
    
    override func viewDidLoad() {
        super.viewDidLoad()
        tableView.tableFooterView = UIView()
        setupNavBar()
        detectGoalContext()
    }
    
    override func viewWillAppear(_ animated: Bool) {
        if (context == .Status) {
            let row = selectedRowIndex()
            let selectedIndexPath = IndexPath(row: row, section: 0)
            self.tableView.selectRow(at: selectedIndexPath as IndexPath, animated: true, scrollPosition: .top)
        }
    }
    
    func selectedRowIndex() -> Int {
        var row = 0
        if let statDic = statDict,
            let filterStat = statDic["selected"] as? String {
            switch filterStat {
            case GoalStatus.Active.title.lowercased() :
                row = GoalStatus.Active.rawValue
                
            case GoalStatus.Archived.title.lowercased() :
                row = GoalStatus.Archived.rawValue
                
            default :
                break
            }
        }
        return row
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    
    func detectGoalContext() {
        if let statDic = statDict,
            let key = statDic["context"] as? String {
            context = GoalContext(rawValue: key)!
        }
    }
    
    func setupNavBar() {
        let tapGesture = UITapGestureRecognizer(target: self, action: #selector(self.tapAction))
        self.navBar.addGestureRecognizer(tapGesture)
    }
    
    @objc func tapAction() {
        self.delegate.closeView()
    }
    
    @IBAction func backButtonPressed(_ sender: Any) {
        self.delegate.closeView()
    }
    
}

extension ObjAndGoalsViewController: UITableViewDataSource {
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return context == .Status ? GoalStatus.count : 1
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        switch context {
        case .Status :
            guard let cell = tableView.dequeueReusableCell(withIdentifier: "FilterCell") as? ObjAndGoalsCell else { return UITableViewCell() }
            cell.separatorInset = UIEdgeInsets.zero
            cell.layoutMargins = UIEdgeInsets.zero
            cell.optionTitle.text = GoalStatus(rawValue: indexPath.row)!.title
            let key = GoalStatus(rawValue: indexPath.row)!.title.lowercased()
            if let statDic = statDict,
               let key = statDic[key] as? Int {
                cell.optionValue.text = String(key)
            }
            return cell
            
        case .Edit :
            guard let cell = tableView.dequeueReusableCell(withIdentifier: "EditCell") as? EditCell else { return UITableViewCell() }
            cell.separatorInset = UIEdgeInsets.zero
            cell.layoutMargins = UIEdgeInsets.zero
            cell.selectionStyle = UITableViewCellSelectionStyle.gray
            return cell
        }
    }
}

extension ObjAndGoalsViewController: UITableViewDelegate {
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        switch context {
        case .Status :
            let option = GoalStatus(rawValue: indexPath.row)!.title.lowercased()
            self.delegate.applyFilter(option: option)
            
        case .Edit :
            self.delegate.editAction()
        }
    }
}
