import React from 'react';
import {
    Dimensions,
    ActivityIndicator,
    FlatList,
    StyleSheet,
    BackHandler,
    LayoutAnimation,
    View,
    NativeEventEmitter, TouchableWithoutFeedback, NativeModules
} from 'react-native';
import FeedbackCell from '../feedbackCell';
import BaseComponentWithoutScroll from "../../../../global/components/BaseComponentWithoutScroll";
import {ActionBarModule, AuthenticationModule} from '../../../../global/native-modules/NativeModules';
import CustomText from "../../../../global/ui/CustomText";
import {Actions} from "react-native-router-flux";
import AnimatedHideView from "./AnimatedHideView";
import MonthYearSelector from "../../../../global/widgets/MonthYearSelector";
import moment from 'moment';
import QPTabView from "../../../QPTabView";

const {NavigationManager} = NativeModules;
const {height} = Dimensions.get('window');

export default class FeedbackListTabs extends BaseComponentWithoutScroll {
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            items: [],
            authToken: null,
            routes: [
                {key: '1', title: 'All'},
                {key: '2', title: 'Detractor'},
                {key: '3', title: 'Passive'},
                {key: '4', title: 'Promoter'}
            ],
            pageIndex: 0,
            isLoadingTail: false,
            selectedRowID: null,
            pickerVisible: false,
            month: moment().month() + 1, //Need to check as it returns month number starting 0
            year: moment().year()
        }
        AuthenticationModule.getAuthToken((token) => {
            this.setState({authToken: token});
        }, (error) => {
            console.log("Error-" + error)
        });
        this.eventEmitter = new NativeEventEmitter(NavigationManager);

        this.CustomLayoutLinear = {
            duration: 300,
            create: {
                type: LayoutAnimation.Types.spring,
                property: LayoutAnimation.Properties.opacity,
            },
            update: {
                type: LayoutAnimation.Types.spring,
            },
        };
    }

    currentTab = 0;
    previousTab = 0;
    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            if(this.state.pickerVisible){
                this.togglePicker();
                return true;
            }
            return false;

        });
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this.backHandler.remove();
    }
    componentWillMount() {
        this.updateTitleAndMenu();
        if (this.props.isConnected) {
            this.getFeedbackList();
        }
        this.rightOptionClickListener = this.eventEmitter.addListener("ObjAction", () => {
            this.togglePicker();
        })


    }

    togglePicker() {
        this.setState({
            pickerVisible: !this.state.pickerVisible
        }, () => {
            this.updateTitleAndMenu();
        })


    }
    updateTitleAndMenu() {

        ActionBarModule.updateTitleAndMenu(JSON.stringify(this.getTitleAndMenuData()));
        ActionBarModule.toggleBackButton(false);
    }

    getTitleAndMenuData(){
        return {
            title: "Feedback - " + (moment((this.state.month) + '', 'MM').format('MMM')) + " " + this.state.year,
            showStat: true,
            showMenu: true,
            showCloseButton: this.state.pickerVisible
        }
    }

    componentWillReceiveProps(nextProps) {
        setTimeout(() => {
            this.setState({selectedRowID: null});
        }, 500);

    }

    _handleChangeTab = (index) => {
        this.previousTab = this.currentTab;
        this.currentTab = index;
        console.log("Change Tab - " + index);
        this.setState({
            index: index,
            items: []
        }, () => {
            if (!this.props.isLoading) {
                this.getFeedbackList(true)
            }
        });


    };
    _onPressRow = (data) => {
        if (this.state.selectedRowID === null) {
            this.props.setSelectedFeedback(data);
            this.setState({selectedRowID: data.responseSetID}, () => {
                ActionBarModule.toggleBackButton(true);
                ActionBarModule.updateTitleAndMenu(
                    JSON.stringify({
                        title: 'Feedback Detail'
                    })
                );
                Actions.cxFeedbackDetail({authToken: this.state.authToken, titleAndMenuData: this.getTitleAndMenuData()});

            });
        }

    }

    _renderRow = ({item, index}) => {
        const selected = this.state.selectedRowID === item.responseSetID;

        return (
            <FeedbackCell
                item={item}
                index = {index}
                onSelect={() => this._onPressRow(item)}
                origin="List"
                ticketStatuses={this.props.ticketStatuses}
                selected={selected}
            />
        )
    }

    _renderScene = ({route}) => {
        if (this.state.index === this.state.routes.indexOf(route)) {
            let contents = this.renderView();
            switch (route.key) {
                case '1':
                    return <View style={{flex: 1}}>
                        {contents}
                    </View>;
                case '2':
                    return <View style={{flex: 1}}>
                        {contents}
                    </View>;
                case '3':
                    return <View style={{flex: 1}}>
                        {contents}
                    </View>;
                case '4':
                    return <View style={{flex: 1}}>
                        {contents}
                    </View>;
                default:
                    return null;
            }
        }
        return null;
    };

    renderView() {
        return this.renderTicketList();

    }

    getFeedbackList(reload = true) {
        this.setState({pageIndex: reload ? 0 : this.state.pageIndex + 1}, () => {
            this.props.fetchFeedbacks({
                pageOffset: this.state.pageIndex,
                sentiment: this.state.routes[this.state.index].title,
                month: ((this.state.month) + ""),
                year: (this.state.year + "")
            }, this.state.isLoadingTail).then(() => {
                this.setState({isLoadingTail: false})
                this.updateTitleAndMenu();
            });
        })

    }

    renderTicketList() {
        if (this.state.isLoadingTail || !this.props.isLoading) {
            const items = this.props.feedbacks.allResponses || [];
            return (
                <View style={{paddingLeft: 10, paddingBottom: 10, flex:1}}>
                    <FlatList
                        data={items}
                        keyExtractor={item => item.responseSetID}
                        renderItem={this._renderRow}
                        onEndReached={this.onEndReached}
                        onEndReachedThreshold={0.01}
                        refreshing={false}
                        ListEmptyComponent={this.renderNoDataFound}
                        onRefresh={() => {
                            this.getFeedbackList(true);
                        }}
                        style={{paddingRight: 10}}
                        ListFooterComponent={this._renderFooter()}
                    />
                </View>
            )
        }
        return <View/>
    }

    _renderFooter = () => {
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

    renderChild() {

        return (

            <View style={{flex: 1, backgroundColor: this.state.pickerVisible ? '#a9000000' : 'transparent'}}>
                <QPTabView
                    style={[{flex: 1}, this.props.style]}
                    navigationState={this.state}
                    renderScene={this._renderScene}
                    onIndexChange={this._handleChangeTab}
                />
                {this.state.pickerVisible &&
                <TouchableWithoutFeedback onPress={() => {
                    this.togglePicker();
                }}>
                    <View style={{
                        height: height,
                        backgroundColor: '#a9000000',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0
                    }}>
                        {this.renderMonthYearPickerOverlay()}
                    </View>

                </TouchableWithoutFeedback>
                }
            </View>

        )
    }

    renderMonthYearPickerOverlay() {
        return (
            <TouchableWithoutFeedback onPress={() => {
                //Do nothing
            }}>
                <View style={{backgroundColor: 'white'}}>
                    <AnimatedHideView visible={this.state.pickerVisible}
                                      style={{
                                          borderBottomWidth: 1,
                                          shadowOffset: {width: 0, height: 2},
                                          shadowOpacity: 0.8,
                                          borderBottomColor: '#9C9C9C',
                                          elevation: 1,
                                          backgroundColor: 'red'
                                      }}
                                      duration={1000}>

                        <MonthYearSelector
                            month={this.state.month}
                            year={this.state.year}
                            minYear={2010}
                            maxYear={moment().year()}
                            onSubmit={(month, year) => {
                                if (this.props.isConnected) {
                                    this.setState({
                                        month: month,
                                        year: year,
                                        pickerVisible: false,

                                    }, () => {
                                        this.updateTitleAndMenu();
                                        this.getFeedbackList(true);
                                    })

                                }
                            }
                            }
                            onCancel={() => {
                                this.setState({pickerVisible: false})
                            }}/>

                    </AnimatedHideView>
                </View>
            </TouchableWithoutFeedback>


        )

    }

    onEndReached = () => {
        // Checking if the list has responses in multiples of 10
        if ((this.props.feedbacks.lastAddedCount > 0 && this.props.feedbacks.lastAddedCount % 10 === 0) && !this.state.isLoadingTail)
            this.setState({
                isLoadingTail: true
            }, () => {
                this.getFeedbackList(false);
            })

    }
    renderNoDataFound = () => {
        if (!this.props.isLoading) {
            return (
                <View
                    style={{
                        flex: 1,
                        marginTop: 20,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'transparent'
                    }}
                >
                    <CustomText style={{color: 'black', fontSize: 16}}>No feedbacks received.</CustomText>

                </View>
            )
        }
        return <View/>;
    }

}
const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    indicator: {
        backgroundColor: '#187CE2',
    },
    label: {
        fontSize: 12,
        fontWeight: 'normal',
        margin: 4,
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
