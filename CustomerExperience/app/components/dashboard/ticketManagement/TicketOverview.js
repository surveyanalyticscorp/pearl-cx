import React from 'react';
import SafeAreaView from "react-native-safe-area-view";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableWithoutFeedback
} from 'react-native';
import {Colors} from '../../../styles/color.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import moment from 'moment';
import {FontFamily} from '../../../styles/font.constants';
import StringUtils from '../../../Utils/StringUtils';
import {Sizes} from '../../../styles/Size.constant';
import Icomoon from '../../../config/Icons/icon-native';

export default function TicketOverview(props) {

    let ticket = props.route.params.data;

    let getIconName = (nps) => {
        switch (true) {
            case (nps <= 6):
                return 'smiley1';
            case (nps < 9):
                return 'smiley3';
            case (nps <= 10):
                return'smiley5';
            default:
                return ''
        }
    };

    let renderNPS = () => {
        /**
         * get rating
         * */
        let iconName = getIconName(4);
      return (
          <View style={[styles.responseIdContainer,{paddingHorizontal: PaddingConstants.tab1}]}>
              <Text style={styles.rowText}> NPS: </Text>
              {StringUtils.isNotEmpty(iconName) && <Icomoon name={iconName} size={Sizes.inlineIcons} color={Colors.secondary} style={{marginHorizontal: MarginConstants.tab1}}/>}
              <Text style={styles.npsText}>4</Text>
          </View>
      )
    };

    let getPriorityColor = (priority) => {
        switch(priority.toLowerCase()) {
            case 'low':
                return Colors.promoter;
            case 'medium':
                return Colors.passive;
            case 'high':
                return Colors.high;
            case 'critical':
                return Colors.critical;
        }
    };

    let getPriority = () => {
        switch (ticket.priority) {
            case 0:
                return 'Low';
            case 1:
                return 'Medium';
            case 2:
                return'High';
            case 3:
                return'Critical';
        }
    };

    let renderTicketPriority = () => {
        let priority = getPriority();
        return (
            <View style={[styles.responseIdContainer,{paddingHorizontal: PaddingConstants.tab1}]}>
                <Text style={styles.rowText}> Priority </Text>
                <View style={[styles.ticketStatusView, {backgroundColor: getPriorityColor(priority)}]}>
                    <Text style={[styles.ticketStatusText,{color: priority === 'Medium' ? Colors.primary : Colors.white}]}>{priority}</Text>
                </View>
            </View>
        )
    };

    let renderRow = (header, value) => {
        return (
            <View style={styles.row}>
                <Text style={styles.rowText}> {header} </Text>
                <Text style={styles.rowValue} numberOfLines={2}>{value}</Text>
            </View>
        )
    };

    let renderResponseIdView = () => {
        return (
            <View style={styles.responseIdContainer}>
            {renderRow('Response ID', ticket.responseID)}
            <TouchableWithoutFeedback onPress={() => {
                alert('navigate to response')
            }}>
            <View style={styles.viewResponseContainer}>
                <Text style={styles.viewResponseText}>View Response</Text>
            </View>
            </TouchableWithoutFeedback>
            </View>
        )
    };

    let renderCustomerComment = () => {
      return (
          <Text style={styles.commentContainer}>
              <Text style={styles.rowText}>Customer Comments:</Text>
              <Text style={styles.rowValue}> {ticket.comment}</Text>
          </Text>
      )
    };

    let renderTicketInfoView = () => {
        let date = moment(ticket.timestamp).format('MMM DD, YYYY');
        /**
         * get ticket status
         * */
      return (
          <View style={styles.container}>
              {renderResponseIdView()}
              {renderTicketPriority()}
              {renderRow('Status:', 'New')}
              {renderRow('Customer Email:', ticket.emailAddress)}
              {renderNPS()}
              {renderRow('Origin Segment:', ticket.originSegment.name)}
              {renderRow('Current Segment:', ticket.currentSegment.name)}
              {renderRow('Ticket Owner:', ticket.ticketOwner)}
              {renderRow('Created On:', date)}
              {renderCustomerComment()}
          </View>
      )
    };

    return (
        <SafeAreaView forceInset={{bottom: 'never'}} style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.safeArea}>
                    {renderTicketInfoView()}
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
        backgroundColor: Colors.white
    },
    responseIdContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: MarginConstants.tab1
    },
    viewResponseContainer: {
        flex:1,
        alignItems:'flex-end',
        paddingRight: PaddingConstants.tab1
    },
    viewResponseText: {
        color: Colors.accent,
        fontSize: TextSizes.secondary,
        fontFamily: FontFamily.regular
    },
    ticketStatusView: {
        width: 2*MarginConstants.tab4,
        paddingVertical: 2,
        borderRadius: 15,
        alignItems:'center',
        marginHorizontal: MarginConstants.tab1
    },
    ticketStatusText: {
        color: Colors.white,
        fontSize: TextSizes.secondary,
        fontFamily: FontFamily.regular,
        textAlign:'center',
    },
    npsText: {
        color: Colors.secondary,
        fontSize: TextSizes.secondary,
        fontFamily: FontFamily.regular,
        textAlign: 'center',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: PaddingConstants.tab1,
        marginVertical: MarginConstants.halfTab
    },
    rowText: {
        color: Colors.primary,
        fontSize: TextSizes.secondary,
        fontFamily: FontFamily.regular
    },
    rowValue: {
        color: Colors.secondary,
        fontSize: TextSizes.secondary,
        marginHorizontal: MarginConstants.tab1,
    },
    commentContainer: {
        margin: MarginConstants.tab1,
        paddingHorizontal: PaddingConstants.halfTab,
        marginBottom: MarginConstants.tab2,
    }

});
