import React  from 'react';
import { View, Text, Dimensions, StyleSheet, Animated, TouchableHighlight, RefreshControl, Platform, Image, ListView, ScrollView } from 'react-native';
import I18n from 'react-native-i18n';
import BaseComponentWithoutScroll from '../../global/components/BaseComponentWithoutScroll';

import Button from 'react-native-button';

import CustomText from '../../global/ui/CustomText';
import SubView from '../../global/components/SubView';
import renderIf from '../../global/renderIf';

import ScrollViewWithRefreshControl from '../../global/ui/ScrollViewWithRefreshControl';
import * as Animatable from 'react-native-animatable';

import Accordion from 'react-native-collapsible/Accordion';


import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { ActionCreators } from '../actions/index';
import OnTouchHighlightWidget from "../../global/widgets/ui/OnTouchHighlightWidget";

class ActivityHistory extends BaseComponentWithoutScroll {

    constructor(props) {
        super(props);

        this.state = {
            index: 0,
            activeSection: -1,
            collapsed: true,
        };
        this.toggleAccordion = this.toggleAccordion.bind(this);
        this.resultCache = [
            {
                "timeRange": "daily",
                "title": I18n.t('today',{locale:props.language}),
                "activityData": [],

            },
            {
                "timeRange": "weekly",
                "title": I18n.t('week',{locale:props.language}),
                "activityData": [],

            },
            {
                "timeRange": "monthly",
                "title": I18n.t('month',{locale:props.language}),
                "activityData": [],

            },
            {
                "timeRange": "allTime",
                "title": I18n.t('all_time',{locale:props.language}),
                "activityData": [],

            }


        ];
    }

    getNextIconImage() {
        if (Platform.OS != 'ios') {
            return require('../../global/images/right_arrow_grey.png');
        } else {
            return { uri: 'right_arrow_grey.png' };
        }
    }
    getDownIconImage() {
        if (Platform.OS != 'ios') {
            return require('../../global/images/down_arrow_grey.png');
        } else {
            return { uri: 'down_arrow_grey.png' };
        }
    }

    componentDidMount() {
        if (!this.props.ActivityData[this.state.index] || JSON.stringify(this.props.ActivityData[this.state.index]) === '{}') {
            this.reloadContent();
        }
    }

    componentDidUpdate(previousProps, previousState) {

        if (previousState.index != this.state.index) {
            if (!this.props.ActivityData[this.state.index] || (JSON.stringify(this.props.ActivityData[this.state.index]) === '{}'))
                this.reloadContent();
        }

    }
    getActivityHistoryData() {
        if (!this.props.isLoading) {
            this.props.getActivityHistoryDetails(this.getRequestDataForPage()).then(() => { this.processAPIResponse() });
        }
    }
    processAPIResponse() {
    }

    getRequestDataForPage() {
        let requestData = {};
        switch (this.state.index) {
            case 0:
                requestData = { "timeRange": "Daily" };
                break;
            case 1:
                requestData = { "timeRange": "Weekly" };
                break;
            case 2:
                requestData = { "timeRange": "Monthly" };
                break;
            case 3:
                requestData = {};
                break;
        }
        return requestData;
    }

    reloadContent() {
        console.log("Refreshing");
        this.getActivityHistoryData();
    }

    _toggleExpanded = () => {
        this.setState({ collapsed: !this.state.collapsed });
    };

    _setSection(sectionIndex) {
        if(this.state.activeSection === sectionIndex){
            this.setState({
                activeSection: -1
            })
        }
        else {
            this.setState({activeSection: sectionIndex});
        }
    }

    _renderHeader(section, i, isActive) {
        let context = this;
        let headerContent =
            <OnTouchHighlightWidget
                onPress={()=>{
                this._setSection(i)
            }
            }>
            <View style={{ padding: 10 }}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 0.6, justifyContent: 'center', alignItems: 'flex-start' }}>
                        <CustomText style={{ fontSize: global.h2FontSize, color: section.color !== "" ? section.color : "#000" }}>
                            {section.title}
                        </CustomText>

                    </View>
                    <CustomText style={{ flex: 0.3, fontSize: global.h2FontSize, color: section.color !== "" ? section.color : "#000", textAlign: 'right' }}>
                        {section.count}
                    </CustomText>
                    <View style={{ flex: 0.1 }} onPress={() => { }}>
                        <Image style={{ height: 40, width: 40 }} source={isActive ? this.getDownIconImage() : this.getNextIconImage()} />
                    </View>
                </View>
                {
                    renderIf(!isActive)(
                        <View style={{ height: 1, backgroundColor: '#ECEBF0' }}>
                        </View>
                    )
                }
            </View>
            </OnTouchHighlightWidget>
            ;
        return (
            <Animatable.View duration={400} style={styles.header} >
                {headerContent}
            </Animatable.View>
        );
    }
    toggleAccordion(refs, i) {
        console.log("Row- " + i);
    }

    _renderContent(section, i, isActive) {

        let listContent = [];
        if (section.activityList.length > 0) {
            section.activityList.map((item, index) => {
                listContent.push(
                    <View key={index}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 6 }}>
                            <CustomText numberOfLines={1} ellipsizeMode={'tail'} style={{ flex: 0.5, fontSize: global.h3FontSize, color: '#9A9C9C', textAlign: 'left' }}>{item.title}</CustomText>
                            <CustomText numberOfLines={1} ellipsizeMode={'tail'} style={{ flex: 0.25, fontSize: global.h3FontSize, color: '#9A9C9C', textAlign: 'left', marginLeft: 10 }}>{item.date}</CustomText>
                            <CustomText numberOfLines={1} ellipsizeMode={'tail'} style={{ flex: 0.25, fontSize: global.h3FontSize, color: '#9A9C9C', textAlign: 'left', marginLeft: 10 }}>{item.time}</CustomText>

                        </View>
                        <View style={{ height: 0.5, backgroundColor: '#ECEBF0' }} />
                    </View>
                );
            });
        }
        else {
            return (
                <View style={{ margin: 10, backgroundColor: 'white' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <CustomText style={{ color: 'black', fontSize: 16 }}>{I18n.t('noDataToDisplay',{locale:this.props.language})}</CustomText>
                    </View>
                    <View style={{ marginTop: 10, height: 1, width: undefined, backgroundColor: '#ECEBF0' }} />
                </View>);
        }
        return (
            <Animatable.View duration={400} style={[styles.content]} transition="backgroundColor">
                <View style={{  marginLeft: 10, }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 6 }}>
                        <CustomText numberOfLines={1} ellipsizeMode={'tail'} style={{ flex: 0.5, fontSize: global.h3FontSize, color: '#586978', textAlign: 'left' }}>{section.title.slice(0, section.title.length - 1).toUpperCase()}</CustomText>
                        <CustomText numberOfLines={1} ellipsizeMode={'tail'} style={{ flex: 0.25, fontSize: global.h3FontSize, color: '#56697B', textAlign: 'left', marginLeft: 10 }}>{I18n.t('date',{locale:this.props.language})}</CustomText>
                        <CustomText numberOfLines={1} ellipsizeMode={'tail'} style={{ flex: 0.25, fontSize: global.h3FontSize, color: '#56697B', textAlign: 'left', marginLeft: 10 }}>{I18n.t('time',{locale:this.props.language})}</CustomText>

                    </View>
                    <View style={{ flexDirection: 'column'}}>
                        {listContent}
                    </View>
                </View>
                <View style={{ margin: 10, height: 1, backgroundColor: '#ECEBF0' }}>
                </View>
            </Animatable.View>
        );
    }

    renderActivitiesList() {
        if (this.props.ActivityData[this.state.index] && this.props.ActivityData[this.state.index].body) {
            let tempActivityData = this.props.ActivityData[this.state.index].body.result;

            if (tempActivityData.length > 0) {
                return (
                    <ScrollViewWithRefreshControl onRefresh={() => { this.reloadContent() }}>
                        <Accordion
                            ref={ref => this.accordion = ref}
                            activeSections={[this.state.activeSection]}
                            sections={tempActivityData}
                            renderHeader={this._renderHeader.bind(this)}
                            renderContent={this._renderContent.bind(this)}
                            duration={400}
                            onChange={this._setSection.bind(this)}
                        />
                    </ScrollViewWithRefreshControl>
                );
            }
            return this.renderNoDataFound();
        } else {
            return <View />;
        }
    }




    renderTabs() {
        var tabs = [];
        this.resultCache.map((item, i) => {
            tabs.push(
                <View key={i} style={{ flexDirection: 'row', flex: 1 }}>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Button onPress={() => { this.handleTabChange(i); }}>
                            <View style={{  justifyContent: 'center', paddingVertical: 20, alignItems: 'center',}}>
                                <CustomText numberOfLines={1} style={{
                                    color: this.state.index === i ? '#56697B' : '#9A9C9C', fontSize: global.h4FontSize,
                                    textDecorationLine: this.state.index === i ? 'underline' : 'none'
                                }}>
                                    {this.resultCache[i].title}
                                </CustomText>
                            </View>
                        </Button>
                    </View>
                    {
                        renderIf(i < this.resultCache.length - 1)(
                            <View style={{ width: 1, height: undefined, backgroundColor: '#ECEBF0' }} />
                        )
                    }
                </View>
            );
        });
        return tabs;
    }

    currentTab = 0;
    previousTab = 0;
    handleTabChange(i) {
        this.previousTab = this.currentTab;
        this.currentTab = i;
        this.setState({ index: i, tabChanged: this.currentTab != this.previousTab, activeSection: this.currentTab == this.previousTab });

    }

    renderNoDataFound() {
        return (
            <ScrollViewWithRefreshControl onRefresh={() => { this.reloadContent() }}>
                <View style={{ alignItems: 'center', margin: 10, backgroundColor: 'white', padding: 10 }}>
                    <CustomText style={{ color: 'black', fontSize: 16 }}>{I18n.t('noDataToDisplay',{locale:this.props.language})}</CustomText>
                </View>
            </ScrollViewWithRefreshControl>
        );
    }

    renderChild() {

        return (
            <SubView title={this.props.title}>
                <View>
                    <View style={{ flexDirection: 'row' }}>
                        {this.renderTabs()}
                    </View>
                    <View style={{ width: undefined, height: 1, backgroundColor: '#ECEBF0' }} />
                </View>

                <View style={{ flex: 1, marginTop: 20, marginBottom: 10, marginHorizontal: 20 }}>
                    {this.renderActivitiesList()}
                </View>

            </SubView >);
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#F5FCFF',
    },
    title: {
        textAlign: 'center',
        fontSize: 22,
        fontWeight: '300',
        marginBottom: 20,
    },
    header: {
        backgroundColor: '#ffffff',
    },
    headerText: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '500',
    },
    content: {

        backgroundColor: '#fff',
    },

    selectors: {
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    selector: {
        backgroundColor: '#F5FCFF',
        padding: 10,
    },
    activeSelector: {
        fontWeight: 'bold',
    },
    selectTitle: {
        fontSize: 14,
        fontWeight: '500',
        padding: 10,
    },
});

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
    return {
        ActivityData: [state.panelActivityDataToday, state.panelActivityDataWeek, state.panelActivityDataMonth, state.panelActivityDataAllTime],
        isLoading: state.isLoading,
        error: state.error.message,
        isConnected: state.network.isConnected,
        language: state.language.googleCode
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(ActivityHistory);
