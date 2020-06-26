import React, { Component } from 'react';
import ReactNative from 'react-native';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    Navigator,
    ScrollView,
    ListView,
    DeviceEventEmitter,
    NativeEventEmitter,
    Dimensions,
    Animated,
    Image,
    RefreshControl,
    TouchableHighlight,
    NativeModules,
    processColor,
    Platform
} from 'react-native';
import { Actions, ActionConst } from 'react-native-router-flux';
import BarChartView from './BarChartView';
import BaseComponent from '../../../global/components/BaseComponent';
import { apiHandler } from '../../../global/api/APIHandler';
import renderIf from '../../../global/renderIf';
import AppConstant from '../../../global/widgets/typography/AppConstant';
import CustomText from '../../../global/ui/CustomText';
import ScrollViewWithRefreshControl from '../../../global/ui/ScrollViewWithRefreshControl';
import QPDonutWithPercent from '../../../global/widgets/QPDonutWithPercent';
import QPCard from '../../../global/widgets/card/QPCard';
const { height, width } = Dimensions.get('window');
const factor = width > height ? height : width;
import { IndicatorViewPager, PagerTitleIndicator, PagerDotIndicator } from 'rn-viewpager';
var PageControl = require('react-native-page-control');
const DONUT_COLOR = '#0097DC';
const LINE_COLOR = '#efefef';
const ICON_SIZE = 40;
const TEXT_COLOR = '#7e7e7e';
import colorCodes from '../../../global/widgets/typography/ColorCodes';


import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { ActionCreators } from '../../actions'


class HeuristicDashboard extends BaseComponent {
    constructor(props) {
        super(props);
        this.state ={
            currentPage: 0,
        }
    }


    handleNavigationSceneFocus() {
        this.reloadContent();
    }

    componentDidMount() {
        if (!this.props.data) {
            this.reloadContent();
        }
    }
    reloadContent() {
        this.getDashboardData();
    }

    getDashboardData() {
        this.props.fetchDashboardData().then(() => this.processApiResponse());
    }

    processApiResponse() {
        if (this.props.error) {
            this.showErrorToastAndClear();
        }
    }

    renderChild() {
        if (this.props.data && JSON.stringify(this.props.data) != "{}") {
            return (

                <View style={{ padding: 10 }}>
                    {this.renderEmployeesCard()}
                    {this.renderCustomFieldsCard()}
                    {this.renderActivityCard()}
                </View>

            )
        }
        return (<View></View>);
    }
    getAndroidIcon(){
            return (require('../../../global/images/android_icon.png'));
    }
    getAppleIcon(){
        return (require('../../../global/images/apple_icon.png'));

    }

    renderEmployeesCard() {
        let radius = Math.round(factor * 0.15);
        let employeeStats = this.props.data.employeeStats;
        return (
            <QPCard title='Employees' style={styles.cardStyle}>
                <View style={{ padding: 10, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white' }}>
                    <View style={{
                        flex: 0.45,
                        alignItems: 'center'
                    }}>
                        <QPDonutWithPercent radius={radius} borderWidth={8} color={DONUT_COLOR} percent={this.round(employeeStats.percentEmployeesImported, 1)}
                        />
                        <CustomText style={[styles.lastResponseText, { fontSize: 12 }]}>{employeeStats.totalMemberCount} of {employeeStats.expectedMemberCount}</CustomText>
                    </View>
                    <View style={{ backgroundColor: LINE_COLOR, width: 3, alignSelf: 'stretch' }} />
                    <View style={{ flex: 0.45 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignSelf: 'stretch' }}>
                            <Image resizeMode="contain" source={this.getAppleIcon()} style={{ height: ICON_SIZE, width: ICON_SIZE, flex: 1, marginLeft: 10 }} />
                            <CustomText style={{ color: TEXT_COLOR, fontSize: global.h2FontSize, flex: 1, textAlign: 'right', marginRight: 10 }}>{this.round(employeeStats.iphonePercent, 1)}%</CustomText>
                        </View>
                        <View style={{ margin: 10, height: 3, alignSelf: 'stretch', backgroundColor: LINE_COLOR }} />
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignSelf: 'stretch' }}>
                            <Image resizeMode="contain" source={this.getAndroidIcon()} style={{ height: ICON_SIZE, width: ICON_SIZE, flex: 1, marginLeft: 10 }} />
                            <CustomText style={{ color: TEXT_COLOR, fontSize: global.h2FontSize, flex: 1, textAlign: 'right', marginRight: 10 }}>{this.round(employeeStats.androidPercent, 1)}%</CustomText>
                        </View>
                    </View>
                </View>
            </QPCard>
        );
    }

    renderCustomFieldsCard() {
        return (
            <QPCard title='Workforce Analysis' style={styles.cardStyle} >
                {this.getPager()}
            </QPCard>
        )

    }
    renderPagerOptions(){
         let response = this.props.data;
         let percent = Math.round(response.customFieldDistributionStats[this.state.currentPage].completionPercent);
        return(
            <CustomText style={[{fontSize: 16} ,colorCodes.primaryFontColor]}>{percent}%</CustomText>
        )
    }
    getPager() {
        if (Platform.OS != 'ios') {
            return (

                <IndicatorViewPager
                    pagerStyle={{ height: height * 0.5, alignSelf: 'stretch', backgroundColor: 'white' }}
                    removeClippedSubviews={true}
                    indicator={this.renderDotIndicator()}
                    onPageSelected = {(params)=>{this.setState({currentPage: params.position})}}
                >

                    {this.getCustomFieldsCustomChart()}
                </IndicatorViewPager>

            )
        }
        return (

            <View style={styles.container}>
                <ScrollView ref="ad" pagingEnabled={true} horizontal={true} showsHorizontalScrollIndicator={false} bounces={false} onScroll={this.onScroll.bind(this)} scrollEventThrottle={16}>
                    {this.getCustomFieldsCustomChart()}
                </ScrollView>
                <PageControl style={{ position: 'absolute', left: 0, right: 0, bottom: 10 }}
                    numberOfPages={this.props.data.customFieldDistributionStats.length}
                    currentPage={this.state.currentPage}
                    hidesForSinglePage={true}
                    pageIndicatorTintColor={LINE_COLOR}
                    indicatorSize={{ width: 8, height: 8 }}
                    currentPageIndicatorTintColor={DONUT_COLOR}
                    onPageIndicatorPress={() => { this.onItemTap.bind(this) }} />
            </View>

        );
    }
    onScroll(event) {
        var offsetX = event.nativeEvent.contentOffset.x,
            pageWidth = width - 10;
        this.setState({
            currentPage: Math.floor((offsetX - pageWidth / 2) / pageWidth) + 1
        });
    }

    onItemTap(index) {
        console.log("Index-" + index);
    }

    getCustomFieldsCustomChart() {
        let contents = [];
        let response = this.props.data;
        for (let i = 0; i < response.customFieldDistributionStats.length; i++) {
            let fieldData = response.customFieldDistributionStats[i];
            contents.push(
                <BarChartView key={'chart_' + i} fieldData={fieldData} />
            );
        }
        return contents;
    }

    renderActivityCard() {
        return (
            <QPCard title='Activity' style={styles.cardStyle}>
                <View style={{ backgroundColor: 'white', padding: 10 }}>
                    {this.renderActivityList()}
                </View>
            </QPCard>
        )
    }
    renderActivityList() {
        let contents = [];
        let response = this.props.data;
        for (let i = 0; i < response.activeUserStats.length; i++) {
            contents.push(
                this.renderActivityRow(i, response.activeUserStats[i])
            );
            if (i < 1) {
                contents.push(<View key={'divider_' + i} style={{ margin: 5, height: 1, alignSelf: 'stretch', backgroundColor: '#efefef' }} />)
            }
        }
        return contents;
    }
    renderActivityRow(key, activity) {
        let percent = Math.round(activity.activeCount / activity.totalCount * 100);
        return (
            <View key={'activity_' + key} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginVertical: 5, marginHorizontal: 5 }}>
                <View style={{ flex: 0.75, justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <CustomText style={{ fontFamily: global.semiBoldText, color: TEXT_COLOR, fontSize: global.h2FontSize }}>{activity.text}</CustomText>
                    <CustomText style={{ fontFamily: global.primaryText, color: TEXT_COLOR, fontSize: global.h3FontSize, marginTop: 5 }}>{activity.description}</CustomText>

                </View>
                <View style={{ flex: 0.25, justifyContent: 'center', alignItems: 'center' }}>
                    <QPDonutWithPercent radius={20} borderWidth={3} percent={percent} color={DONUT_COLOR}
                    />
                    <CustomText style={{ fontSize: global.h5FontSize, color: TEXT_COLOR, marginTop: 2 }}>{activity.activeCount} of {activity.totalCount}</CustomText>
                </View>
            </View>
        )
    }
    renderDotIndicator() {
        return (<PagerDotIndicator pageCount={this.props.data.customFieldDistributionStats.length}

            selectedDotStyle={{ backgroundColor: DONUT_COLOR }}
        />);
    }
    round(value, precision) {
        var multiplier = Math.pow(10, precision || 0);
        return Math.round(value * multiplier) / multiplier;
    }
}


const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: '#ffffff',
        marginTop: 8,
        marginBottom: 8,
        marginLeft: 15,
        marginRight: 15
    },
    chartStyle: {
        alignItems: 'center',
        padding: 10,
        flexDirection: 'row',
        alignSelf: 'stretch'
    },
    noDataStyle: {
        color: '#7e7e7e',
        margin: 15,

    },
    lastResponseText: {
        color: TEXT_COLOR,
        marginLeft: 8,
        marginRight: 8,
        marginTop: 8,
        marginBottom: 8
    },
    cardStyle: {

        marginBottom: 10,

    },
    chart: {
        width: 200,
        height: 200,
    },
});
function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
    return {
        data: state.dashboardData.body,
        isLoading: state.isLoading,
        error: state.error.message,
        isConnected: state.network.isConnected,
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(HeuristicDashboard);
