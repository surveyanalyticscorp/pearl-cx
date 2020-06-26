import React,{Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Actions} from 'react-native-router-flux';
import BaseComponentWithoutScroll from "../../../global/components/BaseComponentWithoutScroll";
import ModuleAddEdit from '../common/ModuleAddEdit';
import {utils} from '../../../global/Utils';
import {ActionCreators} from '../../actions/index';

const CachedImage = require('../../../global/ImageCache/CachedImage');
const ImageCacheProvider = CachedImage.ImageCacheProvider;
class AddEditIdea extends BaseComponentWithoutScroll{
    constructor(props){
        super(props);
        this.handleSubmitIdeaResponse = this.handleSubmitIdeaResponse.bind(this);
        this.submitIdea = this.submitIdea.bind(this);
    }

    renderChild(){
        const {
            idea,
            panelIdeaCategories,
            language,
            isEdit,
            isConnected,
            categoryID,
            } = this.props;
        return (
            <ModuleAddEdit
                item = {isEdit? idea: undefined}
                selectedCategory={this.getIdeaCampaignTitleforID(panelIdeaCategories.ideaCampaigns, categoryID)}
                selectedCategoryID = {categoryID}
                title = {isEdit? idea.title: ""}
                description = {isEdit? idea.description: ""}
                selectedImageFile = {isEdit && idea.ideaImageURL
                    ? {uri: ImageCacheProvider.getCachedImageFilePath(global.BASE_URL + idea.ideaImageURL)}
                    : undefined}
                language = {language}
                isEdit = {isEdit}
                submitModule = {this.submitIdea}
                categories = {panelIdeaCategories.ideaCampaigns}
                isConnected = {isConnected}
                categoryLabel={'title'}
                imageLabel={'ideaImage'}
                module={"Idea"}
                />
        )
    }

    getIdeaCampaignTitleforID(campaigns, id) {
        let length = campaigns.length;
        let i = 0;
        while (i < length) {
            if (campaigns[i].ID === id) {
                return campaigns[i].title;
            }
            i++;
        }
    }
    handleSubmitIdeaResponse(response) {
        if (response.body.message) {
            utils.showToastMessage(response.body.message);
        }
        this.props.onItemAddEdit && this.props.onItemAddEdit(response.body);
        Actions.pop();
    }

    submitIdea(requestData, selectedCategoryID) {
        const{isEdit,
            isConnected,
            addPanelIdea,editPanelIdea} = this.props;
            if(isConnected) {
                let updatedIdea = this.buildRequestData(requestData, selectedCategoryID);
                if (isEdit) {
                    editPanelIdea(updatedIdea).then((response) => {
                        this.handleSubmitIdeaResponse(response);
                    }).catch(error => {
                        this.showErrorToastAndClear();
                    });
                }
                else {
                    addPanelIdea(updatedIdea).then((response) => {
                        this.handleSubmitIdeaResponse(response);
                    }).catch(error => {
                        console.log("Error- " + error);
                        this.showErrorToastAndClear();
                    });
                }
            }

    }
    buildRequestData(requestData, selectedCategoryID) {
        let obj = {
            ...requestData,
            panelID: global.appUser.panelID,
            memberID: global.appUser.ID,
            ideaID: this.props.isEdit ? this.props.idea.ideaID : 0,
            campaignID : selectedCategoryID
        };
        if(this.props.isEdit){
            return {...obj,ideaID:this.props.idea.ideaID }
        }
        return obj;

    }

}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}


function mapStateToProps(state) {
    return {
        panelIdeaCategories: state.panelIdeaCategories.body,
        isLoading: state.isLoading,
        error: state.error.message,
        isConnected: state.network.isConnected,
        language: state.language.googleCode

    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AddEditIdea);