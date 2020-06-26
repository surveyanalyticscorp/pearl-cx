import React, {Component} from 'react';
import {
    View,
    TouchableWithoutFeedback, Dimensions,
} from 'react-native';
import styles from "../homePage/askedQuestionsListStyle";
import StringUtils from "../../../../global/StringUtils";
import {utils} from "../../../../global/Utils";
import CustomText from "../../../../global/ui/CustomText";
import Icon from 'react-native-vector-icons/MaterialIcons'
const CachedImage = require('../../../../global/ImageCache/CachedImage');
const DEFAULT_USER_PROFILE_IMAGE = "https://www.gravatar.com/avatar/7a79e386b9faba5ca3b8a4f779a04c2b.jpg?s=200&d=mm";
const {height, width} = Dimensions.get('window');
const factor = width > height ? height : width;
export default class QuestionRow extends Component{
    constructor(props){
        super(props);
    }

    getImageURL(url) {
        if (url && StringUtils.isNotEmpty(url)) {
            if (utils.isURLAbsolute(url)) return ({uri: url});
            return {uri: global.BASE_URL + url};
        }
        return undefined;
    }


    getMemberDetails (item) {
        let memberName = '';
        if(item.panelMember.name && item.panelMember.name !== null) {
            memberName = item.panelMember.name;
        }
        return memberName;
    }

    render(){
        const{item,key, rightIcon, rightIconClickable} = this.props;
        let shouldShowRightIcon = false;

        if(rightIcon && rightIcon !== '') {
            shouldShowRightIcon = true;
        }

        if (rightIcon && rightIcon === 'delete') {
            //If panelMember id matches with current user then only show delete icon
           shouldShowRightIcon = item.panelMember.ID === global.appUser.ID;
        }
        let questionTextWidth = shouldShowRightIcon ? {width: Math.round(factor * 0.60)} : {width: Math.round(factor * 0.65)};
        return (
            <View style={{flexDirection: 'row', flex: 1, justifyContent: 'space-between'}}>
                <TouchableWithoutFeedback key={key} onPress={() => {
                    this.props.onPress && this.props.onPress(key, item.id);
                }}>
                    <View
                        style={styles.rowItemStyle}>
                        <View style={styles.imageContainer}>
                            <CachedImage style={styles.profileImage}
                                         source={this.getImageURL(item.panelMember.profilePicURL)}
                                         isProfilePic={true}/>
                        </View>
                        <View style={{justifyContent: 'center',padding:10}}>
                            <CustomText style={[styles.questionTextStyle, questionTextWidth]}>
                                {item.text}
                            </CustomText>
                            <CustomText style={styles.questionOwnerNameStyle}>
                                {this.getMemberDetails(item)}
                            </CustomText>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
                <View style={{justifyContent: 'center',}}>
                    {
                        shouldShowRightIcon && <TouchableWithoutFeedback
                            onPress={() => { rightIconClickable && this.props.onPressRightIcon && this.props.onPressRightIcon(key, item.id)}} >
                            <Icon name={rightIcon} size={24} color={'grey'} style={{justifyContent: 'center',
                                margin: 15, }}/>
                        </TouchableWithoutFeedback>
                    }
                </View>
            </View>
        );
    }
}

