import React, {Component} from 'react';
import {
    StyleSheet,
        Text,
        View,
        } from 'react-native';

var styles = require('./QPCardStyleSheet.js');

class QPCardImage extends Component {
    render () {
	const newStyles = this.props.styles || {};
	return (
		<View style={[styles.cardImage, newStyles.cardImage]}>
		    {this.props.children}
      </View>
		);
    }
}

module.exports = QPCardImage;