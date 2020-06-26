import React from 'react';
import {Dimensions, FlatList, Image, NativeModules, Platform, View, StyleSheet,AsyncStorage,NativeEventEmitter} from 'react-native';
import {Actions} from 'react-native-router-flux';
import BaseComponentWithoutScroll from '../../global/components/BaseComponentWithoutScroll';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import {ActionCreators} from '../actions/index';
import CustomText from '../../global/ui/CustomText';
import OnTouchHighlightWidget from "../../global/widgets/ui/OnTouchHighlightWidget";
import {ActionBarModule} from '../../global/native-modules/NativeModules';
import {LocationModule} from '../../global/native-modules/NativeModules';
const {height, width} = Dimensions.get('window');
const screenHeight = (height - (Platform.OS === 'ios' ? 54 : 70))
const factor = width > height ? height : width;
const {ContextMenuManager} = NativeModules;
const RNFS = require('react-native-fs');
const {
    DocumentDirectoryPath
} = RNFS;


class Surveys extends BaseComponentWithoutScroll {
    constructor(props) {
        super(props);
        this.renderRow = this.renderRow.bind(this);
        this.renderSeparator = this.renderSeparator.bind(this);
        this.renderNoDataFound = this.renderNoDataFound.bind(this);
        this.processSurveyResponse = this.processSurveyResponse.bind(this);
        this.processLocationSurveyDatabaseDownload = this.processLocationSurveyDatabaseDownload.bind(this);
        this.eventEmitter = new NativeEventEmitter(ContextMenuManager);
    }

    componentWillMount(){
        super.componentWillMount();
    }

    componentDidMount() {
        console.log("componentDidMount - Home screen api hit");
        this.reloadContent();
    }
    componentWillUnmount(){
        super.componentWillUnmount();
    }


    reloadContent() {
        if(!this.props.isLoading) {
            this.props.getPanelSurvey().then(this.processSurveyResponse)
        }
    }

    processSurveyResponse(response){
       if(response){
            if (!this.props.error) {
                ActionBarModule.updateTitleAndMenu(JSON.stringify({title: this.props.title}));
            }
            else if(this.props.error) {
                this.showErrorToastAndClear();
            }

        }
        this.checkForLocationSurveyData();
    }

    checkForLocationSurveyData(){
        if(Platform.OS !== 'ios') {//On iOS it is handled natively.
            LocationModule.checkVersionAndDownloadLocationDatabase((location) => {
                    LocationModule.updateDatabaseFileLocation(location);
                },
                (error) => {
                    console.log("Error-" + error);
                })
        }
    }

    processLocationSurveyDatabaseDownload(response){
        const path = DocumentDirectoryPath + '/LocationSurvey.sqlite';
        if (response && response.body) {
            let locationSurveyData = response.body;
            let locationGroups = locationSurveyData.groups;
            if(locationGroups && locationGroups.length > 0) {
                AsyncStorage.getItem("SURVEY_DB_MODIFIED_TIME", (err, result) => {
                    if (!result ||  result != (locationSurveyData.locationSurveyDBTimestamp + "")) {
                        let originalURL =locationSurveyData.surveyDBFile;
                        const downloadOptions = {
                            fromUrl: originalURL,
                            toFile: path
                        };
                        RNFS.downloadFile(downloadOptions).promise
                            .then(res => {
                                console.log("Downloaded file path- " + JSON.stringify(res));
                                LocationModule.updateDatabaseFileLocation(path);
                            });
                        AsyncStorage.setItem("SURVEY_DB_MODIFIED_TIME", "" + locationSurveyData.locationSurveyDBTimestamp);
                    } else {
                        LocationModule.updateDatabaseFileLocation(path);
                    }
                });
            }
            else {
                console.log("No location groups. So no location Service.");
            }

        }
    }

    renderChild() {
        let surveys = [];
        if(this.props.surveyData && this.props.surveyData.surveys && this.props.surveyData.surveys.pending){
            surveys = this.props.surveyData.surveys.pending.concat(this.props.surveyData.surveys.started)
        }
        return (
            <FlatList ref={ref => this.listView = ref}
                      style={{flex: 1}}
                      keyExtractor={item => item.invitationID}
                      renderItem={this.renderRow}
                      ItemSeparatorComponent={this.renderSeparator}
                      data={surveys}
                      refreshing={false}
                      ListEmptyComponent={this.renderNoDataFound}
                      onRefresh={() => {
                          console.log("onRefresh - Home screen api hit");
                          this.reloadContent()
                      }}
            />
        )


    }

    componentWillReceiveProps(newProps) {
        if (newProps.notificationNumber !== this.props.notificationNumber) {
            console.log("componentWillReceiveProps - Home screen api hit");
            this.reloadContent();
        }
    }

    handleNavigationSceneFocus() {
        console.log("handleNavigationSceneFocus - Home screen api hit");
        this.reloadContent();
    }

    renderRow({item}) {
        return (
            <OnTouchHighlightWidget onPress={() => {
                this.handleTakeSurvey(item)
            }}>
                <View style={styles.surveyRow}>
                    <Image style={styles.surveyIcon} source={this.getSurveyIcon()}/>
                    <CustomText numberOfLines={1} style={styles.surveyTitle}>{item.title}</CustomText>
                    <Image style={styles.editIcon} source={this.getEditIcon()}/>
                </View>
            </OnTouchHighlightWidget>
        )
    }

    getEditIcon() {
        if (Platform.OS !== 'ios') {
            return require('../../global/images/edit_profile.png');
        }

        return {uri: 'edit_profile.png'};
    }

    getSurveyIcon() {
        if (Platform.OS !== 'ios') {
            return require('../../global/images/communities/survey_icon.png');
        }

        return {uri: 'survey_icon.png'};
    }

    getPaperIcon() {
        if (Platform.OS !== 'ios') {
            return require('../../global/images/communities/paper_icon.png');
        }
        return {uri: 'paper_icon.png'};
    }

    renderSeparator(sectionID, rowID, adjacentRowHiglighed) {
        return (
            <View key={rowID} style={{height: 0.5, backgroundColor: '#ECEBF0'}}>
            </View>
        )
    }

    renderNoDataFound() {
        if (!this.props.isLoading) {
            return (

                <View style={{
                    flex: 1,
                    height: screenHeight,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'white',
                    padding: 25
                }}>
                    <Image style={{height: 75, width: 75}} source={this.getPaperIcon()}/>
                    <CustomText style={{
                        color: '#9B9B9B',
                        fontSize: global.h2FontSize,
                        marginTop: 10,
                        textAlign: 'center'
                    }}>{'You\'re all caught up! Thank you for participating! We will contact you when it is time to participate again.'}</CustomText>
                </View>

            );
        }
        return (<View/>);

    }


    handleTakeSurvey(survey) {
        Actions.takesurvey({survey: survey, title: survey.title});
    }


}

const styles = StyleSheet.create({
    surveyRow: {
        flexDirection: 'row',
        padding: 20,
        alignItems: 'center'
    },
    surveyIcon: {
        height: 25,
        width: 25
    },
    surveyTitle: {
        flex: 1,
        marginHorizontal: 20,
        color: '#9B9B9B',
        fontSize: global.h1by2FontSize
    },
    editIcon: {
        height: 15,
        width: 15
    }

});

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
    return {
        surveyData: state.panelSurveyData.body,
        languageData: state.panelLanguageData.body,
        title: state.panelSurveyData.title,
        isLoading: state.isLoading,
        error: state.error.message,
        isConnected: state.network.isConnected,
        language: state.language.googleCode,
        locationSurveyData : state.locationSurveyData.body
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(Surveys);