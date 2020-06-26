import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    TouchableHighlight,
    Text,
    Dimensions,
    Platform,
    Image
} from 'react-native';
import QPCard from './card/QPCard';
import CustomText from '../ui/CustomText';
import colorCodes from './typography/ColorCodes';
import Font from './typography/Font.js';
import renderIf from '../renderIf';
import Button from 'react-native-button';
const {height, width} = Dimensions.get('window');
const factor = width > height ? height : width;

export default class TakeSurveyWidget extends Component {

    getResponseText() {
        return  this.props.responses + " " +(this.props.responseText || "other members took this Survey.");
    }

    getResponseImage() {
        if (Platform.OS != 'ios') {
            return require('../images/communities/home/briefcase.png');
        } else {
            return { uri: 'briefcase.png' };
        }
    }

    render() {
        return (
            <View style={styles.takeSurveyContainer}>
                <View style={styles.titleContainer}>
                    <View style={{ flex: 1.0, justifyContent: 'center' }}>
                        <CustomText style={styles.titleText} numberOfLines={1} ellipsizeMode='tail'>
                            {this.props.titleText}
                        </CustomText>
                    </View>
                </View>
                <CustomText style={styles.surveyTitle} ellipsizeMode='tail'>
                    {this.props.surveyTitle}
                </CustomText>
                <View style={{flexDirection:'row'} }>
                    <Button containerStyle={styles.takeSurveyButtonContainer}

                        onPress={this.props.onPress}>

                        <CustomText style={styles.takeSurveyText} numberOfLines={1} ellipsizeMode='tail'>
                            {this.props.buttonText || "Take Survey"}
                        </CustomText>

                    </Button>
                </View>
                <View style={styles.responseContainer}>
                    <Image style={styles.image} source={this.getResponseImage()} />
                    <CustomText style={styles.responseText} ellipsizeMode='tail'>
                        {this.getResponseText()}
                    </CustomText>
                </View>
            </View>);
    }


}

// TakeSurveyWidget.defaultProps = {
//     titleText: React.PropTypes.string,
//     surveyTitle: React.PropTypes.string,
//     onPress: React.PropTypes.func,
//     responses: React.PropTypes.string
// };

const styles = StyleSheet.create({
    takeSurveyContainer: {
        backgroundColor: '#F7F7F7',
        marginTop: 8,
        marginBottom: 8,
        marginLeft: 15,
        marginRight: 15
    },
    titleContainer: {
        backgroundColor: '#EEF0EF',
        height: Math.round(factor * 0.10)
    },
    titleText: {
        color: '#616970',
        justifyContent: 'center',
        paddingHorizontal: 10,
        fontStyle: 'italic',
        fontFamily: global.boldText,
        fontSize: global.h3FontSize
    },
    surveyTitle: {
        color: '#616970',
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        fontFamily: global.primaryText,
        fontSize: global.h3FontSize
    },
    takeSurveyButtonContainer: {
        marginLeft: 10,
        marginBottom: 5,
        borderColor: '#B7B7B7', 
        borderWidth:1,
        backgroundColor: '#ffffff',
        paddingVertical: 5,
        paddingHorizontal: 14,
        alignItems: 'center'
    },
    takeSurveyText: {
        fontSize: global.h3FontSize,
        color: '#616970',
        fontFamily: global.primaryText,
        textAlign: 'left'
    },
    responseContainer: {

        flexDirection: 'row',
        marginLeft: 10,
        marginBottom: 5,
        alignItems: 'center'
    },
    image: {
        height: 16,
        width: 16,
        marginRight: 5
    },
    responseText: {
        fontSize: global.h4FontSize,
        color: '#616970',
        fontFamily: global.primaryText,
        textAlign: 'left'
    }
});