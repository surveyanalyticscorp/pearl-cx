/*
 * Datta Kunde created on 15/12/21
 */
import React from 'react';
import {View, Text, TouchableWithoutFeedback, StyleSheet} from 'react-native';
import GLOBAL from '../utils/global';
import {qpColor, qpDimension} from '../utils/QpConstant';

const SurveyHeader = props => {
  return (
    <View style={[headerStyles.container, {backgroundColor: props.themeColor}]}>
      <View style={headerStyles.titleContainer}>
        <Text
          style={{
            color: qpColor.headerText,
            fontSize: 18,
          }}>
          {props.headerLable}
        </Text>
      </View>

      <TouchableWithoutFeedback
        onPress={() => {
          props.onSurveyExit();
        }}>
        <View style={headerStyles.closeButton}>
          <Text style={headerStyles.closeText}>X</Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default SurveyHeader;

const headerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: qpDimension.headerHeight,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  closeButton: {
    width: qpDimension.headerHeight,
    flexDirection: 'column',
    alignItems: 'center',
  },
  closeText: {
    color: qpColor.headerText,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
