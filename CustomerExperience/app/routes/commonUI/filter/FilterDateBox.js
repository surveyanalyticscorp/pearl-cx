import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useNavigation, StackActions} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import moment from 'moment';
import {Colors} from '../../../styles/color.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import {baseTextStyles} from '../../../styles/text.styles';
import {translate} from '../../../Utils/MultilinguaUtils';
import {DMYFORMAT, HalfMonthDateYearFormat} from '../../../Utils/AppConstants';
import {HorizontalSpaceBox} from '../../../widgets/SpaceBox';
import {CalendarIcon} from '../CalendarIcon';

const DateText = () => {
  const {startDate, endDate} = useSelector(state => state.global.range);

  const sDate = moment(startDate, DMYFORMAT).format(HalfMonthDateYearFormat);
  const eDate = moment(endDate, DMYFORMAT).format(HalfMonthDateYearFormat);
  return (
    <Text
      style={[
        baseTextStyles.secondaryRegularText,
        {marginHorizontal: MarginConstants.halfTab, color: Colors.lightBlack},
      ]}>
      {`${sDate} - ${eDate}`}
    </Text>
  );
};

export const FilterDateBox = () => {
  const navigation = useNavigation();

  let filterAction = () => {
    const pushAction = StackActions.push(translate('date_filter.date_range'));
    navigation.dispatch(pushAction);
  };

  return (
    <Pressable testID="Filter-Date-Box" onPress={() => filterAction()}>
      <View style={styles.filterBox}>
        <DateText />
        <HorizontalSpaceBox />
        <CalendarIcon size={16} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  filterBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.evenDarkerGrey,
    paddingVertical: PaddingConstants.tab1,
    marginVertical: MarginConstants.tab1,
    paddingHorizontal: PaddingConstants.tab1,
  },
});
