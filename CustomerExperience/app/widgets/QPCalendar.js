import React, {useState, useRef} from 'react';
import {View, Text, StyleSheet, Pressable, Platform} from 'react-native';
import {MarginConstants} from '../styles/margin.constants';
import {Colors} from '../styles/color.constants';
import {TextSizes} from '../styles/textsize.constants';
import {FontFamily} from '../styles/font.constants';
import {FullMonthYearFormat} from '../Utils/AppConstants';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import StringUtils from '../Utils/StringUtils';
import {PaddingConstants} from '../styles/padding.constants';
import ModalDropdown from './drop-down/ModalDropdown';
import moment from 'moment';
import Calendar from './qp-calendar/calendar';

const QPCalendar = props => {
  let ref = useRef(null);
  let [selectedDate, setSelectedDate] = useState(props.selectedDate);

  let getTheme = () => {
    return {
      selectedDayTextColor: Colors.white,
      selectedDayBackgroundColor: Colors.accent,
      backgroundColor: Colors.white,
      calendarBackground: Colors.white,
      textSectionTitleColor: Colors.borderColor,
      todayTextColor: Colors.accent,
      dayTextColor: Colors.primary,
      textDisabledColor: Colors.darkGrey,
      dotColor: Colors.accent,
      selectedDotColor: Colors.accent,
      arrowColor: Colors.secondary,
      monthTextColor: Colors.borderColor,
      textDayFontFamily: FontFamily.regular,
      textMonthFontFamily: FontFamily.regular,
      textDayHeaderFontFamily: FontFamily.regular,
      textMonthFontWeight: 'bold',
      textDayFontSize: TextSizes.secondary,
      textMonthFontSize: TextSizes.secondary,
      textDayHeaderFontSize: TextSizes.secondary,
    };
  };

  let getYears = () => {
    let data = [];
    let i = props.minYear;
    while (i <= props.maxYear) {
      data.push(StringUtils.getStringFromNumber(i));
      i = i + 1;
    }
    return data;
  };

  let years = getYears();

  let renderDropDown = selectedValue => {
    let index = years.findIndex(item => item === selectedValue);
    return (
      <View>
        <ModalDropdown
          ref={ref}
          style={styles.modelDropdown}
          textStyle={styles.dropdownText}
          dropdownTextStyle={styles.dropdownText}
          arrowIconColor={Colors.secondary}
          options={years}
          defaultValue={selectedValue}
          renderRow={dropdownRenderRow}
          defaultIndex={index}
          onSelect={i => {
            let components = selectedDate.split('-');
            let tempDate = years[i] + '-' + components[1] + '-' + components[2];
            setSelectedDate(tempDate);
            props.selectDate(tempDate);
          }}
        />
      </View>
    );
  };

  let actionOnLeftArrow = () => {
    let tempDate = moment(selectedDate, 'YYYY-MM-DD')
      .subtract(1, 'M')
      .format('YYYY-MM-DD');
    let year = moment(tempDate).year();
    if (year >= props.minYear) {
      setSelectedDate(tempDate);
      props.selectDate(tempDate);
    }
  };

  let actionOnRightArrow = () => {
    let tempDate = moment(selectedDate, 'YYYY-MM-DD')
      .add(1, 'M')
      .format('YYYY-MM-DD');
    let year = moment(tempDate).year();
    let month = moment(tempDate).month();
    let currentMonth = moment().month();
    if (year <= props.maxYear) {
      if (month < currentMonth) {
        setSelectedDate(tempDate);
        props.selectDate(tempDate);
      } else if (month === currentMonth) {
        if (tempDate <= props.maximumDate) {
          setSelectedDate(tempDate);
          props.selectDate(tempDate);
        } else {
          setSelectedDate(props.maximumDate);
          props.selectDate(props.maximumDate);
        }
      }
    }
  };

  let renderCalendarHeader = date => {
    let tempDate = moment(selectedDate, 'YYYY-MM-DD').format('YYYY-MMMM-DD');
    let components = tempDate.split('-');
    return (
      <View style={styles.calendarHeaderContainer}>
        <View style={styles.calendarHeader}>
          <Text style={styles.dateTitle}>{components[1]}</Text>
        </View>
        <View style={styles.dropdownButton}>
          {renderDropDown(components[0] + '')}
        </View>
        <View style={styles.calendarArrowView}>
          <Pressable
            onPress={actionOnLeftArrow}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            <Icon
              name={'arrow-left'}
              size={15}
              color={Colors.secondary}
              style={{
                paddingHorizontal: PaddingConstants.tab1,
                marginRight: MarginConstants.tab2,
              }}
            />
          </Pressable>
          <Pressable
            onPress={actionOnRightArrow}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            <Icon
              name={'arrow-right'}
              size={15}
              color={Colors.secondary}
              style={{paddingHorizontal: PaddingConstants.tab1}}
            />
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <View>
      <Calendar
        minDate={props.minimumDate}
        maxDate={props.maximumDate}
        onDayPress={({dateString}) => {
          setSelectedDate(dateString);
          props.selectDate(dateString);
        }}
        monthFormat={FullMonthYearFormat}
        disableMonthChange={false}
        firstDay={1}
        hideArrows={true}
        headerStyle={styles.calendarHeader}
        current={selectedDate} // Initially visible month
        markedDates={JSON.parse(
          JSON.stringify({
            [selectedDate]: {
              selected: true,
              disableTouchEvent: true,
              selectedDotColor: Colors.accent,
            },
          }),
        )}
        theme={getTheme()}
        renderHeader={renderCalendarHeader}
        hideDayNames={true}
      />
    </View>
  );
};

function dropdownRenderRow(rowData, rowID, highlighted) {
  return (
    <View
      style={[
        styles.dropdownRow,
        {backgroundColor: highlighted ? Colors.overlay : Colors.white},
      ]}>
      <Text style={styles.dropdownText}>{rowData}</Text>
    </View>
  );
}

export default QPCalendar;

const styles = StyleSheet.create({
  calendarHeaderContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  calendarHeader: {
    flex: 1,
    height: 1.5 * MarginConstants.tab4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: PaddingConstants.halfTab,
  },
  calendarArrowView: {
    marginRight: MarginConstants.tab2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateTitle: {
    color: Colors.primary,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
    textAlignVertical: 'center',
    textAlign: 'right',
  },
  modelDropdown: {
    minHeight: MarginConstants.tab3,
    marginRight: MarginConstants.tab1,
    width: '100%',
  },
  dropdownText: {
    color: Colors.primary,
    marginVertical: MarginConstants.tab1,
    marginHorizontal: MarginConstants.halfTab,
    fontSize: Platform.isPad
      ? TextSizes.primary
      : Platform.OS === 'android'
      ? TextSizes.primary
      : TextSizes.secondary,
    textAlign: 'left',
    textAlignVertical: 'center',
    borderColor: Colors.darkerGrey,
  },
  dropdownRow: {
    flexDirection: 'row',
    minHeight: MarginConstants.tab4,
    paddingHorizontal: PaddingConstants.tab1,
  },
  dropdownButton: {
    position: 'absolute',
    left: 80,
    top: 12,
  },
});
