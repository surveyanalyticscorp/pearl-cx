import React, {useEffect, useState} from 'react';
import {StyleSheet, View, TouchableWithoutFeedback, Text} from 'react-native';
import ReadMore from 'react-native-read-more-text';
import {Colors} from '../../../styles/color.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import StringUtils from '../../../Utils/StringUtils';
import {FontFamily} from '../../../styles/font.constants';
import moment from 'moment';
import {HalfMonthDateYearFormat, YMDFORMAT} from '../../../Utils/AppConstants';
import {clearDetractorTicketDetails, getDetractorTicketDetails} from '../../../redux/actions/dashboard.actions';
import {connect} from 'react-redux';
import {isObjectEmpty} from '../../../Utils/Utility';
import {Sizes} from '../../../styles/Size.constant';
import Icomoon from '../../../config/Icons/icon-native';
import LineIcon from 'react-native-vector-icons/SimpleLineIcons';

const TicketWidget = props => {

    let [viewDetails, setViewDetails] = useState(false);
    let time = moment(props.item.timestamp, YMDFORMAT).format(HalfMonthDateYearFormat);

    let onBackPress = () => {
        props.clearTicketDetails();
    };

    useEffect(() => {
        if (!isObjectEmpty(props.ticketDetails)) {
            props.navigation.navigate('Ticket Details', {item: props.ticketDetails, onBackPress: onBackPress});
        }
    }, [props.ticketDetails]);

    let onPress = () => {
        let params = {
            'ticketID': props.item.ticketID,
        };
        props.getTicketDetails(props.authToken, params);
    };

    useEffect(() => {
        if (viewDetails) {
            onPress();
            setViewDetails(false);
        }
    }, [viewDetails]);

    let _renderTruncatedFooter = handlePress => {
        return <Text style={styles.truncatedFooter} onPress={handlePress}>Read more</Text>;
    };

    let _renderRevealedFooter = handlePress => {
        return <Text style={styles.truncatedFooter} onPress={handlePress}>Show less</Text>;
    };

    let renderReadMoreView = () => {
        if (StringUtils.isNotEmpty(props.comment)) {
            return <ReadMore
                numberOfLines={3}
                renderTruncatedFooter={_renderTruncatedFooter}
                renderRevealedFooter={_renderRevealedFooter}>
                <Text style={styles.comment}>{props.comment}</Text>
            </ReadMore>;
        }
        return <Text style={styles.comment}>No comments</Text>;
    };

    let renderTicketDetailsView = () => {
        return (
            <TouchableWithoutFeedback onPress={() => {
                setViewDetails(true);
            }}>
                <>
                    <View style={styles.emailContainer}>
                        <View style={styles.emailAddressView}>
                            <Text style={styles.emailAddress} numberOfLines={2}
                                  ellipsizeMode={'tail'}>{props.item.emailAddress}</Text>
                        </View>
                        <LineIcon name='arrow-right' size={Sizes.inlineIcons} color={Colors.secondary}
                                  style={styles.arrowIndicator}/>
                    </View>
                    <Text style={styles.subtitle}>{time}</Text>
                    <View style={styles.separator}/>
                </>
            </TouchableWithoutFeedback>
        );
    };

    let getIconName = () => {
        let iconName = '';
        switch (true) {
            case (props.item.rating <= 6):
                iconName = 'smiley1';
                break;
            case (props.item.rating < 9):
                iconName = 'smiley3';
                break;
            case (props.item.rating <= 10):
                iconName = 'smiley5';
                break;
            default:
                break;
        }
        return iconName
    };

    let npsHeaderView = (status) => {
        /**
         * get props.statusColor, props.status, props.nps, props.responseId,
         * change smiley as per status
         * */

        return (
            <View style={styles.npsHeaderView}>
                <View style={[styles.ticketStatusView, {backgroundColor: Colors.critical}]}>
                    <Text
                        style={[styles.ticketStatusText, {color: status === 'Medium' ? Colors.primary : Colors.white}]}>{status}</Text>
                </View>
                <Icomoon name={getIconName()} size={Sizes.inlineIcons} color={Colors.secondary}/>
                <Text style={styles.npsText}>{props.item.rating}</Text>
                <View style={styles.responseIdView}>
                    <Text style={styles.responseIdText}>ID: 12345678</Text>
                </View>
            </View>
        );
    };

    let renderTicketContainer = () => {
        return (
            <View style={styles.ticketContainer}>
                {npsHeaderView('Critical')}
                {renderTicketDetailsView()}
                {renderReadMoreView()}
            </View>
        );
    };

    return renderTicketContainer();
};

const mapStateToProps = state => {
    return {
        ticketDetails: state.dashboard.ticketDetails,
        authToken: state.global.authToken,
    };
};

const mapDispatchToProps = dispatch => ({
    getTicketDetails: (token, params) => {
        dispatch(getDetractorTicketDetails(token, params));
    },
    clearTicketDetails: () => {
        dispatch(clearDetractorTicketDetails());
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(TicketWidget);

const styles = StyleSheet.create({
    ticketContainer: {
        marginHorizontal: MarginConstants.tab1,
        padding: 1.5 * PaddingConstants.tab1,
        backgroundColor: Colors.white,
    },
    npsHeaderView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ticketStatusView: {
        width: 2 * MarginConstants.tab4,
        paddingVertical: 2,
        borderRadius: 15,
        alignItems: 'center',
        marginRight: MarginConstants.tab1,
    },
    ticketStatusText: {
        color: Colors.white,
        fontSize: TextSizes.secondary,
        fontFamily: FontFamily.regular,
        textAlign: 'center',
    },
    npsText: {
        color: Colors.secondary,
        fontSize: TextSizes.secondary,
        fontFamily: FontFamily.regular,
        textAlign: 'center',
        marginHorizontal: MarginConstants.tab1,
    },
    responseIdView: {
        flex: 1,
        alignItems: 'flex-end',
    },
    responseIdText: {
        color: Colors.secondary,
        fontSize: TextSizes.secondary,
        textAlign: 'right',
        fontFamily: FontFamily.regular,
    },
    emailContainer: {
        flexDirection: 'row',
        paddingTop: PaddingConstants.tab1,
    },
    emailAddressView: {
        flex: 1,
        marginVertical: MarginConstants.tab1,
    },
    emailAddress: {
        color: Colors.primary,
        fontSize: TextSizes.secondary,
        textAlign: 'left',
        fontFamily: FontFamily.semiBold,
    },
    arrowIndicator: {
        justifyContent: 'center',
        paddingTop: PaddingConstants.tab1,
    },
    subtitle: {
        fontSize: TextSizes.secondary,
        color: Colors.primary,
        textAlign: 'left',
        fontFamily: FontFamily.regular,
    },
    separator: {
        height: .5,
        backgroundColor: Colors.borderColor,
        width: '100%',
        marginVertical: 1.5 * MarginConstants.tab1,
    },
    comment: {
        fontSize: TextSizes.semiSecondary + 1,
        color: Colors.primary,
        textAlign: 'left',
        marginTop: PaddingConstants.tab1,
    },
    truncatedFooter: {
        color: Colors.accent,
        marginTop: 2 * MarginConstants.tab1,
        fontSize: TextSizes.semiSecondary,
    },
});
