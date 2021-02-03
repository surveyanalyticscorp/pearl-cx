import {
    View,
    Text,
    StyleSheet,
    Image,
    FlatList,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Animated
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Colors} from '../styles/color.constants';
import {MarginConstants} from '../styles/margin.constants';
import {PaddingConstants} from '../styles/padding.constants';
import {TextSizes} from '../styles/textsize.constants';
import {FontFamily} from '../styles/font.constants';
import {showErrorFlashMessage} from '../Utils/Utility';
import {showLoading} from '../redux/actions';
import {useDispatch, useSelector} from 'react-redux';
import {apiHandler} from '../api/ApiHandler';
import moment from 'moment';
import {HalfMonthDateYearFormat} from '../Utils/AppConstants';
import QPSpinner from '../widgets/QPSpinner';
import Swipeable from 'react-native-gesture-handler/Swipeable';


export default function Notification(props) {
    let row: Array<any> = [];
    let prevOpenedRow;

    let [list, setList] = useState([]);
    const isLoading = useSelector(state => state.global.isLoading);
    const authToken = useSelector(state => state.global.authToken);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(showLoading(true));
        apiHandler.getNotificationData({'Auth-Token': authToken}, (response) => {
            setList(response.notificationLogs);
            dispatch(showLoading(false))
        }, (error) => {
            showErrorFlashMessage(error.errorAlert);
            dispatch(showLoading(false));
        })
    }, []);

    useEffect(() => {
        props.navigation.setParams({'clearAllNotifications': clearAllNotifications});
    }, []);

    let clearAllNotifications = () =>{
        apiHandler.clearNotification({'Auth-Token': authToken}, ({}),
            (response) => {
                setList([]);
            },(error) =>{

            })
    };

    let clearNotification = (notification) => {
        console.log('Delete item: ' + notification.id);
        apiHandler.clearNotification({'Auth-Token': authToken}, ({"id": notification.id}),
            (response) => {
                if(prevOpenedRow){
                    prevOpenedRow.close();
                }
                let filteredList = list.filter(function (item) {
                    return item.id !== notification.id
                });
                setList(filteredList);
            }, (error) => {
                showErrorFlashMessage(error.errorAlert);
            })
    };

    let viewTicket = (ticketID) => {
        props.navigation.navigate('Ticket Details', {ticketID: ticketID, parentRoute: 'Dashboard'});
    };


    const leftSwipe = (progress, dragX, item) => {
        const scale = dragX.interpolate({
            inputRange: [0, 100],
            outputRange: [0, 1],
            extrapolate: 'clamp',
        });

        return (
            <TouchableOpacity onPress={() => clearNotification(item)} activeOpacity={0.5}>
                <View style={styles.deleteBox}>
                    <Animated.Text style={{transform: [{scale: scale}]}}>
                        Delete
                    </Animated.Text>
                </View>
            </TouchableOpacity>
        );
    };

    let renderRow = ({item, index}) => {
        let imagePath = item.logType === 'U' ?
            require('../config/images/notification_comment_blue.png') : require('../config/images/notification_ticket_blue.png');
        let text = item.notificationText.replace(item.emailAddress, '');
        let time = moment(item.timestamp).format(HalfMonthDateYearFormat);

        return <Swipeable
            ref = {ref => row[index] = ref}
            friction={1}
            leftThreshold={40}
            rightThreshold={80}
            renderLeftActions = {(progress, dragX) => leftSwipe(progress, dragX, item)}
            onSwipeableWillOpen = {() => closePrevOpenRow(index)}>
            <TouchableWithoutFeedback
                onPress={() => {
                let object = JSON.parse(item.data);
                viewTicket(object.CXTicket)}}>
                <View style={styles.row}>
                    <Image
                        style={styles.ticketIcon}
                        source={imagePath}
                    />
                    <View style={styles.rowTextContainer}>
                        <Text style={styles.titleContainer}>
                            <Text style={styles.regularFont}>{text}</Text>
                            <Text style={styles.boldFont}> {item.emailAddress}</Text>
                        </Text>
                        <Text style={styles.subtitle}>{time}</Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Swipeable>
    };

    let closePrevOpenRow = (index) =>{
        if (prevOpenedRow && prevOpenedRow !== row[index]) {
            prevOpenedRow.close();
        }
        prevOpenedRow = row[index];
    };

    let renderSpinner = () => {
        return (
            <View style={styles.loading}>
                <QPSpinner/>
            </View>
        )
    };

    let renderContainer = () => {
        return <FlatList
            data={list}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderRow}
            ListFooterComponent={() => <View style={{paddingBottom: PaddingConstants.tab2}}/>}
        />
    };

    return (
        <View style={styles.container}>
            {isLoading ? renderSpinner() : renderContainer()}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: MarginConstants.tab1
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 1.2 * PaddingConstants.tab1,
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
    regularFont: {
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
        width: 1.1 * MarginConstants.tab3,
        height: 1.1 * MarginConstants.tab3,
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
    deleteBox: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: MarginConstants.tab1,
        width: 80,
        height: 70
    },
});
