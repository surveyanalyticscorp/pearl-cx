import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    TouchableHighlight,
    Text
} from 'react-native';
import CustomText from '../ui/CustomText';
import colorCodes from './typography/ColorCodes';
import Font from './typography/Font';
import TimeAgo from '../TimeAgo';

export default class DiscussionItemWidget extends Component {
    constructor(props) {
        super(props);
        this.discussion = this.props.discussionData;
    }
    render() {
        return (

            <TouchableHighlight onPress={this.props.onPress}
                activeOpacity={0.6}
                underlayColor={'#CCCCCC'}>
                <View style={styles.mainContainer}>

                    <CustomText style={styles.title} numberOfLines={1} ellipsizeMode='tail'>
                        {this.discussion.name}
                    </CustomText>


                    <View style={styles.subTitleContainer} >
                        <CustomText style={[styles.comment,{flex:1}]}>
                            {(this.discussion.commentCount) +' '+ this.props.commentText}
                        </CustomText>
                        <View style={{ flexDirection: 'row', flex: 1}}>
                            <CustomText numberOfLines={1} style={styles.comment}>
                                {this.props.lastCommentText +": " || 'Last Comment: '}
                            </CustomText>
                            {
                                this.getLastCommentTime()
                            }
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }

    getLastCommentTime() {
        if (this.discussion.lastCommentOn === 'N/A') {
            return (<CustomText numberOfLines={1} style={styles.comment}>
                N/A
                        </CustomText>)
        }
        
        return (<TimeAgo style={styles.comment} time={+this.discussion.lastCommentOn} />);
    }
}

// DiscussionItemWidget.defaultProps = {
//     title: React.PropTypes.string,
//     comment: React.PropTypes.string,
//     subTitle: React.PropTypes.string,
//     lastCommentTimestamp: React.PropTypes.string,
// };

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: '#FFFFFF',
        flex: 1,
        padding: 10,
        
        marginLeft: 0,
        marginRight: 0
    },

    subTitleContainer: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'row',
        paddingHorizontal: 10
    },
    title: {
        color: '#393939',
        fontSize: global.h2FontSize,
        textAlign: 'left',
        flex:1,
        margin:10,
        fontFamily: global.boldText
    },
    subtitle: {
        fontSize: global.h2FontSize,
        color: '#646A70',
        textAlign: 'left',
        fontFamily: global.primaryText
    },
    comment: {
        fontSize: global.h4FontSize,
        color: '#b0b0b0',
        
        textAlign: 'left',
        fontFamily: global.lightText,
        paddingVertical: 1
    },
});