'use strict';

var React = require('react-native');

var {
  StyleSheet,
} = React;

module.exports = StyleSheet.create({
  
  primaryFontColor: {
    color: '#124F8E'
  },

  secondaryFontColor: {
    color: '#4e4e4e'
  },

  primaryFontColorForHT: {
    color:'#4D5E75'
  }

});

// declare a global varible
global.primaryFontColorForCommunities = '#4D5E75';

global.secondaryFontColorForCommunities = '#4e4e4e';

global.tertiaryFontColorForCommunities = "#7e7e7e"

global.whiteFontColor = '#FFFFFF';