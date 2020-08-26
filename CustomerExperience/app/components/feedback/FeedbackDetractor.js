import React, {useState, useEffect, useRef} from 'react';
import {View, Text} from 'react-native';

import {styles} from '../../styles/styles';
import MonthYearSelector from '../../widgets/MonthYearSelector';
import moment from 'moment';
import {EventRegister} from 'react-native-event-listeners';

const FeedbackDetractor = props => {
  const [calendar, setCalendar] = useState(false);
  let month = moment().month() + 1; //Need to check as it returns month number starting 0
  let year = moment().year();

  let listener = useRef(null);

  useEffect(() => {
    listener = EventRegister.addEventListener('openCalendar', data => {
      setCalendar(!calendar);
    });
    return () => {
      EventRegister.removeEventListener(listener);
    };
  }, [calendar]);

  const getCalendarView = () => {
    return (
      <MonthYearSelector
        month={month}
        year={year}
        minYear={2010}
        maxYear={moment().year()}
        onSubmit={(month, year) => {
          setCalendar(false);
        }}
        onCancel={() => {
          setCalendar(false);
        }}
      />
    );
  };

  const getCenterView = () => {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Feedback detract</Text>
      </View>
    );
  };
  return calendar ? getCalendarView() : getCenterView();
};

export default FeedbackDetractor;
