import React from 'react';
import {ActivityIndicator, Animated, Dimensions, FlatList, StyleSheet, View} from 'react-native';
import {TabBarTop, TabViewAnimated} from 'react-native-tab-view';
import {apiHandler} from '../global/api/APIHandler';
import CustomText from '../global/ui/CustomText';
import TicketWidget from './TicketWidget';
import QPCard from '../global/widgets/card/QPCard';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import {ActionCreators} from './actions'
import BaseComponent from "../global/components/BaseComponent";
import QPTabView from "./QPTabView";

class DetractorTickets extends BaseComponent {


    static title = 'Scroll views';
    static backgroundColor = '#fff';
    static tintColor = '#222';
    static appbarElevation = 0;

    scrollPositions = [
        { "scrollOffset": { y: 0 } },
        { "scrollOffset": { y: 0 } },
        { "scrollOffset": { y: 0 } },
    ];

    resultCache = [
        {
            "pageOffset": "0",
            "ticketsData": [],
            "totalTickets": 0,
            "scrollOffset": { y: 0 }
        },
        {
            "pageOffset": "0",
            "ticketsData": [],
            "totalTickets": 0,
            "scrollOffset": { y: 0 }
        },
        {
            "pageOffset": "0",
            "ticketsData": [],
            "totalTickets": 0,
            "scrollOffset": { y: 0 }
        }


    ];

    constructor(props) {
        super(props);
        console.log("constructor called");
        this.state = {
            dataLoaded: false,
            isLoadingTail: false,
            showLoader: false,
            index: 0,
            dataSource: [],
            routes: [
                { key: '1', title: 'New' },
                { key: '2', title: 'Pending' },
                { key: '3', title: 'Resolved' }
            ]
        };
    }
    hasMore() {
        if (this.resultCache[this.state.index].ticketsData.length == 0) {
            return true
        }
        return this.resultCache[this.state.index].ticketsData.length < this.resultCache[this.state.index].totalTickets;
    }

    componentDidMount() {
        this.getDetractorTickets("getAll");
    }

    reloadContent() {
        this.clearDataforCurrentIndex();
        this.getDetractorTickets("get");
    }
    clearDataforCurrentIndex() {
        this.resultCache[this.state.index].totalTickets = 0;
        this.resultCache[this.state.index].ticketsData = [];
        this.resultCache[this.state.index].pageOffset = "0";
        this.resultCache[this.state.index].scrollOffset = { y: 0 };

    }

    processAPIResponse(response) {
        dataJSON = JSON.stringify(response);
         this.props.updateLoadingStatus(false);
        this.resultCache[this.state.index].ticketsData = this.resultCache[this.state.index].ticketsData.concat(response.body.tickets);
        this.setState({ dataSource: this.resultCache[this.state.index].ticketsData, dataLoaded: true, error: false, showLoader: false, isLoadingTail: false });
        this.resultCache[this.state.index].totalTickets = response.body.count;
        console.log("Total Tickets Loaded > " + this.resultCache[this.state.index].ticketsData.length);

    }
    processAPIResponseForPage(response, index) {
        dataJSON = JSON.stringify(response);
        this.resultCache[index].ticketsData = this.resultCache[index].ticketsData.concat(response.body.tickets);
        this.resultCache[index].totalTickets = response.body.count;
        if (index === this.resultCache.length - 1) {
            this.setState({ dataSource: this.resultCache[this.state.index].ticketsData });
            this.setState({ dataLoaded: true, error: false, showLoader: false, isLoadingTail: false });
            this.props.updateLoadingStatus(false);
        }


    }

    getDetractorTickets(type) {
        if (type === "get" && this.resultCache[this.state.index].ticketsData.length > 0) {
            this.setState({ dataSource: this.resultCache[this.state.index].ticketsData });

        }
        else if (type === "getAll") {
            if (this.props.isConnected && !this.props.isLoading) {

                //this.prepareForNetworkRequest();

                this.props.updateLoadingStatus(true);
                apiHandler.getDetractorTickets((response) => {
                    this.processAPIResponseForPage(response, 0);
                    apiHandler.getDetractorTickets((response) => {
                        this.processAPIResponseForPage(response, 1);
                        apiHandler.getDetractorTickets((response) => { this.processAPIResponseForPage(response, 2); },
                            this.getRequestDataForPage(2), (error) => {
                                this.handleError(error);
                            });
                    },
                        this.getRequestDataForPage(1), (error) => {
                            this.handleError(error);
                        });
                },
                    this.getRequestDataForPage(0), (error) => {
                        this.handleError(error);
                    });



            }
        }
        else if ((type === "get" && this.resultCache[this.state.index].ticketsData.length == 0) ||
            (type === "update")) {
            if (this.props.isConnected && !this.props.isLoading) {
                if(type!=='update') {this.props.updateLoadingStatus(true);}
                apiHandler.getDetractorTickets(this.processAPIResponse.bind(this), this.getRequestData(), (error) => {
                    this.handleError(error);
                });
            }
        }
    }
    getRequestDataForPage(index) {
        return { "status": "" + index, "storeId": "" + this.props.data.storeId, "pageOffset": "0" };
    }
    getRequestData() {
        return { "status": "" + this.state.index, "storeId": "" + this.props.data.storeId, "pageOffset": "" + this.resultCache[this.state.index].pageOffset };
    }
    getDataSource(tickets) {
        return this.state.dataSource.cloneWithRows(tickets);
    }
    renderNoDataFound() {
        if(this.props.isLoading){
            return <View/>;
        }
        return (
            <View style={{ alignItems: 'center', margin: 10, backgroundColor: 'white', padding: 10 }}>
                    <CustomText style={{ color: 'black', fontSize: 16 }}>{'There are no ' + this.state.routes[this.state.index].title + ' tickets.'}</CustomText>
            </View>

        );

    }
    currentTab = 0;
    previousTab = 0;

    _handleChangeTab = (index) => {
        this.previousTab = this.currentTab;
        this.currentTab = index;
        console.log("Change Tab - " + index);
        this.resultCache[this.previousTab].scrollOffset = this.scrollPositions[this.previousTab];
        this.setState({
           index: index,
            dataSource : []
        },()=>{
            if (!this.props.isLoading) {
                this.getDetractorTickets("get");
            }
        });


    };

    _renderScene = ({ route }) => {
        if (this.state.index == this.state.routes.indexOf(route)) {
            let contents = this.renderView();
            switch (route.key) {
                case '1':
                    return <View style={{ flex: 1 }}>
                        {contents}
                    </View>;
                case '2':
                    return <View style={{ flex: 1 }}>
                        {contents}
                    </View>;
                case '3':
                    return <View style={{ flex: 1 }}>
                        {contents}
                    </View>;
                default:
                    return null;
            }
        }
        return null;
    };

    renderView() {
        if (this.state.dataLoaded) {

            return this.renderDetractorTicketList();

        }
        return (<View/>);
    }
    getReference(ref) {
        return "listview";
    }
    renderDetractorTicketList(){

        return (
            <FlatList
                data = {this.state.dataSource}
                keyExtractor={item => item.ticketID}
                renderItem={this.renderRow.bind(this)}
                onEndReached={this.onEndReached.bind(this)}
                onEndReachedThreshold={0.01}
                refreshing={false}
                ListEmptyComponent={this.renderNoDataFound.bind(this)}
                onRefresh={() => {
                    this.reloadContent();
                }}
                ListFooterComponent={this._renderFooter()}
            />
        )
    }
    _renderFooter= () => {
        if (this.state.isLoadingTail) {
            return (
                <ActivityIndicator
                    color={'#003566'}
                    animating={true}
                    size="small"

                />
            )
        }
        return null;
    }
    renderRow({item}) {
        let commentText = item.comment.replace(/\n/g, " ");
        return (

            <QPCard style={{ margin: 5 }}>
                <TicketWidget name={item.emailAddress} comment={commentText} time={item.timestamp}
                />
            </QPCard>

        );
    }

    onEndReached() {

        console.log("On End reached");
        if (!this.hasMore() || this.state.isLoadingTail) {
            return;
        }
        this.setState({
            isLoadingTail: true,
        });
        this.resultCache[this.state.index].pageOffset = "" + (parseInt(this.resultCache[this.state.index].pageOffset) + 1);
        this.getDetractorTickets("update");

    }
    renderSeparator(leaderBoardData) {
        return (
            <View style={{ height: 0.5, backgroundColor: '#ECEBF0' }}>
            </View>
        )
    }


    onScroll(e) {
        this.scrollPositions[this.currentTab] = { y: e.nativeEvent.contentOffset.y };
    }

    handleItemSelect(index) {
        console.log("list item tapped");
    }

    renderChild() {

        return (

                <View>
                    <QPTabView
                        style={[styles.container, this.props.style]}
                        navigationState={this.state}
                        renderScene={this._renderScene}
                        onIndexChange={this._handleChangeTab}
                        />

                </View>



        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    indicator: {
        backgroundColor: '#e92563',
    },
    label: {
        fontSize: 14,
        fontWeight: 'normal',
        margin: 8,
        color: '#393939'
    },
    tabbar: {
        backgroundColor: '#ffffff',
    },
    imageStyle: {
        flex: 1,
        width: undefined,
        height: undefined,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center'

    },
    tab: {
        opacity: 1,
    },
    page: {
        backgroundColor: 'red',
    },
});

const initialLayout = {
    height: 0,
    width: Dimensions.get('window').width,
};


function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
    return {
        isLoading: state.isLoading,
        error: state.error.message,
        isConnected: state.network.isConnected,
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(DetractorTickets);
