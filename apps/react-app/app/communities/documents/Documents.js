/**
 * Created by TanviGupta on 12/02/20.
 */
import React from 'react';
import {
    Dimensions,
    StyleSheet,
} from 'react-native';

const {height, width} = Dimensions.get('window');
const factor = width > height ? height : width;
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import {ActionCreators} from '../actions/index';
import {ActionBarModule} from "../../global/native-modules/NativeModules";
import QPTabView from "../QPTabView";
import BaseComponentWithoutScroll from "../../global/components/BaseComponentWithoutScroll";
import DocumentTabScene from "./DocumentsTabScenes/DocumentTabScene";
import {Actions} from "react-native-router-flux";
import I18n from "react-native-i18n";

var dataJSON = {};

class Documents extends BaseComponentWithoutScroll {
    constructor(props) {
        super(props);
        let useTranslationForTabs = true;

        if(global.appUser.useTranslationsForTabs){
            useTranslationForTabs = global.appUser.useTranslationsForTabs ==='true';
        }
        this.state = {
            error: false,
            dataLoaded: false,
            requestData: {},
            showLoader: false,
            visible: false,
            index: 0,
            newSort: {key: 1, nameSort: 'none', dateSort: 'none'},
            readSort: {key: 2, nameSort: 'none', dateSort: 'none'},
            favSort: {key: 3, nameSort: 'none', dateSort: 'none'},
            routes: [{key: '1', title: useTranslationForTabs?  I18n.t("new", {locale: props.language})
            : "New" },
                {key: '2', title: useTranslationForTabs?  I18n.t("read", {locale: props.language})
                        : "Read"},
                {key: '3', title: useTranslationForTabs?  I18n.t("favorites", {locale: props.language})
                        : "Favorites"}],
        };
        this.takeSurveyRequested = false;
        this.previousTab = 1;
        this.currentTab = 1;
        this.favouriteData = [];
        this.newData = [];
        this.readData = [];
        this.processAPIResponse = this.processAPIResponse.bind(this);
        this.processFavouriteDone = this.processFavouriteDone.bind(this);
    }

    componentDidMount() {
        //ActionBarModule.updateTitleAndMenu(JSON.stringify({title: "Documents"}));
        this.fillData(this.props.panelDocumentsData);
        this.callGetAPIForPanelMemberDocuments();

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        //ActionBarModule.updateTitleAndMenu(JSON.stringify({title: "Documents"}));
        if (this.takeSurveyRequested) {
            this.takeSurveyRequested = false;
            this.callGetAPIForPanelMemberDocuments();
        }

    }

    callGetAPIForPanelMemberDocuments() {
        this.props.callApiForPanelMemberDocuments({}).then(this.processAPIResponse);
    }

    processAPIResponse(response) {
        dataJSON = JSON.stringify(response);
        let body = response.body
        this.fillData(body)
    }

    fillData(body) {
        if (Object.keys(body).length !== 0) {
            this.favouriteData = [];
            this.newData = body.new ? [...body.new] : [];
            this.readData = body.read ? [...body.read] : [];
            let newFavData = this.newData.filter(item => item.favourite === 1)
            let readFavData = this.readData.filter(item => item.favourite === 1)
            for (let count = 0; count < newFavData.length; count++) {
                this.favouriteData.push(newFavData[count])
            }
            for (let count = 0; count < readFavData.length; count++) {
                this.favouriteData.push(readFavData[count])
            }
        }
        this.setState({dataLoaded: true, error: false, showLoader: false});
    }

    componentWillMount() {
        super.componentWillMount();
    }

    _handleChangeTab = (index) => {
        this.previousTab = this.currentTab;
        this.currentTab = index;
        this.setState({
            index,
        });

    };

    updateNameAccordingToTheKey = (key, value) => {
        switch (key) {
            case '1':
               let newSort = this.state.newSort;
                newSort.nameSort = value;
                this.setState({newSort: newSort});
                break;
            case '2':
                let readSort = this.state.readSort;
                readSort.nameSort = value;
                this.setState({readSort: readSort});
                break;
            case '3':
                let favSort = this.state.favSort;
                favSort.nameSort = value;
                this.setState({favSort: favSort});
                break;
        }
    }

    updateDateAccordingToTheKey = (key, value) => {
        switch (key) {
            case '1':
                let newSort = this.state.newSort;
                newSort.dateSort = value;
                this.setState({newSort: newSort});
                break;
            case '2':
                let readSort = this.state.readSort;
                readSort.dateSort = value;
                this.setState({readSort: readSort});
                break;
            case '3':
                let favSort = this.state.favSort;
                favSort.dateSort = value;
                this.setState({favSort: favSort});
                break;
        }
    }


    getDefaultValue(key) {
        switch (key) {
            case '1':
                return this.props.panelDocumentsData.new ? this.props.panelDocumentsData.new : [];
            case '2':
                return this.props.panelDocumentsData.read ? this.props.panelDocumentsData.read : [];
                break;
            case '3':
                let favouriteData = [];
                let tmpNewData = this.props.panelDocumentsData.new ? this.props.panelDocumentsData.new : [];
                let tmpReadData = this.props.panelDocumentsData.read ? this.props.panelDocumentsData.read : [];
                let newFavData = tmpNewData.filter(item => item.favourite === 1)
                let readFavData = tmpReadData.filter(item => item.favourite === 1)
                for (let count = 0; count < newFavData.length; count++) {
                   favouriteData.push(newFavData[count])
                }
                for (let count = 0; count < readFavData.length; count++) {
                    favouriteData.push(readFavData[count])
                }
             return favouriteData
        }
    }

    getCategoriesForSettings = (data, sortSetting, key) => {
        if (sortSetting.nameSort === 'none' &&  sortSetting.dateSort === 'none') {
            return this.getDefaultValue(key);
        }
        if (sortSetting.nameSort === 'increasingOrder' && sortSetting.dateSort === 'none') {
            let sortedArray = data.sort(function (a, b) {
                if (a.panelDocumentName.toLowerCase() < b.panelDocumentName.toLowerCase()) return -1;
                else if (a.panelDocumentName.toLowerCase() > b.panelDocumentName.toLowerCase()) return 1;
                return 0;
            });
            return sortedArray ? [...sortedArray] : data;
        }
        if (sortSetting.nameSort === 'decreasingOrder' && sortSetting.dateSort === 'none') {
            let reverseSortedArray = data.sort(function (a, b) {
                if (a.panelDocumentName.toLowerCase() > b.panelDocumentName.toLowerCase()) return -1;
                else if (a.panelDocumentName.toLowerCase() < b.panelDocumentName.toLowerCase()) return 1;
                return 0;
            });

            return reverseSortedArray ? [...reverseSortedArray] : data;
        }
        if (sortSetting.nameSort === 'none' && sortSetting.dateSort === 'increasingOrder') {
            let dateSortArray = data.sort(function compare(a, b) {
                var dateA = new Date(a.creationTimeStamp);
                var dateB = new Date(b.creationTimeStamp);
                return dateA - dateB;
            });

            return dateSortArray ? [...dateSortArray] : data;
        }
        if (sortSetting.nameSort === 'none' && sortSetting.dateSort === 'decreasingOrder') {
            let dateSortArray = data.sort(function compare(a, b) {
                var dateA = new Date(a.creationTimeStamp);
                var dateB = new Date(b.creationTimeStamp);
                return dateA - dateB;
            }).reverse();

            return dateSortArray ? [...dateSortArray] : data

        }
        return data;
    }

    getDataCategoriesAccordingToTheSettings(key) {
        switch (key) {
            case '1':
                return {categories: this.getCategoriesForSettings(this.newData, this.state.newSort, key) };
            case '2':
                return {categories: this.getCategoriesForSettings(this.readData, this.state.readSort, key)};
            case '3':
                return {categories: this.getCategoriesForSettings(this.favouriteData, this.state.favSort, key)};
            default:
                return {categories: []};
        }

    }

    getSortState = (key) => {
        switch (key) {
            case '1':
                return this.state.newSort;
            case '2':
                return this.state.readSort;
            case '3':
                return this.state.favSort;
        }
    }

    handleTakeSurvey(document) {
        this.takeSurveyRequested = true;
        let documentURL = document.downloadUrl
        documentURL = documentURL.substring(1)
        documentURL = global.BASE_URL + documentURL;
        Actions.documentViewer({documentUrl: documentURL, title: document.panelDocumentName, document: document});
    }



    handleFavourite(survey) {
        let addFavSurvey = survey
        addFavSurvey.favourite = addFavSurvey.favourite === 1 ? 0 : 1;
        this.props.updatePanelMemberDocuments(addFavSurvey).then(this.processFavouriteDone);
    }

    processFavouriteDone(response) {
        this.callGetAPIForPanelMemberDocuments();
    }

    /** Rendering cycles*/
    _renderScene = ({route}) => {
        if (this.state.index == this.state.routes.indexOf(route)) {
            const routeProps = this.getDataCategoriesAccordingToTheSettings(route.key)
            return (<DocumentTabScene {...routeProps}
                                      {...this.props}
                                      routeKey={route.key}
                                      sortState={this.getSortState(route.key)}
                                      surveySelected={(data) => {
                                          if (this.props.isConnected && data.category) {
                                              this.handleTakeSurvey(data.category);
                                          }

                                      }}
                                      favouriteSelected={(data) => {
                                          if (this.props.isConnected && data.category) {
                                              this.handleFavourite(data.category);
                                          }
                                      }}
                                      nameSortingEnabled={(type) => {
                                        this.updateNameAccordingToTheKey(route.key,type);
                                      }}
                                      dateSortingEnabled={(type) => {
                                         this.updateDateAccordingToTheKey(route.key,type);
                                      }}
                                      onPress={(data) => {
                                          this.callGetAPIForPanelMemberDocuments();
                                      }}/>);
        }
    };

    renderChild() {
        return (
            <QPTabView navigationState={this.state}
                           renderScene={this._renderScene}
                                 onIndexChange={this._handleChangeTab}/>);
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: '#F9F9F9',
        marginTop: 8,
        marginBottom: 8,
        marginLeft: 15,
        marginRight: 15
    },
    titleContainer: {
        backgroundColor: '#EEF0EF',
        height: Math.round(factor * 0.10)
    },
    titleText: {
        color: '#616970',
        justifyContent: 'center',
        marginLeft: 10,
        fontWeight: 'normal',
        fontSize: 14,
        fontStyle: 'italic'
    },
    content: {
        flex: 1,
        flexDirection: 'row',

    },
});

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
    return {
        panelDocumentsData: state.panelDocumentsData.body,
        isLoading: state.isLoading,
        error: state.error.message,
        isConnected: state.network.isConnected,
        language: state.language.googleCode
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(Documents);
