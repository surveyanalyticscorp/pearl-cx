import React from 'react';
import SafeAreaView from "react-native-safe-area-view";
import {
    View,
    Text,
    StyleSheet,
    ScrollView
} from 'react-native';
import {Colors} from '../../../styles/color.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import {TextSizes} from '../../../styles/textsize.constants';

export default function TicketOverview(props) {

    let renderRowHeader = (header) => {
        return (
            <View style={styles.row}>
                <View style={styles.selectedStateView}/>
                <Text style={styles.rowHeaderText}> {header} </Text>
            </View>
        )
    };

    let renderRow = (header, value) => {
        return (
            <View style={[styles.row,{ marginBottom: 1}]}>
                <Text style={styles.rowText}> {header} </Text>
                <Text style={styles.rowText} numberOfLines={2}>{value}</Text>
            </View>
        )
    };

    let renderTicketDetails = () => {
      return (
          <View style={styles.container}>
              {renderRowHeader('Ticket Info')}
              {renderRow('Response Id', '1234567')}
              {renderRow('Created On', 'Aug 24, 2020')}
              {renderRow('Current Segment', 'North Segment')}
              {renderRow('Origin Segment', 'Main Segment')}
              {renderRow('Ticket Owner', 'nehal.sanklecha')}

          </View>
      )
    };

    let renderCustomerEmail = () => {
        return (
            <View style={styles.commentContainer}>
                {renderRowHeader('Customer Email')}
                <Text style={styles.rowBody}>nehal.sanklecha+9676@questionpro.com</Text>
            </View>
        )
    };

    let renderCustomerComment = () => {
        return (
            <View style={styles.commentContainer}>
                {renderRowHeader('Customer Comment')}
                <Text style={styles.rowBody}>The manager completely botched our loan application! We were there for more than four hours trying to resolve the situation. Beyond that, he was rude to us, practically ignoring us while we were waiting for him. If you can't provide better service, then I'm taking my business elsewhere. | The manager completely botched our loan application! We were there for more than four hours trying to resolve the situation. Beyond that, he was rude to us, practically ignoring us while we were waiting for him. If you can't provide better service, then I'm taking my business elsewhere.</Text>
                </View>
        )
    };

    return (
        <SafeAreaView forceInset={{bottom: 'never'}} style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.safeArea}>
                {renderTicketDetails()}
                {renderCustomerEmail()}
                {renderCustomerComment()}
            </View>
            </ScrollView>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.darkerGrey
    },
    scrollContainer: {
        flexGrow: 1,
        backgroundColor: Colors.darkerGrey
    },
    container: {
        margin: MarginConstants.tab1,
        backgroundColor: Colors.darkerGrey,
    },
    row: {
        backgroundColor: Colors.white,
        height: 1.7*PaddingConstants.tab3,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: PaddingConstants.tab1,
    },
    rowText: {
        color: Colors.primary,
        fontSize: TextSizes.secondary,
    },
    rowHeader: {
        backgroundColor: Colors.white,
        height: 1.5*PaddingConstants.tab3,
        flexDirection: 'row',
        alignItems: 'center',
    },
    rowHeaderText: {
        color: Colors.primary,
        fontSize: 1.1*TextSizes.secondary,
        paddingLeft:3
    },
    rowBody: {
        color: Colors.primary,
        fontSize: TextSizes.secondary,
        paddingHorizontal: PaddingConstants.tab2
    },
    separator:{
        height: .5,
        backgroundColor:'red'
    },
    commentContainer: {
        margin: MarginConstants.tab1,
        backgroundColor: Colors.white,
        paddingBottom: PaddingConstants.tab2
    },
    selectedStateView:{
        width: 3,
        position:'absolute',
        left:0,
        top:0,
        bottom:0,
        backgroundColor: Colors.accent,
        marginVertical: 1.5*MarginConstants.tab1,
        marginLeft: MarginConstants.halfTab
    },
});
