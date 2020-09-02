import React, {useState, useRef, useEffect} from 'react';
import SafeAreaView from "react-native-safe-area-view";
import {View, Text, ScrollView, StyleSheet, KeyboardAvoidingView, Platform} from 'react-native';
import {Colors} from '../../../styles/color.constants';

export default function UpdateTicket(props) {

    return (
        <SafeAreaView forceInset={{bottom: 'never'}} style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContainer}
                        keyboardDismissMode='on-drag'
                        keyboardShouldPersistTaps={'handled'}
            >
                <KeyboardAvoidingView behavior='position'
                                      style={styles.safeArea}
                                      keyboardVerticalOffset={Platform.select({
                                          ios: Platform.isPad ? -200 : -150,
                                          android: -200
                                      })}
                                      enabled>
            <View>

            </View>
                </KeyboardAvoidingView>
            </ScrollView>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.darkerGrey
    },
    scrollContainer: {
        flexGrow: 1,
        backgroundColor: Colors.darkerGrey
    },
});
