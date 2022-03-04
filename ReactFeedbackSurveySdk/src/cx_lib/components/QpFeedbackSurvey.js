/*
 * Datta Kunde created on 15/12/21
 */

import React, {useState, useEffect} from 'react';
import {View, ActivityIndicator, Alert, AsyncStorage} from 'react-native';
import {WebView} from 'react-native-webview';
import {getSurveyUrl} from '../QuestionProCx';
import SurveyHeader from './SurveyHeader';
import GLOBAL from '../utils/global.js';
import {
    CX_SURVEY_HEADER,
    CX_THEME_COLOR,
    qpColor,
    qpErrorMsg,
    qpString,
} from '../utils/QpConstant';

export const QpFeedbackSurvey = props => {
    const [isLoading, setIsLoading] = useState(true);
    const [showAlert, setShowAlert] = useState(false);
    const [surveyUrl, setSurveyUrl] = useState('');
    const [headerText, setHeaderText] = useState('');
    const [themeColor, setThemeColor] = useState(qpColor.defaultTheme);

    useEffect(() => {
        if (GLOBAL.initialized) {
            getSurveyUrl(props.surveyId).then(apiResponse => {
                console.log('getSurveyUrl: ' + JSON.stringify(apiResponse));
                setIsLoading(false);
                if(apiResponse){
                    console.log('Survey Url: '+ apiResponse.SurveyURL);
                    setSurveyUrl(apiResponse.SurveyURL);
                }else{
                    if (typeof props.onSurveyFinished === 'function') {
                        props.onSurveyFinished();
                    }
                }
            });
        } else {
            setIsLoading(false);
            try {
                if (typeof props.onSurveyFinished === 'function') {
                    props.onSurveyFinished();
                }
            }catch (e) {
                console.error(e.toString());
            }
            console.error(qpErrorMsg.init);
        }

        AsyncStorage.getItem(CX_SURVEY_HEADER).then(surveyHeader => {
            setHeaderText(surveyHeader);
        });

        AsyncStorage.getItem(CX_THEME_COLOR).then(themeColorStr => {
            themeColorStr && setThemeColor(themeColorStr);
        });
    }, []);

    const renderDialog = () => {
        return Alert.alert(
            qpString.survey_exit_confirmation_message,
            '',
            [
                {
                    text: qpString.yes,
                    onPress: onSurveyExit,
                },
                {
                    text: qpString.no,
                    onPress: () => {
                        setShowAlert(false);
                    },
                },
            ],
            {cancelable: false},
        );
    };

    const onSurveyExit = () => {
        console.log('On Survey Exit...');
        try {
            if (typeof props.onSurveyFinished === 'function') {
                props.onSurveyFinished();
            }
        }catch (e) {
            console.error(e.toString())
        }
    };

    return (
        <View style={{flex: 1}}>
            {
                <SurveyHeader
                    headerLable={headerText}
                    themeColor={themeColor}
                    onSurveyExit={() => setShowAlert(true)}
                />
            }
            {!isLoading && (
                <WebView
                    source={{
                        uri: surveyUrl,
                    }}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    startInLoadingState={true}
                    showsVerticalScrollIndicator={false}
                    onNavigationStateChange={e => {
                        //console.warn('current state is ', JSON.stringify(e, null, 2));
                        //code: -1001
                        // description: "The request timed out."
                        if (
                            e.url.includes('#autoClose') ||
                            e.title.includes(qpString.survey_exit_web_view_title)
                        ) {
                            console.log('Survey Finished....');
                            setTimeout(() => {
                                try{
                                    if (typeof props.onSurveyFinished === 'function') {
                                        props.onSurveyFinished();
                                    }
                                }catch (e) {
                                    console.error(e.toString())
                                }
                            }, 3000);
                        }
                    }}
                />
            )}
            {isLoading && <ActivityIndicator size="large" color={themeColor}/>}
            {showAlert && renderDialog()}
        </View>
    );
};

