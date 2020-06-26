import React from 'react';
import BaseComponentWithoutScroll from "../../../global/components/BaseComponentWithoutScroll";
import {ActionCreators} from "../../actions";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import ModuleDetails from '../common/ModuleDetails';

class TopicDetails extends BaseComponentWithoutScroll {
    constructor(props){
        super(props);
    }
    fetchTopicComments(requestData, successCallback){
        this.props.getDiscussionTopicComments(requestData).then((res) => {
            successCallback(res);
        }).catch(error => {
            console.log(error);
            this.showErrorToastAndClear();
        });
    }

    addUpdateComment(requestData, successCallback){
        this.props.addUpdateTopicComment(requestData).then((res) => {
            successCallback(res);
        }).catch(error => {
            console.log(error);
            this.showErrorToastAndClear();
        });
    }

    deleteComment(requestData, successCallback) {
        this.props.deleteTopicComment(requestData).then((res) => {
            successCallback(res);
        }).catch(error => {
            console.log(error);
            this.showErrorToastAndClear();
        });
    }

    renderChild(){
        const{language, category, isLoading, item,isConnected, onModuleUpdateComment,isComment,
                addUpdateTopicComment,deleteTopicComment,getDiscussionTopicComments} = this.props;
        return (
            <ModuleDetails
                {...this.props}
                isComment = {isComment}
                module={item}
                language={language}
                isLoading = {isLoading}
                isConnected ={isConnected}
                headerLabel={"Topics"}
                category={category}
                idLabel ={"topicID"}
                itemTitleLabel={"title"}
                categoryTitleLabel = {"name"}
                categoryIDLabel = {"discussionID"}
                fetchComments = {this.fetchTopicComments.bind(this)}
                addUpdateComment = {this.addUpdateComment.bind(this)}
                deleteComment = {this.deleteComment.bind(this)}
                onModuleUpdateComment = {onModuleUpdateComment}
                itemImageURLLabel={"topicImageURL"}
                addCommentReply={addUpdateTopicComment}
                deleteCommentReply = {deleteTopicComment}
                getCommentReplies={getDiscussionTopicComments}
            />
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}


function mapStateToProps(state) {
    return {
        isLoading: state.isLoading,
        error: state.error.message,
        isConnected: state.network.isConnected,
        language: state.language.googleCode

    };
}
export default connect(mapStateToProps, mapDispatchToProps)(TopicDetails);