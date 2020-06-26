import React, {Component}from 'react';
import {Image, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';

export default class BackgroundImage extends Component {
	render() {
		return (
			<Image source={this.props.image} style={[styles.image, this.props.imageStyle]}>
				{this.props.children}
			</Image>
		)
	}
}

BackgroundImage.propTypes = {
	image     : PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
		PropTypes.object
	]).isRequired,
	imageStyle: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
		PropTypes.array,
		PropTypes.object
	]),
};
BackgroundImage.defaultProps = {};

var styles = StyleSheet.create({
    image: {
		position  : 'absolute',
		top       : 0,
		bottom    : 0,
		left      : 0,
		right     : 0,
		resizeMode: 'cover',
		zIndex    : -1
	}
});