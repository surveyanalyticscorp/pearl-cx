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
import {showLoading} from '../../redux/actions/index';
import {getDashboardContent, setDashboardRangeFilter} from '../../redux/actions/dashboard.actions';
import {connect} from 'react-redux';
import {dashboardStyles} from './dashboard.style';
import {Colors} from '../../styles/color.constants';
import {isObjectEmpty} from '../../Utils/Utility';
import QPSpinner from '../../widgets/QPSpinner';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import {DMYFORMAT, HalfMonthDateYearFormat, YMDFORMAT} from '../../Utils/AppConstants';
import {MarginConstants} from '../../styles/margin.constants';
import Icomoon from '../../config/Icons/icon-native'
import {VictoryPie} from 'victory-native'
import SafeAreaView from 'react-native-safe-area-view';
import {Sizes} from '../../styles/Size.constant';
import LineIcon from 'react-native-vector-icons/SimpleLineIcons';
import StringUtils from '../../Utils/StringUtils';

const wait = timeout => {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
};

const CxDashboard = props => {
    let [callApi, setCallAPI] = useState(true);
    let [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setCallAPI(true);
        wait(2000).then(() => setRefreshing(false));
    }, []);

    useEffect(() => {
        if(props.dashboardData.DetractorTicketsCount){
            props.showLoading(false);
        }
    },[props.dashboardData.DetractorTicketsCount]);

    useEffect(() => {

        if (callApi) {

            if(!isObjectEmpty(props.range)) {
                let selectedRange = getSelectedRange(props.range.type);
                let startDate = props.range.type !== 6 ? selectedRange.startDate : props.range.startDate;
                let endDate = props.range.type !== 6 ? selectedRange.endDate : props.range.endDate;
                if(StringUtils.isEmpty(props.range.startDate) && StringUtils.isEmpty(props.range.endDate)) {
                    props.setRange({
                        type: 1,
                        startDate: selectedRange.startDate,
                        endDate: selectedRange.endDate
                    })
                }
                let data = {
                    startDate: moment(startDate, DMYFORMAT).format(YMDFORMAT),
                    endDate: moment(endDate, DMYFORMAT).format(YMDFORMAT)
                };
                props.getDashboardContent(props.authToken, data);
                setCallAPI(false);
            }
        }
    }, [callApi]);

    let getSelectedRange = (type) => {
        let today = new Date();
        let month = today.getMonth() + 1;
        let tempEndDate = today.getDate()+"/"+month+"/"+today.getFullYear();
        switch (type) {
            case 1:
                /** Last 30 days*/
                let tempStartDate = moment(tempEndDate, DMYFORMAT).subtract(30,'days').format(DMYFORMAT);
                return {'startDate': tempStartDate, 'endDate': tempEndDate};
            case 2:
                /** This month*/
                let firstDate = 1+"/"+month+"/"+today.getFullYear();
                tempStartDate = moment(firstDate, DMYFORMAT).format(DMYFORMAT);
                return {'startDate': tempStartDate, 'endDate': tempEndDate};
            case 3:
                /** Last month*/
                firstDate = 1+"/"+today.getMonth()+"/"+today.getFullYear();
                tempStartDate = moment(firstDate, DMYFORMAT).format(DMYFORMAT);
                let lastDate = new Date(today.getFullYear(), today.getMonth(), 0);
                month = lastDate.getMonth() + 1;
                tempEndDate = lastDate.getDate()+"/"+month+"/"+lastDate.getFullYear();
                tempEndDate = moment(tempEndDate, DMYFORMAT).format(DMYFORMAT);
                return {'startDate': tempStartDate, 'endDate': tempEndDate};
            case 4:
                /** Last 3 months*/
                tempStartDate = moment(tempEndDate, DMYFORMAT).subtract(3,'months').format(DMYFORMAT);
                return {'startDate': tempStartDate, 'endDate': tempEndDate};
            case 5:
                /** Last 6 months */
                tempStartDate = moment(tempEndDate, DMYFORMAT).subtract(6,'months').format(DMYFORMAT);
                return {'startDate': tempStartDate, 'endDate': tempEndDate};
            default:
                break;
        }
    };

    const renderDonutChart = () => {
        let data = props.dashboardData.primaryStoreNPS;
        let responses = props.dashboardData.primaryStoreNPS.totalResponses;
        let responseCount = getTrimmedNoOfResponses(responses);
        let victoryPieData = responseCount !== 0 ? [
            { y: data.promoterFormattedPercent, x: ''},
            { y: data.passiveFormattedPercent, x: ''},
            { y: data.detractorFormattedPercent, x: ''}
        ] : [
            { y: 100, x: ''}, //for empty nps chart
        ];
        let victoryPieColorScale = responseCount !== 0 ? [Colors.promoter, Colors.passive, Colors.detractor] : [Colors.primary];
        return (
            <View style={dashboardStyles.chartContainer}>
                <View style={dashboardStyles.donut}>
                    <VictoryPie
                        data={victoryPieData}
                        width={5*MarginConstants.tab4}
                        height={6*MarginConstants.tab4}
                        innerRadius={2.5*MarginConstants.tab4}
                        radius={2.2*MarginConstants.tab4}
                        style={{
                            labels: {
                                fill: 'transparent'
                            },
                        }}
                        colorScale={victoryPieColorScale}
                        endAngle={-90}
                        startAngle={90}
                    />
                </View>
                <View style={dashboardStyles.npsView}>
                    <Text style={[dashboardStyles.npsPercentText,{left: data.npsPercentage > 0 ? '100%' : '80%'}]}>{data.npsPercentage}</Text>
                    <Text style={[dashboardStyles.npsText,{left: data.npsPercentage > 0 ? '75%' : '65%'}]}>NPS</Text>
                </View>
                {renderDonutInfoContainer(responseCount)}
            </View>
        );
    };

    let renderDonutInfoContainer = (responseCount) => {
        return <View style={dashboardStyles.donutInfoContainer}>
            {renderDonutInformation('check-square', 'Surveys',props.dashboardData.surveyCount)}
            {renderDonutInformation('th-large', 'Responses', responseCount)}
        </View>
    };

    let renderDonutInformation = (icon, title, count) => {
        return (
            <View style={dashboardStyles.responseView}>
                <Text style={dashboardStyles.responseText}>{count}</Text>
                <View style={dashboardStyles.separator}/>
                <View style={dashboardStyles.ticketTypeContainer}>
                    <Icon name={icon} size={15} color={Colors.borderColor}/>
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
                        screen: icon === 'new' ? "New" : (icon === 'open' ? "Open" : "Resolved")
                    });
                    props.navigation.dispatch(pushAction);
                }}>
                <View style={[dashboardStyles.ticketContainer,{marginHorizontal: icon === 'open' ? MarginConstants.tab1 : 0}]}>
                    <Text  style={dashboardStyles.ticketText}>{ticketCount}</Text>
                    <View style={dashboardStyles.separator}/>
                    <View style={dashboardStyles.ticketTypeContainer}>
                        <Icomoon name={icon} size={Sizes.icons} color= {Colors.borderColor}/>
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
                {renderTicketView(props.dashboardData.DetractorTicketsCount.pending,"open", "Open")}
                {renderTicketView(props.dashboardData.DetractorTicketsCount.resolved,"resolved", "Resolved")}
            </View>
        )
    };

    const getTrimmedNoOfResponses = (responseCount) => {

        let numberOfResponses = responseCount ? responseCount : 0;

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

    let renderNoDataFound = () => {
        return (
            <View
                style={dashboardStyles.emptyView}>
                <Text style={dashboardStyles.emptyText}>No segment found</Text>
            </View>
        );
    };

    let renderRow = storeItem => {
        return (
            <View style={[dashboardStyles.row, {backgroundColor: storeItem.item.storeName === props.dashboardData.primaryStoreName ? Colors.accentGradient : Colors.white}]}>
                <Text style={dashboardStyles.productText}>{storeItem.item.storeName}</Text>
                <Text style={dashboardStyles.productText}>{storeItem.item.NPSScore.npsPercentage}</Text>
            </View>
        );
    };

    let renderListHeader = () => {
        return (
            <View style={dashboardStyles.productHeaderView}>
                <Text style={dashboardStyles.listTitle}>Segment</Text>
                <Text style={dashboardStyles.listTitle}>NPS</Text>
            </View>
        )
    };

    let renderStoreNPSList = () => {
        let list = props.dashboardData.storeNPSList;
        return (
            <View style={dashboardStyles.listViewContainer}>
                <View style={dashboardStyles.list}>
                    <FlatList
                        data={list.sort((a, b) => b.NPSScore.npsPercentage - a.NPSScore.npsPercentage)}
                        keyExtractor={item => item.filterName}
                        renderItem={renderRow}
                        onEndReachedThreshold={0.01}
                        refreshing={false}
                        ListEmptyComponent={renderNoDataFound}
                        showsVerticalScrollIndicator={false}
                        ListHeaderComponent={renderListHeader}
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
                    {renderSegmentTitle('Comparison')}
                    {renderStoreNPSList()}
                </View>
            );
        }
        return <View style={dashboardStyles.container} />;
    };

    let getDashBoardDataOnNewRange = (range) => {
        props.setRange(range);
        setCallAPI(true)
    };

    let filterAction = () => {
        const pushAction = StackActions.push('Date Range', {
            range: props.range,
            setRange: getDashBoardDataOnNewRange
        });
        props.navigation.dispatch(pushAction);
    };

    let addRange = () => {
        let startDate = props.range.startDate;
        let endDate = props.range.endDate;
        let startComponents = startDate.split('/');
        let endComponents = endDate.split('/');
        let startMonth = parseInt(startComponents[1]) - 1;
        let tempStart = moment([startComponents[2], startMonth+'', startComponents[0]]);
        let endMonth = parseInt(endComponents[1]) - 1;
        let tempEnd = moment([endComponents[2], endMonth+'', endComponents[0]]);
        let days = tempEnd.diff(tempStart,'days');
        let nextDay = moment(endDate, DMYFORMAT).add(1,'days').format(DMYFORMAT);
        let endDay = moment(nextDay, DMYFORMAT).add(days,'days').format(DMYFORMAT);
        let tempRange = {...props.range, startDate: nextDay, endDate: endDay};
        props.setRange(tempRange)
    };

    let reduceRange = () => {
        let startDate = props.range.startDate;
        let endDate = props.range.endDate;
        let startComponents = startDate.split('/');
        let endComponents = endDate.split('/');
        let startMonth = parseInt(startComponents[1]) - 1;
        let tempStart = moment([startComponents[2], startMonth+'', startComponents[0]]);
        let endMonth = parseInt(endComponents[1]) - 1;
        let tempEnd = moment([endComponents[2], endMonth+'', endComponents[0]]);
        let days = tempEnd.diff(tempStart,'days');
        let endDay = moment(startDate, DMYFORMAT).subtract(1,'days').format(DMYFORMAT);
        let startDay = moment(endDay, DMYFORMAT).subtract(days,'days').format(DMYFORMAT);
        let tempRange = {...props.range, startDate: startDay, endDate: endDay};
        props.setRange(tempRange)
    };

    let renderFilterHeader = () => {
        let startDate = moment(props.range.startDate, DMYFORMAT).format(HalfMonthDateYearFormat);
        let endDate = moment(props.range.endDate, DMYFORMAT).format(HalfMonthDateYearFormat);

        return (
            <View style={dashboardStyles.filterHeader}>
                <TouchableWithoutFeedback onPress={filterAction} hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
                <View style={dashboardStyles.filterLeftView}>
                        <LineIcon name={'calendar'} size={15} color={Colors.white}/>
                        <View style={dashboardStyles.filterCalendarView}>
                            <Text style={dashboardStyles.dateText}>{startDate} - </Text>
                            <Text style={dashboardStyles.dateText}>{endDate}</Text>
                        </View>
                </View>
            </TouchableWithoutFeedback>
        <View style={dashboardStyles.filterArrowIconView}>
            <TouchableWithoutFeedback hitSlop={{top: 20, bottom: 20, left: 20, right: 20}} onPress={reduceRange}>
                <LineIcon name='arrow-left' size={15} color= {Colors.white} style={{marginRight: MarginConstants.tab2}}/>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback hitSlop={{top: 20, bottom: 20, left: 20, right: 20}} onPress={addRange}>
                <LineIcon name='arrow-right' size={15} color= {Colors.white}/>
            </TouchableWithoutFeedback>
        </View>
    </View>
    )
    };

    let renderDashboard = () => {
        return (
            <SafeAreaView forceInset={{bottom: 'never'}} style={dashboardStyles.container}>
                {renderFilterHeader()}
                <ScrollView
                    contentContainerStyle={dashboardStyles.scrollView}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }>
                    <View style={dashboardStyles.container}>
                        {renderDashboardContent()}
                        {renderSpinner()}
                    </View>
                </ScrollView>
            </SafeAreaView>
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

    return renderDashboard()
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
