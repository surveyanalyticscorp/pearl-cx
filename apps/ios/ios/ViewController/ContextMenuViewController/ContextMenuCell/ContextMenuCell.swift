//
//  ContextMenuCell.swift
//  QuestionProCommunities
//
//  Created by Jignesh Raiyani on 9/9/16.
//  Copyright © 2016 QuestionPro Pvt Ltd. All rights reserved.
//

import UIKit

class ContextMenuCell: UITableViewCell {

    @IBOutlet weak var iQuestionTextLabel: UITextView!
    @IBOutlet weak var iResponseTextLabel: UITextView!
    @IBOutlet weak var iTimeStampLabel: UITextView!
    @IBOutlet weak var iSelectionView: UIView!
    
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
        self.iSelectionView.backgroundColor = selected ? GlobalData.getSelectionColorForMainMenu() : UIColor.clear
        
        self.iQuestionTextLabel.font = GlobalData.getPrimaryFontForContextMainMenu()
        self.iQuestionTextLabel.textColor = GlobalData.getPrimaryFontColorForMainMenu()
        self.iQuestionTextLabel.textContainer.maximumNumberOfLines = 3
        self.iQuestionTextLabel.isUserInteractionEnabled = false
        
        self.iTimeStampLabel.font = GlobalData.getSecondaryFontForMainMenu()
        self.iTimeStampLabel.textColor =  GlobalData.getSecondaryFontColorForMainMenu()
        self.iTimeStampLabel.textContainer.maximumNumberOfLines = 1
        self.iTimeStampLabel.isUserInteractionEnabled = false

        
        self.iResponseTextLabel.font = GlobalData.getSecondaryFontForMainMenu()
        self.iResponseTextLabel.textColor = GlobalData.getSecondaryFontColorForMainMenu()
        self.iResponseTextLabel.textContainer.lineBreakMode = NSLineBreakMode.byTruncatingTail
        self.iResponseTextLabel.textContainer.maximumNumberOfLines = 1
        self.iResponseTextLabel.isUserInteractionEnabled = false

        
        let selectionView = UIView()
        selectionView.backgroundColor = GlobalData.getTableViewCellSelectionColor()
        self.selectedBackgroundView = selectionView
                
    }
    
}
