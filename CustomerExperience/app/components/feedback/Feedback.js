import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import FeedbackCell from './FeedbackCells';
import {MarginConstants} from '../../styles/margin.constants';
import {StackActions} from '@react-navigation/native';
import {Colors} from '../../styles/color.constants';
import {clearError, showLoading} from '../../redux/actions';
import {getFeedbackList, setFeedbackRangeFilter} from '../../redux/actions/feedback.actions';
import {connect} from 'react-redux';
import QPSpinner from '../../widgets/QPSpinner';
import {showMessage} from 'react-native-flash-message';
import {isObjectEmpty, usePrevious} from '../../Utils/Utility';
import ArrayUtils from '../../Utils/ArrayUtils';
import {TextSizes} from '../../styles/textsize.constants';
import {PaddingConstants} from '../../styles/padding.constants';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import FilterHeader from '../FilterHeader';
import moment from 'moment';
import {DMYFORMAT, YMDFORMAT} from '../../Utils/AppConstants';
import StringUtils from '../../Utils/StringUtils';
import {getSelectedRange} from '../../Utils/DateFilterUtility';
import SafeAreaView from 'react-native-safe-area-view';

const FeedbackTab = createMaterialTopTabNavigator();

export default function Feedback(props){
    let [callApi, setCallAPI] = useState(false);
    let [comparision, setComparision] = useState(false);

    const renderFeedbackView = () => {
        return(
            <SafeAreaView forceInset={{top: 'never',bottom:'never'}} style={styles.safeAreaView}>
                <FilterHeader actionOnArrowClick = {() => {
                    setComparision(true)
                }}
                              callDataAPI = {() => {
                                  setCallAPI(true)
                              }}
                              {...props}
                />
                <FeedbackTabStack comparisionProp={comparision} apiProp ={callApi}/>
            </SafeAreaView>
        )
    };
    return renderFeedbackView();
}

const FeedbackTabStack = () => (
    <FeedbackTab.Navigator tabBarOptions={{
        labelStyle: {color: Colors.primary, width: useWindowDimensions().width/4, fontSize: TextSizes.secondary},
        indicatorStyle: {backgroundColor: Colors.accent},
        style:{backgroundColor: Colors.white, width: '100%'},
        initialLayout: {width: useWindowDimensions().width},
        tabStyle:{height: 1.7*PaddingConstants.tab4}
    }}
                           keyboardDismissMode={'auto'}
    >
        <FeedbackTab.Screen name="All" component={FeedbackTabScreen} />
        <FeedbackTab.Screen name="Detractor" component={FeedbackTabScreen} />
        <FeedbackTab.Screen name="Passive" component={FeedbackTabScreen} />
        <FeedbackTab.Screen name="Promoter" component={FeedbackTabScreen} />
    </FeedbackTab.Navigator>
);

const renderFeedbackScene = (props) => {

    let [feedbackData, setFeedbackData] = useState([]);
    let [callApi, setCallAPI] = useState(props.apiProp || false);
    let [comparision, setComparision] = useState(props.comparisionProp || false);

    let prevRangeRef = usePrevious(props.range);

    let getFeedbackData = () => {
        /**
         * To avoid multiple API calls for each tab
         * */
        if(!props.isLoading) {
            const data = {
                pageOffset: 0,
                sentiment: 'All',
                startDate: moment(props.range.startDate, DMYFORMAT).format(YMDFORMAT),
                endDate: moment(props.range.endDate, DMYFORMAT).format(YMDFORMAT)
            };
            props.getFeedbackList(
                data,
                props.authToken,
            );
        }
    };

    useEffect(() => {
        if(StringUtils.isEmpty(props.range.startDate) && StringUtils.isEmpty(props.range.endDate) && !props.isLoading) {
            let selectedRange = getSelectedRange({type:1});
            props.setRange({
                type: 1,
                startDate: selectedRange.startDate,
                endDate: selectedRange.endDate
            });
            let data = {
                pageOffset: 0,
                sentiment: 'All',
                startDate: moment(selectedRange.startDate, DMYFORMAT).format(YMDFORMAT),
                endDate: moment(selectedRange.endDate, DMYFORMAT).format(YMDFORMAT)
            };
            props.getFeedbackList(data, props.authToken);
        } else {
            getFeedbackData()
        }
    }, []);

    useEffect(() => {
        if(prevRangeRef && prevRangeRef !== props.range) {
            getFeedbackData();
        }
    },[props.range]);

    useEffect(() => {
        if (callApi && StringUtils.isNotEmpty(props.range.startDate)) {
            getFeedbackData();
            setCallAPI(false);
        }
    }, [callApi]);

    useEffect(() => {
        if(comparision) {
            getFeedbackData();
            setComparision(false)
        }
    },[comparision]);

    useEffect(() => {
        getItems()
    },[props.feedback]);

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

    useEffect(() => {
        if(props.feedback.allResponses){
            props.showLoading(false);
        }
    },[props.feedback.allResponses]);

    const getItems = () => {
        if(props.route) {
            if (props.route.name === 'All') {
                setFeedbackData(props.feedback.allResponses);
            } else {
                let responses = props.feedback.allResponses;
                if(ArrayUtils.isNotEmpty(responses)) {
                    setFeedbackData(responses.filter(res => res.sentiment === props.route.name));
                } else {
                    setFeedbackData([])
                }
            }
        }
    };

    const _onPressRow = (data) => {
        const pushAction = StackActions.push('Feedback Details', {
            data: data,
            ticketStatus: props.feedback.cxTicketStatusValues,
            token: props.authToken
        });
        props.navigation.dispatch(pushAction);
    };

    const _renderRow = ({item}) => {
        let ticketStatuses = props.feedback.cxTicketStatusValues;
        return (
            <FeedbackCell
                item={item}
                onSelect={() => _onPressRow(item)}
                origin="List"
                ticketStatuses={ticketStatuses}
            />
        );
    };

    const renderNoDataFound = () => {
        return (
            <View style={styles.emptyView}>
                <Text style={styles.emptyText}>No feedbacks received</Text>
            </View>
        );
    };

    let renderSpinner = () => {
        return (
            <View style={styles.loading}>
                <QPSpinner/>
            </View>
        )
    };

    let renderFeedbackList = () => {
        if (!isObjectEmpty(props.feedback)) {
            return (
                <View style={styles.container}>
                    <FlatList
                        data={feedbackData}
                        keyExtractor={item => item.responseSetID+''}
                        renderItem={_renderRow}
                        // onEndReached={onEndReached}
                        onEndReachedThreshold={0.01}
                        refreshing={false}
                        ListEmptyComponent={renderNoDataFound}
                        onRefresh={() => {
                            setCallAPI(true);
                        }}
                        initialNumToRender={10}
                    />
                </View>
            );
        }
        return <View/>
    };

    return props.isLoading ? renderSpinner() : renderFeedbackList()
};


const mapStateToProps = state => {
    return {
        feedback: state.feedback.response,
        isLoading: state.global.isLoading,
        isError: state.global.isError,
        errorMessage: state.global.errorMessage,
        authToken: state.global.authToken,
        feedbackRange: state.feedback.range,
        range: state.global.range
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

const FeedbackTabScreen = connect(mapStateToProps, mapDispatchToProps)(renderFeedbackScene);

const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1,
    },
    container: {
        flex: 1,
        marginTop: MarginConstants.tab1
    },
    emptyView: {
        flex: 1,
        marginTop: MarginConstants.tab3,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    emptyText: {
        color: Colors.primary,
        fontSize: TextSizes.primary
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


// const onEndReached = () => {
//     // Checking if the list has responses in multiples of 10
//     // if((props.feedbacks.lastAddedCount > 0 && this.props.feedbacks.lastAddedCount % 10 === 0   ) && !this.state.isLoadingTail)
//     //   this.setState({
//     //     isLoadingTail: true
//     //   }, ()=>{
//     //     this.getFeedbackList(false);
//     //   })
// };
