import React, {useCallback, useEffect, useState} from 'react';
import {
    FlatList,
    RefreshControl,
    ScrollView,
    Text,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import {StackActions} from '@react-navigation/native';
import CXTrendItemWidget from './components/CXTrendItemWidget';
import {showLoading} from '../../redux/actions/index';
import {DASHBOARD_RANGE, getDashboardContent, setDashboardRangeFilter} from '../../redux/actions/dashboard.actions';
import {connect} from 'react-redux';
import {dashboardStyles} from './dashboard.style';
import {Colors} from '../../styles/color.constants';
import {isObjectEmpty} from '../../Utils/Utility';
import QPSpinner from '../../widgets/QPSpinner';
import RangeCalendar from '../../widgets/RangeCalendar';
import ArrayUtils from '../../Utils/ArrayUtils';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import {DMYFORMAT, YMDFORMAT} from '../../Utils/AppConstants';
import AsyncStorage from '@react-native-community/async-storage';
import {MarginConstants} from '../../styles/margin.constants';
import Icomoon from '../../config/Icons/icon-native'
import {VictoryPie} from 'victory-native'

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

    let openDashboardCalendar = () => {
        setCalendar(true)
    };

    useEffect(() => {
        props.navigation.setParams({'openCalendar': openDashboardCalendar});
    }, []);

    useEffect(() => {
        if(props.dashboardData.DetractorTicketsCount){
            props.showLoading(false);
        }
    },[props.dashboardData.DetractorTicketsCount]);

    useEffect(() => {

        if (callApi) {

            if(!isObjectEmpty(props.range)) {
                let selectedRange = setSelectedRange(props.range.type);
                let startDate = props.range.type !== 4 ? selectedRange.startDate : props.range.startDate;
                let endDate = props.range.type !== 4 ? selectedRange.endDate : props.range.endDate;
                let data = {
                    startDate: moment(startDate, DMYFORMAT).format(YMDFORMAT),
                    endDate: moment(endDate, DMYFORMAT).format(YMDFORMAT)
                };
                props.getDashboardContent(props.authToken, data);
                setCallAPI(false);
            }
        }
    }, [callApi]);

    let setSelectedRange = (type) => {
        let today = new Date();
        let month = today.getMonth() + 1;
        let tempEndDate = today.getDate()+"/"+month+"/"+today.getFullYear();
        switch (type) {
            case 1:
                let tempStartDate = moment(tempEndDate, DMYFORMAT).subtract(30,'days').format(DMYFORMAT);
                return {'startDate': tempStartDate, 'endDate': tempEndDate};
            case 2:
                tempStartDate = moment(tempEndDate, DMYFORMAT).subtract(3,'months').format(DMYFORMAT);
                return {'startDate': tempStartDate, 'endDate': tempEndDate};
            case 3:
                tempStartDate = moment(tempEndDate, DMYFORMAT).subtract(6,'months').format(DMYFORMAT);
                return {'startDate': tempStartDate, 'endDate': tempEndDate};
            default:
                break;

        }
    };

    const renderCalendarView = () => {

        let selectedRange = setSelectedRange(props.range.type);
        let startDate = props.range.type !== 4 ? selectedRange.startDate : props.range.startDate;
        let endDate = props.range.type !== 4 ? selectedRange.endDate : props.range.endDate;

        return <RangeCalendar
            showCalendar={calendar}
            closeCalendar={() => {
                setCalendar(false);
            }}
            startDate={startDate}
            endDate={endDate}
            selectedType={props.range.type}

            onSubmit={(type, startDate, endDate) => {
                let range = {
                    type: type,
                    startDate: startDate,
                    endDate: endDate
                };
                setCalendar(false);
                props.setRange(range);
                setCallAPI(true);
                AsyncStorage.setItem(DASHBOARD_RANGE, JSON.stringify(range))
            }}
        />;
    };

    const renderDonutChart = () => {
        let data = props.dashboardData.primaryStoreNPS;
        let responseCount = getTrimmedNoOfResponses();
        return (
            <View style={dashboardStyles.chartContainer}>
                <VictoryPie
                    data={[
                        { y: data.promoterFormattedPercent, x: ''},
                        { y: data.passiveFormattedPercent, x: ''},
                        { y: data.detractorFormattedPercent, x: ''}
                    ]}
                    width={210}
                    height={250}
                    innerRadius={78}
                    radius={90}
                    style={{
                        labels: {
                            fill: 'transparent'
                        },
                    }}
                    colorScale={[Colors.promoter, Colors.passive, Colors.detractor]}
                    endAngle={-90}
                    startAngle={90}
                />
                <Text style={dashboardStyles.npsText}> {data.npsPercentage} NPS</Text>
                <View style={dashboardStyles.donutInfoContainer}>
                    {renderDonutInformation('check-square', 'Surveys',124)}
                    {renderDonutInformation('th-large', 'Responses', responseCount)}
                </View>
            </View>
        );
    };

    let renderDonutInformation = (icon, title, count) => {
      return (
          <View style={dashboardStyles.responseView}>
              <Text style={dashboardStyles.responseText}>{count}</Text>
              <View style={dashboardStyles.separator}/>
              <View style={dashboardStyles.ticketTypeContainer}>
                  <Icon name={icon} size={15} color= {Colors.borderColor}/>
                  <Text style={dashboardStyles.response}>{title}</Text>
              </View>
          </View>
      )
    };


    let renderTicketView = (ticketCount, icon, title) => {
        return (
            <TouchableWithoutFeedback
                onPress={() => {
                    let data = {
                        storeId: '' + props.dashboardData.primaryStoreId,
                        title: props.dashboardData.primaryStoreName + ' - Tickets',
                        token: props.authToken,
                    };
                    const pushAction = StackActions.push('DetractorTickets', {
                        data: data,
                        screen: icon === 'new' ? "New" : (icon === 'open' ? "Started" : "Finished")
                    });
                    props.navigation.dispatch(pushAction);
                }}>
                <View style={[dashboardStyles.ticketContainer,{marginHorizontal: icon === 'open' ? MarginConstants.tab2 : 0}]}>
                    <Text  style={dashboardStyles.ticketText}>{ticketCount}</Text>
                    <View style={dashboardStyles.separator}/>
                    <View style={dashboardStyles.ticketTypeContainer}>
                        <Icomoon name={icon} size={20} color= {Colors.borderColor}/>
                        <Text style={dashboardStyles.ticketType}>{title}</Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    };

    let getClosedLoopView = () => {
        return(
            <View style={dashboardStyles.closedLoopView}>
                {renderTicketView(props.dashboardData.DetractorTicketsCount.new,"new", "New")}
                {renderTicketView(props.dashboardData.DetractorTicketsCount.pending,"open", "Pending")}
                {renderTicketView(props.dashboardData.DetractorTicketsCount.resolved,"resolved", "Resolved")}
            </View>
        )
    };

    const getTrimmedNoOfResponses = () => {

        let numberOfResponses = props.dashboardData.primaryStoreNPS.totalResponses ? props.dashboardData.primaryStoreNPS.totalResponses : 0;

        if (numberOfResponses >= 10000) {
            numberOfResponses =
                Math.round(numberOfResponses / 1000).toFixed(
                    numberOfResponses > 10000 ? 0 : 1,
                ) + 'K';
        } else if (numberOfResponses >= 1000) {
            numberOfResponses = (numberOfResponses / 1000).toFixed(1) + 'K';
        }
        return numberOfResponses
    };

    // const getTicketText = () => {
    //     let ticketText = '';
    //     if(!isObjectEmpty(props.dashboardData) && !isObjectEmpty(props.dashboardData.DetractorTicketsCount)) {
    //         let pendingCount = props.dashboardData.DetractorTicketsCount.pending;
    //         let newCount = props.dashboardData.DetractorTicketsCount.new;
    //         if (pendingCount > 0) {
    //             ticketText =
    //                 pendingCount + ' Pending ' + (pendingCount > 1 ? 'tickets' : 'ticket');
    //         }
    //         if (newCount > 0) {
    //             if (pendingCount > 0) {
    //                 ticketText = newCount + ' New, ' + ticketText;
    //             } else {
    //                 ticketText = newCount + ' New ' + (newCount > 1 ? 'tickets' : 'ticket');
    //             }
    //         }
    //         if (newCount === 0 && pendingCount === 0) {
    //             ticketText = 'No Pending tickets';
    //         }
    //     }
    //     return ticketText;
    // };
    //
    // const getTicketsButton = () => {
    //     return (
    //         <TouchableWithoutFeedback
    //             onPress={() => {
    //                 let data = {
    //                     storeId: '' + props.dashboardData.primaryStoreId,
    //                     title: props.dashboardData.primaryStoreName + ' - Tickets',
    //                     token: props.authToken,
    //                 };
    //                 const pushAction = StackActions.push('DetractorTickets', {
    //                     data: data,
    //                 });
    //                 props.navigation.dispatch(pushAction);
    //             }}>
    //             <View style={dashboardStyles.ticketButton}>
    //                 <Text
    //                     numberOfLines={1}
    //                     ellipsizeMode={'tail'}
    //                     style={dashboardStyles.ticketText}>
    //                     {getTicketText()}
    //                 </Text>
    //                 <Icon name="arrow-right" size={20} color= {Colors.white}/>
    //             </View>
    //         </TouchableWithoutFeedback>
    //     );
    // };

    const renderStoreNPSList = () => {
        if (ArrayUtils.isNotEmpty(props.dashboardData.storeNPSList)) {
            let list = props.dashboardData.storeNPSList;
            let data = list.slice(0, 5);
            let title = props.dashboardData.systemPreferences.businessUnitName
                ? props.dashboardData.systemPreferences.businessUnitName
                : 'Business';
            return renderLists(data, title);
        }
    };

    const renderProductNPSList = () => {
        if (ArrayUtils.isNotEmpty(props.dashboardData.productNPSList)) {
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
                <View style={dashboardStyles.productHeaderView}>
                    <Text style={dashboardStyles.listTitle}>{title}</Text>
                    <Text style={dashboardStyles.listTitle}>NPS</Text>
                </View>
                <View style={dashboardStyles.list}>
                    <FlatList
                        data={list}
                        keyExtractor={item => item.filterName}
                        renderItem={renderRow}
                        onEndReachedThreshold={0.01}
                        refreshing={false}
                        ListEmptyComponent={renderNoDataFound}
                    />
                </View>
            </View>
        );
    };

    let renderSegmentTitle = (text) => {
        return(
            <Text style={dashboardStyles.dashboardTitle}>{text}</Text>
        )
    };

    let renderDashboardContent = () => {
        if (!props.isError && !props.isLoading && !isObjectEmpty(props.dashboardData)) {
            return (
                <View>
                    {renderSegmentTitle(props.dashboardData.primaryStoreName)}
                    {renderDonutChart()}
                    {renderSegmentTitle('Closed Loop')}
                    {getClosedLoopView()}
                    {renderSegmentTitle("Segment Comparison")}
                    {renderStoreNPSList()}
                    {renderProductNPSList()}
                </View>
            );
        }
        return <View style={dashboardStyles.container} />;
    };

    let renderDashboard = () => {
        return (
            <ScrollView
                contentContainerStyle={dashboardStyles.container}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }>
                <View style={dashboardStyles.container}>
                    {renderDashboardContent()}
                    {renderSpinner()}
                </View>
            </ScrollView>
        );
    };

    let renderSpinner = () => {
        if(props.isLoading) {
            return (
                <View style={dashboardStyles.loading}>
                    <QPSpinner />
                </View>
            )
        }
    };

    return calendar ? renderCalendarView() : renderDashboard()
};

const mapStateToProps = state => {
    return {
        dashboardData: state.dashboard.dashboardData,
        userInfo: state.global.userInfo,
        isLoading: state.global.isLoading,
        isError: state.global.isError,
        errorMessage: state.global.errorMessage,
        authToken: state.global.authToken,
        range: state.dashboard.range
    };
};

const mapDispatchToProps = dispatch => ({
    getDashboardContent: (token, data) => {
        dispatch(showLoading(true));
        dispatch(getDashboardContent(token, data));
    },
    showLoading: (flag) => {
        dispatch(showLoading(flag));
    },
    setRange: (range) => {
        dispatch(setDashboardRangeFilter(range))
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(CxDashboard);
