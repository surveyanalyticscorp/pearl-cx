import React,{useEffect, useState, useRef} from 'react';
import {View, Text, FlatList, TouchableWithoutFeedback} from 'react-native';
import TicketWidget from './TicketWidget';
import {dashboardStyles} from '../dashboard.style';
import {apiHandler} from '../../../api/ApiHandler';
import {connect} from 'react-redux';
import QPSpinner from '../../../widgets/QPSpinner';
import moment from 'moment';
import {DMYFORMAT, YMDFORMAT} from '../../../Utils/AppConstants';
import {PaddingConstants} from '../../../styles/padding.constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Colors} from '../../../styles/color.constants';
import ActionButton from 'react-native-action-button';
import {TextSizes} from '../../../styles/textsize.constants';
import {Sizes} from '../../../styles/Size.constant';
import {usePrevious} from '../../../Utils/Utility';
import {translate} from "../../../Utils/MultilinguaUtils";

const DetractorScenes = props => {

    let initialData = [
        {
            key: 'new',
            data: {tickets: []},
            pageOffset: '0',
            status: '0',
            priority: 0,
            index: 0,
            storeId: props.storeId+'',
        }, {
            key: 'pending',
            data: {tickets: []},
            pageOffset: '0',
            status: '1',
            priority: 0,
            index: 1,
            storeId: props.storeId+'',
        }, {
            key: 'resolved',
            data: {tickets: []},
            pageOffset: '0',
            status: '2',
            priority: 0,
            index: 2,
            storeId: props.storeId+'',
        }, {
            key: 'escalated',
            data: {tickets: []},
            pageOffset: '0',
            status: '5',
            priority: 0,
            index: 3,
            storeId: props.storeId+'',
        }
    ];

    let [responseData, setResponseData] = useState(initialData);
    let [showLoader, setShowLoader] = useState(false);
    let [callAPI, setCallAPI] = useState(false);
    let [filterObject, setFilterObject] = useState({text: translate("close_loop.all"), value: -1});

    let prevFilterRef = usePrevious(filterObject);

    useEffect(() => {
        setCallAPI(true)
    },[]);

    useEffect(() => {
        showLoader && setShowLoader(false);
    },[responseData]);


    useEffect(() => {
        if(prevFilterRef && prevFilterRef !== filterObject) {
            setCallAPI(true);
        }
    },[filterObject]);

    useEffect(() => {
        if(callAPI) {
            for (let responseCount = 0; responseCount < responseData.length; responseCount++) {
                setShowLoader(true);
                let params = responseData[responseCount];
                params = {
                    ...params,
                    startDate: moment(props.range.startDate, DMYFORMAT).format(YMDFORMAT),
                    endDate: moment(props.range.endDate, DMYFORMAT).format(YMDFORMAT),
                    filterText: filterObject.value
                };
                apiHandler.getCXDetractorTicket(
                    props.authToken,
                    params,
                    response => {
                        setCallAPI(false);
                        let data = [...responseData];
                        data[responseCount].data = response.body;
                        setResponseData(data);
                    },
                    error => {
                        setCallAPI(false);
                        setShowLoader(false);
                    },
                );
            }
        }
    }, [callAPI]);

    const renderNoDataFound = () => {
        return (
            <View style={dashboardStyles.emptyView}>
                <Text style={dashboardStyles.detractorEmptyText}> {translate("close_loop.no_tickets")} </Text>
            </View>
        );
    };

    const renderRow = (rowItem) => {
        let commentText = rowItem.item.comment.replace(/\n/g, " ");
        return (
            <TicketWidget
                comment={commentText}
                item={rowItem.item}
                {...props}
            />
        );
    };

    const onEndReached = () => {
        getDetractorAPI()
    };

    const getDetractorAPI = () => {
        let dataCount = props.route.params.dataCount;
        let params = responseData[dataCount];
        let pageCount = parseInt(params.pageOffset) + 1;
        params.pageOffset = pageCount + '';
        params = {...params,
            startDate: moment(props.range.startDate, DMYFORMAT).format(YMDFORMAT),
            endDate: moment(props.range.endDate, DMYFORMAT).format(YMDFORMAT),
            filterText: filterObject.value
        };
        apiHandler.getCXDetractorTicket(
            props.authToken,
            params,
            response => {
                let data = [...responseData];
                data[dataCount].pageOffset = response.body.pageOffset;
                data[dataCount].data.tickets = [...data[dataCount].data.tickets, ...response.body.tickets];
                setResponseData(data)
            },
            error => {
            },
        );
    };

    let setTicketFilter = (value) => {
        if(filterObject.value !== value) {
            setResponseData(initialData);
        }
        switch (value) {
            case 3:
                setFilterObject({text:'Critical', value: 3});
                break;
            case 2:
                setFilterObject({text:'High', value: 2});
                break;
            case 1:
                setFilterObject({text:'Medium', value: 1});
                break;
            case 0:
                setFilterObject({text:'Low', value: 0});
                break;
            default:
                setFilterObject({text:'All', value: -1})
        }
    };

    let renderTicketFilterView = () => {
        return (
            <TouchableWithoutFeedback onPress={() => {
                props.navigation.navigate(translate("filter_by"),{setFilter: setTicketFilter, selectedFilter: filterObject.value})
            }} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
            >
                <View style={dashboardStyles.filterView}>
                    <Icon name={'filter'} size={Sizes.filterIcon} color={Colors.primary}/>
                    <Text style={dashboardStyles.filterText}>{filterObject.text}</Text>
                </View>
            </TouchableWithoutFeedback>
        )
    };

    let renderDetractorTickets = () => {
        let dataCount = props.route.params.dataCount;
        let tickets = responseData[dataCount].data["tickets"];
        return (
            <View style={dashboardStyles.container}>
                <FlatList
                    data={tickets}
                    keyExtractor={item => item.ticketID+''}
                    renderItem={renderRow}
                    onEndReachedThreshold={0.01}
                    refreshing={false}
                    onEndReached={onEndReached}
                    ListEmptyComponent={renderNoDataFound}
                    ListFooterComponent={() => <View style={{paddingBottom: PaddingConstants.tab2}}/>}
                    ListHeaderComponent={renderTicketFilterView}
                />
                <ActionButton
                    buttonColor= {Colors.accent}
                    buttonTextStyle={{fontSize: TextSizes.donutPercentText}}
                    onPress={() => {
                        props.navigation.navigate('New Ticket',{parentRoute: 'Dashboard'});
                    }}
                />
            </View>
        );
    };

    let renderSpinner = () => {
        return (
            <View style={dashboardStyles.loading}>
                <QPSpinner />
            </View>
        )
    };

    return showLoader ? renderSpinner() : renderDetractorTickets()
};

const mapStateToProps = state => {
    return {
        isLoading: state.global.isLoading,
        authToken: state.global.authToken,
        storeId: state.dashboard.dashboardData.primaryStoreId,
        range: state.global.range
    };
};

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(DetractorScenes);

