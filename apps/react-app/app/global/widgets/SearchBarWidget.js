import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    TouchableHighlight,
    Text,
    Dimensions,
    Platform,
    TextInput,
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


export default class SearchBarWidget extends Component {

    constructor(props) {
        super(props);
        this.state = { text: '' };
    }

    getSearchButtonImage() {
        if (Platform.OS != 'ios') {
            return require('../images/communities/search.png');
        }
        let iosImage = { uri: 'search.png' };
        return iosImage;
    }



    render() {
        return (
            <View style={styles.searchBarContainer}>
                <View style={[{ flex: 1, borderRadius: 22 }, styles.searchInput]}>
                    {
                        //renderIf(!(this.props.isFocus ||  this.state.text.length > 0))(
                        renderIf(!(this.props.isFocus && this.state.focus ))(
                            <Image style={[{ width: Math.round(factor * 0.05), height: Math.round(factor * 0.05) }]} source={this.getSearchButtonImage()} />
                        )
                    }{
                    <View style={[{ flex: 1}]}>
                        <TextInput style={[styles.searchInputText]}
                                   autoCapitalize="none"
                                   autoCorrect={false}
                                   underlineColorAndroid={'transparent'}
                                   placeholder={this.props.placeholderText}
                                   onFocus={() => {this.props.onFocus(); this.setState({focus: true})}}
                                   onEndEditing={()=>{this.setState({focus: false})}}
                                   onBlur={() => this.props.onBlur()}
                                   onChangeText={(text) => {
                                       this.setState({text: text});
                                       this.props.onSearchTextChange(text)}}>
                        </TextInput>
                    </View>
                }
                </View>
            </View>);
    }
}

// SearchBarWidget.defaultProps = {
//     hasResponse: React.PropTypes.bool,
//     placeholderText: React.PropTypes.string,
//     isFocus: React.PropTypes.bool,
//     onSearchTextChange: React.PropTypes.func,
//     onFocus: React.PropTypes.func,
//     onBlur: React.PropTypes.func,
//     onDonePress: React.PropTypes.func
// };

const styles = StyleSheet.create({
    searchBarContainer: {
        backgroundColor: '#FFFFFF',
    },
    searchInput: {
        flex:1,
        borderRadius: 20,
        flexDirection: 'row',
        borderWidth: 1,
        alignItems:'center',
        paddingHorizontal:8,
        minHeight:Math.round(factor * 0.06),
        borderColor: '#CBCBCB'
    },

    searchInputText: {

        backgroundColor: 'transparent',
        color:'black',
        minHeight:Math.round(factor * 0.06),
        padding: 5,

        fontFamily: global.primaryText,
        fontSize: global.h3FontSize
    },
    titleText: {
        color: '#616970',
        justifyContent: 'center',
        paddingHorizontal: 10,
        fontStyle: 'italic',
        fontFamily: global.boldText,
        fontSize: global.h3FontSize
    },

    doneText: {
        paddingVertical: 2,
        paddingHorizontal: 8,
        fontSize: global.h3FontSize,
        color: '#616970',
        fontFamily: global.primaryText,
        textAlign: 'center'
    }
});