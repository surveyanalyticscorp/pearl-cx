import React, {useContext, useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableWithoutFeedback, useWindowDimensions, View} from 'react-native';
import FeedbackCell from './FeedbackCells';
import {MarginConstants} from '../../styles/margin.constants';
import {StackActions} from '@react-navigation/native';
import {Colors} from '../../styles/color.constants';
import {clearError, setError, setRangeFilter} from '../../redux/actions';
import {connect} from 'react-redux';
import QPSpinner from '../../widgets/QPSpinner';
import {showErrorFlashMessage, usePrevious} from '../../Utils/Utility';
import ArrayUtils from '../../Utils/ArrayUtils';
import {TextSizes} from '../../styles/textsize.constants';
import {PaddingConstants} from '../../styles/padding.constants';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import FilterHeader from '../FilterHeader';
import moment from 'moment';
import {DMYFORMAT, YMDFORMAT} from '../../Utils/AppConstants';
import SafeAreaView from 'react-native-safe-area-view';
import {apiHandler} from '../../api/ApiHandler';
import {FontFamily} from '../../styles/font.constants';
import {Sizes} from '../../styles/Size.constant';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const FeedbackTab = createMaterialTopTabNavigator();
const FormContext = React.createContext();

function Feedback(props){
    let [feedbackData, setFeedbackData] = useState([]);
    let [ticketStatus, setTicketStatus] = useState([]);
    let [pageOffset, setPageOffset] = useState(0);
    let [pagination, setPagination] = useState(false);
    let [showLoader, setShowLoader] = useState(false);
    let prevRangeRef = usePrevious(props.range);

    let getFeedbackData = () => {
        /**
         * To avoid multiple API calls for each tab
         * */
        if (showLoader || pagination) {
            const data = {
                pageOffset: pageOffset,
                sentiment: 'All',
                startDate: moment(props.range.startDate, DMYFORMAT).format(YMDFORMAT),
                endDate: moment(props.range.endDate, DMYFORMAT).format(YMDFORMAT)
            };
            apiHandler.getFeedbackResponseList(props.authToken, data, (response) => {
                let data = pageOffset === 0 ? [] : [...feedbackData];
                data = [...data, ...response.body.allResponses];
                data = [...new Set(data)];
                setTicketStatus(response.body.cxTicketStatusValues);
                setFeedbackData(data);
                console.log("pageOffset data count " + data.length);
                showLoader && setShowLoader(false);
                pagination && setPagination(false)
            }, (error) => {
                setShowLoader(false);
                props.setError(error);
                showErrorFlashMessage(error.message)
            });
        }
    };

    useEffect(() => {
        setShowLoader(true);
    }, []);

    useEffect(() => {
        if(pageOffset === 0) {
            ArrayUtils.isNotEmpty(feedbackData) && setFeedbackData([]);
        } else {
            getFeedbackData()
        }
    },[pageOffset]);

    useEffect( () => {
        showLoader && getFeedbackData()
    },[showLoader]);

    useEffect(() => {
        if(prevRangeRef && prevRangeRef !== props.range) {
            if(pageOffset === 0) {
                setFeedbackData([]);
                setShowLoader(true);
            } else {
                setPageOffset(0);
                setShowLoader(true);
            }
        }
    },[props.range]);

    useEffect(() => {
        pagination && setPageOffset(pageOffset + 1)
    },[pagination]);

    let onEndReached = () => {
        !pagination && setPagination(true);
    };

    let onRefresh = () => {
        if(pageOffset === 0) {
            setFeedbackData([]);
            setShowLoader(true);
        } else {
            setPageOffset(0);
            setShowLoader(true);
        }
    };

    let renderSpinner = () => {
        return (
            <View style={styles.loading}>
                <QPSpinner/>
            </View>
        )
    };

    const renderFeedbackView = () => {
        return(
            <SafeAreaView forceInset={{top: 'never',bottom:'never'}} style={styles.safeAreaView}>
                <FilterHeader actionOnArrowClick = {() => {
                    setFeedbackData([]);
                    setPageOffset(0);
                    setShowLoader(true);
                }}
                              callDataAPI = {() => {
                                  setFeedbackData([]);
                                  setPageOffset(0);
                                  setShowLoader(true);
                              }}
                              {...props}
                />
                <FormContext.Provider value={{
                    ticketStatus: ticketStatus,
                    feedbackData: feedbackData,
                    onFeedbackEndReached: onEndReached,
                    onRefresh: onRefresh,
                    range: props.range,
                    token: props.authToken
                }}>
                    <FeedbackTabStack />
                </FormContext.Provider>
                {showLoader && renderSpinner()}
            </SafeAreaView>
        )
    };
    return renderFeedbackView();
}

const FeedbackTabStack = () => (
    <FeedbackTab.Navigator tabBarOptions={{
        labelStyle: {width: useWindowDimensions().width/4, fontSize: TextSizes.secondary},
        indicatorStyle: {backgroundColor: Colors.accent},
        style:{backgroundColor: Colors.white, width: '100%'},
        initialLayout: {width: useWindowDimensions().width},
        tabStyle:{height: 1.7*PaddingConstants.tab4},
        activeTintColor: Colors.accent,
        inactiveTintColor: Colors.primary,
    }}
                           lazy
                           keyboardDismissMode={'auto'}
    >
        <FeedbackTab.Screen name="All" component={renderFeedbackScene} initialParams={{screenName: 'All'}} />
        <FeedbackTab.Screen name="Detractor" component={renderFeedbackScene} initialParams={{screenName: 'Detractor'}} />
        <FeedbackTab.Screen name="Passive" component={renderFeedbackScene} initialParams={{screenName: 'Passive'}} />
        <FeedbackTab.Screen name="Promoter" component={renderFeedbackScene} initialParams={{screenName: 'Promoter'}} />
    </FeedbackTab.Navigator>
);



const renderFeedbackScene = (props) => {

    const feedbackForm = useContext(FormContext);
    let [list, setList] = useState(feedbackForm.feedbackData);
    let prevFeedbackRef = usePrevious(feedbackForm.feedbackData);
    let [filterText, setFilterText] = useState('Date');

    useEffect(() => {
        if(prevFeedbackRef !== feedbackForm.feedbackData) {
            getData()
        }
    },[feedbackForm.feedbackData]);

    const _onPressRow = (data) => {
        const pushAction = StackActions.push('Feedback Details', {
            data: data,
            ticketStatus: feedbackForm.ticketStatus,
            token: feedbackForm.token
        });
        props.navigation.dispatch(pushAction);
    };

    let renderResponseFilterView = () => {
        return (
            <TouchableWithoutFeedback onPress={() => {
                alert('open sorting screen')
            }} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
            >
                <View style={styles.filterView}>
                    <Icon name={'swap-vertical'} size={1.2*Sizes.filterIcon} color={Colors.primary}/>
                    <Text style={styles.filterText}>{filterText}</Text>
                </View>
            </TouchableWithoutFeedback>
        )
    };

    const _renderRow = ({item}) => {
        return (
            <FeedbackCell
                item={item}
                onSelect={() => _onPressRow(item)}
                origin="List"
                ticketStatuses={feedbackForm.ticketStatus}
                {...props}
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

    let getData = () => {
        if(props.route.params.screenName === 'All') {
            setList([...feedbackForm.feedbackData])
        } else {
            setList([...feedbackForm.feedbackData.filter(res => res.sentiment === props.route.params.screenName)])
        }
    };

    let renderFeedbackList = () => {
        return (
             <FlatList
                    data={list}
                    renderItem={_renderRow}
                    keyExtractor={item => item.responseSetID+''}
                    onEndReachedThreshold={0}
                    onEndReached={feedbackForm.onFeedbackEndReached}
                    refreshing={false}
                    ListEmptyComponent={renderNoDataFound}
                    onRefresh={feedbackForm.onRefresh}
                    extraData={[list]}
                    contentContainerStyle={styles.container}
                    ListFooterComponent={() => <View style={{paddingBottom: PaddingConstants.tab2}}/>}
                    ListHeaderComponent={renderResponseFilterView}
             />
        );
    };

    return renderFeedbackList()
};


const mapStateToProps = state => {
    return {
        isError: state.global.isError,
        errorMessage: state.global.errorMessage,
        authToken: state.global.authToken,
        range: state.global.range
    };
};

const mapDispatchToProps = dispatch => ({
    setError: (error) => {
      dispatch(setError(error))
    },
    clearError: () => {
        dispatch(clearError(false));
    },
    setRange: (range) => {
        dispatch(setRangeFilter(range))
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Feedback);

const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1,
    },
    container: {
        marginTop: MarginConstants.tab1,
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
    },
    filterView: {
        marginVertical: MarginConstants.halfTab,
        justifyContent: 'flex-end',
        alignItems:'center',
        paddingHorizontal: PaddingConstants.tab1,
        flexDirection:'row'
    },
    filterText: {
        color: Colors.accent,
        fontFamily: FontFamily.regular,
        fontSize: TextSizes.primary,
        textAlign: 'center',
        paddingHorizontal: PaddingConstants.halfTab
    }
});
