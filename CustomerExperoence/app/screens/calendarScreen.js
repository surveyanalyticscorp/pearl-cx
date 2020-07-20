import React, {useState, useEffect} from 'react';
import {
  View,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MonthYearSelector from '../widgets/MonthYearSelector';
import moment from 'moment';
import {MarginConstants} from '../styles/margin.constants';
import {Colors} from '../styles/color.constants';
import SafeAreaView from 'react-native-safe-area-view';

const CalendarScreen = props => {
  let month = moment().month() + 1; //Need to check as it returns month number starting 0
  let year = moment().year();
  const renderCloseButton = () => {
    return (
      <TouchableOpacity
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
      </TouchableOpacity>
    );
  };

  const renderCalendarView = () => {
    return (
      <Modal
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
          <TouchableWithoutFeedback
            style={{flex: 1}}
            onPress={() => {
              props.closeCalendar && props.closeCalendar(false);
            }}>
            <View
              style={[
                {
                  flex: 1,
                  backgroundColor: 'rgba(62,62,62,0.95)',
                  marginTop: Platform.select({ios: 20, android: 0}),
                },
              ]}>
              {renderCloseButton()}
              <MonthYearSelector
                month={month}
                year={year}
                minYear={2010}
                maxYear={moment().year()}
                onSubmit={(month, year) => {
                  let selectedYear = {month: month, year: year};
                  props.onSubmit && props.onSubmit(selectedYear);
                }}
                onCancel={() => {
                  props.closeCalendar && props.closeCalendar(false);
                }}
              />
            </View>
          </TouchableWithoutFeedback>
        </SafeAreaView>
      </Modal>
    );
  };
  return renderCalendarView();
};

export default CalendarScreen;
