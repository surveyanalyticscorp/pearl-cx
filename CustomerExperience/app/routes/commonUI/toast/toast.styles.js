import React from 'react';
import {StyleSheet} from 'react-native';
import {baseTextStyles} from '../../../styles/text.styles';
import {Colors} from '../../../styles/color.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import {MarginConstants} from '../../../styles/margin.constants';
export const toastStyles = StyleSheet.create({
  errorContainer: {
    height: 60,
    width: '90%',
    backgroundColor: Colors.overdueBackgroundColor,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: PaddingConstants.tab1,
    paddingVertical: PaddingConstants.tab1,
    marginVertical: MarginConstants.tab1,
    marginHorizontal: MarginConstants.tab1_2x,
  },
  successContainer: {
    height: 60,
    width: '90%',
    backgroundColor: Colors.toastSuccessBackgroundColor,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: PaddingConstants.tab1,
    paddingVertical: PaddingConstants.tab1,
    marginVertical: MarginConstants.tab1,
    marginHorizontal: MarginConstants.tab1_2x,
  },
  infoContainer: {
    height: 60,
    width: '90%',
    backgroundColor: Colors.toastInfoBackgroundColor,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: PaddingConstants.tab1,
    paddingVertical: PaddingConstants.tab1,
    marginVertical: MarginConstants.tab1,
    marginHorizontal: MarginConstants.tab1_2x,
  },
  error: {
    backgroundColor: Colors.overdueBackgroundColor,

    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    padding: PaddingConstants.tab1,
    margin: MarginConstants.tab1,
  },
  success: {
    backgroundColor: Colors.success,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    padding: PaddingConstants.tab1,
    margin: MarginConstants.tab1,
  },
  errorText1Style: {
    ...baseTextStyles,
    color: Colors.deleteButtonText,
  },
  successrText1Style: {
    ...baseTextStyles,
    color: Colors.promoter,
  },
});

export default toastStyles;
