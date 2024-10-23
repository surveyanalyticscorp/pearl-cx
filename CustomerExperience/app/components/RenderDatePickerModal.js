import React from 'react';
import DatePicker from 'react-native-date-picker';
// import {showSuccessFlashMessage} from '../Utils/Utility';
import moment from 'moment';
import {DMYFORMAT, YMDFORMAT} from '../Utils/AppConstants';
const RenderDatePickerModal = ({
  isOpen,
  setOpen,
  currentDate,
  setDate,
  isMaxDateIsToday = true,
  isStartDate = false,
}) => {
  const today = new Date();
  const selectedDate = new Date(
    moment(currentDate, DMYFORMAT).format(YMDFORMAT),
  );

  const minimumDate = new Date(
    new Date().setFullYear(new Date().getFullYear() - 4),
  );

  return (
    <DatePicker
      modal
      open={isOpen}
      date={selectedDate}
      mode="date"
      maximumDate={isMaxDateIsToday ? today : undefined}
      minimumDate={minimumDate}
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
