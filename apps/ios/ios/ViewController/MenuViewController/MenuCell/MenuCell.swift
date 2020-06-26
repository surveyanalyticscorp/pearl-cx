//
//  MenuCell.swift
//  QuestionProCommunities
//
//  Created by Jignesh Raiyani on 9/9/16.
//  Copyright © 2016 QuestionPro Pvt Ltd. All rights reserved.
//

import UIKit

class MenuCell: UITableViewCell {

    @IBOutlet weak var iNameLabel: UILabel!
    @IBOutlet weak var iInfoLabel: UILabel!
    @IBOutlet weak var iSelectionView: UIView!
    
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
        self.iSelectionView.backgroundColor = selected ? GlobalData.getSelectionColorForMainMenu() : UIColor.clear
        self.iNameLabel.textColor =  GlobalData.getPrimaryFontColorForMainMenu()
        self.iInfoLabel.textColor =  GlobalData.getPrimaryFontColorForMainMenu()
        
        let selectionView = UIView()
        selectionView.backgroundColor = GlobalData.getTableViewCellSelectionColorForMainMenu()
        self.selectedBackgroundView = selectionView
        
    }
    
}
