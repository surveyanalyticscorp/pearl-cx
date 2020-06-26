import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    TouchableHighlight,
    Dimensions,
    Platform,
    Image
} from 'react-native';
import CustomText from '../ui/CustomText';
const {height, width} = Dimensions.get('window');
const factor = width > height ? height : width;


export default class ContactWidget extends Component {

    getEmailIcon() {
        if (Platform.OS != 'ios') {
            return require('../images/communities/email.png');
        } else {
            return { uri: 'email.png' };
        }
    }

    getProfileImage() {
        if (this.props.contact.hasThumbnail) {
            return { uri: this.props.contact.thumbnailPath };
        } else {
            if (Platform.OS != 'ios') {
                return require('../images/communities/no_photo.png');
            } else {
                return { uri: 'no_photo.png' };
            }
        }
    }

    getCheckBoxImage() {
        if (Platform.OS != 'ios') {
            return require('../images/communities/selected.png');
        } else {
            return { uri: 'selected.png' };
        }
    }

    render() {
        const name = this.props.contact.givenName + " " + this.props.contact.familyName
        return (
            <TouchableHighlight onPress={this.props.onSelect}
                                activeOpacity={0.6}
                                underlayColor={'#f8f8f8'}>
                <View style={styles.mainContainer}>
                    <View style={{flexDirection: 'row', backgroundColor: '#FFFFFF'}}>
                        <View style={styles.imageContainer}>
                            <Image style={styles.image} source={this.getProfileImage()}/>
                        </View>
                        <View style={styles.titleContainer}>
                            <CustomText style={[styles.titleText]} numberOfLines={1} ellipsizeMode='tail'>
                                {name}
                            </CustomText>
                        </View>
                        <View style={styles.emailIconContainer}>
                            <Image style={styles.emailImage}
                                   source={this.props.contact.isSelect ? this.getCheckBoxImage() : this.getEmailIcon()}/>
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }
}

// ContactWidget.defaultProps = {
//     index: React.PropTypes.number,
//     contact: React.PropTypes.object,
//     onSelect: React.PropTypes.func
// };

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: '#ffffff',
        height: 36,
        marginLeft: 15,
        marginRight: 15,
        justifyContent: 'center'
    },
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    image: {
        backgroundColor: '#FFFFFF',
        height: Math.round(factor * 0.08),
        borderRadius: Math.round(factor * 0.08) / 2,
        width: Math.round(factor * 0.08)
    },
    titleContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        marginLeft: 20
    },
    titleText: {
        color: '#393939',
        fontFamily: global.primaryText,
        fontSize: global.h2FontSize
    },
    emailIconContainer: {
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center'
    },
    emailImage: {
        backgroundColor: '#FFFFFF',
        height: Math.round(factor * 0.06),
        width: Math.round(factor * 0.06)
    }
});
