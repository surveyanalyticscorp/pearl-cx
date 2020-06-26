
import React,{Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Actions} from 'react-native-router-flux';
import BaseComponentWithoutScroll from "../../../global/components/BaseComponentWithoutScroll";
import ModuleAddEdit from '../common/ModuleAddEdit';
import {utils} from '../../../global/Utils';
import {ActionCreators} from '../../actions/index';
import {AuthenticationModule} from "../../../global/native-modules/NativeModules";

const CachedImage = require('../../../global/ImageCache/CachedImage');
const ImageCacheProvider = CachedImage.ImageCacheProvider;
class AddEditTopic extends BaseComponentWithoutScroll{
    constructor(props){
        super(props);
        let collaborateMenu = global.appUser.collaborateTabMenu
        this.moduleName = collaborateMenu.includes("discussion") ? "Discussion" : "Topic";
        this.handleSubmitTopicResponse = this.handleSubmitTopicResponse.bind(this);
        this.submitTopic = this.submitTopic.bind(this);
    }

    showDocument() {
        return ((global.mainScreen.props.APP_NAME === "HealthTrust Collaboratives") || (global.mainScreen.props.APP_NAME === "Communities"))
    }

    renderChild(){
        const {
            topic,
            panelTopicCategories,
            language,
            isEdit,
            isConnected,
            categoryID
        } = this.props;
        return (
            <ModuleAddEdit
                item = {isEdit? topic: undefined}
                selectedCategory={this.getCategoryTitleForCategoryID(panelTopicCategories.categories, categoryID)}
                selectedCategoryID = { categoryID}
                title = {isEdit? topic.title: ""}
                description = {isEdit? topic.description: ""}
                selectedImageFile = {isEdit && topic.topicImageURL
                    ? {uri: ImageCacheProvider.getCachedImageFilePath(global.BASE_URL + topic.topicImageURL)}
                    : undefined}
                language = {language}
                isEdit = {isEdit}
                submitModule = {this.submitTopic}
                categories = {panelTopicCategories.categories}
                isConnected = {isConnected}
                categoryLabel={'name'}
                module={this.moduleName}
                imageLabel={'topicImage'}
                addDocument={this.showDocument()}
                documentFileItem={isEdit && topic.downloadUrl
                    ? {uri: ImageCacheProvider.getCachedImageFilePath(global.BASE_URL + topic.downloadUrl)}
                    : undefined}
            />
        )
    }

    getCategoryTitleForCategoryID(campaigns, id) {
        let length = campaigns.length;
        let i = 0;
        while (i < length) {
            if (campaigns[i].ID === id) {
                return campaigns[i].name;
            }
            i++;
        }
    }
    handleSubmitTopicResponse(response) {
        if (response.body.message) {
            utils.showToastMessage(response.body.message);
        }
        this.props.onItemAddEdit && this.props.onItemAddEdit(response.body);
        Actions.pop();
    }

    submitTopic(requestData, selectedCategoryID, documentAdded, documentChanges) {
        const{isEdit,
            isConnected,
            addPanelTopic,editPanelTopic,uploadFileForTopics} = this.props;
        if(isConnected) {
            let updatedTopic = this.buildRequestData(requestData, selectedCategoryID);
            if (isEdit) {
                editPanelTopic(updatedTopic).then((response) => {
                    if (documentChanges) {
                        uploadFileForTopics( {
                            uploadedFile: documentAdded,
                            topicID: response.body.ID
                        }).then((fileResponse) => {
                            if (fileResponse) {
                                this.handleSubmitTopicResponse(response);
                            }
                        }).catch(error => {
                            console.log("Error- " + error);
                            this.showErrorToastAndClear();
                        });
                    } else {
                        this.handleSubmitTopicResponse(response);
                    }
                }).catch(error => {
                    this.showErrorToastAndClear();
                });
            }
            else {
                addPanelTopic(updatedTopic).then((response) => {
                    if (documentAdded) {
                        uploadFileForTopics( {
                                uploadedFile: documentAdded,
                                topicID: response.body.ID
                            }).then((fileResponse) => {
                                if (fileResponse) {
                                    response.body.downloadUrl = fileResponse.body.downloadUrl
                                    this.handleSubmitTopicResponse(response);
                                }
                        }).catch(error => {
                            console.log("Error- " + error);
                            this.showErrorToastAndClear();
                        });
                    } else {
                        this.handleSubmitTopicResponse(response);
                    }
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
            discussionID : selectedCategoryID
        };
        if(this.props.isEdit){
            return {...obj,topicID:this.props.topic.topicID }
        }
        return obj;

    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}


function mapStateToProps(state) {
    return {
        panelTopicCategories: state.panelTopicCategories.body,
        isLoading: state.isLoading,
        error: state.error.message,
        isConnected: state.network.isConnected,
        language: state.language.googleCode

    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AddEditTopic);
