import React,{useEffect, useState} from 'react';
import SafeAreaView from "react-native-safe-area-view";
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {Colors} from '../../../styles/color.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import ArrayUtils from '../../../Utils/ArrayUtils';
import moment from 'moment';
import {MDYFORMAT} from '../../../Utils/AppConstants';
import {isObjectEmpty} from '../../../Utils/Utility';
import {useSelector} from 'react-redux';
import QPSpinner from '../../../widgets/QPSpinner';

export default function TicketComments(props) {

    let routeName = props.route.name;
    const isLoading = useSelector(state => state.global.isLoading);
    const ticket = useSelector(state => state.dashboard.ticketDetails);
    let [ticketLogs, setTicketLogs] = useState([]);
    useEffect(() => {
       if(!isObjectEmpty(ticket)) {
           setTicketLogs(ticket.ticketLogs)
       }
    },[ticket]);

    let renderCommentRow = () => {
            if (ArrayUtils.isNotEmpty(ticketLogs)) {
                return ticketLogs.map((item, index) => {
                    let date = moment(item.logDate, MDYFORMAT).format('MMM DD, YYYY');
                    let text = routeName === 'Comments' ? item.comment : item.logType;
                    return (
                        <View key={index} style={styles.commentRow}>
                            <Text style={styles.authorText}>Author: {item.author}</Text>
                            <Text style={styles.dateText}>{date}</Text>
                            <Text style={styles.commentText}>{text}</Text>
                        </View>
                    )
                })
            }
        return <View/>
    };

    let renderSpinner = () => {
        return (
            <View style={styles.loading}>
                <QPSpinner />
            </View>
        )
    };

    return (
        <SafeAreaView forceInset={{bottom: 'never'}} style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.safeArea}>
                {isLoading ? renderSpinner() : renderCommentRow()}
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
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },

});
