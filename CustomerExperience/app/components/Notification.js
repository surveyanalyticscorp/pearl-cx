import {View, Text, StyleSheet, Image} from 'react-native';
import React,{useState, useEffect} from 'react';
import {Colors} from '../styles/color.constants';
import {MarginConstants} from '../styles/margin.constants';
import {PaddingConstants} from '../styles/padding.constants';
import {TextSizes} from '../styles/textsize.constants';
import {FontFamily} from '../styles/font.constants';
import {showErrorFlashMessage} from '../Utils/Utility';
import {showLoading} from '../redux/actions';
import {connect} from 'react-redux';
import {apiHandler} from '../api/ApiHandler';


function Notification(props) {

    let [list, setList] = useState([]);

    useEffect(() => {
        props.showLoading(true);
        apiHandler.getNotificationData({'Auth-Token': props.authToken}, (response) => {
            setList(response);
            props.showLoading(false);
        }, (error) => {
            showErrorFlashMessage(error.errorAlert);
            props.showLoading(false);
        })
    },[]);

    let renderRow = () => {
        return <View style={styles.row}>
            <Image
                style={styles.ticketIcon}
                source={require('../config/images/notification_ticket_blue.png')}
            />
            <View style={styles.rowTextContainer}>
                <Text style={styles.titleContainer}>
                    <Text style={styles.regularFont}>New Ticket from</Text>
                    <Text style={styles.boldFont}> dave@mail.com</Text>
                </Text>
                <Text style={styles.subtitle}>Nov 03, 2020</Text>
            </View>
        </View>
    };


    return <View style={styles.container}>
        {renderRow()}
    </View>
}

const mapStateToProps = state => {
    return {
        isLoading: state.global.isLoading,
        authToken: state.global.authToken,
    };
};

const mapDispatchToProps = dispatch => ({
    showLoading: (flag) => {
        dispatch(showLoading(flag));
    }
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
