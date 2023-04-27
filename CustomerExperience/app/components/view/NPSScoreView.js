import React from 'react';
import {View, Image, StyleSheet, Text} from 'react-native';
import {PaddingConstants} from '../../styles/padding.constants';
import {MarginConstants} from '../../styles/margin.constants';
import {Colors} from '../../styles/color.constants';
import {FontFamily} from '../../styles/font.constants';
import {FontWeight} from '../../styles/font.constants';
import {TextSizes} from '../../styles/textsize.constants';
const NPSScoreView = ({text}) => {
  return (
    <View style={npsStyles.npsView}>
      <Image
        style={npsStyles.npsImage}
        source={require('./../../../assets/images/nps_meter.png')}
      />
      <View style={npsStyles.npsBackground}>
        <Text style={npsStyles.npsText}>{text}</Text>
      </View>
    </View>
  );
};

const npsStyles = StyleSheet.create({
  npsView: {
    flex: 2,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    padding: PaddingConstants.tab1,
  },
  npsBackground: {
    marginStart: MarginConstants.halfTab,
    backgroundColor: Colors.critical2,
    borderRadius: 50,
    height: MarginConstants.tab3,
    width: MarginConstants.tab3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  npsText: {
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight._400,
    fontSize: TextSizes.primary,
    color: Colors.white,
  },
  npsImage: {width: 16, height: 16},
});

export default NPSScoreView;
