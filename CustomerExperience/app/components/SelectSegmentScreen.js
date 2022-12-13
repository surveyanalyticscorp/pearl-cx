import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  setSegment,
  setSegmentSelectorOpen,
} from '../redux/actions/dashboard.actions';
import {CloseButton} from '../routes/CommonScreen';
import {Colors} from '../styles/color.constants';
import {FontFamily} from '../styles/font.constants';
import {MarginConstants} from '../styles/margin.constants';
import {PaddingConstants} from '../styles/padding.constants';
import {TextSizes} from '../styles/textsize.constants';
import {getSegmentIndex} from '../Utils/TicketUtils';
import GlobalSelectSegment from './dashboard/GlobalSelectSegment';

const SelectSegmentScreen = (props) => {
  const dispatch = useDispatch();

  const segmentList_ = useSelector(
    (state) => state.dashboard.segmentDetails.segments,
  );
  const currentSegment = useSelector((state) => state.dashboard.currentSegment);
  const navigation = useNavigation();
  const handleSegmentSelectionAction = (item) => {
    dispatch(setSegment(item));
    dispatch(setSegmentSelectorOpen(false));
    if (navigation.canGoBack) {
      navigation.goBack();
    }
  };

  const renderSelectSegment = (props) => {
    return (
      <View
        //  style={styles.contentContainer}
        style={{backgroundColor: Colors.white, flex: 1}}>
        <GlobalSelectSegment
          {...props}
          data={segmentList_}
          selectedIndex={
            getSegmentIndex(
              segmentList_ ?? [],
              currentSegment.currentSegmentID,
            ) ?? 0
          }
          handleOnPress={(item) => handleSegmentSelectionAction(item)}
        />
      </View>
    );
  };
  return (
    <View style={styles.rootContainer}>
      <View style={styles.container}>
        <View
          style={[
            styles.rowContainer,
            {
              maxHeight: MarginConstants.tab4,
              alignItems: 'center',
              justifyContent: 'space-between',
            },
          ]}>
          <Text style={styles.headerText}>{'Select Segment'}</Text>
          <CloseButton color={Colors.filterIconColor} />
        </View>
        {renderSelectSegment()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: Colors.white,
    borderTopStartRadius: 8,
    borderTopEndRadius: 8,
    marginHorizontal: MarginConstants.tab1,
    marginTop:
      Platform.OS === 'ios' ? MarginConstants.tab4 : MarginConstants.tab1,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopStartRadius: 8,
    borderTopEndRadius: 8,

    marginTop: MarginConstants.tab1,
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'row',

    // backgroundColor: Colors.accentLight,
  },
  headerText: {
    fontFamily: FontFamily.medium,
    fontSize: TextSizes.largeText,
    padding: PaddingConstants.tab1,
    color: Colors.filterIconColor,
  },
});
export default SelectSegmentScreen;
