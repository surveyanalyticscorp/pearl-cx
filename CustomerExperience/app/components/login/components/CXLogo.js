import React from 'react';
import {View, Image} from 'react-native';
import {loginStyles} from '../login.styles';

const CXLogo = () => {
  const cxLogo = require('../../../config/images/cx_logo.png');
  return (
    <View style={loginStyles.logo}>
      <Image
        style={loginStyles.logoImage}
        resizeMode="contain"
        source={cxLogo}
      />
    </View>
  );
};

export default CXLogo;
