import SafeAreaView from "react-native-safe-area-view";
import React from 'react';
import {StyleSheet, View, Text, TouchableWithoutFeedback} from 'react-native';
import {MarginConstants} from '../../styles/margin.constants';
import {Colors} from '../../styles/color.constants';
import {PaddingConstants} from '../../styles/padding.constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Sizes} from '../../styles/Size.constant';
import {TextSizes} from '../../styles/textsize.constants';
import {FontFamily} from '../../styles/font.constants';
import {clearUserInfo} from '../../redux/actions';
import {connect} from 'react-redux';

function AppSettings(props) {

    let renderRow = (icon, title, subtitle, action) => {
        return (
            <TouchableWithoutFeedback onPress={action}>
                <View style={styles.rowContainer}>
                    <View style={styles.row}>
                        <Icon name={icon} color={Colors.secondary} size={1.2*Sizes.icons}/>
                        <Text style={styles.title}>{title}</Text>
                        <View style={{alignItems:'flex-end', flex:1}}>
                        <Text style={styles.subtitle}>{subtitle}</Text>
                        </View>
                    </View>
                    <Icon name={'chevron-right'} color={Colors.secondary} size={1.5*Sizes.icons}/>
                </View>
            </TouchableWithoutFeedback>
        )
    };

    let pushToAccountDetails = () => {
      props.navigation.navigate('Account Details',{userInfo: props.userInfo})
    };

    return (
        <SafeAreaView forceInset={{bottom: 'never'}} style={styles.safeArea}>
            <View style={styles.safeArea}>
                {renderRow('account', 'Account details', '', pushToAccountDetails)}
                {renderRow('segment', 'Segment', 'Selected segment')}
            </View>
        </SafeAreaView>
    )
}

const mapStateToProps = state => {
    return {
        userInfo: state.global.userInfo,
    };
};

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(AppSettings);


const styles = StyleSheet.create({
    safeArea: {
        flex:1,
    },
    rowContainer: {
        flexDirection:'row',
        marginTop: MarginConstants.tab2,
        marginHorizontal: 1.2*MarginConstants.tab1,
        backgroundColor: Colors.white,
        padding: 1.5*PaddingConstants.tab1,
        justifyContent: 'flex-start',
        alignItems:'center'
    },
    row: {
        flex:1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    title: {
        fontSize: TextSizes.primary,
        fontFamily: FontFamily.regular,
        color: Colors.primary,
        paddingLeft: PaddingConstants.tab2
    },
    subtitle: {
        fontSize: TextSizes.primary,
        fontFamily: FontFamily.regular,
        color: Colors.primary,
        paddingRight: PaddingConstants.tab1,
    }
});
