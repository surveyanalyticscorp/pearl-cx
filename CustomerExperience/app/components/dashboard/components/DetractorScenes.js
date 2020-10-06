import React,{useEffect, useState} from 'react';
import {View, Text, FlatList} from 'react-native';
import TicketWidget from './TicketWidget';
import {dashboardStyles} from '../dashboard.style';
import {apiHandler} from '../../../api/ApiHandler';
import {connect} from 'react-redux';
import {showLoading} from '../../../redux/actions';
import QPSpinner from '../../../widgets/QPSpinner';

const DetractorScenes = props => {

    let [responseData, setResponseData] = useState([
        {
            key: 'new',
            data: {tickets: []},
            pageOffset: '0',
            status: '0',
            index: 0,
            storeId: props.route.params.data.storeId,
        }, {
            key: 'pending',
            data: {tickets: []},
            pageOffset: '0',
            status: '1',
            index: 1,
            storeId: props.route.params.data.storeId,
        }, {
            key: 'resolved',
            data: {tickets: []},
            pageOffset: '0',
            status: '2',
            index: 2,
            storeId: props.route.params.data.storeId,
        }
    ]);

    useEffect(() => {
        for (let responseCount = 0; responseCount < responseData.length ; responseCount++) {
            let params = responseData[responseCount];
            props.showLoading(true);
            apiHandler.getCXDetractorTicket(
                props.authToken,
                params,
                response => {
                    let data = [...responseData];
                    data[responseCount].data = response.body;
                    setResponseData(data);
                    props.showLoading(false);
                },
                error => {
                    // console.log(error);
                    props.showLoading(false);
                },
            );
        }
    }, []);

    const renderNoDataFound = () => {
        return (
            <View style={dashboardStyles.emptyView}>
                <Text style={dashboardStyles.detractorEmptyText}>There are no Pending tickets.</Text>
            </View>
        );
    };

    const renderRow = (rowItem) => {
        let commentText = rowItem.item.comment.replace(/\n/g, " ");
        return (
            <View style={{ margin: 5 }}>
                <TicketWidget
                    comment={commentText}
                    item={rowItem.item}
                    {...props}
                />
            </View>
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
                // console.log(error);
            },
        );
    };

    let renderDetractorTickets = () => {
        let dataCount = props.route.params.dataCount;
        let tickets = responseData[dataCount].data["tickets"];
        return (
                <View style={dashboardStyles.container}>
                    <FlatList
                        contentContainerStyle={{flexGrow: 1, backgroundColor: 'transparent'}}
                        data={tickets}
                        // keyExtractor={item => item.filterName}
                        renderItem={renderRow}
                        onEndReachedThreshold={0.01}
                        refreshing={false}
                        onEndReached={onEndReached}
                        ListEmptyComponent={renderNoDataFound}
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

    return props.isLoading ? renderSpinner() : renderDetractorTickets()
};

const mapStateToProps = state => {
    return {
        isLoading: state.global.isLoading,
        authToken: state.global.authToken
    };
};

const mapDispatchToProps = dispatch => ({
    showLoading: (flag) => {
        dispatch(showLoading(flag));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(DetractorScenes);

