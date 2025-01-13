import React from 'react';
import {View} from 'react-native';

import {useSelector} from 'react-redux';
import ViewResponseDetailsButton from './ViewResponseDetailsButton';

const ConditionalResponseButton = ({showResponseButton}) => {
  const {responseId} = useSelector(state => state.dashboard.ticket);

  return responseId && showResponseButton ? (
    <ViewResponseDetailsButton />
  ) : (
    <View />
  );
};

export default ConditionalResponseButton;
