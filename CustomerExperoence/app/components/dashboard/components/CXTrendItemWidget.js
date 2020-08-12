import React from 'react';
import {StyleSheet, View, TouchableHighlight, Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {TextSizes} from '../../../styles/textsize.constants';
import {Colors} from '../../../styles/color.constants';
import {MarginConstants} from '../../../styles/margin.constants';
const CXTrendItemWidget = props => {
  let total = props.promoter + props.detractor + props.passive;
  let promoterPercent = (props.promoter / total) * 100;
  let detractorPercent = (props.detractor / total) * 100;
  let passivePercent = (props.passive / total) * 100;
  let state = {
    promoterPercent: isNaN(promoterPercent) ? 0 : promoterPercent,
    detractorPercent: isNaN(detractorPercent) ? 0 : detractorPercent,
    passivePercent: isNaN(passivePercent) ? 0 : passivePercent,
  };

  return (
    <TouchableHighlight
      onPress={props.onPress}
      activeOpacity={0.6}
      underlayColor={'#CCCCCC'}>
      <View style={styles.mainContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {props.storeName}
          </Text>
          <View
            style={{
              height: 5,
              marginTop: 10,
              marginBottom: 10,
              flexDirection: 'row',
              backgroundColor: '#E8E8E8',
            }}>
            <View
              style={{
                height: 5,
                flex: state.promoterPercent,
                backgroundColor: '#90BA5B',
              }}
            />
            <View
              style={{
                height: 5,
                flex: state.passivePercent,
                backgroundColor: '#E8E8E8',
              }}
            />
            <View
              style={{
                height: 5,
                flex: state.detractorPercent,
                backgroundColor: '#CE3E3E',
              }}
            />
          </View>
        </View>

        <View style={styles.valueContainer}>
          <Text style={styles.value}>{props.nps}</Text>
        </View>
        {props.isClickable && (
          <View style={styles.arrowContainer}>
            <Icon size={20} name="keyboard-arrow-right" color={'#3b3b3b'} />
          </View>
        )}
      </View>
    </TouchableHighlight>
  );
};

CXTrendItemWidget.defaultProps = {
  storeName: 'Delhi',
  nps: 57,
  promoter: 126,
  passive: 40,
  detractor: 22,
  isClickable: false,
};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#ffffff',
    marginTop: 0,
    flex: 1,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 0,
    padding: 15,
    marginRight: 0,
  },

  indexParent: {
    flex: 1,
    backgroundColor: '#4575b8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  titleContainer: {
    flex: 0.8,
    justifyContent: 'center',
    flexDirection: 'column',
  },
  title: {
    color: '#393939',
    fontSize: TextSizes.primary,
    textAlign: 'left',
  },

  valueContainer: {
    flex: 0.15,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  value: {
    color: '#3b3b3b',
    fontSize: TextSizes.primary,
    textAlign: 'center',
  },
  arrowContainer: {
    flex: 0.05,
  },
});
export default CXTrendItemWidget;
