import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import moment from 'moment/min/moment-with-locales.min';
import CustomText from '../../../global/ui/CustomText';

export default class Time extends React.Component {
  render() {
    return (
      <View style={[styles[this.props.position].container, this.props.containerStyle[this.props.position]]}>
        <CustomText style={[styles[this.props.position].text, this.props.textStyle[this.props.position],{color: '#9097A9', fontSize:global.h4FontSize}]}>
          {moment(new Date(this.props.currentMessage.timestamp)).format('hh:mm a')}
        </CustomText>
      </View>
    );
  }
}

const containerStyle = {
  marginLeft: 10,
  marginRight: 10,
  
};

const textStyle = {
  fontSize: 10,
  backgroundColor: 'transparent',
  textAlign: 'right',
};

const styles = {
  left: StyleSheet.create({
    container: {
      ...containerStyle,
    },
    text: {
      color: '#9097A9',
      ...textStyle,
    },
  }),
  right: StyleSheet.create({
    container: {
      ...containerStyle,
    },
    text: {
      color: '#9097A9',
      ...textStyle,
    },
  }),
};

// Time.contextTypes = {
//   getLocale: React.PropTypes.func,
// };

Time.defaultProps = {
  position: 'left',
  currentMessage: {
    timestamp: null,
  },
  containerStyle: {},
  textStyle: {},
};

// Time.propTypes = {
//   position: React.PropTypes.oneOf(['left', 'right']),
//   currentMessage: React.PropTypes.object,
//   containerStyle: React.PropTypes.shape({
//     left: View.propTypes.style,
//     right: View.propTypes.style,
//   }),
//   textStyle: React.PropTypes.shape({
//     left: Text.propTypes.style,
//     right: Text.propTypes.style,
//   }),
// };
