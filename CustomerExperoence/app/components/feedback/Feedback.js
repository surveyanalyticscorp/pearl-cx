/* eslint-disable */
import React, {useState, useEffect} from 'react';
import {Dimensions, Text, View} from 'react-native';
import {TabView, TabBar} from 'react-native-tab-view';

import FeedbackAll from './FeedbackAll';
import {Colors} from '../../styles/color.constants';
import {fontFamily} from '../../styles/font.constants';
import {TextSizes} from '../../styles/textsize.constants';
import {MarginConstants} from '../../styles/margin.constants';

const initialLayout = {width: Dimensions.get('window').width};
import {EventRegister} from 'react-native-event-listeners';
import CalendarScreen from '../view/calendarScreen';
import {getFeedbackList} from '../../redux/actions/feedback.actions';
import {connect} from 'react-redux';
import {DotIndicator} from 'react-native-indicators';
import {showMessage} from 'react-native-flash-message';
import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';
import {ASYNC_AUTH_TOKEN} from '../../api/Constant';

const Feedback = props => {
    let month = moment().month() + 1; //Need to check as it returns month number starting 0
    let year = moment().year();

    const [authToken, setAuthToken] = useState('');

    const [calendar, setCalendar] = useState(false);
    const [getFeedbackApi, setFeedbackAPI] = useState(true);
    const [selectedYear, setSelectedYear] = useState({month: month, year: year});
    const [index, setIndex] = useState(0);
    const [routes] = React.useState([
        {key: 'all', title: 'ALL'},
        {key: 'detractor', title: 'DETRACTOR'},
        {key: 'passive', title: 'PASSIVE'},
        {key: 'promoter', title: 'PROMOTER'},
    ]);

    useEffect(() => {
        async function getAuthToken() {
            return await AsyncStorage.getItem(ASYNC_AUTH_TOKEN);
        }

        if (getFeedbackApi) {
            getAuthToken().then(token => {
                setAuthToken(token);
                const data = {
                    pageOffset: 0,
                    sentiment: 'All',
                    month: selectedYear.month + '',
                    year: selectedYear.year + '',
                };
                props.getFeedbackList(
                    data,
                    token,
                );
            });
            setFeedbackAPI(false);
        }


    }, [selectedYear, getFeedbackApi]);

    useEffect(() => {
        this.listener = EventRegister.addEventListener('openCalendar', data => {
            setCalendar(true);
        });
        return () => {
            EventRegister.removeEventListener(this.listener);
        };
    }, []);

    useEffect(() => {
        if (props.isError) {
            showMessage({
                message: props.errorMessage.message,
                type: 'error',
                icon: 'auto',
            });
            let timer = setTimeout(() => {
                props.cleanError();
            }, 1000);
            return () => {
                clearTimeout(timer);
            };
        }
    }, [props.isError]);

    const renderScene = ({route}) => {
        switch (route.key) {
            case 'all':
                return <FeedbackAll {...props}
                                    authToken={authToken}
                                    sentiment={'All'}
                                    onRefresh={() => {
                                        setFeedbackAPI(true);
                                    }}/>;
            case 'detractor':
                return <FeedbackAll {...props}
                                    authToken={authToken}
                                    sentiment={'Detractor'}
                                    onRefresh={() => {
                                        setFeedbackAPI(true);
                                    }}/>;
            case 'passive':
                return <FeedbackAll {...props}
                                    authToken={authToken}
                                    sentiment={'Passive'}
                                    onRefresh={() => {
                                        setFeedbackAPI(true);
                                    }}/>;
            case 'promoter':
                return <FeedbackAll {...props}
                                    authToken={authToken}
                                    sentiment={'Promoter'}
                                    onRefresh={() => {
                                        setFeedbackAPI(true);
                                    }}/>;
            default:
                return <FeedbackAll {...props}
                                    authToken={authToken}
                                    sentiment={'All'}
                                    onRefresh={() => {
                                        setFeedbackAPI(true);
                                    }}/>;
        }
    };


    const renderCalendarView = () => {
        return (<CalendarScreen
            showCalendar={calendar}
            closeCalendar={() => {
                setCalendar(false);
            }}
            onSubmit={(selectedYear) => {
                setFeedbackAPI(true);
                setSelectedYear(selectedYear);
                setCalendar(false);
            }}
        />);
    };


    const renderTabView = () => {
        return (<View style={{flex: 1}}>
            <TabView
                navigationState={{index, routes}}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={initialLayout}
                renderTabBar={props =>
                    <TabBar
                        {...props}
                        labelStyle={{
                            indicatorStyle: {backgroundColor: '#FF0000'},
                            scrollEnabled: true,
                            labelStyle: {color: '#000000', fontSize: 12},
                            tabStyle: {width: 150},

                        }}
                        indicatorStyle={{backgroundColor: Colors.red}}
                        style={{backgroundColor: 'white'}}
                        scrollEnabled={true}
                        tabStyle={{minHeight: 30, width: 150}} // here
                        renderLabel={({route, focused, color}) => (
                            <Text style={{
                                color: Colors.primary, fontFamily: fontFamily.Medium,
                                fontSize: TextSizes.secondary, marginVertical: MarginConstants.tab1,
                            }}>
                                {route.title}
                            </Text>
                        )}
                    />}
            />
            {props.isLoading && (
                <DotIndicator color="#2589E3" count={3} size={10}/>
            )}
        </View>);
    };

    return calendar ? renderCalendarView() : renderTabView();

};
const mapStateToProps = state => {
    return {
        feedback: state.feedback,
        isLoading: state.global.isLoading,
        isError: state.global.isError,
        errorMessage: state.global.errorMessage,
    };
};
// Map Dispatch To Props (Dispatch Actions To Reducers. Reducers Then Modify The Data And Assign It To Your Props)
const mapDispatchToProps = dispatch => ({
    getFeedbackList: (data, token) => {
        dispatch(getFeedbackList(data, token));
    },
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Feedback);

