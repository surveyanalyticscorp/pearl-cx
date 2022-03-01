
/* 
 * Datta Kunde created on 19/05/21 
 */

import React from 'react';
import {View, Button, StyleSheet, TouchableOpacity, Text} from 'react-native';


export const QpTextView = ({label}) =>{
    return(
        <Text
            style={[styles.appButtonText]}
            numberOfLines={1}>
            {label}
        </Text>
    )
};


const styles = StyleSheet.create({
    titleText: {
        fontSize: 20,
        fontWeight: "bold"
    }
});

