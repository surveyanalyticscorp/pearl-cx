import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {Sizes} from '../styles/Size.constant';
import {Colors} from '../styles/color.constants';
import {MarginConstants} from '../styles/margin.constants';
import {PaddingConstants} from '../styles/padding.constants';
import {TextSizes} from '../styles/textsize.constants';
import {FontFamily} from '../styles/font.constants';

export default function Notification(props) {

    let renderRow = () => {
        return <View style={styles.row}>
            <MaterialIcon name={'chat'} size={Sizes.filterIcon} color= {Colors.accent}/>
            <View style={styles.rowTextContainer}>
                <Text style={styles.titleContainer}>
                    <Text style={styles.regularFont}>New Ticket from</Text>
                    <Text style={styles.boldFont}> dave@mail.com</Text>
                </Text>
                <Text style={styles.subtitle}>Nov 03, 2020</Text>
            </View>
        </View>
    };


    return <View style={styles.container}>
        {renderRow()}
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        margin: MarginConstants.tab1
    },
    row: {
        flexDirection:'row',
        alignItems:'center',
        padding: 1.2*PaddingConstants.tab1,
        margin: MarginConstants.tab1,
        backgroundColor: Colors.white
    },
    rowTextContainer: {
        marginHorizontal: MarginConstants.tab1,
        paddingHorizontal: PaddingConstants.tab1
    },
    titleContainer: {
        fontSize: TextSizes.secondary,
        color: Colors.primary,
        marginVertical: MarginConstants.halfTab
    },
    regularFont:{
        fontFamily: FontFamily.regular
    },
    boldFont: {
        fontFamily: FontFamily.semiBold
    },
    subtitle: {
        fontSize: TextSizes.semiSecondary,
        color: Colors.secondary,
    }

});
