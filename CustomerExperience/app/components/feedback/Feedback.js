import React, {useState, useEffect, useRef} from 'react';
import {Dimensions, Text, View, StyleSheet} from 'react-native';
import {TabView, TabBar} from 'react-native-tab-view';
import FeedbackAll from './FeedbackAll';
import {Colors} from '../../styles/color.constants';
import {fontFamily} from '../../styles/font.constants';
import {TextSizes} from '../../styles/textsize.constants';
import {MarginConstants} from '../../styles/margin.constants';
import {EventRegister} from 'react-native-event-listeners';
import CalendarScreen from '../view/calendarScreen';
import {getFeedbackList, setFeedbackRangeFilter} from '../../redux/actions/feedback.actions';
import {connect} from 'react-redux';
import {showMessage} from 'react-native-flash-message';
import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';
import {ASYNC_AUTH_TOKEN} from '../../api/Constant';
import {clearError, showLoading} from '../../redux/actions';
import {isObjectEmpty} from '../../Utils/Utility';
import QPSpinner from '../../widgets/QPSpinner';
import {PaddingConstants} from '../../styles/padding.constants';

const initialLayout = {width: Dimensions.get('window').width};

const Feedback = props => {
    let month = props.feedback.range.month ? props.feedback.range.month : moment().month() + 1; //Need to check as it returns month number starting 0
    let year = props.feedback.range.year ? props.feedback.range.year : moment().year();

    let listener = useRef(null);

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
        if(!isObjectEmpty(props.feedback)){
            props.showLoading(false);
        }
    },[props.feedback]);

    useEffect(() => {
        listener = EventRegister.addEventListener('openCalendar', data => {
            setCalendar(true);
        });
        return () => {
            EventRegister.removeEventListener(listener);
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
                props.clearError();
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
            selectedDate={selectedYear}
            onSubmit={(selectedYear) => {
                setFeedbackAPI(true);
                setSelectedYear(selectedYear);
                setCalendar(false);
                props.setRange(selectedYear);
            }}
        />);
    };


    const renderTabView = () => {
        return <TabView
                    navigationState={{index, routes}}
                    renderScene={renderScene}
                    onIndexChange={setIndex}
                    initialLayout={initialLayout}
                    renderTabBar={props =>
                        <TabBar
                            {...props}
                            labelStyle={{
                                indicatorStyle: {backgroundColor: '#FF0000'},
                                scrollEnabled: false,
                                labelStyle: {color: '#000000', fontSize: 12, width: initialLayout.width/5},
                            }}
                            indicatorStyle={{backgroundColor: Colors.red}}
                            style={{backgroundColor: 'white', width: '100%'}}
                            scrollEnabled={false}
                            tabStyle={{height: 2*PaddingConstants.tab4}}
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
    };

    let renderSpinner = () => {
        if(props.isLoading) {
            return (
                <View style={styles.loading}>
                    <QPSpinner/>
                </View>
            )
        }
    };

    return (
        <View style={styles.container}>
            {calendar ? renderCalendarView() : renderTabView()}
            {renderSpinner()}
        </View>

    )

};
const mapStateToProps = state => {
    return {
        feedback: state.feedback,
        isLoading: state.global.isLoading,
        isError: state.global.isError,
        errorMessage: state.global.errorMessage,
    };
};

const mapDispatchToProps = dispatch => ({
    clearError: () => {
        dispatch(clearError(false));
    },
    getFeedbackList: (data, token) => {
        dispatch(showLoading(true));
        dispatch(getFeedbackList(data, token));
    },
    showLoading: (flag) => {
        dispatch(showLoading(flag));
    },
    setRange: (range) => {
        dispatch(setFeedbackRangeFilter(range))
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Feedback);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
    }

});
