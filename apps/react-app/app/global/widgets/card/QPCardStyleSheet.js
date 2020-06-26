import React, {Component} from 'react';
import {
  StyleSheet,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    margin: 5
  },
  card: {
    backgroundColor: '#ccc',
    borderRadius: 2,
    shadowColor: "#000000",
    shadowOpacity: 0.3,
    shadowRadius: 1,
    shadowOffset: {
      height: 1,
      width: 0.3,
    },
    alignSelf: 'stretch',
    margin: 5
  },
  cardImage: {
    flex: 1
  },
  cardTitle: {
    flex: 1,
    flexDirection: 'row',
    padding: 16
  },
  cardContent: {
    paddingRight: 16,
    paddingLeft: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  cardAction: {
    margin: 8,
    flexDirection: 'row',
    alignItems: 'center',

  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: '#E9E9E9'
  }
});

module.exports = styles;
