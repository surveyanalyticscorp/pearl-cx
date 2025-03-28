import React from 'react';
import DatePicker from 'react-native-date-picker';
// import {showSuccessFlashMessage} from '../Utils/Utility';
import moment from 'moment';
import {DMYFORMAT, YMDFORMAT} from '../Utils/AppConstants';
import StringUtils from '../Utils/StringUtils';
const RenderDatePickerModal = ({
  isOpen,
  setOpen,
  currentDate,
  setDate,
  isMaxDateIsToday = true,
  isStartDate = false,
}) => {
  console.log(
    'TEST RenderDatePickerModal',
    JSON.stringify({
      isOpen,
      setOpen,
      currentDate,
      setDate,
      isMaxDateIsToday,
      isStartDate,
    }),
  );

  const today = new Date();
  const selectedDate = StringUtils.isNotEmpty(currentDate)
    ? new Date(moment(currentDate, DMYFORMAT).format(YMDFORMAT))
    : new Date();

  const minimumDate = new Date(
    new Date().setFullYear(new Date().getFullYear() - 4),
  );

  console.log(
    'TEST RenderDatePickerModal',
    JSON.stringify({
      isOpen,
      setOpen,
      currentDate,
      setDate,
      isMaxDateIsToday,
      isStartDate,
      today,
      selectedDate,
    }),
  );

  return (
    <DatePicker
      modal
      open={isOpen}
      date={selectedDate}
      mode="date"
      maximumDate={isMaxDateIsToday ? today : undefined}
      minimumDate={minimumDate}
      title={isStartDate ? 'Start date' : 'End date'}
      onConfirm={date => {
        setOpen(false);
        setDate(isStartDate, date);

        // showSuccessFlashMessage(date.getDate().toLocaleString());
      }}
      onCancel={() => {
        setOpen(false);
      }}
    />
  );
};
export default RenderDatePickerModal;
