import React,{useEffect, useState} from 'react';
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

const DetractorScenes = props => {

    let [responseData, setResponseData] = useState([
        {
            key: 'new',
            data: {tickets: []},
            pageOffset: '0',
            status: '0',
            index: 0,
            storeId: props.storeId+'',
        }, {
            key: 'pending',
            data: {tickets: []},
            pageOffset: '0',
            status: '1',
            index: 1,
            storeId: props.storeId+'',
        }, {
            key: 'resolved',
            data: {tickets: []},
            pageOffset: '0',
            status: '2',
            index: 2,
            storeId: props.storeId+'',
        }, {
            key: 'escalated',
            data: {tickets: []},
            pageOffset: '0',
            status: '3',
            index: 3,
            storeId: props.storeId+'',
        }
    ]);
    let [showLoader, setShowLoader] = useState(false);
    let [filterText, setFilterText] = useState('All');

    useEffect(() => {
        for (let responseCount = 0; responseCount < responseData.length ; responseCount++) {
            setShowLoader(true);
            let params = responseData[responseCount];
            params = {...params,
                startDate: moment(props.range.startDate, DMYFORMAT).format(YMDFORMAT),
                endDate: moment(props.range.endDate, DMYFORMAT).format(YMDFORMAT)
            };
            apiHandler.getCXDetractorTicket(
                props.authToken,
                params,
                response => {
                    let data = [...responseData];
                    data[responseCount].data = response.body;
                    setResponseData(data);
                },
                error => {
                    setShowLoader(false);
                },
            );
        }
    }, []);

    useEffect(() => {
        showLoader && setShowLoader(false);
    },[responseData]);

    const renderNoDataFound = () => {
        return (
            <View style={dashboardStyles.emptyView}>
                <Text style={dashboardStyles.detractorEmptyText}> No tickets</Text>
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
            endDate: moment(props.range.endDate, DMYFORMAT).format(YMDFORMAT)
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

    let renderTicketFilterView = () => {
      return (
          <TouchableWithoutFeedback onPress={() => {
              alert('open filter screen')
          }} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          >
          <View style={dashboardStyles.filterView}>
              <Icon name={'filter'} size={25} color={Colors.primary}/>
              <Text style={dashboardStyles.filterText}>{filterText}</Text>
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
                        contentContainerStyle={{flexGrow: 1, backgroundColor: 'transparent'}}
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
                        onPress={() => { alert("open new ticket screen")}}
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

