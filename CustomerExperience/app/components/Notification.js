import {View, Text, StyleSheet, Image, FlatList, TouchableWithoutFeedback} from 'react-native';
import React,{useState, useEffect} from 'react';
import {Colors} from '../styles/color.constants';
import {MarginConstants} from '../styles/margin.constants';
import {PaddingConstants} from '../styles/padding.constants';
import {TextSizes} from '../styles/textsize.constants';
import {FontFamily} from '../styles/font.constants';
import {isObjectEmpty, showErrorFlashMessage} from '../Utils/Utility';
import {showLoading} from '../redux/actions';
import {connect} from 'react-redux';
import {apiHandler} from '../api/ApiHandler';
import {clearDetractorTicketDetails, getDetractorTicketDetails} from '../redux/actions/dashboard.actions';


function Notification(props) {

    let [list, setList] = useState([]);

    /**
     *
     * {
        "emailAddress": "a@b.com",
        "data": "ticketID: 123, responseId: 123",
        "notificationText": "new ticket is created from :",
        "responseID": 0,
        "timestamp":'Nov 3, 2020'
    },{
        "emailAddress": "a@b.com",
        "data": "ticketID: 123, responseId: 123",
        "notificationText": "new ticket is created from :",
        "responseID": 0,
        "timestamp": 'Nov 3, 2020'

    }*/

    useEffect(() => {
        props.showLoading(true);
        apiHandler.getNotificationData({'Auth-Token': props.authToken}, (response) => {
            setList(response.notificationLogs);
            props.showLoading(false);
        }, (error) => {
            showErrorFlashMessage(error.errorAlert);
            props.showLoading(false);
        })
    },[]);

    let onBackPress = () => {
        props.clearTicketDetails();
    };

    useEffect(() => {
        if (!isObjectEmpty(props.ticketDetails)) {
            props.navigation.navigate('Ticket Details', {item: props.ticketDetails, onBackPress: onBackPress, parentRoute: 'Dashboard'});
        }
    }, [props.ticketDetails]);

    let viewTicket = (ticketID) => {
        let params = {
            'ticketID': ticketID,
        };
        props.getTicketDetails(props.authToken, params);
    };

    let renderRow = ({item}) => {
        return <TouchableWithoutFeedback onPress={() => {
            let object = JSON.parse(item.data);
            //viewTicket(object.ticketID)
        }}>
            <View style={styles.row}>
                <Image
                    style={styles.ticketIcon}
                    source={require('../config/images/notification_ticket_blue.png')}
                />
                <View style={styles.rowTextContainer}>
                    <Text style={styles.titleContainer}>
                        <Text style={styles.regularFont}>{item.notificationText}</Text>
                        <Text style={styles.boldFont}> {item.emailAddress}</Text>
                    </Text>
                    <Text style={styles.subtitle}>{item.timestamp}</Text>
                </View>
            </View>
        </TouchableWithoutFeedback>
    };


    return (
        <View style={styles.container}>
            <FlatList
                data={list}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderRow}
                ListFooterComponent={() => <View style={{paddingBottom: PaddingConstants.tab2}}/>}
            />
        </View>
    )
}

const mapStateToProps = state => {
    return {
        ticketDetails: state.dashboard.ticketDetails,
        authToken: state.global.authToken,
        isLoading: state.global.isLoading,
    };
};

const mapDispatchToProps = dispatch => ({
    showLoading: (flag) => {
        dispatch(showLoading(flag));
    },
    getTicketDetails: (token, params) => {
        dispatch(getDetractorTicketDetails(token, params));
    },
    clearTicketDetails: () => {
        dispatch(clearDetractorTicketDetails());
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Notification);


const styles = StyleSheet.create({
    container: {
        flex:1,
        margin: MarginConstants.tab1
    },
    row: {
        flexDirection:'row',
        alignItems:'center',
        padding: 1.2*PaddingConstants.tab1,
        margin: MarginConstants.tab1,
        backgroundColor: Colors.white
    },
    rowTextContainer: {
        marginHorizontal: MarginConstants.tab1,
        paddingHorizontal: PaddingConstants.tab1
    },
    titleContainer: {
        fontSize: TextSizes.secondary,
        color: Colors.primary,
        marginVertical: MarginConstants.halfTab
    },
    regularFont:{
        fontFamily: FontFamily.regular
    },
    boldFont: {
        fontFamily: FontFamily.semiBold
    },
    subtitle: {
        fontSize: TextSizes.semiSecondary,
        color: Colors.secondary,
    },
    ticketIcon: {
        width: 1.2*MarginConstants.tab3,
        height: 1.2*MarginConstants.tab3,
        color: Colors.accent
    }

});
