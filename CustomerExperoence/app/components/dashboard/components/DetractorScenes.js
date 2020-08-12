/* eslint-disable */
import React from 'react';
import {View, Text, ImageBackground, FlatList} from 'react-native';
import TicketWidget from './TicketWidget';
import {Colors} from '../../../styles/color.constants';
import {fontFamily} from '../../../styles/font.constants';
import {TextSizes} from '../../../styles/textsize.constants';

const DetractorScenes = props => {

    const renderNoDataFound = () => {
        return (
            <View
                style={{
                    flex: 1,
                    marginTop: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'transparent',
                }}>
                <Text style={{color: Colors.white, fontFamily: fontFamily.Bold ,fontSize: TextSizes.largeText}}>
                   There is no Pending tickets.
                </Text>
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
    }

    const onEndReached = () => {
        props.endReached && props.endReached()
    }

    return (
        <ImageBackground
            resizeMode={'stretch'}
            source={require('../../../config/images/background.png')}
            style={{flex: 1, backgroundColor: 'transparent'}}>
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
