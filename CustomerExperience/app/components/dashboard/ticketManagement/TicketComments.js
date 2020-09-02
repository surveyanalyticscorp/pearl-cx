import React, {useState, useRef, useEffect} from 'react';
import SafeAreaView from "react-native-safe-area-view";
import {View, Text, TouchableWithoutFeedback,StyleSheet} from 'react-native';
import {Colors} from '../../../styles/color.constants';

export default function TicketComments(props) {

    let renderCommentRow = () => {
      return(
          <View style={styles.safeArea}>
          </View>
      )
    };

    return (
        <SafeAreaView forceInset={{bottom: 'never'}} style={styles.safeArea}>
            <View style={styles.safeArea}>
            </View>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.darkerGrey
    },
    commentRow: {

    }
});
