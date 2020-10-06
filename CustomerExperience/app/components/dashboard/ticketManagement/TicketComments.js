import React from 'react';
import SafeAreaView from "react-native-safe-area-view";
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {Colors} from '../../../styles/color.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import ArrayUtils from '../../../Utils/ArrayUtils';
import moment from 'moment';
import {MDYFORMAT} from '../../../Utils/AppConstants';

export default function TicketComments(props) {

    let routeName = props.route.name;
    let ticketLogs = props.route.params.data.ticketLogs;

    let renderCommentRow = () => {
        if(ticketLogs && ArrayUtils.isNotEmpty(ticketLogs)) {
            return ticketLogs.map(item => {
                let date = moment(item.logDate, MDYFORMAT).format('MMM DD, YYYY');
                let text = routeName === 'Comments' ? item.comment : item.logType;
                return(
                    <View style={styles.commentRow}>
                        <Text style={styles.authorText}>Author: {item.author}</Text>
                        <Text style={styles.dateText}>{date}</Text>
                        <Text style={styles.commentText}>{text}</Text>
                    </View>
                )
            })
        }
        return <View/>
    };

    return (
        <SafeAreaView forceInset={{bottom: 'never'}} style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.safeArea}>
                {renderCommentRow()}
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
    commentRow: {
        backgroundColor: Colors.white,
        margin: MarginConstants.tab1,
        padding: PaddingConstants.tab1
    },
    authorText: {
        color: Colors.secondary,
        fontSize: TextSizes.semiMediumText,
        paddingHorizontal: PaddingConstants.tab1,
        paddingVertical: PaddingConstants.halfTab
    },
    commentText: {
        color: Colors.primary,
        fontSize: TextSizes.secondary,
        padding: PaddingConstants.tab1
    },
    dateText: {
        color: Colors.secondary,
        fontSize: TextSizes.mediumText,
        paddingHorizontal: PaddingConstants.tab1
    },
    scrollContainer: {
        flexGrow: 1,
        backgroundColor: Colors.darkerGrey
    },
});
