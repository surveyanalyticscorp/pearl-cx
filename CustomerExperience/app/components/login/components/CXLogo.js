import React from 'react';
import {View, Image} from 'react-native';
import {loginStyles} from '../login.styles';

const CXLogo = () => {
  return (
    <View style={loginStyles.logo}>
      <Image
        style={loginStyles.logoImage}
        resizeMode="contain"
        source={require('../../../config/images/cx-logo.png')}
      />
    </View>
  );
};

export default CXLogo;
