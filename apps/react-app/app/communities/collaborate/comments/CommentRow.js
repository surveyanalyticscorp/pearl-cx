import React, {Component} from 'react';
import {Dimensions, Platform, StyleSheet, TouchableHighlight, TouchableWithoutFeedback, View} from 'react-native';
import CustomText from "../../../global/ui/CustomText";
import EditDeleteContextMenu from '../../../global/widgets/popup-menu/EditDeleteContextMenu';
import Icon from 'react-native-vector-icons/MaterialIcons'
import {utils} from '../../../global/Utils';
import * as colorCodes from '../../../global/widgets/typography/ColorCodes';
import StringUtils from "../../../global/StringUtils";
import {Actions} from "react-native-router-flux";
import I18n from "react-native-i18n";

const CachedImage = require('../../../global/ImageCache/CachedImage');
const {height, width} = Dimensions.get('window');

const factor = width > height ? height : width;

export default class CommentRow extends Component {
    constructor(props) {
        super(props);
    }

    getImageURL(url) {
        if (url && StringUtils.isNotEmpty(url)) {
            if (utils.isURLAbsolute(url)) return ({uri: url});
            return {uri: global.BASE_URL + url};
        }
        return undefined;
    }

    render() {
        const {comment, isChild} = this.props;


        return (
            <View style={[styles.container, {marginHorizontal: isChild? 0 : 20 }]}>
                <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
                    {this.renderAuthorProfileImage(comment)}
                    {this.renderCommentContent(comment)}
                    {this.renderContextMenu(comment)}
                </View>
                <View>
                    {this.renderChildComments(comment)}
                </View>
            </View>
        )
    }

    renderChildComments(comment) {
        if(!this.props.isDetailComment && comment.childComments && comment.childComments.length > 0) {
            let childComments = comment.childComments.slice(0, 2).map((item, index) => {
                return (<CommentRow key={"child_"+item.commentID} comment={item} isReply isChild
                                    onCommentDelete={this.props.onCommentDelete}
                                    onCommentEdit={this.props.onCommentEdit}
                                />)
            });
            return (<View style={{marginLeft: 40}}>
                {childComments}
            </View>);
        }
        return null;
    }

    renderAuthorProfileImage(comment) {
        let profileImage = StringUtils.isNotEmpty(comment.author.profileImage) ? (this.getImageURL(comment.author.profileImage)) :
            (Platform.OS != 'ios' ? require('../../../global/images/communities/place_holder.png') : {uri: 'place_holder.png'})
        return (
            <View style={{marginTop: 10}}>
                <CachedImage style={styles.profileImage} source={profileImage}
                             isProfilePic={false}/>
            </View>
        )
    }

    renderContextMenu(comment) {
        return !this.props.isDetailComment &&
            comment.panelMemberID === global.appUser.ID &&
            <View style={{marginTop: 10}}>
                <EditDeleteContextMenu
                    onEdit={() => {
                        console.log("On Edit");
                        console.log("Image url - "+ comment.imageURL);
                        console.log("Image URL- "+ this.getImageURL(comment.imageURL))
                        this.props.onCommentEdit(comment, this.getImageURL(comment.author.profileImage),
                            this.getImageURL(comment.imageURL));
                    }}
                    onDelete={() => {
                        this.props.onCommentDelete(comment);
                        console.log("On Delete");
                    }}/>
            </View>;
    }

    renderAuthorNameAndCommentText(comment) {
        return (
            <View style={{backgroundColor: '#e8e8e8', borderRadius: 10, padding: 10}}>
                <CustomText numberOfLines={1}
                            style={[styles.title, {
                                alignSelf: 'stretch',
                                color: global.tertiaryFontColorForCommunities
                            }]}>
                    {comment.author.fullName}
                </CustomText>
                {StringUtils.isNotEmpty(comment.commentText) &&
                <CustomText numberOfLines={0} style={[ styles.subtitle, colorCodes.primaryFontColor]}>
                    {comment.commentText}
                </CustomText>
                }
            </View>
        )
    }

    renderCommentContent(comment) {
        const imageURL = this.getImageURL(comment.imageURL);
        return (
            <View style={{flex: 1, marginHorizontal: 10}}>
                {this.renderAuthorNameAndCommentText(comment)}
                {this.renderCommentImage(comment, imageURL)}
                {this.renderCommentFooter(comment)}
            </View>
        );
    }


    renderCommentFooter(comment) {
        return (
            <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginHorizontal:10, marginVertical:5}}>
                <CustomText numberOfLines={1}
                            style={[styles.smallText, colorCodes.secondaryFontColor]}>
                    {comment.creationTimeStamp}
                </CustomText>
                {this.renderReplyButton(comment)}
            </View>
        )
        return
    }

    renderReplyButton(comment){

        return !this.props.isReply && !this.props.isDetailComment &&
            (
                <TouchableHighlight
                    activeOpacity={0.9}
                    onPress={() => {
                        this.props.openCommentReply(this.props.comment);
                    }}
                    underlayColor={'#CCCCCC'}>
                    <View style={{marginHorizontal:20, alignItems: 'center', flexDirection: 'row'}}>
                        <Icon
                            name='reply'
                            size={20}
                            color={'grey'}
                        />

                        <CustomText
                            style={[styles.subtitle, {
                                fontSize: global.h5FontSize,
                                marginLeft: 5,
                                textAlign: 'center'
                            }]}>{I18n.t('reply',{locale:this.props.language})}</CustomText>
                    </View>

                </TouchableHighlight>
            );
    }
    renderCommentImage(comment, imageURL) {
        return StringUtils.isNotEmpty(comment.imageURL) &&
            <TouchableWithoutFeedback
                activeOpacity={0.9}
                onPress={() => {
                    Actions.imageDetail({source: imageURL});
                }}>
                <View style={{marginTop:10}}>
                    <CachedImage style={{height: 100, width: 100, borderRadius:15}} source={imageURL}/>
                </View>
            </TouchableWithoutFeedback>;
    }

}
const menuIcon = () => <Icon
    name='more-vert'
    size={20}
    color={'grey'}
/>;


const touchableOpacityProps = {
    activeOpacity: 0.6,
};

const touchableHighlightProps = {
    activeOpacity: 0.5,
    underlayColor: 'green',
};
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',

        paddingVertical: 10,

    },
    title: {

        fontSize: global.h2FontSize,
        color: '#124F8E'

    },
    subtitle: {
        fontSize: global.h3FontSize,
        color: global.secondaryFontColorForCommunities
    },
    profileImage: {
        backgroundColor: '#ffffff',
        height: 24,
        borderRadius: 12,
        width: 24,

    },
    smallText: {
        fontSize: global.h5FontSize,
        color: global.secondaryFontColorForCommunities
    },

    ideaImage: {
        height: factor * 0.3,
        width: factor * 0.5,
    }
})