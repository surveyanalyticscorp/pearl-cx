import React from 'react';
import {Image} from 'react-native';
const NPSIcon = ({sentiment, size}) => {
  const size_ = size ?? 16;
  function getIcon(sentiment_) {
    switch (sentiment_) {
      case 'Detractor':
        return require('./../../assets/images/detractor.png');
      case 'Passive':
        return require('./../../assets/images/passive.png');
      default:
        return require('./../../assets/images/promoter.png');
    }
  }

  return (
    <Image source={getIcon(sentiment)} style={{width: size_, height: size_}} />
  );
};

export default NPSIcon;
