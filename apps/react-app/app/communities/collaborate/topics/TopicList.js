import React from 'react';
import BaseComponentWithoutScroll from "../../../global/components/BaseComponentWithoutScroll";

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import {ActionCreators} from '../../actions/index';
import ModuleItemList from "../common/ModuleItemList";
import {Actions} from "react-native-router-flux";


class TopicList extends BaseComponentWithoutScroll{
    constructor(props){
        super(props);
        this.fetchItems = this.fetchItems.bind(this);
        this.topicsListTabs = JSON.parse(global.appUser.topicsTabMenu);
    }

    fetchItems(page = 0, type = "RECENT", successCallback){
        this.props.getPanelDiscussionTopics(this.getRequestData(page,type)).then(response => {
            successCallback(response.body.topics);
        }).catch(error => {
            this.showErrorToastAndClear();
        });
    }
    getRequestData(page,type) {
        const {category} = this.props;
        return {
            page: page,
            discussionID: category.ID,
            type: type,
        }
    }

    renderChild(){
        const{language, category, isLoading} = this.props;
        return (
            <ModuleItemList
                language={language}
                isLoading = {isLoading}
                headerLabel={"Topics"}
                category={category}
                idLabel ={"topicID"}
                itemTitleLabel={"title"}
                categoryTitleLabel = {"name"}
                categoryIDLabel = {"discussionID"}
                fetchItems = {this.fetchItems}
                itemImageURLLabel={"topicImageURL"}
                addUpdateVoteAction = {this.props.addUpdateTopicVote}
                onFavoriteAction = {this.props.addUpdateTopicFavorite}
                deleteItemAction = {this.props.deleteTopic}
                addItem={(item,onAddEdit)=>{
                    Actions.addTopic({topic: item, isEdit: item!== undefined,categoryID:category.ID, onItemAddEdit: onAddEdit})
                }}
                onError = {this.showErrorToastAndClear.bind(this)}
                onDetailsLoad = {(props)=>{
                    Actions.topicDetails({
                        ...props
                    });
                }}
                showDocumentViewer={(documentURL) => {
                    Actions.documentCollaborate({documentUrl: documentURL});
                }}
                useIcon = {true}
                tabTitles={this.topicsListTabs}
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
        language: state.language.googleCode,
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(TopicList);