import React, {useEffect, useState} from 'react';
import {Colors} from '../../../styles/color.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableWithoutFeedback,
  Pressable,
  Modal,
} from 'react-native';
import {FontFamily} from '../../../styles/font.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import moment from 'moment';
import {
  DMYFORMAT,
  HalfMonthDateYearFormat,
  YMDFORMAT,
} from '../../../Utils/AppConstants';
import SafeAreaView from 'react-native-safe-area-view';
import {PaddingConstants} from '../../../styles/padding.constants';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {DASHBOARD_RANGE} from '../../../redux/actions/dashboard.actions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QPCalendar from '../../../widgets/QPCalendar';
import StringUtils from '../../../Utils/StringUtils';
import {StackActions, useNavigation} from '@react-navigation/native';
import {translate} from '../../../Utils/MultilinguaUtils';
import {
  BottomSheetHeader,
  SaveDashboardDate,
} from '../../../routes/CommonScreen';
import {useDispatch, useSelector} from 'react-redux';
import {setRangeFilter} from '../../../redux/actions';

export default function DashboardDateFilter(props) {
  const dispatch = useDispatch();

  const LAST_30_DAYS = 1;
  const THIS_MONTH = 2;
  const LAST_MONTH = 3;
  const LAST_3_MONTHS = 4;
  const LAST_6_MONTHS = 5;
  const CUSTOM_DATE_RANGE = 6;

  let routeName = props.route.name;
  const currentSelectedRange = useSelector(state => state.global.range);

  const [selectedRange, setSelectedRange] = useState(currentSelectedRange);
  const [selectedType, setSelectedType] = useState(
    currentSelectedRange.type || 1,
  );
  let [startDateSelected, setStartDateSelected] = useState(false);
  let [showCalendar, setShowCalendar] = useState(false);
  let [customDate, setCustomDate] = useState('');
  let [validationError, setValidationError] = useState('');

  const saveRange = () => {
    let tempEnd = moment(selectedRange.endDate, DMYFORMAT).format(YMDFORMAT);
    let tempStart = moment(selectedRange.startDate, DMYFORMAT).format(
      YMDFORMAT,
    );

    if (moment(tempEnd).isSameOrAfter(tempStart)) {
      dispatch(setRangeFilter(selectedRange));
      // props.route.params.setRange(selectedRange);

      AsyncStorage.setItem(DASHBOARD_RANGE, JSON.stringify(selectedRange));
      props.navigation.dispatch(StackActions.popToTop());
    } else {
      setValidationError('Start date should be less than End date');
    }
  };

  useEffect(() => {
    props.navigation.dangerouslyGetParent().setParams({saveRange: saveRange});
  }, [selectedRange]);

  let getFilterText = type => {
    switch (type) {
      case LAST_30_DAYS:
        return translate('date_filter.last_30_days');
      case THIS_MONTH:
        return translate('date_filter.this_month');
      case LAST_MONTH:
        return translate('date_filter.last_month');
      case LAST_3_MONTHS:
        return translate('date_filter.last_3_months');
      case LAST_6_MONTHS:
        return translate('date_filter.last_6_months');
    }
  };

  let getSelectedRange = type => {
    let today = new Date();
    let month = today.getMonth() + 1;
    let tempEndDate = today.getDate() + '/' + month + '/' + today.getFullYear();
    switch (type) {
      case LAST_30_DAYS:
        /** Last 30 days*/
        let tempStartDate = moment(tempEndDate, DMYFORMAT)
          .subtract(30, 'days')
          .format(DMYFORMAT);
        return {startDate: tempStartDate, endDate: tempEndDate};
      case THIS_MONTH:
        /** This month*/
        let firstDate = 1 + '/' + month + '/' + today.getFullYear();
        tempStartDate = moment(firstDate, DMYFORMAT).format(DMYFORMAT);
        return {startDate: tempStartDate, endDate: tempEndDate};
      case LAST_MONTH:
        /** Last month*/
        // new code

        tempStartDate = moment(moment(today).startOf('month'), DMYFORMAT)
          .subtract(1, 'months')
          .format(DMYFORMAT);
        tempEndDate = moment(
          moment(tempStartDate, DMYFORMAT).endOf('month'),
          DMYFORMAT,
        ).format(DMYFORMAT);

        return {startDate: tempStartDate, endDate: tempEndDate};
      case LAST_3_MONTHS:
        /** Last 3 months*/
        tempStartDate = moment(tempEndDate, DMYFORMAT)
          .subtract(3, 'months')
          .format(DMYFORMAT);
        return {startDate: tempStartDate, endDate: tempEndDate};
      case LAST_6_MONTHS:
        /** Last 6 months */
        tempStartDate = moment(tempEndDate, DMYFORMAT)
          .subtract(6, 'months')
          .format(DMYFORMAT);
        return {startDate: tempStartDate, endDate: tempEndDate};
      default:
        break;
    }
  };

  let getRange = type => {
    switch (type) {
      case LAST_30_DAYS:
      case LAST_3_MONTHS:
      case LAST_6_MONTHS:
        let range = getSelectedRange(type);
        return range.startDate + ' - ' + range.endDate;
      case THIS_MONTH:
        let date1 = new Date();
        return date1.toLocaleString('default', {month: 'long'});
      case LAST_MONTH:
        let date2 = new Date();
        let date = new Date(
          date2.getFullYear(),
          date2.getMonth() - 1,
          date2.getDate(),
        ); //last month date
        return date.toLocaleString('default', {month: 'long'});
    }
  };

  let renderValidationError = () => {
    return <Text style={styles.error}>{validationError}</Text>;
  };

  let renderMonthRow = type => {
    let title = getFilterText(type);
    let range = getRange(type);
    return (
      <View style={{marginBottom: 0.5}}>
        <TouchableWithoutFeedback
          onPress={() => {
            let rangeSelected = getSelectedRange(type);

            setSelectedType(type);
            let dashboardRange = {type: type, ...rangeSelected};
            setSelectedRange(dashboardRange);
          }}>
          <View style={styles.monthRow}>
            <View>
              <Text style={styles.dateTitle}>{title}</Text>
            </View>
            {selectedType === type && (
              <View style={styles.checkIcon}>
                <MaterialIcon name={'check'} size={25} color={Colors.accent} />
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
        {type !== LAST_6_MONTHS && <View style={styles.separator} />}
      </View>
    );
  };

  let renderMonthView = () => {
    return (
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.container}>
          {renderMonthRow(LAST_30_DAYS)}
          {renderMonthRow(THIS_MONTH)}
          {renderMonthRow(LAST_MONTH)}
          {renderMonthRow(LAST_3_MONTHS)}
          {renderMonthRow(LAST_6_MONTHS)}
        </View>
      </ScrollView>
    );
  };

  let renderCancelButton = () => {
    return (
      <Pressable
        style={styles.cancelButton}
        onPress={() => {
          setShowCalendar(false);
        }}>
        <Text style={styles.buttonText}>Cancel</Text>
      </Pressable>
    );
  };

  let renderOkButton = () => {
    return (
      <Pressable
        style={styles.cancelButton}
        onPress={() => {
          //save date
          if (startDateSelected) {
            setSelectedRange({
              ...selectedRange,
              type: CUSTOM_DATE_RANGE,
              startDate: customDate,
            });
          } else {
            setSelectedRange({
              ...selectedRange,
              type: CUSTOM_DATE_RANGE,
              endDate: customDate,
            });
          }
          setShowCalendar(false);
        }}>
        <Text style={styles.buttonText}>Ok</Text>
      </Pressable>
    );
  };

  let renderCalendarFooter = () => {
    return (
      <View style={styles.calendarFooter}>
        {renderCancelButton()}
        {renderOkButton()}
      </View>
    );
  };

  let setCalendarDate = date => {
    let tempDate = moment(date, 'YYYY-MM-DD').format(DMYFORMAT);
    setCustomDate(tempDate);
  };

  let renderCalendar = () => {
    let date = startDateSelected
      ? selectedRange.startDate
      : selectedRange.endDate;
    let selectedDate = moment(date, DMYFORMAT).format('YYYY-MM-DD');
    let currentDate = moment().format('YYYY-MM-DD');
    let currentYear = moment().year();
    let minYear = parseInt(currentYear) - 4;
    return (
      <View style={styles.calendarContainer}>
        <View style={styles.calendarBox}>
          <QPCalendar
            {...props}
            selectDate={setCalendarDate}
            selectedDate={selectedDate}
            minimumDate={minYear + '-01-01'}
            maximumDate={currentDate}
            minYear={minYear}
            maxYear={currentYear}
          />
        </View>
        {renderCalendarFooter()}
      </View>
    );
  };

  let renderCalendarViewOnModal = () => {
    return (
      <Modal
        animationType={'fade'}
        transparent={true}
        onRequestClose={() => {}}
        visible={showCalendar}
        supportedOrientations={['portrait']}>
        <View style={styles.modalContainer}>
          <SafeAreaView style={{flex: 1}}>
            <ScrollView style={styles.scrollContainer}>
              {renderCalendar()}
            </ScrollView>
          </SafeAreaView>
        </View>
      </Modal>
    );
  };

  let renderStartDateRow = (isStartDate, displayDate) => {
    let title = isStartDate
      ? translate('date_filter.start_date')
      : translate('date_filter.end_date');
    let date = moment(displayDate, 'DD-MM-YYYY').format(
      HalfMonthDateYearFormat,
    );
    return (
      <View style={{marginBottom: 0.5}}>
        <TouchableWithoutFeedback
          onPress={() => {
            setShowCalendar(true);
            StringUtils.isNotEmpty(validationError) && setValidationError('');
            setStartDateSelected(isStartDate);
            setCustomDate(displayDate);
          }}>
          <View style={styles.customRow}>
            <Text style={styles.dateTitle}>{title}</Text>
            <Text style={styles.rangeTitle}>{date}</Text>
          </View>
        </TouchableWithoutFeedback>
        {isStartDate && <View style={styles.separator} />}
      </View>
    );
  };

  let renderCustomView = () => {
    return (
      <View style={styles.container}>
        {StringUtils.isNotEmpty(validationError) && renderValidationError()}
        {renderStartDateRow(true, selectedRange.startDate)}
        {renderStartDateRow(false, selectedRange.endDate)}
        {showCalendar && renderCalendarViewOnModal()}
      </View>
    );
  };

  const RenderDateList = () => {
    const navigation = useNavigation();
    return (
      <ScrollView style={styles.scrollContainer}>
        <BottomSheetHeader
          title={translate('date_filter.date_range')}
          onPressClose={() => {
            navigation.goBack();
          }}
        />
        <View style={styles.container}>
          {renderMonthRow(LAST_30_DAYS)}
          {renderMonthRow(THIS_MONTH)}
          {renderMonthRow(LAST_MONTH)}
          {renderMonthRow(LAST_3_MONTHS)}
          {renderMonthRow(LAST_6_MONTHS)}
          {StringUtils.isNotEmpty(validationError) && renderValidationError()}
          {renderStartDateRow(true, selectedRange.startDate)}
          {renderStartDateRow(false, selectedRange.endDate)}
          <SaveDashboardDate saveRange={saveRange} />

          {showCalendar && renderCalendarViewOnModal()}
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* {routeName === translate('date_filter.month')
        ? renderMonthView()
        : renderCustomView()}
       */}
      <RenderDateList />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingTop: PaddingConstants.halfTab,
    paddingHorizontal: PaddingConstants.tab1,
  },
  dateTitle: {
    color: Colors.primary,
    fontSize: TextSizes.primary,
    fontFamily: FontFamily.regular,
  },
  rangeTitle: {
    color: Colors.secondary,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
    marginVertical: MarginConstants.halfTab,
  },
  separator: {
    backgroundColor: Colors.borderColor,
    height: 0.5,
    marginHorizontal: MarginConstants.tab2,
    marginBottom: MarginConstants.tab2,
  },
  monthRow: {
    marginHorizontal: MarginConstants.tab2,
    marginVertical: 1.5 * MarginConstants.tab1,
    flexDirection: 'row',
  },
  checkIcon: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    flex: 1,
    marginRight: MarginConstants.tab1,
  },
  customRow: {
    marginHorizontal: MarginConstants.tab2,
    marginVertical: 1.5 * MarginConstants.tab1,
  },
  calendarContainer: {
    flex: 1,
    marginHorizontal: MarginConstants.tab1,
    marginTop: 6 * MarginConstants.tab4,
  },
  calendarBox: {
    backgroundColor: Colors.white,
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  calendarFooter: {
    justifyContent: 'flex-end',
    backgroundColor: Colors.white,
    flexDirection: 'row',
  },
  cancelButton: {
    minWidth: PaddingConstants.tab4,
    height: PaddingConstants.tab3,
    justifyContent: 'center',
    alignItems: 'center',
    margin: MarginConstants.tab1,
    paddingHorizontal: PaddingConstants.tab1,
  },
  okButton: {
    minWidth: PaddingConstants.tab4 + PaddingConstants.tab1,
    height: PaddingConstants.tab3,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: MarginConstants.tab1,
  },
  buttonText: {
    color: Colors.accent,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
    textAlign: 'center',
  },
  error: {
    color: Colors.error,
    textAlign: 'center',
    fontSize: TextSizes.secondary,
    fontFamily: FontFamily.light,
  },
});
