import React from 'react';
import BaseComponentWithoutScroll from "../../../global/components/BaseComponentWithoutScroll";
import {ActionCreators} from "../../actions";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import ModuleDetails from '../common/ModuleDetails';

class IdeaDetail extends BaseComponentWithoutScroll {
    constructor(props){
        super(props);
    }

    fetchIdeaComments(requestData, successCallback){
        this.props.getPanelIdeaComments(requestData).then((res) => {
            successCallback(res);
        }).catch(error => {
            console.log(error);
            this.showErrorToastAndClear();
        });
    }

    addUpdateComment(requestData, successCallback){
        this.props.addUpdateIdeaComment(requestData).then((res) => {
            successCallback(res);
        }).catch(error => {
            console.log(error);
            this.showErrorToastAndClear();
        });
    }

    deleteComment(requestData, successCallback) {
        this.props.deleteIdeaComment(requestData).then((res) => {
            successCallback(res);
        }).catch(error => {
            console.log(error);
            this.showErrorToastAndClear();
        });
    }

    renderChild(){
        const{language, category, isLoading, item,isConnected,onModuleUpdateComment, isComment,
            addUpdateIdeaComment,
            deleteIdeaComment,getPanelIdeaComments} = this.props;
        return (
            <ModuleDetails
                {...this.props}
                isComment = {isComment}
                module={item}
                language={language}
                isLoading = {isLoading}
                isConnected ={isConnected}
                headerLabel={"Ideas"}
                category={category}
                idLabel ={"ideaID"}
                itemTitleLabel={"title"}
                categoryTitleLabel = {"title"}
                categoryIDLabel = {"campaignID"}
                fetchComments = {this.fetchIdeaComments.bind(this)}
                addUpdateComment = {this.addUpdateComment.bind(this)}
                deleteComment = {this.deleteComment.bind(this)}
                onModuleUpdateComment = {onModuleUpdateComment}
                itemImageURLLabel={"ideaImageURL"}
                addCommentReply={addUpdateIdeaComment}
                deleteCommentReply = {deleteIdeaComment}
                getCommentReplies={getPanelIdeaComments}
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
export default connect(mapStateToProps, mapDispatchToProps)(IdeaDetail);