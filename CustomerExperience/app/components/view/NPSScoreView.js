import React from 'react';
import {View, Image, StyleSheet, Text} from 'react-native';
import {MarginConstants} from '../../styles/margin.constants';
import {Colors} from '../../styles/color.constants';
import {FontFamily} from '../../styles/font.constants';
import {FontWeight} from '../../styles/font.constants';
import {TextSizes} from '../../styles/textsize.constants';
import {HorizontalSpaceBox} from '../../widgets/SpaceBox';
import TextLabel from '../../widgets/TextLabel/TextLabel';
const NPSScoreView = ({text}) => {
  return (
    <View testID="nps-view" style={npsStyles.npsView}>
      <Image
        testID="nps-image"
        style={npsStyles.npsImage}
        source={require('./../../../assets/images/nps_meter.png')}
      />
      <HorizontalSpaceBox />
      <View style={npsStyles.npsBackground}>
        <Text style={npsStyles.npsText}>{text}</Text>
      </View>
    </View>
  );
};

const npsStyles = StyleSheet.create({
  npsView: {
    flex: 3,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  npsBackground: {
    backgroundColor: Colors.critical2,
    borderRadius: MarginConstants.tab1_4x,
    height: MarginConstants.tab1_4x,
    width: MarginConstants.tab1_4x,
    alignItems: 'center',
    justifyContent: 'center',
  },
  npsText: {
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight._400,
    fontSize: TextSizes.secondary,
    color: Colors.white,
  },
  npsImage: {width: 22, height: 22},
});

export default NPSScoreView;
