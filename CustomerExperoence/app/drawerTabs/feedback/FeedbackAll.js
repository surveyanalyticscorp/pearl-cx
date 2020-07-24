/* eslint-disable */
import React, {useEffect, useState} from 'react';
import {Text, View, SafeAreaView, StyleSheet, FlatList} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {ASYNC_AUTH_TOKEN} from '../../api/types';
import FeedbackCell from '../components/FeedbackCells';
import {MarginConstants} from '../../styles/margin.constants';
import {StackActions} from '@react-navigation/native';

const FeedbackAll = props => {
    const [selectedRowID, setSelectedRowID] = useState(0);

    const _onPressRow = (data) => {
        const pushAction = StackActions.push('Feedback Details', {
            data: data,
            ticketStatus: props.feedback.response.body.cxTicketStatusValues,
            token: props.authToken
        });
        props.navigation.dispatch(pushAction);
    };

    const onEndReached = () => {

        // Checking if the list has responses in multiples of 10
        // if((props.feedbacks.lastAddedCount > 0 && this.props.feedbacks.lastAddedCount % 10 === 0   ) && !this.state.isLoadingTail)
        //   this.setState({
        //     isLoadingTail: true
        //   }, ()=>{
        //     this.getFeedbackList(false);
        //   })

    };

    const _renderRow = ({item}) => {
        const selected = selectedRowID === item.responseSetID;
        let ticketStatuses = props.feedback.response.body.cxTicketStatusValues;
        return (
            <FeedbackCell
                item={item}
                onSelect={() => _onPressRow(item)}
                origin="List"
                ticketStatuses={ticketStatuses}
                selected={selected}
            />
        );
    };

    const renderNoDataFound = () => {
        return (
            <View
                style={{
                    flex: 1,
                    marginTop: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'transparent',
                }}
            >
                <Text style={{color: 'black', fontSize: 16}}>No feedbacks received.</Text>

            </View>
        );
    };


    const getItems = () => {
        if (props.sentiment === 'All') {
            return props.feedback.response.body.allResponses
        } else {
            let responses  = props.feedback.response.body.allResponses
            let bigResponse = responses.filter(res => res.sentiment === props.sentiment);
            return bigResponse;
        }
    }


    const renderFeedbackStatus = () => {
        if (props.feedback.response.body) {
            let items = getItems();
            return (
                <SafeAreaView style={styles.container}>
                    <FlatList
                        data={items}
                        keyExtractor={item => item.responseSetID}
                        renderItem={_renderRow}
                        onEndReached={onEndReached}
                        onEndReachedThreshold={0.01}
                        refreshing={false}
                        ListEmptyComponent={renderNoDataFound}
                        onRefresh={() => {
                         props.onRefresh && props.onRefresh();
                        }}
                    />
                </SafeAreaView>
            );
        }
        return <View style={{flex: 1}}/>;
    };

    return renderFeedbackStatus();
};

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: MarginConstants.tab1,
    },
    counterContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    counterTitle: {
        fontFamily: 'System',
        fontSize: 32,
        fontWeight: '700',
        color: '#000',
    },
    counterText: {
        fontFamily: 'System',
        fontSize: 36,
        fontWeight: '400',
        color: '#000',
    },
    buttonText: {
        fontFamily: 'System',
        fontSize: 50,
        fontWeight: '300',
        color: '#007AFF',
        marginLeft: 40,
        marginRight: 40,
    },
});
export default FeedbackAll;
