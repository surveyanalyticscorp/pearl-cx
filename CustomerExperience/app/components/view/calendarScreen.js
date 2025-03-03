import React, {useState} from 'react';
import {Modal, Platform, Pressable, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
// import MonthYearSelector from '../../widgets/MonthYearSelector';
import moment from 'moment';
import {MarginConstants} from '../../styles/margin.constants';
import {Colors} from '../../styles/color.constants';
import SafeAreaView from 'react-native-safe-area-view';

const CalendarScreen = props => {
  const [selectedYear, setSelectedYear] = useState({
    month: props.selectedDate.month,
    year: props.selectedDate.year,
  });
  const renderCloseButton = () => {
    return (
      <Pressable
        testID="close-button"
        onPress={() => {
          props.closeCalendar && props.closeCalendar(false);
        }}
        style={[
          {
            marginTop: MarginConstants.halfTab,
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
          },
        ]}>
        <SafeAreaView
          style={{
            marginTop: MarginConstants.tab2 * 1.5,
            marginStart: MarginConstants.tab1,
            marginEnd: MarginConstants.tab1,
          }}>
          <View style={{margin: MarginConstants.tab1 * 2}}>
            <Icon
              name={'close'}
              color={Colors.white}
              style={{fontSize: 25, fontWeight: 'normal'}}
            />
          </View>
        </SafeAreaView>
      </Pressable>
    );
  };

  const renderCalendarView = () => {
    return (
      <Modal
        testID="calendar-modal"
        animationType={'fade'}
        transparent={true}
        visible={props.showCalendar}
        supportedOrientations={['portrait', 'landscape']}
        onRequestClose={() => {
          props.closeCalendar && props.closeCalendar(false);
        }}>
        <SafeAreaView
          forceInset={{vertical: 'never', horizontal: 'never'}}
          style={{flex: 1, marginTop: -60, paddingTop: 40}}>
          <View
            style={[
              {
                flex: 1,
                backgroundColor: 'rgba(62,62,62,0.95)',
                marginTop: Platform.select({ios: 20, android: 0}),
              },
            ]}>
            {renderCloseButton()}
            {/* <MonthYearSelector
              month={selectedYear.month}
              year={selectedYear.year}
              minYear={2010}
              maxYear={moment().year()}
              onSubmit={(month, year) => {
                let selectedYear = {month: month, year: year};
                setSelectedYear(selectedYear);
                props.onSubmit && props.onSubmit(selectedYear);
              }}
              onCancel={() => {
                props.closeCalendar && props.closeCalendar(false);
              }}
            /> */}
          </View>
        </SafeAreaView>
      </Modal>
    );
  };
  return renderCalendarView();
};

export default CalendarScreen;
