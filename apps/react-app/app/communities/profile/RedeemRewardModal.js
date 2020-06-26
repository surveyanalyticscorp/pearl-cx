/**
 * Created by sachinsable on 04/07/17.
 */
import React, {Component} from 'react';
import {View, Text, StyleSheet, Animated, Dimensions, Image, Platform, PixelRatio, ScrollView} from "react-native";
import I18n from 'react-native-i18n';
import Button from "react-native-button";
import CustomText from '../../global/ui/CustomText';
import BaseComponentWithoutScroll from '../../global/components/BaseComponentWithoutScroll';
import {Actions} from 'react-native-router-flux';
import Checkbox from '../../global/widgets/checkbox/CheckBox';

import HTMLView from '../../global/ui/htmlview/HtmlView';
var {
    height: deviceHeight,
    width: deviceWidth
} = Dimensions.get("window");

var styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "transparent",
        justifyContent: "center",
        alignItems: "center",
    },

});

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import {ActionCreators} from '../actions';
import {utils} from '../../global/Utils';

class RedeemReward extends BaseComponentWithoutScroll {

    constructor(props) {
        super(props);

        this.state = {
            offset: new Animated.Value(-deviceHeight),
            redeemDisabled: true
        };
        this.requestData = {qPointRewardID: this.props.id};
    }


    componentDidMount() {
        Animated.timing(this.state.offset, {
            duration: 300,
            toValue: 0
        }).start();
    }


    closeModal() {
        Animated.timing(this.state.offset, {
            duration: 300,
            toValue: -deviceHeight
        }).start(Actions.pop);
    }

    getCloseIcon() {
        if (Platform.OS != 'ios') {
            return require('../../global/images/close_grey.png');
        }
        return {uri: 'close_grey.png'};
    }


    renderChild() {
        const {language} = this.props;
        return (
            <Animated.View onPress={() => {
                this.closeModal();
            }} style={[styles.container, {backgroundColor: "rgba(52,52,52,0.9)"},
                {transform: [{translateY: this.state.offset}]}]}>

                <View style={{
                    width: deviceWidth * 0.8,
                    height: deviceHeight * 0.8,
                    justifyContent: "flex-start",
                    paddingVertical: 30,
                    paddingHorizontal: 20,
                    backgroundColor: "white",
                    overflow: 'hidden',
                    borderRadius: 0,
                    borderColor: '#000',
                    borderWidth: 1 / PixelRatio.get(),

                }}>
                    <Button
                        containerStyle={{padding: 10, position: 'absolute', right: 0, top: 0}}
                        onPress={this.closeModal.bind(this)}
                        isDisabled={false}>
                        <Image source={this.getCloseIcon()} style={{height: 15, width: 15}}></Image>
                    </Button>
                    <CustomText style={{
                        color: '#515F6A',
                        fontFamily: global.semiBoldText,
                        fontSize: global.h1by2FontSize,
                        alignSelf: 'stretch',
                        textAlign: 'left'
                    }}>
                        {I18n.t('brand_disclaimer',{locale: language})}
                    </CustomText>
                    <ScrollView style={{marginVertical: 10, paddingRight: 10}}>
                        <HTMLView
                            textComponentProps = { {style:{color: '#B1BBCA', fontSize: global.h3FontSize}}}
                            value={this.props.disclaimer}

                        />
                    </ScrollView>
                    <View style={{
                        paddingVertical: 5,
                        alignItems: 'flex-start',
                        alignSelf: 'flex-start',
                        backgroundColor: 'transparent',
                        marginTop: 5,
                        paddingRight: 20
                    }}>
                        <Checkbox
                            checkboxStyle={{height: 20, width: 20}}
                            onChange={
                                (checked) => {
                                    this.setState({redeemDisabled: !checked})
                                }}
                            renderLabel={ () => {
                                return (<CustomText style={{color: '#B1BBCA', fontSize: global.h4FontSize}}>{I18n.t('i_agree',{locale: language})}</CustomText>)
                            }}/>
                    </View>
                    <View style={{alignSelf: 'stretch', alignItems: 'center'}}>
                        <Button containerStyle={{backgroundColor: this.state.redeemDisabled? '#F1F1F1':'#47A0DC', padding: 10, marginTop: 10}}
                                onPress={() => {
                                    this.redeemReward();
                                }}
                                disabled={this.state.redeemDisabled }
                                >
                            <CustomText style={{
                                fontSize: global.h2FontSize,
                                color: 'white',
                                fontFamily: global.semiBoldText
                            }}>{I18n.t('redeem_now',{locale: language})}</CustomText>
                        </Button>
                    </View>
                </View>
            </Animated.View>
        );
    }



    redeemReward() {
        if(this.props.isConnected && !this.props.isLoading) {
            this.props.redeemReward(this.requestData).then((response) => {

                if (response.body.message) {
                    utils.showToastMessage(response.body.message);
                }
                this.closeModal();

            }).catch(error => {
                utils.showToastMessage(error.message);
                this.closeModal();
            });

        }

    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
    return (
        {
            isConnected: state.network.isConnected,
            error: state.error,
            isLoading: state.isLoading,
            language: state.language.googleCode
        }
    )
}


export default connect(mapStateToProps, mapDispatchToProps)(RedeemReward);