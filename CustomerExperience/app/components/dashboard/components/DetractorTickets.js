import React, {useEffect, useState} from 'react';
import {View, Text, Dimensions, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import {Colors} from '../../../styles/color.constants';
import {TabBar, TabView} from 'react-native-tab-view';
import {FontFamily} from '../../../styles/font.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import {apiHandler} from '../../../api/ApiHandler';
import DetractorScenes from './DetractorScenes';
import QPSpinner from '../../../widgets/QPSpinner';

const DetractorTickets = props => {
    const [index, setIndex] = useState(0);
    const [routes] = React.useState([
        {key: 'new', title: 'NEW'},
        {key: 'pending', title: 'PENDING'},
        {key: 'resolved', title: 'RESOLVED'},
    ]);
    const [responseData, setResponseData] = useState([{
        key: 'new',
        data: {tickets: []},
        pageOffset: '0',
        status: '0',
        index: 0,
        storeId: ''//props.route.params.data.storeId,
    }, {
        key: 'pending',
        data: {tickets: []},
        pageOffset: '0',
        status: '1',
        index: 1,
        storeId: ''//props.route.params.data.storeId,
    }, {
        key: 'resolved',
        data: {tickets: []},
        pageOffset: '0',
        status: '2',
        index: 2,
        storeId: ''//props.route.params.data.storeId,
    }]);

    useEffect(() => {
        for (let responseCount = 0; responseCount < responseData.length ; responseCount++) {
            let params = responseData[responseCount];
            apiHandler.getCXDetractorTicket(
                props.authToken,
                params,
                response => {
                    let data = [...responseData];
                    data[responseCount].data = response.body;
                    setResponseData(data)
                },
                error => {
                    // console.log(error);
                },
            );
        }
    }, []);

    let renderSpinner = () => {
        if(props.isLoading) {
            return (
                <View style={styles.loading}>
                    <QPSpinner/>
                </View>
            )
        }
    };

    const getDetractorAPI = (dataCount) => {
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
    }

    const renderScene = ({route}) => {
        switch (route.key) {
            case 'new':
                return <DetractorScenes data={responseData[0].data.tickets} endReached={() => {
                    getDetractorAPI(0)
                }}/>;
            case 'pending':
                return <DetractorScenes data={responseData[1].data.tickets} endReached={() => {
                    getDetractorAPI(1)
                }}/>;
            case 'resolved':
                return <DetractorScenes data={responseData[2].data.tickets} endReached={() => {
                    getDetractorAPI(2)
                }}/>;
        }
    };

    const renderTabView = () => {
        return (
            <TabView
                navigationState={{index, routes}}
                renderScene={renderScene}
                onIndexChange={setIndex}
                renderTabBar={props => (
                    <TabBar
                        {...props}
                        labelStyle={{
                            indicatorStyle: {backgroundColor: '#FF0000'},
                            scrollEnabled: true,
                            labelStyle: {color: '#000000', fontSize: 12},
                            tabStyle: {width: 150},
                        }}
                        style={{backgroundColor: 'white'}}
                        scrollEnabled={true}
                        indicatorStyle={{backgroundColor: Colors.red}}
                        tabStyle={{
                            minHeight: 30,
                            width: Dimensions.get('window').width / 3,
                        }} // here
                        renderLabel={({route, focused, color}) => (
                            <Text
                                style={{
                                    color: Colors.primary,
                                    fontFamily: FontFamily.Light,
                                    fontSize: TextSizes.secondary,
                                    marginVertical: MarginConstants.halfTab,
                                }}>
                                {route.title}
                            </Text>
                        )}
                    />
                )}
            />
        );
    };

    return (
        <View style={styles.container}>
            {renderTabView()}
            {renderSpinner()}
        </View>
    );
};

const mapStateToProps = state => {
    return {
        userInfo: state.global.userInfo,
        isLoading: state.global.isLoading,
        isError: state.global.isError,
        errorMessage: state.global.errorMessage,
        authToken: state.global.authToken
    };
};

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(DetractorTickets);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
    }
});
