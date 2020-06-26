import React, { Component } from 'react';
import { View, Text, Dimensions, StyleSheet, Animated, TouchableHighlight, Platform, Image, ScrollView } from 'react-native';

import I18n from 'react-native-i18n';
import Button from 'react-native-button';
import CustomText from '../../global/ui/CustomText';
import { Actions } from 'react-native-router-flux';

export default class ShareProfile extends Component {

    constructor(props) {
        super(props);
    }

    getEmailImage() {
        if (Platform.OS != 'ios') {
            return require('../../global/images/communities/profile/mail.png');
        } else {
            return { uri: 'mail.png' };
        }
    }
   

    getFacebookImage() {
        if (Platform.OS != 'ios') {
            return require('../../global/images/communities/profile/facebook.png');
        } else {
            return { uri: 'facebook.png' };
        }
    }

    getTwitterImage() {
        if (Platform.OS != 'ios') {
            return require('../../global/images/communities/profile/twitter.png');
        } else {
            return { uri: 'twitter.png' };
        }
    }

    render() {
        const shareProfileProps = this.props;
        return (
            <ScrollView>

            <View style={styles.mainContainer}>
                <View >
                    <View style={styles.textContainer}>
                        <CustomText style={{ fontSize: 32, color: '#3e526b' }}>{I18n.t('share_via',{locale: shareProfileProps.language})}</CustomText>
                    </View>

                    <View style={styles.btnContainer}>
                        <Button
                            onPress={
                                ()=>{ Actions.inviteViaEmail({title: I18n.t('invite_email_contact',{locale: shareProfileProps.language}),language: shareProfileProps.language, onPress : this.props.onPress, shareProfileProps})}}
                            containerStyle={styles.emailButtonStyle}
                            isDisabled={false}>
                            <View style={{ flex: 2, alignItems: 'center' }}>
                                <Image style={{ width: 30, height: 30 }} source={this.getEmailImage()} />
                            </View>
                            <View style={{ flex: 3 }}>
                                <CustomText style={styles.textStyle}>{'Email'}</CustomText>
                            </View>
                        </Button>
                    </View>

                    <View style={styles.btnContainer}>
                        <Button
                            containerStyle={styles.facebookButtonStyle}
                            isDisabled={false}>
                            <View style={{ flex: 2, alignItems: 'center' }}>
                                <Image style={{ width: 30, height: 30 }} source={this.getFacebookImage()} />
                            </View>
                            <View style={{ flex: 3 }}>
                                <CustomText style={styles.textStyle}>{'Facebook'}</CustomText>
                            </View>
                        </Button>
                    </View>

                    <View style={styles.btnContainer}>
                        <Button
                            containerStyle={styles.twitterButtonStyle}
                            isDisabled={false}>
                            <View style={{ flex: 2, alignItems: 'center' }}>
                                <Image style={{ width: 30, height: 30 }} source={this.getTwitterImage()} />
                            </View>
                            <View style={{ flex: 3 }}>
                                <CustomText style={styles.textStyle}>{'Twitter'}</CustomText>
                            </View>
                        </Button>
                    </View>
                </View>
            </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        
        justifyContent: 'center',
        paddingHorizontal: 80,
        paddingVertical: 80,
        backgroundColor: '#FFFFFF',

    },
    textContainer: {

        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,

    },
    btnContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    },
    emailButtonStyle: {
        borderWidth: 2,
        borderRadius: 22,
        backgroundColor: '#9b9b9b',
        borderColor: '#9b9b9b',
        paddingVertical: 5,
        alignItems: 'center'
    },
    facebookButtonStyle: {
        borderWidth: 2,
        borderRadius: 22,
        backgroundColor: '#3b5999',
        paddingVertical: 5,
        borderColor: '#3b5999',
        alignItems: 'center'
    },
    twitterButtonStyle: {
        borderWidth: 2,
        borderRadius: 22,
        backgroundColor: '#1da1f3',
        paddingVertical: 5,
        borderColor: '#1da1f3',

        alignItems: 'center'
    },
    textStyle: {
        color: '#ffffff',
        fontWeight: 'normal',
        fontSize: 16
    }
});
