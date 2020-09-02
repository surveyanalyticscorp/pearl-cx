import React, {useState, useRef, useEffect} from 'react';
import SafeAreaView from "react-native-safe-area-view";
import {View, Text, TouchableWithoutFeedback,StyleSheet} from 'react-native';

export default function UpdateTicket(props) {

    return (
        <SafeAreaView forceInset={{bottom: 'never'}} style={styles.safeArea}>
            <View style={{flex:1, backgroundColor:'green'}}/>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    safeArea: {
        flex: 1
    },
});
