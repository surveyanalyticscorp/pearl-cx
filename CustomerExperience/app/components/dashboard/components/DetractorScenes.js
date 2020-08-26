import React from 'react';
import {View, Text, ImageBackground, FlatList} from 'react-native';
import TicketWidget from './TicketWidget';
import {dashboardStyles} from '../dashboard.style';

const DetractorScenes = props => {

    const renderNoDataFound = () => {
        return (
            <View style={dashboardStyles.emptyView}>
                <Text style={dashboardStyles.detractorEmptyText}>There is no Pending tickets.</Text>
            </View>
        );
    };

    const renderRow = (rowItem) => {
        let commentText = rowItem.item.comment.replace(/\n/g, " ");
        return (
            <View style={{ margin: 5 }}>
                <TicketWidget name={rowItem.item.emailAddress} comment={commentText} time={rowItem.item.timestamp}
                />
            </View>
        );
    };

    const onEndReached = () => {
        props.endReached && props.endReached()
    };

    return (
        <ImageBackground
            resizeMode={'cover'}
            source={require('../../../config/images/background.png')}
            style={dashboardStyles.detractorView}>
            <FlatList
                contentContainerStyle={{flexGrow: 1, backgroundColor: 'transparent'}}
                data={props.data}
                keyExtractor={item => item.filterName}
                renderItem={renderRow}
                onEndReachedThreshold={0.01}
                refreshing={false}
                onEndReached={onEndReached}
                ListEmptyComponent={renderNoDataFound}
            />
        </ImageBackground>
    );
};

export default DetractorScenes;
