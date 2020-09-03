import React, {useState} from 'react';
import {Modal, ScrollView, TouchableOpacity, View,Text,TouchableWithoutFeedback,StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SafeAreaView from 'react-native-safe-area-view';
import {MarginConstants} from '../styles/margin.constants';
import {Colors} from '../styles/color.constants';
import DatePicker from './DatePicker';
import {MonthYearFormat} from '../Utils/AppConstants';
import {PaddingConstants} from '../styles/padding.constants';
import {TextSizes} from '../styles/textsize.constants';
import {fontFamily} from '../styles/font.constants';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';

export default function RangeCalendar(props) {

    let [isStartDateSelected, setStartDateSelected] = useState(true);
    let [isEndDateSelected, setEndDateSelected] = useState(false);
    let [startDate, setStartDate] = useState('MM/YYYY');
    let [endDate, setEndDate] = useState('MM/YYYY');

    const renderCloseButton = () => {
        return (
            <View style={styles.closeIconContainer}>
            <TouchableOpacity
                onPress={() => {
                    props.closeCalendar && props.closeCalendar(false);
                }}
                >
                        <Icon
                            name={'close'}
                            color={Colors.white}
                            style={{fontSize: 25, fontWeight: 'normal'}}
                        />
            </TouchableOpacity>
            </View>
        );
    };

    let setSelectedData = (year, month, date) => {
        if(month.length === 1) {
            month = '0'+month;
        }
        if(date.length === 1) {
            date = '0'+date;
        }
        let tempDate = date+"/"+month+"/"+year;
        if(isStartDateSelected) {
            setStartDate(tempDate)
        } else {
            setEndDate(tempDate)
        }
    };

    let renderDatePicker = () => {
        return(
            <View style={styles.datePicker}>
            <DatePicker
                onSubmit = {setSelectedData}
                dateFormat = {MonthYearFormat}
                savedDate = {isStartDateSelected ? startDate : endDate}
                minYear={2000}
                maxYear={2050}
            />
                {renderPickerFooter()}
            </View>
        )
    };

    let renderPickerFooter = () => {
        return (
            <View style={styles.calendarFooter}>
                <TouchableOpacity style={styles.okButton}
                                         onPress={() => {
                                             props.onSubmit(startDate, endDate)
                                         }}
            >
                    <Text style={styles.text}>OK</Text>
            </TouchableOpacity>
            </View>
        );
    };

    let renderHeaderText = () => {
        return (
            <View style={styles.questionContainer}>
                <Text style={styles.rangeText}>Select the range</Text>
            </View>
        );
    };

    let renderStartDateCell = () => {
        return <DateCell isSelected={isStartDateSelected}
                         selectedText={startDate}
                         selectionAction={() => {
                            setStartDateSelected(true);
                            setEndDateSelected(false)
                         }}
        />
    };

    let renderEndDateCell = () => {
        return <DateCell isSelected={isEndDateSelected}
                         selectedText={endDate}
                         selectionAction={() => {
                             setEndDateSelected(true);
                             setStartDateSelected(false);
                         }}
        />
    };

    return (
        <Modal animationType={'fade'}
               transparent={true}
               onRequestClose={() => {
                   props.closeCalendar(false);
               }}
               visible={props.showCalendar}
               supportedOrientations={['portrait', 'landscape', 'landscape-left', 'landscape-right']}
        >
            <View style={[styles.modalContainer]}>
                <SafeAreaView style={{flex: 1}}>
                    <ScrollView style={styles.scrollContainer}>
                        {renderCloseButton()}
                        <View style={styles.modalDOBView}>
                            {renderHeaderText()}
                            <Text style={styles.text}>Start date</Text>
                            {renderStartDateCell()}
                            <Text style={styles.text}>End date</Text>
                            {renderEndDateCell()}
                        </View>
                        {renderDatePicker()}

                    </ScrollView>
                </SafeAreaView>
            </View>
        </Modal>
    );
}

function DateCell(props) {
    let displayDate = (props.selectedText !== MonthYearFormat) ? moment(props.selectedText, 'DD-MM-YYYY').format('MMM, YYYY') : MonthYearFormat;
    return (
        <TouchableWithoutFeedback
            onPress={props.selectionAction}
        >
            <View style={styles.dateContainer}>

                <View style={[styles.textDateContainer,
                    {backgroundColor: props.isSelected ? Colors.accentGradient : Colors.grey}]}>
                    <View
                        style={[styles.selectedStateView,
                            {backgroundColor: props.isSelected ? Colors.accent : Colors.grey}]}/>
                    <View style={styles.textContainer}>
                        <Text style={styles.text}>{displayDate}</Text>
                    </View>
                </View>

                <FontIcon name={'calendar'}
                          size={20}
                          color={ props.isSelected ? Colors.accent : Colors.secondary}
                />
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
    },
    closeIconContainer: {
        marginRight: MarginConstants.tab2,
        alignItems:'flex-end'
    },
    calendarContainer: {
        flex:1,
        marginHorizontal: MarginConstants.tab1,
        marginTop: MarginConstants.tab1,
    },
    calendarHeader: {
        backgroundColor: Colors.white
    },
    headerIcons: {
        flexDirection: 'row',
        padding: PaddingConstants.tab1,
        backgroundColor: Colors.white
    },
    calendarBox: {
        backgroundColor: Colors.white
    },
    calendarFooter: {
        alignItems: 'flex-end',
        paddingRight:MarginConstants.tab1,
        backgroundColor: Colors.white,
        paddingTop: MarginConstants.tab1
    },
    okButton: {
        width: 2*PaddingConstants.tab4,
        height:PaddingConstants.tab3,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: MarginConstants.tab1,
        borderColor: Colors.accent
    },
    modalDOBView: {
        marginTop: MarginConstants.tab3,
        marginBottom:MarginConstants.halfTab,
        marginHorizontal: MarginConstants.tab1,
        backgroundColor: Colors.white,
        padding: PaddingConstants.tab1
    },
    questionContainer: {
        paddingBottom: PaddingConstants.tab1,
    },
    rangeText:{
        color: Colors.primary,
        textAlign: 'center',
        fontSize: TextSizes.primary,
        fontFamily: fontFamily.Regular
    },
    dateContainer: {
        minHeight: PaddingConstants.tab4,
        alignItems: 'center',
        alignSelf: 'stretch',
        marginBottom: MarginConstants.tab1,
        marginHorizontal: MarginConstants.halfTab,
        flexDirection: 'row'
    },
    text: {
        color: Colors.secondary,
        fontFamily: fontFamily.Regular,
        fontSize: TextSizes.secondary,
        justifyContent: 'center',
        alignItems:'center',
        paddingLeft: PaddingConstants.tab1,
        paddingBottom: PaddingConstants.halfTab
    },
    textDateContainer: {
        flex:1,
        paddingLeft: PaddingConstants.tab1,
        marginRight: MarginConstants.tab1,
        paddingVertical: PaddingConstants.tab1
    },
    selectedStateView: {
        width: 5,
        position:'absolute',
        left:0,
        top:0,
        bottom:0
    },
    datePicker:{
        margin: MarginConstants.tab1
    }
});
