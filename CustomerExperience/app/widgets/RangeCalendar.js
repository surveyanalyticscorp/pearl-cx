import React, {useState} from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  Pressable,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import {MarginConstants} from '../styles/margin.constants';
import {Colors} from '../styles/color.constants';
import {
  DMYFORMAT,
  FullMonthDateYearFormat,
  YMDFORMAT,
  HalfMonthDateYearFormat,
} from '../Utils/AppConstants';
import {PaddingConstants} from '../styles/padding.constants';
import {TextSizes} from '../styles/textsize.constants';
import {FontFamily} from '../styles/font.constants';
import moment from 'moment';

export default function RangeCalendar(props) {
  let [startDate, setStartDate] = useState(props.startDate);
  let [endDate, setEndDate] = useState(props.endDate);
  let [showCustom, setShowCustom] = useState(props.selectedType === 4);
  let [validationError, setValidationError] = useState('');
  let [selectedType, setSelectedType] = useState(props.selectedType);
  let [startDateSelected, setStartDateSelected] = useState(false);

  const renderCloseButton = () => {
    return (
      <View style={styles.closeIconContainer}>
        <Pressable
          onPress={() => {
            props.closeCalendar && props.closeCalendar(false);
          }}>
          <Icon name={'close'} color={Colors.white} size={25} />
        </Pressable>
      </View>
    );
  };

  let getFilterText = type => {
    switch (type) {
      case 1:
        return 'Last 30 days';
      case 2:
        return 'Last 3 months';
      case 3:
        return 'Last 6 months';
      default:
        return 'Custom';
    }
  };

  let renderPredefinedDateSelection = type => {
    let text = getFilterText(type);
    return (
      <View style={styles.preDefinedDateContainer}>
        {type === selectedType && <View style={styles.selectedStateView} />}
        <TouchableWithoutFeedback
          onPress={() => {
            if (type !== 4) {
              props.onSubmit(type, '', '');
            } else {
              setSelectedType(type);
              setShowCustom(true);
              setStartDateSelected(true);
            }
          }}>
          <Text style={styles.rangeText}>{text}</Text>
        </TouchableWithoutFeedback>
      </View>
    );
  };

  let showSelectedDate = () => {
    let sDate = moment(startDate, DMYFORMAT).format(HalfMonthDateYearFormat);
    let eDate = moment(endDate, DMYFORMAT).format(HalfMonthDateYearFormat);
    let selectedDateString = sDate + ' - ' + eDate;
    return (
      <View style={[styles.preDefinedDateContainer, {flexDirection: 'row'}]}>
        <Text style={styles.text}>Date Selected</Text>
        <View style={styles.selectedDate}>
          <Text style={styles.text}>{selectedDateString}</Text>
        </View>
      </View>
    );
  };

  let saveDate = () => {
    if (startDate !== DMYFORMAT && endDate !== DMYFORMAT) {
      if (!moment(startDate, DMYFORMAT).isValid()) {
        setValidationError('Invalid start date entered');
      } else if (!moment(endDate, DMYFORMAT).isValid()) {
        setValidationError('Invalid end date entered');
      } else {
        let tempEnd = moment(endDate, DMYFORMAT).format(YMDFORMAT);
        let tempStart = moment(startDate, DMYFORMAT).format(YMDFORMAT);
        if (moment(tempEnd).isSameOrAfter(tempStart)) {
          tempEnd = moment(tempEnd, YMDFORMAT).format(DMYFORMAT);
          tempStart = moment(tempStart, YMDFORMAT).format(DMYFORMAT);
          props.onSubmit(4, tempStart, tempEnd);
        } else {
          setValidationError('start date should be less than end date');
        }
      }
    } else {
      setValidationError('Please select a date');
    }
  };

  let renderPickerFooter = () => {
    return (
      <View style={styles.calendarFooter}>
        <Pressable style={styles.okButton} onPress={saveDate}>
          <Text style={[styles.text, {color: Colors.white}]}>OK</Text>
        </Pressable>
      </View>
    );
  };

  let setSelectedData = (year, month, date) => {
    setValidationError('');
    if (month.length === 1) {
      month = '0' + month;
    }
    if (date.length === 1) {
      date = '0' + date;
    }
    let tempDate = date + '/' + month + '/' + year;
    if (startDateSelected) {
      setStartDate(tempDate);
    } else {
      setEndDate(tempDate);
    }
  };

  let renderDatePicker = () => {
    return <View style={styles.datePicker} />;
  };

  let renderStartDateCell = () => {
    return (
      <DateCell
        isSelected={startDateSelected}
        selectedText={startDate}
        prefix={'From'}
        selectionAction={() => {
          setStartDateSelected(true);
        }}
      />
    );
  };

  let renderEndDateCell = () => {
    return (
      <DateCell
        isSelected={!startDateSelected}
        selectedText={endDate}
        prefix={'Until'}
        selectionAction={() => {
          setStartDateSelected(false);
        }}
      />
    );
  };

  let showCustomDateContainer = () => {
    return renderDatePicker();
  };

  let renderValidationError = () => {
    return <Text style={styles.error}>{validationError}</Text>;
  };

  return (
    <Modal
      animationType={'fade'}
      transparent={true}
      onRequestClose={() => {
        props.closeCalendar(false);
      }}
      visible={props.showCalendar}
      supportedOrientations={['portrait']}>
      <View style={[styles.modalContainer]}>
        <SafeAreaView style={{flex: 1}}>
          <ScrollView style={styles.scrollContainer}>
            {renderCloseButton()}
            <View>
              <View style={styles.modalDOBView}>
                {!showCustom && showSelectedDate()}
                {renderPredefinedDateSelection(1)}
                {renderPredefinedDateSelection(2)}
                {renderPredefinedDateSelection(3)}
                {renderPredefinedDateSelection(4)}
              </View>
              {showCustom && (
                <View style={styles.modalDOBView}>
                  {renderValidationError()}
                  {renderStartDateCell()}
                  {renderEndDateCell()}
                  {showCustomDateContainer()}
                  {renderPickerFooter()}
                </View>
              )}
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

function DateCell(props) {
  let displayDate = moment(props.selectedText, 'DD-MM-YYYY').format(
    FullMonthDateYearFormat,
  );
  return (
    <TouchableWithoutFeedback onPress={props.selectionAction}>
      <View style={styles.dateContainer}>
        <Text style={styles.text}>{props.prefix}</Text>
        <View style={styles.textDateContainer}>
          <View style={styles.textContainer}>
            <Text
              style={[
                styles.text,
                {color: props.isSelected ? Colors.accent : Colors.secondary},
              ]}>
              {displayDate}
            </Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  closeIconContainer: {
    marginRight: MarginConstants.tab2,
    alignItems: 'flex-end',
  },
  calendarFooter: {
    alignItems: 'flex-end',
    paddingRight: MarginConstants.tab1,
    paddingTop: MarginConstants.tab1,
    marginTop: MarginConstants.tab1,
  },
  okButton: {
    width: 2 * PaddingConstants.tab4,
    height: PaddingConstants.tab3,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.accent,
    marginBottom: MarginConstants.tab1,
  },
  modalDOBView: {
    marginBottom: MarginConstants.halfTab,
    marginHorizontal: MarginConstants.tab1,
    backgroundColor: Colors.darkerGrey,
    padding: PaddingConstants.tab1,
  },
  rangeText: {
    color: Colors.primary,
    fontSize: TextSizes.primary,
    fontFamily: FontFamily.regular,
    flex: 1,
  },
  dateContainer: {
    minHeight: PaddingConstants.tab4,
    alignItems: 'center',
    alignSelf: 'stretch',
    marginBottom: MarginConstants.tab1,
    marginHorizontal: MarginConstants.halfTab,
    flexDirection: 'row',
  },
  text: {
    color: Colors.secondary,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: PaddingConstants.tab1,
    paddingBottom: PaddingConstants.halfTab,
  },
  error: {
    color: Colors.error,
    textAlign: 'center',
    fontSize: TextSizes.secondary,
    fontFamily: FontFamily.light,
  },
  selectedStateView: {
    width: 5,
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: Colors.accent,
  },
  preDefinedDateContainer: {
    padding: PaddingConstants.tab1,
    margin: MarginConstants.tab1,
    backgroundColor: Colors.white,
    height: PaddingConstants.tab4,
    flexDirection: 'row',
  },
  selectedDate: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  datePicker: {
    margin: MarginConstants.tab1,
  },
  textDateContainer: {
    flex: 1,
    paddingLeft: PaddingConstants.tab1,
    marginRight: MarginConstants.tab1,
    paddingVertical: PaddingConstants.tab1,
    backgroundColor: Colors.grey,
  },
});
