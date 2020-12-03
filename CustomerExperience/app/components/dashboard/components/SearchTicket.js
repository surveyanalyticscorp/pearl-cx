import {SafeAreaView, StyleSheet, TouchableOpacity, View, TextInput} from 'react-native';
import React, {useState} from 'react';
import {Sizes} from '../../../styles/Size.constant';
import {Colors} from '../../../styles/color.constants';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import {MarginConstants} from '../../../styles/margin.constants';
import {PaddingConstants} from '../../../styles/padding.constants';

export default function SearchTicket(props) {

    let [searchText, onChangeText] = useState('');

    let renderSearchBar = () => {
        return(
                <TextInput
                    style={styles.textInputContainer}
                    onChangeText={text => {
                        onChangeText(text);
                    }}
                    placeholderTextColor={Colors.white}
                    placeholder={'Search email or response ID'}
                    value={searchText}
                    autoFocus={false}
                    autoCapitalize={'none'}
                    clearButtonMode={'while-editing'}
                />
        )
    };

    let renderHeaderBackLeft = () => {
        return (
            <View style={styles.leftHeaderButton}>
                <TouchableOpacity
                    hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
                    onPress={() => {
                        props.navigation.goBack()
                    }}>
                    <Icon name="arrow-left" size={Sizes.icons} color= {Colors.white}/>
                </TouchableOpacity>
            </View>
        );
    };

    let renderNavigationHeader = () => {
        return (
            <View style={styles.headerContainer}>
                {renderHeaderBackLeft()}
                {renderSearchBar()}
            </View>
        )
    };

    return (
        <View style={styles.container}>
        {renderNavigationHeader()}
        </View>
    )

}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    container: {
        flex: 1,
    },
    headerContainer: {
        width:'100%',
        flexDirection: 'row',
        backgroundColor: Colors.accent,
        alignItems: "center",
        justifyContent: 'space-between',
        paddingTop: 1.5*PaddingConstants.tab4

    },
    leftHeaderButton: {
        marginHorizontal: MarginConstants.halfTab,
        height:30,
        paddingHorizontal: PaddingConstants.tab1
    },
    textInputContainer: {
        flex:1,
        backgroundColor: 'rgba(85, 149, 224, 0.7)',
        marginRight: MarginConstants.tab2,
        paddingHorizontal: PaddingConstants.tab2,
        color: Colors.white,
        height:35,
        marginBottom: MarginConstants.tab1

    }
});
