import React, {Component} from 'react';
import {ActivityIndicator, Animated, Dimensions,KeyboardAvoidingView, FlatList, Keyboard, Platform, StyleSheet, View} from 'react-native';
import CustomText from "../../../global/ui/CustomText";
import {utils} from "../../../global/Utils";

import SubView from '../../../global/components/SubView';
import I18n from 'react-native-i18n';
import CommentRow from "../comments/CommentRow";
import CommentInputBox from "../comments/CommentInputBox";
import ModuleCommentReplies from './ModuleCommentReplies';
import {Actions} from 'react-native-router-flux';
import ArrayUtil from "../../../global/ArrayUtil";
import ModuleItemRow from "./ModuleItemRow";

const OS = Platform.OS;
// get OS navigation bar height
const NAVIGATION_HEIGHT = OS === 'ios' ? 60 : 70;
// get window height
const WINDOW_HEIGHT = Dimensions.get('window').height;

var AndroidKeyboardAdjust = require('NativeModules').AndroidKeyboardAdjust;
import SafeAreaView from 'react-native-safe-area-view';
export default class ModuleDetails extends Component {
    constructor(props) {
        super(props);
        const navigationHeight = NAVIGATION_HEIGHT * 2;
        // get FlatChat vertical offset to allow extra space on top
        const verticalOffset = navigationHeight;
        this.state = {
            isLoadingTail: false,
            currentComment: {},
            page: 0,
            comments: [],
            module: props.module,
            activeKeyboard: false,
            scrollPosition: 0,
            contentSize: 0,
            layoutHeight: 0,
            openModal: false,
            openPrompt: false,
            // FlatChat layout variables
            keyboardHeight: 0,
            flatListOffset: verticalOffset,
            flatListHeight: WINDOW_HEIGHT - verticalOffset,
            listHeight: new Animated.Value(WINDOW_HEIGHT - verticalOffset),
        }
        this.baseModule = props.module;
        this.renderCommentRow = this.renderCommentRow.bind(this);
        this.renderNoCommentsText = this.renderNoCommentsText.bind(this);
        this.renderHeader = this.renderHeader.bind(this);
        this.addComment = this.addComment.bind(this);
        this.onEndReached = this.onEndReached.bind(this);
        this.renderFooter = this.renderFooter.bind(this);
        this.getCommentsData = this.getCommentsData.bind(this);
    }


    renderSeparator() {
        return (
            <View style={styles.separator}/>

        )
    }

    componentWillUnmount() {
        this.keyboardWillShowListener.remove();
        this.keyboardWillHideListener.remove();
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    keyboardWillShow(e) {
        console.log("Keyboard will show");
        const {listHeight, flatListHeight, openPrompt} = this.state;
        const keyboardHeight = e.endCoordinates.height;
        if(!openPrompt) {

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


    keyboardDidShow(e) {
        console.log("Keyboard Did show");
        this.setState({activeKeyboard: true, keyboardHeight: e.endCoordinates.height});

    }


    keyboardWillHide(e) {
        console.log("Keyboard will hide");
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
        console.log("Keyboard did hide");
        this.setState({activeKeyboard: false, keyboardHeight: 0});
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
        const {module} = this.state;
        const{getCommentReplies} = this.props;
        return (

            <View style={{flex: 1}}>
                <SubView title={module.title}>

                    <Animated.View style={[{position: 'relative', height: this.state.listHeight, flex: Platform.OS ==='android'? 1: 0}]}>
                        <FlatList
                            keyExtractor={(item, index) => item.commentID}
                            ListHeaderComponent={this.renderHeader}
                            keyboardShouldPersistTaps="never"
                            ref={ref => this.scroller = ref}
                            renderItem={this.renderCommentRow}
                            data={this.state.comments}
                            onScroll={e => this.updateScrollPosition(e)}
                            onLayout={e => this.updateLayoutHeight(e)}
                            refreshing={false}
                            onRefresh = {()=>{this.getCommentsData(true)}}
                            ListFooterComponent={this.renderFooter}
                            ListEmptyComponent={this.renderNoCommentsText}
                            onContentSizeChange={(w, h) => this.updateContentSize(w, h)}
                            onEndReached={this.onEndReached}
                            onEndReachedThreshold={0.01}
                            extraData={module}
                        />

                        {this.getListFooter()}

                    </Animated.View>

                </SubView>
                <ModuleCommentReplies
                    {...this.props}
                    onCloseModal={(comment) => {
                        let commentsArray = this.state.comments;
                        let index = commentsArray.indexOf(this.state.currentComment);
                        commentsArray[index] = comment;
                        this.setState({openModal: false, comments: commentsArray});
                    }}
                    open={this.state.openModal}
                    comment={this.state.currentComment}
                    item={this.state.module}
                    getCommentReplies={getCommentReplies}/>
            </View>
        );

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
            <CommentInputBox onSend={this.addComment.bind(this)} isConnected={this.props.isConnected}
                             shouldFocus={this.props.isComment && OS === 'ios'}
                             placeholder={I18n.t('enter_a_comment', {locale: this.props.language})}/>
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
    renderHeader(){
        return(
            <View>
                <ModuleItemRow
                    {...this.props}
                    item={this.state.module}
                    isDetail
                    onItemVote={(item,upVote)=>{
                        let item1 = this.props.onItemVote(item, upVote,()=>{
                            this.setState({module: this.baseModule})
                        });
                        this.setState({module: item1});
                    }}
                    onFavorite={
                        (item) => {
                            let item1 = this.props.onFavorite(item, () => {
                                this.setState({module: this.baseModule});
                            });
                            this.setState({module: item1})
                        }
                    }
                    onEdit={(item)=>{
                        this.props.onEdit(item, (updatedItem)=> {
                            let update = {...Object.assign({}, item, updatedItem)};
                            this.setState({module: update});
                            this.baseModule = update;
                            });

                    }}

                    onDelete={(item)=>{
                        this.props.onDelete(item, ()=>{
                            Actions.pop();
                        });
                    }}

                />
                {this.renderSeparator()}
            </View>
        )
    }

    componentDidMount() {

        if(this.state.module.commentsCount > 0) { //fetch comments only when count is >0
            setTimeout(() => {
                this.getCommentsData(true);
            }, 100);
        }


    }
    getCommentsData(refresh = false){
        if (this.props.isConnected && !this.props.isLoading) {
            if (refresh) {
                this.setState({comments: []}, () => {
                    this.handleGetCommentsAPI()
                })
            }
        }
    }
    handleGetCommentsAPI(){
        const{fetchComments} = this.props;
        fetchComments(this.getCommentsRequestData(),(res) => {
            if (res) {
                this.setState({
                    comments: [...this.state.comments, ...res.body.comments],
                    isLoadingTail: false,
                });
            }
        });

    }

    getCommentsRequestData(){
        const{idLabel, categoryIDLabel} = this.props;
        return {
            [`${idLabel}`]: this.props.module[`${idLabel}`],
            page:this.state.page,
            [`${categoryIDLabel}`]: this.props.module[`${categoryIDLabel}`]
        }

    }
    onEndReached(){
        if(this.state.comments.length === 0
            || this.state.module.commentsCount === this.state.comments.length ){return;}
        if(!this.state.isLoadingTail){
            this.setState({
                isLoadingTail : true,
                page: this.state.page + 1,
            }, ()=>{
                this.handleGetCommentsAPI();
            })
        }
    }
    onCommentEdit(comment,profileImageURL,commentImageURL){
        //this.setState({currentComment: comment, openPrompt:true});
        Actions.editComment({comment: comment, profileImageURL: profileImageURL,
            commentImageURL : commentImageURL, updateComment: this.addComment.bind(this)})
    }
    renderCommentRow({item}) {
        return (
            <View>
                <CommentRow comment={item} openCommentReply={this.openCommentReplies.bind(this)}
                            onCommentDelete = {this.alertForDeleteComment.bind(this)}
                            onCommentEdit = {this.onCommentEdit.bind(this)}
                            language={this.props.language}/>
            </View>)
    }

    renderNoCommentsText() {
        if (!this.props.isLoading) {
            return (
                <View style={{alignItems: 'center', margin: 10, backgroundColor: 'white', padding: 10}}>
                    <CustomText style={{
                        color: global.tertiaryFontColorForCommunities,
                        fontSize: 16
                    }}>{I18n.t('noDataToDisplay',{locale:this.props.language})}</CustomText>
                </View>

            );
        }
        return (<View/>);
    }

    componentWillMount() {
        if (Platform.OS !== 'ios') {
            AndroidKeyboardAdjust.setAdjustResize();
        }
        this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow.bind(this));
        this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide.bind(this));
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide.bind(this));
    }

    openCommentReplies(comment) {
        this.setState({currentComment: comment, openModal: true});

    }

    addComment(commentText, selectedImage = undefined, commentID = 0, parentCommentID = 0) {
        Keyboard.dismiss();
        //TODO : Need to optimize the code below
        const{addUpdateComment,onModuleUpdateComment} = this.props;

        addUpdateComment(this.buildCommentObject(commentText,selectedImage, commentID, parentCommentID), (response) => {
            if (response.body) {
                if(parentCommentID === 0) {
                    let updatedCommentsCount = this.state.module.commentsCount;
                    if (commentID === 0) {
                        updatedCommentsCount = this.state.module.commentsCount + 1;
                    }
                    let comment = ArrayUtil.getMatchingObject(this.state.comments, 'commentID', commentID);
                    if(comment){
                        comment = {
                            ...response.body,
                            childComments: comment.childComments,
                        }
                    }
                    this.setState({
                        comments: commentID === 0 ? [response.body, ...this.state.comments] :
                            utils.replaceElementByAttribute(this.state.comments, 'commentID', commentID, comment? comment:response.body),
                        module: {...this.state.module, commentsCount: updatedCommentsCount}
                    }, () => {
                        onModuleUpdateComment(this.state.module, updatedCommentsCount);
                        setTimeout(() => {

                            if (this.state.contentSize > this.state.layoutHeight && commentID === 0) {
                                //this.scroller.scrollToIndex({animated: true, index: 0})
                            }

                        }, 200);

                    });
                }
                else {
                    let comment = ArrayUtil.getMatchingObject(this.state.comments, 'commentID', parentCommentID);
                    let commentIndex= ArrayUtil.getIndexOfElementFromArray(this.state.comments, comment, 'commentID');
                    let childComment = ArrayUtil.getMatchingObject(comment.childComments, 'commentID', commentID);

                    if(childComment){
                        let childCommentIndex = ArrayUtil.getIndexOfElementFromArray(comment.childComments,childComment, 'commentID');
                        comment.childComments[childCommentIndex] = response.body;
                    }
                    else {
                        comment.childComments.push(response.body);
                    }
                    let comments = this.state.comments;
                    comments[commentIndex] = comment;
                    this.setState({comments : comments});
                }
            }
        });
    }

    deleteComment(comment) {
        let id = comment.commentID;
        let parentId = comment.parentCommentID;
        const{deleteComment,onModuleUpdateComment} = this.props;

        deleteComment(this.buildCommentObjectToDelete(id,parentId),(response) => {
            if (response.body) {
                if(parentId === 0) {
                    let updatedCommentsCount = this.state.module.commentsCount - 1;

                    this.setState({
                        comments: utils.removeElementByAttribute(this.state.comments, 'commentID', id),
                        module: {...this.state.module, commentsCount: updatedCommentsCount}
                    }, () => {
                        onModuleUpdateComment(this.state.module, updatedCommentsCount);

                        utils.showToastMessage("Comment deleted successfully.")
                    });
                }
                else {
                    let comment = ArrayUtil.getMatchingObject(this.state.comments, 'commentID', parentId);
                    comment.childComments = utils.removeElementByAttribute(comment.childComments, 'commentID', id);
                    comment.childCommentCount = comment.childComments.length;
                    let commentIndex = ArrayUtil.getIndexOfElementFromArray(this.state.comments, comment, 'commentID');
                    let comments = this.state.comments;
                    comments[commentIndex] = comment;
                    this.setState({
                        comments: comments,
                    },()=>{
                        utils.showToastMessage("Comment deleted successfully.")
                    })
                }
            }
        });
    }

    buildCommentObject(commentText, selectedImage, commentID, parentCommentID) {
        const {module, idLabel} = this.props;
        return {
            [`${idLabel}`]: module[`${idLabel}`],
            commentText: commentText,
            commentID: commentID,
            commentImage : selectedImage? selectedImage.data: '',
            deleteImage : selectedImage === undefined,
            parentCommentID : parentCommentID
        }
    }
    buildCommentObjectToDelete(id, parentId){
        return {
            commentID : id,
            parentCommentID: parentId
        }
    }

    alertForDeleteComment(id){
        utils.showAlert("Delete Comment", "Do you really want to delete this comment?",
            ()=>{}, ()=> this.deleteComment(id));
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
    modal: {
        justifyContent: 'center',
        flex: 1,
        borderRadius: 15
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

    }

});
