import React from 'react';
import {Dimensions, FlatList, StyleSheet, View} from 'react-native';
import I18n from 'react-native-i18n';
import BaseComponentWithoutScroll from '../../global/components/BaseComponentWithoutScroll';
import LeaderBoardWithImageWidget from '../../global/widgets/LeaderBoardWithImageWidget';
import CustomText from '../../global/ui/CustomText';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import {ActionCreators} from '../actions/index';
import QPTabView from "../QPTabView";

class Leaderboard extends BaseComponentWithoutScroll {
    constructor(props) {
        super(props);

        this.state = {
            index: 0,
            routes: [{key: '1', title: I18n.t('thisMonth', {locale: props.language})},
                {key: '2', title: I18n.t('lastMonth', {locale: props.language})},
                {key: '3', title: I18n.t('allTime', {locale: props.language})}],

        };
        this.memberUsernameSetting = false;
        this.renderRow = this.renderRow.bind(this);
        this.renderSeparator = this.renderSeparator.bind(this);
        this.renderNoDataFound = this.renderNoDataFound.bind(this);
    }

    componentDidMount() {
        if (!this.props.leaderBoardData[this.state.index] || JSON.stringify(this.props.leaderBoardData[this.state.index]) === '{}') {
            this.reloadContent();
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.index != this.state.index) {
            if (!this.props.leaderBoardData[this.state.index] || (JSON.stringify(this.props.leaderBoardData[this.state.index]) === '{}'))
                this.reloadContent();
        }
    }

    reloadContent() {
        this.getPanelLeaderBoard();
    }

    getPanelLeaderBoard() {
        if (!this.props.isLoading) {
            this.props.getPanelLeaderboard(this.getRequestDataForPage());
        }
    }

    renderNoDataFound() {
        if (!this.props.isLoading) {
            return (
                <View style={{alignItems: 'center', margin: 10, backgroundColor: 'white', padding: 10}}>
                    <CustomText style={{
                        color: 'black',
                        fontSize: 16
                    }}>{I18n.t('noDataToDisplay', {locale: this.props.language})}</CustomText>
                </View>

            );
        }
        return <View/>
    }

    currentTab = 0;
    previousTab = 0;
    _handleChangeTab = (index) => {
        this.previousTab = this.currentTab;
        this.currentTab = index;
        this.setState({
            index,
        });

    };

    getRequestDataForPage() {
        let requestData = {};
        switch (this.state.index) {
            case 0:
                requestData = {"timeRange": "Monthly"};
                break;
            case 1:
                requestData = {"timeRange": "Previous Month"};
                break;
            case 2:
                requestData = {"timeRange": ""};
                break;
        }
        return requestData;
    }


    _renderScene = ({route}) => {
        if (this.state.index == this.state.routes.indexOf(route)) {
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
                default:
                    return null;
            }
        }
        return null;
    };

    renderView() {
        if (this.props.leaderBoardData[this.state.index] && this.props.leaderBoardData[this.state.index].body) {
            let body = this.props.leaderBoardData[this.state.index].body
            let tempLeaderBoardData = body.leaderBoard;
            let memberUsernameSetting = body.memberUsernameSetting ? body.memberUsernameSetting : false;
            this.memberUsernameSetting = memberUsernameSetting;
            if (tempLeaderBoardData.length > 0) {
                return this.renderLeaderBoardList(tempLeaderBoardData);
            }
            return this.renderNoDataFound();
        } else {
            return <View/>;
        }
    }


    renderLeaderBoardList(tempLeaderBoardData) {


        return (
            <FlatList ref={ref => this.listView = ref}
                      onContentSizeChange={() => {
                      }}
                      style={{backgroundColor: 'transparent'}}
                      renderItem={this.renderRow}
                      data={tempLeaderBoardData}

                      removeClippedSubviews={false}
                      enableEmptySections={true}
                      onEndReached={this.onEndReached}
                      onEndReachedThreshold={10}

                      keyExtractor={item => item.index}
                      ItemSeparatorComponent={this.renderSeparator}
                      refreshing={false}
                      onRefresh={() => {
                          this.reloadContent()
                      }}
                      ListEmptyComponent={this.renderNoDataFound}
            />
        );

    }

    renderSeparator(sectionID, rowID, adjacentRowHiglighed) {
        return (
            <View key={rowID} style={{height: 0.5, backgroundColor: '#ECEBF0'}}>
            </View>
        )
    }

    renderRow({item}) {
        let title = this.memberUsernameSetting ? item.memberUserName : item.memberFullName
        return (
            <LeaderBoardWithImageWidget key={item.index}
                                        index={item.index}
                                        profilepic={item.memberProfileImageUrl}
                                        title={title}
                                        QPoint={item.memberQPoints}
                                        QPointGrowth={item.memberQPointGrowth}
                                        leaderBoardData={item}
                                        pointsText={I18n.t('points', {locale: this.props.language})}
                                        onPress={() => {
                                            this.handleItemSelect(item.index);
                                        }
                                        }/>
        );
    }

    handleItemSelect(index) {
        console.log("list item tapped");
    }

    renderChild() {
        return (

            <QPTabView
                navigationState={this.state}
                renderScene={this._renderScene}
                onIndexChange={this._handleChangeTab}

            />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    indicator: {
        backgroundColor: '#e92563',
    },
    label: {
        fontSize: 9,
        fontWeight: 'normal',
        margin: 8,
    },
    tabbar: {
        backgroundColor: '#ffffff',
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
        leaderBoardData: [state.leaderboardThisMonthData, state.leaderboardLastMonthData, state.leaderboardAllTimeData],
        isLoading: state.isLoading,
        error: state.error.message,
        isConnected: state.network.isConnected,
        language: state.language.googleCode

    };
}


export default connect(mapStateToProps, mapDispatchToProps)(Leaderboard);
