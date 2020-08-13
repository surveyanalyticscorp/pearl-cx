import React, {Component} from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  Button,
  TouchableHighlight,
  Text,
} from 'react-native';
import {fontFamily} from '../styles/font.constants';
import Picker from '@gregfrench/react-native-wheel-picker';

import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
var PickerItem = Picker.Item;
var {height: deviceHeight, width: deviceWidth} = Dimensions.get('window');

var styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerColumn: {
    flex: 1,
    padding: 5,
    alignItems: 'center',
  },
  pickerTitle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
const dateFormat = 'YYYY';
const getMonthListFirstDayDate = date => {
  const monthList = [];
  const year = date.format('YYYY');
  for (let i = 1; i < 13; i += 1) {
    monthList.push(moment(`01-${i}-${year}`, dateFormat));
  }
  return monthList;
};

const getYearListFromMinYear = (minYear, maxYear) => {
  const yearList = [];

  for (let i = minYear; i <= maxYear; i++) {
    yearList.push(i);
  }
  return yearList;
};

export default class MonthYearSelector extends Component {
  constructor(props) {
    super(props);
    this.months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    this.years = getYearListFromMinYear(props.minYear, props.maxYear);
    this.state = {
      selectedMonth: props.month,
      selectedYear: props.year,
    };
  }

  render() {
    return (
      <View
        style={[
          {padding: 20, backgroundColor: 'white', minHeight: 400},
          this.props.style,
        ]}>
        {this.renderHeader()}
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
          {this.renderMonthPicker()}
          {this.renderYearPicker()}
        </View>
        {this.renderActionButtons()}
      </View>
    );
  }
  renderActionButtons() {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'center',
          marginTop: 10,
        }}>
        {this.getDoneButton()}
      </View>
    );
  }
  getDoneButton = () => {
    return (
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        <TouchableHighlight
          style={{
            backgroundColor: this.props.primaryColor,
            paddingHorizontal: 20,
            paddingVertical: 5,
          }}
          onPress={() => {
            this.props.onSubmit(
              this.state.selectedMonth,
              this.state.selectedYear,
            );
          }}>
          <View>
            <Text style={{color: 'white'}}>Done</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  };

  renderHeader() {
    const {primaryColor, secondaryColor} = this.props;

    return (
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Icon
          color={secondaryColor}
          name={'date-range'}
          size={30}
          style={{marginRight: 10}}
        />
        <Text style={{color: primaryColor, fontSize: 18, fontWeight: 'bold'}}>
          {this.getMonthName(this.state.selectedMonth) +
            ', ' +
            this.state.selectedYear}
        </Text>
      </View>
    );
  }

  renderPickerTitle(text) {
    const {secondaryColor} = this.props;
    return (
      <View style={styles.pickerTitle}>
        <Text style={{color: secondaryColor}}>{text}:</Text>
      </View>
    );
  }

  renderSeparator() {
    const {secondaryColor} = this.props;
    return (
      <View
        style={{
          height: 0.5,
          backgroundColor: secondaryColor,
          marginTop: 5,
          flexDirection: 'row',
          alignSelf: 'stretch',
        }}
      />
    );
  }

  getMonthName(month) {
    return moment(month + '', 'MM').format('MMMM');
  }
  renderMonthPicker() {
    return (
      <View style={styles.pickerColumn}>
        {this.renderPickerTitle('Month')}
        {this.renderSeparator()}
        {this.renderMonthPickerElement()}
        {this.renderSeparator()}
      </View>
    );
  }

  renderYearPicker() {
    return (
      <View style={[styles.pickerColumn]}>
        {this.renderPickerTitle('Year')}
        {this.renderSeparator()}
        {this.renderYearPickerElement()}
        {this.renderSeparator()}
      </View>
    );
  }

  renderMonthPickerElement() {
    let items = this.months;
    return (
      <Picker
        style={{width: 180, height: 180, marginBottom: 40}}
        selectedValue={this.state.selectedMonth}
        itemStyle={{
          color: this.props.primaryColor,
          marginTop: 20,
          fontSize: 18,
          fontFamily: fontFamily.Bold,
        }}
        onValueChange={value => {
          this.validateAndSetMonth(value, this.state.selectedYear);
        }}>
        {items.map((value, i) => (
          <PickerItem label={this.getMonthName(value)} value={value} key={i} />
        ))}
      </Picker>
    );
  }

  validateAndSetMonth = (monthValue, yearValue) => {
    let year = moment().year();
    let month = moment().month() + 1;
    if (yearValue === year) {
      if (monthValue > month) {
        this.setState({selectedMonth: month});
        return;
      }
    }
    this.setState({selectedMonth: monthValue});
  };

  renderYearPickerElement() {
    let items = this.years;
    return (
      <Picker
        style={{width: 180, height: 180, marginBottom: 40}}
        selectedValue={this.state.selectedYear}
        itemStyle={{
          color: this.props.primaryColor,
          marginTop: 20,
          fontSize: 18,
          fontFamily: fontFamily.Bold,
        }}
        onValueChange={value => {
          this.setState({selectedYear: value}, () => {
            this.validateAndSetMonth(this.state.selectedMonth, value);
          });
        }}>
        {items.map((value, i) => (
          <PickerItem label={value + ''} value={value} key={i} />
        ))}
      </Picker>
    );
  }
}

MonthYearSelector.defaultProps = {
  primaryColor: '#187CE2',
  secondaryColor: '#9C9C9C',
};
