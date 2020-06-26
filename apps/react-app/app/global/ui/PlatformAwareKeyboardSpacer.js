import React, { Component } from 'react';
import {
    Platform,
    View,
} from 'react-native';

import KeyboardSpacer from 'react-native-keyboard-spacer';

export default class PlatformAwareKeyboardSpacer extends Component {
    constructor(props){
        super(props);
    }
    render() {
        if (Platform.OS === 'android') {
            return <View />;
        }

        return (
            <KeyboardSpacer/>
        );
    }
}
