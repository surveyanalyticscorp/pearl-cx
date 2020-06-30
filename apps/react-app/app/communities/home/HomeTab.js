import React from 'react';
import {
    AsyncStorage,
    Dimensions,
    Platform,
    NativeEventEmitter,
    NativeModules,
    StyleSheet,
    View,
    Text, Image
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import BaseComponentWithoutScroll from '../../global/components/BaseComponentWithoutScroll';
import AlertWidget from '../../global/widgets/AlertWidget';
import ScrollViewWithRefreshControl from '../../global/ui/ScrollViewWithRefreshControl';

import PollResultWidget from './PollResultWidget';
import PollQuestionWidget from './PollQuestionWidget';
import NewsFeedItem from './NewsFeedItem';
import {ActionBarModule} from '../../global/native-modules/NativeModules';

const {height, width} = Dimensions.get('window');
const factor = width > height ? height : width;
const {ContextMenuManager} = NativeModules;
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import {ActionCreators} from '../actions/index';
import I18n from 'react-native-i18n';
import {SizeConstants} from "../../global/style/size.constants";
const RNFS = require('react-native-fs');
const {
    DocumentDirectoryPath
} = RNFS;
class HomeTab extends BaseComponentWithoutScroll {
    constructor(props) {
        super(props);
        this.eventEmitter = new NativeEventEmitter(ContextMenuManager);
        this.processAPIResponse = this.processAPIResponse.bind(this);
        this.state = {uploadResponseArray: [], pollAnswered: false, showAlert: false, showingSurvey: false}
        this.callProfileDataApi()
    }

    componentDidMount() {
        if (Platform.OS === 'ios') {
            if (this.props.LANGUAGE_ID !== "en") {
                let langugaeSelected = this.props.languageData.languages.filter(lang => lang.googleCode === this.props.LANGUAGE_ID)
                if (langugaeSelected) {
                    ActionBarModule.updateLanguageMenuTitle(langugaeSelected[0].languageName);

                }
            }
        }
        AsyncStorage.setItem(global.getReloadKey, 'false');
        if (global.fromLogin) {
            setTimeout(() => {
                global.fromLogin = false;
                this.getPanelLanguageData();
            }, 100);

        }else{
            this.callGetAppSupportedLanguages();
        }

        if ((!this.state.dataLoaded && !this.state.error)) {
          this.getPanelHome();
        }
    }



    componentWillMount() {
        super.componentWillMount();
        this.reloadListner = this.eventEmitter.addListener('reloadScreen', (isReload) => {
            this.requestData = {};
            this.reloadContent();
        });
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this.props.navigationStateHandler.unregisterFocusHook(this);
        this.reloadListner.remove();
    }

    setLanguage(languageData, languageID) {
        if (languageData.languages) {
            let langugaeSelected = languageData.languages.filter(lang => lang.languageID === languageID);
            if (langugaeSelected) {
                this.getPanelHome();
                ActionBarModule.updateLanguageMenuTitle(langugaeSelected[0].languageName);

            } else {
                this.getPanelHome();
            }
        }
    }

    callProfileDataApi() {
        if(this.props.profileData === undefined) {
            this.props.getProfileDetails({}).then(() => {
                console.log("profile data updated")
            });
        }
    }

    handleNavigationSceneFocus() {
        //  this.reloadContent();
    }

    componentWillReceiveProps(newProps) {
        // console.log("componentWillReceiveProps" + JSON.stringify(newProps));
        if (newProps.notificationNumber !== this.props.notificationNumber) {
            this.reloadContent();
        }

    }

    reloadContent() {
        this.getPanelHome();
    }

    processAPIResponse(response) {
        if(this.props.homeData) {
            if (this.props.homeData.ALERT &&  this.props.homeData.ALERT.links.appLink.length !== 0) {
                this.checkAlertInfo(this.props.homeData.ALERT.links.appLink[0]);
            }
            this.setState({pollAnswered: false, reloadContent: false, showSurvey: false});
            ActionBarModule.updateTitleAndMenu(JSON.stringify({title: this.props.title}));
        }

        this.checkForLocationSurveyData();
    }






    processPollSubmitResponse(result) {
        this.props.homeData.poll.result = result;
        this.setState({dataLoaded: true, error: false, showLoader: false, pollAnswered: true});
    }


    getPanelHome =()=> {
        setTimeout(() => {
            if (!this.props.isLoading) {
                this.props.getPanelHome({"type": [5, 6]}).then(this.processAPIResponse);
            }
        }, 100);
    };

    getSelectedLanguageGoogleCode  = () => {
        if (this.props.languageData) {
            let selectedLanguageID = this.props.languageData.languageID;
            let langugaeSelected = this.props.languageData.languages.filter(lang => lang.languageID === selectedLanguageID);
            if (langugaeSelected) {
                return langugaeSelected[0].googleCode
            }
        }
        return "en"
    };

    getPanelLanguageData() {
        this.props.getPanelLanguageList().then((response) => {
            if (this.props.languageData.languages.length > 1) {
                this.setLanguage(this.props.languageData, this.props.languageData.languageID);
            } else {
                this.getPanelHome();
            }
        });
    }

    /**
     * Used to get list language from panel with help of API
     */
    callGetAppSupportedLanguages(){
        this.props.getPanelLanguageList().then((response) => {
            this.getPanelHome();
        });
    }


    getAnswers=(answerList) =>{
        for (var i = 0; i < answerList.length; i++) {
            answerList[i].isSelected = false
        }
        return answerList;
    };


    showPollQuestion(pollData) {
        return (
            <View style={styles.mainContainer}>
                <View style={{flex: 1}}>
                    <PollQuestionWidget
                        title={pollData.polls.question.text}
                        style={{backgroundColor: 'red', marginTop: 10, marginBottom: 10, flex: 1}}
                        question={pollData.polls.question}
                        answers={this.getAnswers(pollData.polls.answers)}
                        survey={pollData.polls.survey}
                        questionType={pollData.polls.type}
                        onSubmitResult={(result) => {
                            this.processPollSubmitResponse(result);
                            console.log('submit button clicked ');
                        }}>
                    </PollQuestionWidget>
                </View>
            </View>

        );
    }

    showPoll() {
        let contents = (<View></View>);
        if (this.props.homeData.poll && this.props.homeData.poll.polls) {
            let pollData = this.props.homeData.poll;
            if (pollData.polls.sticky) {
                if (!pollData.pollTaken && !this.state.pollAnswered ) {
                    contents = this.showPollQuestion(pollData);
                } else {
                    contents = this.showPollResult(pollData);
                }
            } else {
                if (!this.state.pollAnswered) {
                    contents = this.showPollQuestion(pollData);
                } else {
                    contents = this.showPollResult(pollData);
                }
            }
        }
        return contents;
    }



    showPollResult(pollData) {
        const {language} = this.props;
        return (<View style={styles.mainContainer}>
            <View style={styles.content}>
                <View style={{flex: 1}}>
                    <PollResultWidget
                        title={I18n.t('poll', {locale: language}) + pollData.polls.question.text}
                        result={this.props.homeData.poll.result}/>
                </View>
            </View>

        </View>);

    }

    handleTakeSurvey(survey) {
        Actions.takesurvey({survey: survey, title: survey.title});
    }


    handleAlertAction(alertData) {
        try {
            let alertValue = alertData.ID;
            AsyncStorage.setItem(global.getAlertKey, alertValue.toString());
            this.setState({showAlert: false});
        } catch (error) {
            console.log('AsyncStorage error: ' + error.message);
        }
    }

    checkAlertInfo(alertData) {
        try {
            if (AsyncStorage.getItem(global.getAlertKey)) {
                AsyncStorage.getItem(global.getAlertKey, (err, result) => {
                    if (result !== null && result === alertData.ID.toString()) {
                        this.setState({showAlert: false});
                    } else {
                        this.setState({showAlert: true});
                    }
                });
            } else {
                this.setState({showAlert: true});
            }
        } catch (error) {
            console.log('AsyncStorage error: ' + error.message);
        }
    }

    showAlert() {

        if (this.props.homeData.ALERT.links.appLink.length !== 0) {
            let linkData = this.props.homeData.ALERT.links;
            let firstAppLink = linkData.appLink[0];
            if (this.state.showAlert) {
                return (

                    <AlertWidget
                        ref="AlertWidget"
                        titleText={firstAppLink.title}
                        messageText={firstAppLink.subTitle}
                        onPress={() => {
                            this.handleAlertAction(firstAppLink);
                        }}>
                    </AlertWidget>
                );
            } else {
                return (<View></View>);
            }
        } else {
            return (<View></View>);
        }
    }

    showNewsFeed() {
        if (this.props.homeData.NEWS.links.appLink.length !== 0) {
            let linkData = this.props.homeData.NEWS.links;
            let language = this.props.language;
            let contents = [];
            linkData.appLink.map((item, index) => {
                if(item.active) {
                    contents.push(
                        <View key={item.ID} style={{marginVertical: 5}}>
                            <NewsFeedItem newsFeedItem={item}
                                          readMoreText={I18n.t('read_more', {locale: language})}
                                          showLessText={I18n.t('show_less', {locale: language})}/>
                        </View>
                    );
                }
            });
            return contents;
        }
        else {
            return (<View></View>);
        }
    }

    renderAppLogo() {
        return (<View style={{justifyContent: "center",alignItems: 'center',marginHorizontal: Math.round(factor * 0.018), marginVertical: Math.round(factor * 0.018)}}>
            <Image
                resizeMode={"contain"}
                source={require('../../global/images/HTCollabsIcon.png')}
                style={{height: SizeConstants.logoHeight, width: "70%"}}>
            </Image>
        </View>)
    }


    renderChild() {
        let contents = [];
        const {language} = this.props;
        if (this.props.homeData && JSON.stringify(this.props.homeData) != '{}') {

            const showLogo = this.showAppLogo();
            const alertNotShowing = this.isAlertShowing();
            const pollNotShowing = this.isPollShowing();
            const surveyNotShowing = this.isSurveyShowing();
            const newsNotShowing = this.isNewsShowing();

            if (alertNotShowing && pollNotShowing && surveyNotShowing && newsNotShowing ) {

                contents = <View style={{backgroundColor: 'white',
                    flex: 1,
                    justifyContent: 'center', alignItems: 'center', margin: 10}}>
                    {showLogo && this.renderAppLogo()}
                    <Text style={{
                        color: '#616970',
                        justifyContent: 'center',
                        fontFamily: global.primaryText,
                        fontSize: global.h2FontSize}}>
                        {"There are no new studies at this time, feel free to explore and post comments in the collaborate feature available in the navigation menu"}
                    </Text>
                </View>;

            } else {
                contents = <View style={{flex: 1, backgroundColor: 'white'}}>
                    {showLogo && this.renderAppLogo()}
                    <View>
                        {this.showAlert()}
                    </View>
                    <View>
                        {this.showPoll()}
                    </View>
                    <View>
                        {this.showNewsFeed()}
                    </View>
                </View> ;
            }
        }
        else {
            contents = <View style={{backgroundColor: 'white', flex: 1}}></View>;
        }
        return (
            <ScrollViewWithRefreshControl
                onRefresh={() => {
                    if (this.props.homeData && this.props.homeData.poll && this.props.homeData.poll.polls) {
                        let pollData = this.props.homeData.poll;
                        if (!pollData.polls.sticky) {
                            this.setState({pollAnswered: false});
                        }}
                    this.reloadContent();
                }}>
                {contents}

            </ScrollViewWithRefreshControl>
        );

    }

    showAppLogo() {
        return this.props.APP_NAME === "HealthTrust Collaboratives";
    }

    isAlertShowing() {
        if (this.props.homeData.ALERT.links.appLink.length !== 0) {
            return false;
        }
        return  true;
    }

    isPollShowing() {
        if (this.props.homeData.poll && this.props.homeData.poll.polls) {
            return false;
        }
        return true;
    }

    isSurveyShowing() {
        if (this.props.homeData.survey && this.props.homeData.survey.surveys.length > 0) {
            return false;
        }
        return true;
    }

    isNewsShowing(){
        if (this.props.homeData.NEWS.links.appLink.length !== 0) {
            return false;
        }
        return true;
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
        homeData: state.panelHomeData.body,
        languageData: state.panelLanguageData.body,
        title: state.panelHomeData.title,
        isLoading: state.isLoading,
        error: state.error.message,
        isConnected: state.network.isConnected,
        language: state.language.googleCode,
        locationSurveyData : state.locationSurveyData.body,
        profileData: state.panelProfileData.body,
    };
}



export default connect(mapStateToProps, mapDispatchToProps)(HomeTab);
