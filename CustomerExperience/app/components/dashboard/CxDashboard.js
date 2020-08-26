import React, {useCallback, useEffect, useState, useRef} from 'react';
import {FlatList, ImageBackground, RefreshControl, ScrollView, Text, TouchableHighlight, View} from 'react-native';
import {StackActions} from '@react-navigation/native';
import CXTrendItemWidget from './components/CXTrendItemWidget';
import {showLoading} from '../../redux/actions/index';
import {getDashboardContent, setDashboardRangeFilter} from '../../redux/actions/dashboard.actions';
import {connect} from 'react-redux';
import {dashboardStyles} from './dashboard.style';
import {Colors} from '../../styles/color.constants';
import Pie from 'react-native-pie';
import {isObjectEmpty} from '../../Utils/Utility';
import QPSpinner from '../../widgets/QPSpinner';
import {EventRegister} from "react-native-event-listeners";
import RangeCalendar from '../../widgets/RangeCalendar';
import ArrayUtils from '../../Utils/ArrayUtils';

const wait = timeout => {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
};
const CxDashboard = props => {
    let [callApi, setCallAPI] = useState(true);
    let [refreshing, setRefreshing] = useState(false);
    let [calendar, setCalendar] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setCallAPI(true);
        wait(2000).then(() => setRefreshing(false));
    }, []);

    let listener = useRef(null);

    useEffect(() => {
        listener = EventRegister.addEventListener('openDashboardCalendar', data => {
            setCalendar(true);
        });
        return () => {
            EventRegister.removeEventListener(listener);
        };
    }, []);

    useEffect(() => {
        if(!isObjectEmpty(props.dashboardData)){
            props.showLoading(false);
        }
    },[props.dashboardData]);

    useEffect(() => {

        if (callApi) {
            props.getDashboardContent(props.authToken);
            setCallAPI(false);
        }
    }, [callApi]);

    const renderCalendarView = () => {
        return <RangeCalendar
            showCalendar={calendar}
            closeCalendar={() => {
                setCalendar(false);
            }}
            onSubmit={(startDate, endDate) => {
                let range = {
                    startDate: startDate,
                    endDate: endDate
                };
                setCalendar(false);
                props.setRange(range)
            }}
        />;
    };

    const getTrimmedNoOfResponses = () => {
        let responseText = "";
        let numberOfResponses = "";
        if (props.dashboardData) {
            let numberOfResponsesNumber = 0;
            if (props.dashboardData.primaryStoreNPS.totalResponses) {
                numberOfResponsesNumber =
                    props.dashboardData.primaryStoreNPS.totalResponses;
            }
            let numberOfResponses = numberOfResponsesNumber + '';

            if (numberOfResponsesNumber >= 10000) {
                numberOfResponses =
                    Math.round(numberOfResponsesNumber / 1000).toFixed(
                        numberOfResponsesNumber > 10000 ? 0 : 1,
                    ) + 'K';
            } else if (numberOfResponsesNumber >= 1000) {
                numberOfResponses = (numberOfResponsesNumber / 1000).toFixed(1) + 'K';
            }
            responseText = numberOfResponses > 1 ? 'Responses' : 'Response';
        }

        return (
            <View style={dashboardStyles.responseView}>
                <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={dashboardStyles.responseText}>
                    {numberOfResponses}
                </Text>
                <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={dashboardStyles.response}>
                    {responseText}
                </Text>
            </View>
        );
    };

    const getTicketText = () => {
        let ticketText = '';
        if(props.dashboardData && !isObjectEmpty(props.dashboardData.DetractorTicketsCount)) {
            let pendingCount = props.dashboardData.DetractorTicketsCount.pending;
            let newCount = props.dashboardData.DetractorTicketsCount.new;
            if (pendingCount > 0) {
                ticketText =
                    pendingCount + ' Pending ' + (pendingCount > 1 ? 'tickets' : 'ticket');
            }
            if (newCount > 0) {
                if (pendingCount > 0) {
                    ticketText = newCount + ' New, ' + ticketText;
                } else {
                    ticketText = newCount + ' New ' + (newCount > 1 ? 'tickets' : 'ticket');
                }
            }
            if (newCount === 0 && pendingCount === 0) {
                ticketText = 'No Pending tickets';
            }
        }
        return ticketText;
    };

    const getTicketsButton = () => {
        return (
            <TouchableHighlight
                style={dashboardStyles.ticketButton}
                onPress={() => {
                    let data = {
                        storeId: '' + props.dashboardData.primaryStoreId,
                        title: props.dashboardData.primaryStoreName + ' - Tickets',
                        token: props.authToken,
                    };
                    const pushAction = StackActions.push('DetractorTickets', {
                        data: data,
                    });
                    props.navigation.dispatch(pushAction);
                }}>
                <View>
                    <Text
                        numberOfLines={1}
                        ellipsizeMode={'tail'}
                        style={dashboardStyles.ticketText}>
                        {getTicketText()}
                    </Text>
                </View>
            </TouchableHighlight>
        );
    };

    const renderDonutChart = () => {
        let percent = 0;
        if (props.dashboardData) {
            percent = props.dashboardData.primaryStoreNPS.npsPercentage;
        }
        let color = percent < 0 ? Colors.negativePassive : Colors.positivePassive;
        let roundColor =
            percent < 0 ? Colors.negativePromter : Colors.positivePromter;
        return (
            <View style={dashboardStyles.chartContainer}>
                <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 0.5}}>
                        <Pie
                            radius={80}
                            innerRadius={60}
                            sections={[
                                {
                                    percentage: percent,
                                    color: roundColor,
                                },
                            ]}
                            backgroundColor={color}
                        />
                        <View style={dashboardStyles.gauge}>
                            <Text style={dashboardStyles.gaugeText}>{percent + ''}</Text>
                            <Text style={dashboardStyles.npmGaugeText}>NPS</Text>
                        </View>
                    </View>
                    {getTrimmedNoOfResponses()}
                </View>
            </View>
        );
    };

    const renderStoreNPSList = () => {
        if (props.dashboardData && ArrayUtils.isNotEmpty(props.dashboardData.storeNPSList)) {
            let list = props.dashboardData.storeNPSList;
            let data = list.slice(0, 5);
            let title = props.dashboardData.systemPreferences.businessUnitName
                ? props.dashboardData.systemPreferences.businessUnitName
                : 'Business';
            return renderLists(data, title);
        }
    };

    const renderProductNPSList = () => {
        if (props.dashboardData && ArrayUtils.isNotEmpty(props.dashboardData.productNPSList)) {
            let list = props.dashboardData.productNPSList;
            let title = 'Products';
            return renderLists(list, title);
        }
    };

    const renderNoDataFound = () => {
        return (
            <View
                style={dashboardStyles.emptyView}>
                <Text style={dashboardStyles.emptyText}>No feedbacks received.</Text>
            </View>
        );
    };

    const renderRow = storeItem => {
        let name = storeItem.item.filterName
            ? storeItem.item.filterName
            : storeItem.item.storeName;
        let clickable = storeItem.item.hasOwnProperty('storeName');
        return (
            <CXTrendItemWidget
                storeName={name}
                nps={storeItem.item.NPSScore.npsPercentage}
                promoter={storeItem.item.NPSScore.promoters}
                passive={storeItem.item.NPSScore.passive}
                detractor={storeItem.item.NPSScore.detractors}
                isClickable={clickable}
                onPress={() => {
                    let data = {storeId: storeItem.item.storeId + ''};
                    const pushAction = StackActions.push('DashBoardStoreDetails', {
                        name: props.dashboardData.primaryStoreName,
                        data: data,
                    });
                    props.navigation.dispatch(pushAction);
                }}
            />
        );
    };
    const renderLists = (list, title) => {
        return (
            <View style={dashboardStyles.listViewContainer}>
                <View style={dashboardStyles.textView}>
                    <Text style={dashboardStyles.listTitle}>{title}</Text>
                </View>
                <FlatList
                    data={list}
                    keyExtractor={item => item.filterName}
                    renderItem={renderRow}
                    onEndReachedThreshold={0.01}
                    refreshing={false}
                    ListEmptyComponent={renderNoDataFound}
                />
            </View>
        );
    };

    const renderDashboardContent = () => {
        if (!props.isError && !props.isLoading) {
            return (
                <View style={dashboardStyles.center}>
                    {renderDonutChart()}
                    {getTicketsButton()}
                    {renderStoreNPSList()}
                    {renderProductNPSList()}
                </View>
            );
        }
        return <View style={{flex: 1}} />;
    };

    const renderDashboard = () => {
        return (
            <ImageBackground
                resizeMode={'cover'}
                source={require('../../config/images/background.png')}
                style={dashboardStyles.imageBackgroundContainer}>
                {renderScreen()}
            </ImageBackground>
        );
    };

    const renderScreen = () => {
        return (
            <ScrollView
                contentContainerStyle={dashboardStyles.cxContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }>
                <View style={dashboardStyles.container}>
                    <View style={dashboardStyles.cxContainer}>
                        {renderDashboardContent()}
                    </View>
                    {renderSpinner()}
                </View>
            </ScrollView>
        );
    };

    let renderSpinner = () => {
        if(props.isLoading) {
            return (
                <View style={dashboardStyles.loading}>
                    <QPSpinner spinnerColor={Colors.white}/>
                </View>
            )
        }
    };

    return (
        <View style={dashboardStyles.container}>
            {calendar ? renderCalendarView() : renderDashboard()}
        </View>

    )
};

const mapStateToProps = state => {
    return {
        dashboardData: state.dashboard.dashboardData,
        userInfo: state.global.userInfo,
        isLoading: state.global.isLoading,
        isError: state.global.isError,
        errorMessage: state.global.errorMessage,
        authToken: state.global.authToken
    };
};

const mapDispatchToProps = dispatch => ({
    getDashboardContent: token => {
        dispatch(showLoading(true));
        dispatch(getDashboardContent(token));
    },
    showLoading: (flag) => {
        dispatch(showLoading(flag));
    },
    setRange: (range) => {
        dispatch(setDashboardRangeFilter(range))
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(CxDashboard);
