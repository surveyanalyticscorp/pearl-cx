import React from 'react';
import {View, Image, StyleSheet, Dimensions} from 'react-native';
import QuestionProBanner from '../../../assets/images/questionpro_banner.svg';
import {MarginConstants} from '../../styles/margin.constants';
import {PaddingConstants} from '../../styles/padding.constants';
import {Colors} from '../../styles/color.constants';

const CxLogo_ = () => {
  const {width, height} = Dimensions.get('window');
  return (
    <View style={{alignItems: 'center', justifyContent: 'center'}}>
      <QuestionProBanner height={height * 0.15} width={width * 0.75} />
      <Image
        style={{...styles.cxlogo, width: width * 0.15, height: height * 0.15}}
        resizeMode="contain"
        source={require('../../../app/config/images/questionpro_cx_logo_transparent.png')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  cxlogo: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
});

export default CxLogo_;
