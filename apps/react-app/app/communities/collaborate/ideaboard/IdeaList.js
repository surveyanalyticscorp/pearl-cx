import React from 'react';
import BaseComponentWithoutScroll from "../../../global/components/BaseComponentWithoutScroll";
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import {ActionCreators} from '../../actions/index';
import ModuleItemList from "../common/ModuleItemList";


class IdeaList extends BaseComponentWithoutScroll{
    constructor(props){
        super(props);
        this.fetchItems = this.fetchItems.bind(this);
        this.ideaListTabs = JSON.parse(global.appUser.ideaboardMenu);

    }

    fetchItems(page = 0, type = "RECENT", successCallback){
        this.props.getPanelCampaignIdeas(this.getRequestData(page,type)).then(response => {
            successCallback(response.body.ideas);
        }).catch(error => {
            this.showErrorToastAndClear();
        });
    }
    getRequestData(page,type) {
        const{category} = this.props;
        return {
            page: page,
            campaignID: category.ID,
            type: type,
        }
    }


    renderChild(){
        const{language, category, isLoading} = this.props;
        return (
            <ModuleItemList
                language={language}
                isLoading = {isLoading}
                headerLabel={"Ideas"}
                category={category}
                idLabel ={"ideaID"}
                itemTitleLabel={"title"}
                categoryTitleLabel = {"title"}
                categoryIDLabel = {"campaignID"}
                fetchItems = {this.fetchItems}
                itemImageURLLabel={"ideaImageURL"}
                addUpdateVoteAction = {this.props.addUpdateIdeaVote}
                deleteItemAction = {this.props.deleteIdea}
                onFavoriteAction = {this.props.addUpdateIdeaFavorite}
                addItem={(item,onAddEdit)=>{
                    Actions.addIdea({idea: item,isEdit: item!== undefined,categoryID:category.ID, onItemAddEdit: onAddEdit})
                }}
                onError = {this.showErrorToastAndClear.bind(this)}
                onDetailsLoad = {(props)=>{
                    Actions.ideaDetails(props);
                }}
                useIcon={false}
                tabTitles = {this.ideaListTabs}
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


export default connect(mapStateToProps, mapDispatchToProps)(IdeaList);