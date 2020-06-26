import React, {Component} from 'react';
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    FlatList,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import CustomText from "../../../global/ui/CustomText";
import CommentRow from "../comments/CommentRow";
import CommentInputBox from "../comments/CommentInputBox";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import {ActionCreators} from '../../actions/index';
import Modal from 'react-native-modalbox';
import Icon from 'react-native-vector-icons/MaterialIcons'
import {utils} from '../../../global/Utils';
import {Actions} from "react-native-router-flux";
import I18n from "react-native-i18n";

const CachedImage = require('../../../global/ImageCache/CachedImage');
const {height, width} = Dimensions.get('window');

const factor = width > height ? height : width;

const OS = Platform.OS;
// get OS navigation bar height
const NAVIGATION_HEIGHT = OS === 'ios' ? 50 : 60;
// get window height
const WINDOW_HEIGHT = Dimensions.get('window').height;

var AndroidKeyboardAdjust = require('NativeModules').AndroidKeyboardAdjust;

import SafeAreaView from 'react-native-safe-area-view';

export default class ModuleCommentReplies extends Component {

    constructor(props) {
        super(props);
        const navigationHeight = NAVIGATION_HEIGHT * 2;
        // get FlatChat vertical offset to allow extra space on top
        const verticalOffset = navigationHeight;
        this.item = props.item;
        this.state = {

            comments: [],
            isLoadingTail: false,
            page: 0,
            activeKeyboard: false,
            scrollPosition: 0,
            contentSize: 0,
            layoutHeight: 0,
            openPrompt: false,
            comment: props.comment,
            // FlatChat layout variables
            flatListOffset: verticalOffset,
            flatListHeight: WINDOW_HEIGHT - verticalOffset,
            listHeight: new Animated.Value(WINDOW_HEIGHT - verticalOffset),
        }
        this.renderCommentRow = this.renderCommentRow.bind(this);
        this.renderNoCommentsText = this.renderNoCommentsText.bind(this);
        this.renderHeader = this.renderHeader.bind(this);
        this.addComment = this.addComment.bind(this);
        this.onEndReached = this.onEndReached.bind(this);
        this.renderFooter = this.renderFooter.bind(this);
        this.getCommentRepliesData = this.getCommentRepliesData.bind(this);
    }

    renderSeparator(sectionID, rowID, adjacentRowHiglighed) {
        return (
            <View/>
        )
    }

    renderFooter() {
        if (this.state.isLoadingTail) {
            return (
                <ActivityIndicator
                    color={'#003566'}
                    animating={true}
                    size="small"

                />
            )
        }
        return null;
    }

    componentWillMount() {
        this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow.bind(this));
        this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide.bind(this));
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide.bind(this));
    }

    getCommentRepliesData(refresh = false) {
        if (this.props.isConnected && !this.props.isLoading) {
            if (refresh) {
                this.setState({comments: []}, () => {
                    this.handleGetCommentsAPI();
                })
            }
        }
    }

    handleGetCommentsAPI() {
        const{getCommentReplies} = this.props;
        getCommentReplies(this.getCommentsRequestData()).then(res => {
            if (res) {
                this.setState({
                    comments: [...this.state.comments, ...res.body.comments],
                    isLoadingTail: false,
                });
            }
        }).catch(error => {
            console.log(error);
            this.showErrorToastAndClear();
        });

    }

    getCommentsRequestData() {
        const {idLabel} = this.props;
        return {
            [`${idLabel}`]: this.item[`${idLabel}`],
            commentID: this.props.comment.commentID,
            page: this.state.page
        };
    }

    onEndReached() {
        if (this.state.comments.length === 0 ||
            this.state.comment.childCommentCount === this.state.comments.length) {
            return;
        }
        if (!this.state.isLoadingTail) {
            this.setState({
                isLoadingTail: true,
                page: this.state.page + 1,
            }, () => {
                this.handleGetCommentsAPI();
            })
        }
    }

    componentWillUnmount() {
        this.keyboardWillShowListener.remove();
        this.keyboardWillHideListener.remove();
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    keyboardWillShow(e) {
        const {listHeight, flatListHeight, openPrompt} = this.state;
        const keyboardHeight = e.endCoordinates.height;

        /*************************** FLATLIST ANIMATION  */
        if (!openPrompt) {
            Animated.timing(listHeight, {
                // animate the FlatList height to his initial minus the keyboard height
                toValue: flatListHeight - keyboardHeight,
                // uses the keyboard animation timing to be synchronized
                duration: e.duration

                // scroll to the end when animation is finished
            }).start(() => {
                /** remove all listHeight listeners if @prop @type scrollOnKeyboardShow = "bottom-start" */
                if (this.state.scrollOnKeyboardShowBottomStart) {
                    this.state.listHeight.removeAllListeners();
                }
            });
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.open && !this.props.open) {
            this.setState({
                comment: newProps.comment,
                comments: [],
                isLoadingTail: false,
                page: 0,
                openPrompt: false,
            }, () => {
                this.refs.commentRepliesModal.open();
                if (this.state.comment.childComments && this.state.comment.childComments.length > 0) {
                    setTimeout(() => {
                        this.handleGetCommentsAPI();
                    }, 100);
                }

            });

        }
    }

    keyboardDidShow() {
        this.setState({activeKeyboard: true});
    }


    keyboardWillHide(e) {
        const {listHeight, flatListHeight} = this.state;


        /*************************** FLATLIST ANIMATION  */

        Animated.timing(listHeight, {
            // animate the FlatList height to his initial height
            toValue: flatListHeight,
            // fixer to speed up the resizing animation on closing keyboard
            duration: e.duration - 150
        }).start();
    }


    keyboardDidHide() {
        this.setState({activeKeyboard: false});
    }


    updateScrollPosition(e) {
        const scrollPosition = this.state.scrollPosition;
        const currentScrollPos = e.nativeEvent.contentOffset.y;

        // ignore negative scroll positions in case of iOS momentum or bugs
        if (currentScrollPos >= 0) {
            const sensitivity = 10;
            const scrollPositionOffset = (currentScrollPos - scrollPosition);
            if (Math.abs(scrollPositionOffset) > sensitivity) {
                this.setState({scrollPosition: currentScrollPos});
            }
        }
    }


    updateLayoutHeight(e) {
        this.setState({layoutHeight: e.nativeEvent.layout.height});
    }


    updateContentSize(w, h) {
        this.setState({contentSize: h});
    }


    render() {
        return (

            <Modal
                style={[styles.modal, {backgroundColor: 'white'}]}
                ref={"commentRepliesModal"}
                swipeToClose={true}
                coverScreen={false}
                onOpened={()=>{
                    if (Platform.OS != 'ios') {
                        AndroidKeyboardAdjust.setAdjustPan();
                    }
                }}
                swipeArea={200}
                onClosed={() => {
                    if (Platform.OS != 'ios') {
                        AndroidKeyboardAdjust.setAdjustResize();
                    }
                    this.props.onCloseModal(this.state.comment);
                }}
            >
                <SafeAreaView forceInset={{bottom:'always'}}style={{flex:1, paddingTop: 20}}>
                    <KeyboardAvoidingView style={{height: this.state.flatListHeight}}>
                        <Animated.View style={{position: 'relative', height: this.state.listHeight}}>
                            <View style={{alignSelf: 'stretch', alignItems: 'flex-end', marginHorizontal: 10}}>
                                <TouchableOpacity
                                    activeOpacity={0.6}
                                    underlayColor={'#CCCCCC'}
                                    onPress={() => {
                                        this.refs.commentRepliesModal.close()
                                    }}>

                                    <Icon
                                        name='keyboard-arrow-down'
                                        size={30}
                                        color={'grey'}
                                    />

                                </TouchableOpacity>
                            </View>
                            <FlatList
                                style={{flex: 1}}
                                keyExtractor={item => "reply_" + item.commentID}
                                keyboardShouldPersistTaps="handled"
                                ListHeaderComponent={this.renderHeader}
                                ref={ref => this.scroller = ref}
                                renderItem={this.renderCommentRow}
                                onRefresh={() => {
                                    this.getCommentRepliesData(true)
                                }}
                                data={this.state.comments}
                                onScroll={e => this.updateScrollPosition(e)}
                                onLayout={e => this.updateLayoutHeight(e)}
                                ListFooterComponent={this.renderFooter}
                                refreshing={false}
                                ListEmptyComponent={this.renderNoCommentsText}
                                onEndReached={this.onEndReached}
                                onEndReachedThreshold={0.01}
                                onContentSizeChange={(w, h) => this.updateContentSize(w, h)}
                            />
                            {this.getListFooter()}
                        </Animated.View>

                    </KeyboardAvoidingView>
                </SafeAreaView>
            </Modal>


        )
    }
    getListFooter(){
        return (
            <SafeAreaView forceInset={{bottom:'always'}}style={{backgroundColor:'white',paddingTop: 20}}>
                <View>
                    {this.renderSeparator()}
                    {this.getInputBoxContent()}

                    </View>
            </SafeAreaView>
        )
    }
    getInputBoxContent() {
        if (Platform.OS === 'ios') {  //Modal handles the keyboard issue for ios
            return this.getCommentInputBox();
        }
        return (
            <KeyboardAvoidingView behavior="padding">
                {this.getCommentInputBox()}
            </KeyboardAvoidingView>

        );
    }

    getCommentInputBox() {
        return (
            <CommentInputBox onSend={this.addComment} isConnected={this.props.isConnected}
                             placeholder={"Enter a reply."}/>
        )
    }

    renderSeparator(sectionID, rowID, adjacentRowHiglighed) {
        return (
            <View key={rowID} style={styles.separator}>
            </View>
        )
    }

    renderNoCommentsText() {
        if (!this.props.isLoading) {
            return (

                <View style={{alignItems: 'center', margin: 10, backgroundColor: 'white', padding: 10}}>
                    <CustomText style={{
                        color: global.tertiaryFontColorForCommunities,
                        fontSize: 16
                    }}>{I18n.t('noDataToDisplay', {locale: this.props.language})}</CustomText>
                </View>

            );
        }
        return (<View/>);
    }

    addComment(commentText, commentImage = undefined, commentID = 0, parentCommentID = 0) {
        Keyboard.dismiss();

        this.props.addCommentReply(this.buildCommentObject(commentText, commentImage, commentID)).then((response) => {
            if (response.body) {
                console.log("Comments Response- >" + JSON.stringify(response));

                this.setState({
                    comments: commentID === 0 ? [response.body, ...this.state.comments] :
                        utils.replaceElementByAttribute(this.state.comments, 'commentID', commentID, response.body),

                }, () => {
                    this.setState({
                        comment: {
                            ...this.state.comment,
                            childCommentCount: this.state.comments.length,
                            childComments: [...this.state.comments]
                        }
                    })
                    setTimeout(() => {

                        if (this.state.contentSize > this.state.layoutHeight && commentID === 0) {
                            //this.scroller.scrollToIndex({animated: true, index:0})
                        }
                    }, 200);


                })
            }
        });
    }

    deleteComment(comment) {
        let id = comment.commentID;
        this.props.deleteCommentReply(this.buildCommentObjectToDelete(id)).then((response) => {
            if (response.body) {

                this.setState({
                    comments: utils.removeElementByAttribute(this.state.comments, 'commentID', id),

                }, () => {
                    this.setState({
                        comment: {
                            ...this.state.comment,
                            childCommentCount: this.state.comments.length,
                            childComments: [...this.state.comments]
                        }
                    })
                    utils.showToastMessage("Comment deleted successfully.")

                });
            }
        });
    }

    buildCommentObjectToDelete(id) {
        return {
            commentID: id
        }
    }

    alertForDeleteComment(comment) {
        utils.showAlert("Delete Comment", "Do you really want to delete this comment?",
            () => {
            }, () => this.deleteComment(comment));
    }

    renderCommentRow({item}) {
        return (
            <View style={{paddingLeft: 40}}>
                <CommentRow comment={item} isReply
                            language={this.props.language}
                            onCommentDelete={this.alertForDeleteComment.bind(this)}
                            onCommentEdit={this.onCommentEdit.bind(this)}/>
            </View>)
    }


    renderHeader() {
        return (
            <View>
                <CommentRow comment={this.state.comment} isDetailComment language={this.props.language}/>
                {this.renderSeparator()}
            </View>
        )
    }

    buildCommentObject(commentText, commentImage, commentID) {
        const {idLabel} = this.props;
        return {
            parentCommentID: this.state.comment.commentID,
            commentText: commentText,
            [`${idLabel}`]: this.item[`${idLabel}`],
            commentID: commentID,
            commentImage: commentImage ? commentImage.data : "",
            deleteImage: commentImage === undefined
        }
    }

    open(comment) {
        this.setState({comment: comment});
        this.commentRepliesModal.open();
    }

    onCommentEdit(comment, profileImageURL, commentImageURL) {
        Actions.editComment({
            comment: comment, profileImageURL: profileImageURL,
            commentImageURL: commentImageURL, updateComment: this.addComment.bind(this)
        })
    }
}

const styles = StyleSheet.create({
    footerContainer: {
        marginTop: 5,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10,
    },
    footerText: {
        fontSize: 14,
        color: '#aaa',
    },
    textInput: {
        flex: 1,
        marginLeft: 10,
        color: 'black',
        fontSize: global.h2FontSize,
        lineHeight: global.h2FontSize,
        marginTop: Platform.select({
            ios: 6,
            android: 0,
        }),
        marginBottom: Platform.select({
            ios: 5,
            android: 3,
        }),
    },
    separator: {
        alignSelf: 'stretch',
        height: 1,
        backgroundColor: '#ECEBF0',
    },
    commentsList: {
        flex: 1,
        padding: 10,

    },
    modal: {
        justifyContent: 'center',
        flex: 1,
        borderRadius: 15
    },

});
