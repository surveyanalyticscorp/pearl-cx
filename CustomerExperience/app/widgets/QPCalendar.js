import React, {useState} from 'react';
import {View, Text, Dimensions, StyleSheet, TouchableOpacity} from 'react-native';
import {CalendarList} from 'react-native-calendars';
import {MarginConstants} from '../styles/margin.constants';
import {Colors} from '../styles/color.constants';
import {TextSizes} from '../styles/textsize.constants';
import {FontFamily} from '../styles/font.constants';
import {FullMonthYearFormat} from '../Utils/AppConstants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import StringUtils from '../Utils/StringUtils';

/* Not completed */
const QPHorizontalCalendar = (props) => {

    let months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

    let getYears = (minYears, maxYears) => {
        let data = [];
        let i = minYears;
        while(i <= maxYears){
            data.push(StringUtils.getStringFromNumber(i));
            i = i+1;
        }
        return data;
    };

    let years = getYears(1990, 2050);

    const [selectedDate, setSelectedDate] = React.useState('2020-05-16');
    const [markedDates, setMarkedDates] = React.useState({});

    const setNewDaySelected = (date) => {
        const markedDate = Object.assign({});
        markedDate[date] = {
            selected: true,
            selectedColor: '#DFA460'
        };
        setSelectedDate(date);
        setMarkedDates(markedDate);
    };

    let getTheme = () => {
        return(
            {
                selectedDayTextColor: Colors.white,
                selectedDayBackgroundColor: props.selectedBackgroundColor || Colors.accent ,
                backgroundColor: Colors.white,
                calendarBackground:  Colors.white,
                textSectionTitleColor: Colors.borderColor,
                todayTextColor: props.currentDayTextColor || Colors.accent,
                dayTextColor: props.dayTextColor || Colors.primary,
                textDisabledColor: Colors.darkGrey,
                dotColor: props.dotColor || Colors.accent ,
                selectedDotColor:  Colors.white,
                arrowColor:  Colors.secondary,
                monthTextColor: Colors.borderColor,
                textDayFontFamily: FontFamily.Regular,
                textMonthFontFamily: FontFamily.Regular,
                textDayHeaderFontFamily: FontFamily.Regular,
                textMonthFontWeight: 'bold',
                textDayFontSize: TextSizes.secondary,
                textMonthFontSize: TextSizes.secondary,
                textDayHeaderFontSize: TextSizes.secondary
            }
        );
    };

    let leftArrow = (onPressLeft) => {
        return <TouchableOpacity
            onPress={onPressLeft}
            style={styles.arrow}
            hitSlop={{left: 5, right: 5, top: 5, bottom: 5}}
        >
            <Icon name='chevron-left' size={30} color= {Colors.accent}/>
        </TouchableOpacity>
    };

    let rightArrow = (onPressRight) => {
        return <TouchableOpacity
            onPress={onPressRight}
            style={styles.arrow}
            hitSlop={{left: 5, right: 5, top: 5, bottom: 5}}
        >
            <Icon name='chevron-right' size={30} color= {Colors.accent}/>
        </TouchableOpacity>
    };

    let renderCalendarHeaderSubView = (title, leftAction, rightAction) => {
        return (
                <View style={styles.header}>
                    {leftArrow(leftAction)}
                        <Text  allowFontScaling={false} style={styles.calendarHeaderText}>{title}</Text>
                    {rightArrow(rightAction)}
                </View>
        )
    };

    let renderCalendarHeader = (date) => {
        const header = date.toString(FullMonthYearFormat);
        const [month, year] = header.split(' ');

        return (
            <View style={styles.calendarHeader}>
                {renderCalendarHeaderSubView(month)}
                {renderCalendarHeaderSubView(year)}
            </View>
        )
    };


    return (
        <CalendarList
            markedDates={markedDates}
            current={selectedDate}
            pastScrollRange={12}
            futureScrollRange={12}
            horizontal
            pagingEnabled
            onDayPress={(day) => {
                setNewDaySelected(day.dateString);
            }}
            calendarWidth={Dimensions.get('window').width - MarginConstants.tab4}
            theme={getTheme()}
            renderHeader={renderCalendarHeader}
        />
    );
};

export default QPHorizontalCalendar;

const styles = StyleSheet.create({

    calendarHeader: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
        height: 1.2*MarginConstants.tab4,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: MarginConstants.tab1,
    },
    calendarHeaderText: {
        fontSize: TextSizes.secondary,
        fontFamily: FontFamily.SemiBold,
        paddingTop: 10,
        paddingBottom: 10,
        color: Colors.secondary,
        paddingRight: 5
    },
    arrow: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },

});
