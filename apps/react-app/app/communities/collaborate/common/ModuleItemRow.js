/**
 * Created by Sachin Sable on 10/08/17.
 */
import React, {Component} from 'react';
import {
    Dimensions,
    Image,
    Platform,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import CustomText from "../../../global/ui/CustomText";
import EditDeleteContextMenu from '../../../global/widgets/popup-menu/EditDeleteContextMenu';
import LikeDislikeWidget from "../ideaboard/LikeDislikeWidget";
import {utils} from '../../../global/Utils';
import * as colorCodes from '../../../global/widgets/typography/ColorCodes';
import {Actions} from "react-native-router-flux";
import ReadMore from '@exponent/react-native-read-more-text';
import StringUtils from "../../../global/StringUtils";
import Triangle from "../../../global/widgets/shapes/triangle/Triangle";
import I18n from "react-native-i18n";

const CachedImage = require('../../../global/ImageCache/CachedImage');
const {height, width} = Dimensions.get('window');

const factor = width > height ? height : width;
import Icon from 'react-native-vector-icons/MaterialIcons';
export default class ModuleItemRow extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>
                {this.renderTitleBar()}
                {this.renderDescription()}
                {this.renderImage()}
                {this.renderSeparator()}
                {this.renderActionItems()}

            </View>
        );
    }

    renderImage() {
        const{itemImageURL}= this.props;
        let imageURL = this.getImageURL(itemImageURL);
        if (imageURL) {
            return <TouchableWithoutFeedback
                activeOpacity={0.1}
                onPress={() => {
                    Actions.imageDetail({source: imageURL});
                }}>

                <View style={[styles.ideaImage, {marginVertical: 10}]}>
                    <CachedImage style={styles.ideaImage} source={imageURL}
                                 isProfilePic={false}/>
                </View>
            </TouchableWithoutFeedback>;
        }
        return null;
    }

    renderTitleBar() {
        const{memberImage} = this.props;
        return (
            <TouchableWithoutFeedback
                onPress={() => {
                    this.showDetail(false);
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10}}>
                    <CachedImage style={styles.profileImage} source={this.getImageURL(memberImage)}
                                 isProfilePic={false}/>
                    {this.renderModuleTitleAndAuthor()}
                    {this.renderDocumentButton()}
                    {this.renderFavoriteButton()}
                    {this.renderContextMenu()}
                </View>
            </TouchableWithoutFeedback>);
    }

    renderDocumentButton() {
        const{item,showDocumentViewer} = this.props;
        if (item && StringUtils.isNotEmpty(item.downloadUrl)) {
            let url = item.downloadUrl.substr(1);
            let documentURL = global.BASE_URL + url
            let details = this.getFileIconAndColor(documentURL)
            return (
                <TouchableWithoutFeedback onPress={() => {
                       showDocumentViewer && showDocumentViewer(documentURL)
                }}>
                <View style={{alignItems: 'center', marginHorizontal: 10}}>
                <Icon name={details.icon} size={20} color={details.color}/>
            </View>
                </TouchableWithoutFeedback>);
        }
        return null
    }

    renderFavoriteButton() {
        const {item, onFavorite} = this.props;
        return <View style={{alignItems: 'center', marginHorizontal: 10}}>
            <LikeDislikeWidget
                onPress={() => {
                    onFavorite(item);
                }}
                selected={item.myFavourite === "checked"}
                icon={item.myFavourite === "checked"? 'star':'star-border'}
                selectedColor={item.myFavourite === "checked"? '#FDD735': 'grey'}/>

        </View>;
    }

    renderModuleTitleAndAuthor() {
        const {isDetail, title,authorFirstName,authorLastName,creationTimeStamp} = this.props;
        return <View style={{flex: 1, marginHorizontal: 10}}>
            <CustomText numberOfLines={isDetail ? 0 : 1}
                        style={[styles.title]}>{title}</CustomText>
            <CustomText numberOfLines={1}
                        style={[styles.smallText, colorCodes.secondaryFontColor, {fontStyle: 'italic'}]}>
                {authorFirstName + " " + authorLastName + ", " + creationTimeStamp}
            </CustomText>
        </View>;
    }

    renderContextMenu(){
        const{item,onEdit, onDelete} = this.props;
        let memberID = item.author? item.author.memberID : item.memberID;
        if(memberID === global.appUser.ID){
            return (
                <EditDeleteContextMenu onEdit={() => {
                    console.log("On Edit");
                    onEdit(item);
                }} onDelete={() => {
                    onDelete(item);
                    console.log("On Delete");
                }}
                />
            )
        }
        return null;
    }

    renderDescription() {
        const {description, isDetail } = this.props;
        let content;
        if (isDetail) {
            content =
                <CustomText numberOfLines={0}
                            style={[styles.subtitle, colorCodes.secondaryFontColor]}>{description}</CustomText>

        } else {
            content = <ReadMore
                numberOfLines={3}
                renderTruncatedFooter={this._renderTruncatedFooter}>
                <CustomText
                    style={[styles.subtitle, colorCodes.secondaryFontColor]}>{description}</CustomText>
            </ReadMore>

        }
        return (<View style={{alignSelf: 'stretch', paddingHorizontal: 20,paddingVertical: 10}}>
                {content}
            </View>
        )

    }

    _renderTruncatedFooter = (handlePress) => {
        return (
            <CustomText style={{color: '#99bfe4', marginTop: 5, fontSize: 12}} onPress={() => {
                this.showDetail();
            }}>
                {I18n.t('read_more',{locale:this.props.language})}
            </CustomText>
        );
    };


    renderActionItems() {
        return (
            <View style={{
                flexDirection: 'row',
                marginVertical: 10,
                paddingHorizontal: 20,
                paddingVertical:5,
                alignSelf: 'stretch',
                justifyContent: 'space-between'
            }}>

                {this.renderUpVoteButton()}
                {this.renderDownVoteButton()}
                {this.renderCommentButton()}


            </View>
        );
    }


    renderCommentButton() {
        const{item,commentImageURL} = this.props;
        let commentButtonText = I18n.t('comments',{locale:this.props.language}) + (item.commentsCount > 0 ? " ("+item.commentsCount+")": "" );
        return <TouchableOpacity
            activeOpacity={0.1}
            onPress={() => {
                this.showDetail(true);
            }}
            underlayColor={'#CCCCCC'}>
            <View style={{alignItems: 'center', flexDirection: 'row'}}>


                <Image
                    style={[{width: 15, height: 15}]}
                    source={commentImageURL}/>


                <View style={{width: 5}}/>
                <CustomText
                    style={[styles.subtitle, {
                        fontSize: global.h5FontSize,
                    }]}>{commentButtonText}</CustomText>
            </View>
        </TouchableOpacity>;
    }

    renderDownVoteButton() {
        const{item, useIcon} = this.props;
        let downVoteText = I18n.t('down_vote',{locale:this.props.language}) + (item.downVotes > 0 ? " ("+item.downVotes+")": "" );
        return <TouchableOpacity
            activeOpacity={0.1}
            onPress={() => {
                this.props.onItemVote(item, false);
            }}>
            <View style={{alignItems: 'center', flexDirection: 'row'}}>
                { useIcon?
                    <LikeDislikeWidget
                        onPress={() => {
                            this.props.onItemVote(item, false);
                        }}
                        selected={item.myVote === -1}
                        selectedColor={'#D34835'}
                        icon={'thumb-down'}/>
                    :
                    <Triangle
                        color={item.myVote === -1 ? '#D34835' : 'grey'} inverse/>
                }
                <View style={{width: 5}}/>
                <CustomText
                    style={[styles.subtitle, {
                        fontSize: global.h5FontSize,

                    }]}>{downVoteText}</CustomText>
            </View>
        </TouchableOpacity>;
    }

    renderUpVoteButton() {
        //TODO : Multilingual
        const{item,useIcon} = this.props;
        let upVoteText = I18n.t('up_vote',{locale:this.props.language}) + (item.upVotes > 0 ? " ("+item.upVotes+")": "") ;
        return <TouchableOpacity
            activeOpacity={0.1}
            onPress={() => {
                this.props.onItemVote(item, true);
            }}>

            <View style={{alignItems: 'center', flexDirection: 'row',}}>
                {   useIcon?
                    <LikeDislikeWidget
                        onPress={() => {
                            this.props.onItemVote(item, false);
                        }}
                        selected={item.myVote === 1}
                        selectedColor={'#4CAE51'}
                        icon={'thumb-up'}/>
                    :
                    <Triangle
                        color={item.myVote === 1 ? '#4CAE51' : 'grey'}
                    />
                }
                <View style={{width: 5}}/>
                <CustomText
                    style={[styles.subtitle, {
                        fontSize: global.h5FontSize,

                    }]}>{upVoteText}</CustomText>
            </View>
        </TouchableOpacity>;
    }

    getImageURL(url) {
        if (StringUtils.isNotEmpty(url)) {
            if (utils.isURLAbsolute(url)) return ({uri: url});
            return {uri: global.BASE_URL + url};
        }
        return undefined;
    }

    showDetail(isComment) {
        if (!this.props.isDetail) {
            this.props.onDetailsLoadAction({
                ...this.props,
                onModuleUpdateComment: this.props.onModuleUpdateComment,
                isComment:isComment,

            });
        }
    }

    renderSeparator() {
        return (
            <View style={styles.separator}/>

        )
    }

      getFileIconAndColor = (filename) => {
        const extn = filename.substring(filename.lastIndexOf('.') + 1, filename.length);
        switch (extn) {
            case "pdf":
                return {icon: "insert-drive-file", color: "#C70039"};
            case "doc":
            case "docx":
            case "xml":
            case "txt":
            case "rtf":
                return  {icon: "description", color: "#4188EC"};
            case "xls":
            case "xlsx":
            case "csv":
                return {icon: "assessment", color: "#117a34"};
            case "ppt":
            case "pptx":
                return {icon: "pie-chart", color: "#FF5733"};
        }
    };
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
    },
    title: {

        fontSize: global.h2FontSize,
        color: '#124F8E'

    },
    separator: {
        alignSelf: 'stretch',
        height: 0.5,
        backgroundColor: '#ECEBF0',
    },
    subtitle: {

        fontSize: global.h3FontSize,
        color: global.secondaryFontColorForCommunities
    },
    smallText: {
        fontSize: global.h5FontSize,
        color: global.secondaryFontColorForCommunities
    },
    profileImage: {
        backgroundColor: '#ffffff',
        height: 24,
        borderRadius: 12,
        width: 24,

    },

    ideaImage: {
        height: factor * 0.3,
        width: width,
    }
})