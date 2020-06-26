import React from 'react';
import {Dimensions, ListView, StyleSheet, TouchableHighlight, View} from 'react-native';

import QPCard from '../global/widgets/card/QPCard';
import BaseComponent from '../global/components/BaseComponent';
import {Actions} from 'react-native-router-flux';
import {apiHandler} from '../global/api/APIHandler';
import CustomText from '../global/ui/CustomText';
import QPDonutNPSWidget from '../global/widgets/QPDonutNPSWidget';
import CXTrendItemWidget from '../global/widgets/CXTrendItemWidget';
import DetractorTickets from './DetractorTickets';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import {ActionCreators} from './actions'
import {ActionBarModule} from '../global/native-modules/NativeModules';

const {height, width} = Dimensions.get('window');
const factor = width > height ? height : width;

class CXDashboard extends BaseComponent {

    constructor() {
        super();
        this.state = { storeNPSList: [], dataLoaded: false, requestData: {}, showLoader: false };
        console.log("NEw component");
    }


    componentDidMount() {
        ActionBarModule.updateTitleAndMenu(JSON.stringify({title: 'Dashboard'}));
        setTimeout(()=>{
            this.getCXDashBoard();
        },100);

        console.log("NEw component Mounted");
    }

    reloadContent() {
        this.getCXDashBoard();
    }
   
    getCXDashBoard() {
        if (this.props.isConnected && !this.props.isLoading) {
            //update state to start loading
            
            this.props.updateLoadingStatus(true);
            apiHandler.getCXDashBoard(this.processAPIResponse.bind(this), this.props.data, (error) => {
                console.log(error+"");
                this.handleError(error);
            });
        }
    }

    processAPIResponse(response) {
        dataJSON = JSON.stringify(response);
        this.props.updateLoadingStatus(false);
        this.setState({ data: response.body, dataLoaded: true, error: false, showLoader: false });
        let titleJSON = { "title": response.body.primaryStoreName };
        apiHandler.updateActionBar(JSON.stringify(titleJSON));
    }

    renderView() {
        radius = Math.round(factor * 0.2);
        return (
            <View style={styles.container}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>
                        <QPCard >
                            {this.getPrimaryStoreContent()}
                        </QPCard>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 40 }}>

                    {this.getTicketsButton()}

                </View>
                <View style={{ flexDirection: 'row', marginTop: 20 }}>
                    <View style={{ flex: 1 }} >
                        {this.renderStoreNPSList()}
                    </View>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 20 }}>
                    <View style={{ flex: 1 }} >
                        {this.renderProductNPSList()}
                    </View>
                </View>
            </View >
        );
    }

    getPrimaryStoreContent() {
        return (<View style={{ flexDirection: 'row', backgroundColor: '#fff', padding: 10, flex: 1 }}>
            <View style={styles.donut}>
                <QPDonutNPSWidget radius={radius}
                    percent={this.state.data.primaryStoreNPS.npsPercentage}
                    promoter={this.state.data.primaryStoreNPS.promoters}
                    passive={this.state.data.primaryStoreNPS.passive}
                    detractor={this.state.data.primaryStoreNPS.detractors}
                    fontSize={Math.round(factor * 0.04)} />
            </View>
            <View style={styles.responseContainer}>
                <View style={{ flexDirection: 'column', alignItems: 'center' }}>

                    {this.getTrimmedNoOfResponses()}

                    <CustomText numberOfLines={1} ellipsizeMode={'tail'} style={[styles.ResponseText, { color: '#00508E' }]}>
                        {this.getResponseText()}
                    </CustomText>
                </View>
            </View>
        </View>);
    }

    getTicketsButton() {
        return (
            <TouchableHighlight
                style={{ flex: 1 }}
                onPress={() => {
                    let data = {"storeId": ""+this.state.data.primaryStoreId, "title": this.state.data.primaryStoreName+" - Tickets"};
                    let titleJSON = { "title": this.state.data.primaryStoreName };
                    Actions.detractorTickets({data:data});
                    this.onPushScreen("DetractorTickets", DetractorTickets,data, JSON.stringify(titleJSON));
                    apiHandler.updateActionBar(JSON.stringify(data));
                } }>
                <View style={{ backgroundColor: '#404A5B', paddingVertical: 15 }}>

                    <CustomText numberOfLines={1} ellipsizeMode={'tail'} style={[styles.ButtonText, { color: 'white' }]}>
                        {this.getTicketText()}
                    </CustomText>

                </View>
            </TouchableHighlight>
        );


    }

    renderChild() {
        if (this.state.dataLoaded) {
            return this.renderView();
        }
        return (<View></View>);
    }

    renderStoreNPSList() {
        let leaderboardItems = [
            {
                index: 1,
                percent: 89,
                exponent: 9,
                title: 'West Region',
                sentiment: 'negative'
            },
            {
                index: 2,
                percent: 89,
                exponent: 3,
                title: 'South Region',
                sentiment: 'negative'
            },
            {
                index: 3,
                percent: 89,
                exponent: 10,
                title: 'North Region',
                sentiment: 'positive'
            }

        ];
        var dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => {
                r1 != r2
            }
        });

        if (this.state.data.storeNPSList.length > 0) {
            let listDataSource = dataSource.cloneWithRows(this.state.data.storeNPSList.slice(0,5));
            return (
                <QPCard title ={this.state.data.systemPreferences.businessUnitName?this.state.data.systemPreferences.businessUnitName : 'Business Units' }>
                    <ListView ref="storeNPSList" dataSource={listDataSource}
                        renderRow={this.renderRow.bind(this)}
                        renderSeparator={this.renderSeparator.bind(this)}
                        >
                    </ListView>
                </QPCard>
            );
        }
       

    }

    renderProductNPSList(){
         var dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => {
                r1 != r2
            }
        });
         if (this.state.data.productNPSList.length > 0) {
            let listDataSource = dataSource.cloneWithRows(this.state.data.productNPSList.slice(0,5));
            return (
                <QPCard title ={'Products'} style={{marginTop:10}}>
                    <ListView ref="productNPSList" dataSource={listDataSource}
                        renderRow={this.renderProductRow.bind(this)}
                        renderSeparator={this.renderSeparator.bind(this)}
                        >
                    </ListView>
                </QPCard>
            );
        }
    }

    renderSeparator(storeNPSList, sectionID, rowID) {
        return (
            <View key={`sep:${sectionID}:${rowID}`} style={{ height: 1, backgroundColor: '#eeeeee' }}>
            </View>
        )
    }
    renderRow(storeNPSListItem) {
        return (

            <CXTrendItemWidget storeName={storeNPSListItem.storeName}
                nps ={storeNPSListItem.NPSScore.npsPercentage}
                promoter = {storeNPSListItem.NPSScore.promoters}
                passive = {storeNPSListItem.NPSScore.passive}
                detractor = {storeNPSListItem.NPSScore.detractors}
                isClickable = {true}
                onPress = {()=>{
                    if (this.props.isConnected) {
                        console.log("Store ID> "+storeNPSListItem.storeId);
                        let data = {"storeId": storeNPSListItem.storeId+"" };
                        let titleJSON = { "title": this.state.data.primaryStoreName };
                        Actions.cxDashboard({data: data});
                        this.onPushScreen("CXDashboard", CXDashboard,data,JSON.stringify(titleJSON));
                    }
                }}/>
           

        );
    }
    renderProductRow(productNPSListItem){
        return (

            <CXTrendItemWidget storeName={productNPSListItem.productName.name}
                nps ={productNPSListItem.NPSScore.npsPercentage}
                promoter = {productNPSListItem.NPSScore.promoters}
                passive = {productNPSListItem.NPSScore.passive}
                detractor = {productNPSListItem.NPSScore.detractors}
                />
           

        );
    }

    getTrimmedNoOfResponses() {
        let numberOfResponsesNumber = 0;
        if (this.state.data.primaryStoreNPS.totalResponses) {
            numberOfResponsesNumber = this.state.data.primaryStoreNPS.totalResponses;
        }
        this.props.noOfResponses = numberOfResponsesNumber;

        let numberOfResponses = numberOfResponsesNumber + "";

        if (numberOfResponsesNumber >= 10000) {
            numberOfResponses = Math.round(numberOfResponsesNumber / 1000).toFixed(numberOfResponsesNumber > 10000 ? 0 : 1) + "K";
        }
        else if (numberOfResponsesNumber >= 1000) {
            numberOfResponses = (numberOfResponsesNumber / 1000).toFixed(1) + "K";
        }

        let textView = (<CustomText numberOfLines={1} ellipsizeMode={'tail'} style={[styles.bigNumber, { color: '#00508E' }]}>{numberOfResponses}</CustomText>);
        return textView;

    }

    getEllipsizeDots(trimmingNeeded) {
        if (trimmingNeeded) {
            return (<CustomText style={[{ fontSize: 20, fontWeight: 'bold' }, { color: 'white' }]}>K+</CustomText>);
        }
    }

    getResponseText() {
        if (this.state.data.primaryStoreNPS.totalResponses) {
            return this.state.data.primaryStoreNPS.totalResponses > 1 ? 'Responses' : 'Response';
        } else {
            return 'Response';
        }

    }

    getTicketText() {
        let ticketText = '';
        let pendingCount = this.state.data.DetractorTicketsCount.pending;
        let newCount = this.state.data.DetractorTicketsCount.new;
        if (pendingCount > 0) {
            ticketText = pendingCount + ' Pending ' + (pendingCount > 1 ? 'tickets' : 'ticket');
        }
        if (newCount > 0) {
            if (pendingCount > 0) {
                ticketText = newCount + ' New, ' + ticketText;
            }
            else {
                ticketText = newCount + ' New ' + (newCount > 1 ? 'tickets' : 'ticket');
            }
        }
        if (newCount == 0 && pendingCount == 0) {
            ticketText = 'No Pending tickets'
        }
        return ticketText;
    }

    getStoreName() {
        if (this.state.data.primaryStoreName) {
            return this.state.data.primaryStoreName;
        } else {
            return '';
        }
    }

    getexponentPercentage() {
        if (this.state.data.primaryStoreNPS.npsPercentage) {
            return this.state.data.primaryStoreNPS.npsPercentage;
        } else {
            return 0;
        }
    }
}
CXDashboard.defaultProps = {
    noOfResponses: 42,
    storeName: ""
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,


    },
    donut: {
        flex: 1,
        alignItems: 'center',
    },
    responseContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',

    },
    bigNumber: {
        fontWeight: 'bold',
        fontSize: Math.round(factor * 0.15),
        height: Math.round(factor * 0.16),
    },
    ResponseText: {
        flex: 1,
        fontSize: Math.round(factor * 0.04),
        textAlign: 'center'
    },
    ButtonText: {
        flex: 1,
        fontSize: Math.round(factor * 0.05),
        textAlign: 'center'
    },
});
function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
    return {
        isLoading: state.isLoading,
        error: !!state.error,
        isConnected: state.network.isConnected,
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(CXDashboard);