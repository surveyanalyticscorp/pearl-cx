/**
 * Created by sachinsable on 03/07/17.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Navigator,
    ScrollView,
    ListView,
    DeviceEventEmitter,
    NativeEventEmitter,
    Dimensions,
    Animated,
    Image,
    RefreshControl,
    TouchableHighlight,
    NativeModules,
    Platform, Alert
} from 'react-native';
import I18n from 'react-native-i18n';
import {Actions, ActionConst} from 'react-native-router-flux';
import CustomText from '../../global/ui/CustomText';
import ScrollViewWithRefreshControl from '../../global/ui/ScrollViewWithRefreshControl';
import Button from "react-native-button";

const {height, width} = Dimensions.get('window');
const factor = width > height ? height : width;
const CachedImage = require('../../global/ImageCache/CachedImage');

export default class MyRewards extends Component {
    constructor(props) {
        super(props);


    }

    componentDidMount() {
        if (!this.props.rewardsData || JSON.stringify(this.props.rewardsData) === '{}') {
            this.reloadContent();
        }
    }

    reloadContent() {
        this.props.onPress();
    }

    render() {
        const {language} = this.props;
        let qPoints = this.props.profileData.body ? this.props.profileData.body.qPoints : 0;
        console.log(this.props.rewardsData);
        if (this.props.rewardsData && this.props.rewardsData.body && this.props.rewardsData.body.rewards && this.props.rewardsData.body.rewards.length > 0) {
           let rewardItem = this.props.rewardsData.body.rewards[0].qPoints
            qPoints = rewardItem
        }
        if (this.props.rewardsData && JSON.stringify(this.props.rewardsData) != '{}') {
            return (

                <ScrollViewWithRefreshControl
                    onRefresh={() => {
                        this.reloadContent()
                    }}
                    style={{flex: 1}}
                >
                    <View style={{paddingHorizontal: 20, paddingVertical:10}}>
                        <View style={{flexDirection: 'row'}}>
                            <CustomText style={{color: '#C5CDD8', fontSize:global.h2FontSize}}>{I18n.t('total_points',{locale:language})}: </CustomText>
                            <CustomText style={{color: '#93a2b6', fontFamily:global.boldText,fontSize:global.h2FontSize}}>{qPoints}</CustomText>

                        </View>
                        <CustomText style={{color: '#B1BBCA',fontFamily:global.boldText,fontSize:global.h4FontSize, marginTop:2}}>{I18n.t('redeem_rewards_instruction',{locale: language})}</CustomText>

                    </View>
                    <View style={styles.lineViewContainer}/>
                    <View>
                        {this.getRewardsList()}
                    </View>


                </ScrollViewWithRefreshControl>

            );
        }
        return (<View/>);
    }

    getRewardsList() {
        let contents = [];
        this.props.rewardsData.body.rewards.map((item, index) => {
            contents.push(
                <View key={'rewards_' + index}>
                    {this.getRewardsRow(item)}
                    <View style={styles.lineViewContainer}/>
                </View>
            )
        });
        if(contents.length > 0) {
            return contents;
        }
        return this.renderNoRewards();

    }
    renderNoRewards(){
        const {language} = this.props;
        return(
            <View style={{alignItems: 'center', margin: 10, backgroundColor: 'white', padding: 10}}>
                <CustomText style={{color: 'black', fontSize: 16}}>{I18n.t('noRewards',{locale:language})}</CustomText>
            </View>
        );
    }

    getRewardsRow(item) {

        const {language} = this.props;
        return (
            <View style={{flexDirection: 'row', alignItems: 'center', alignSelf: 'stretch', paddingHorizontal:20, paddingVertical:10}}>
                <CachedImage resizeMode="contain" source={{uri: item.img}} isProfilePic={false}
                             useQueryParamsInCacheKey={false} style={{height: 40, width: 40}}/>
                <CustomText style={[{flex: 1, marginHorizontal: 20},styles.rewardTitle]}>{item.title}</CustomText>
                <View style={{alignItems:'flex-end', justifyContent:'center'}}>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
                        <CustomText style={{color: '#717173', fontSize:global.h1by2FontSize, textAlign:'center'}}>{item.pointsValue} </CustomText>
                        <CustomText style={{color: '#C5CDD8', fontSize:global.h4FontSize}}>{I18n.t('points',{locale:language})}</CustomText>
                    </View>
                    <Button containerStyle={{backgroundColor: '#47A0DC', padding:5, marginVertical:2}} onPress={() => {
                        console.log(item)
                        if (item.redeemable) {
                            if (this.props.isConnected) {
                                Actions.redeemReward({id: item.qPointRewardID, disclaimer:item.disclaimer
                                })}
                        } else {
                            if (item.qPoints < item.pointsValue) {
                                this.showInsufficientBalanceAlert();
                            } else {
                                this.showCannotRedeemAlert();
                            }

                        }

                    }

                    }>
                        <CustomText style={styles.buttonText}>{I18n.t('redeem',{locale: language})}</CustomText>
                    </Button>
                </View>
            </View>
        )
    }

    showCannotRedeemAlert() {
        Alert.alert(
            'Low Gift Cards',
            'We are low on gift cards right now, please try again later',
            [
                {
                    text: 'OK',
                    style: 'cancel',
                    onPress: (() => {

                    })}

            ],
            { cancelable: false }
        );
    }

    //[TG-339 This alert is added so that user will know he has a less points to redeem]
    showInsufficientBalanceAlert() {
        Alert.alert(
            'Insufficient Balance',
            'Oops, you don’t seem to have sufficient points to redeem this reward.',
            [
                {
                    text: 'OK',
                    style: 'cancel',
                    onPress: (() => {

                    })}

            ],
            { cancelable: false }
        );
    }

}
const styles = StyleSheet.create({
    lineViewContainer: {
        height: 1,
        flex: 1,
        backgroundColor: '#E5E8E9'
    },
    rewardTitle:{
        fontSize: global.h2FontSize,
        color : '#515F6A',
        fontFamily: global.boldText
    },
    buttonText:{
        fontSize: global.h4FontSize,
        color : 'white',
        fontFamily: global.semiBoldText
    },

});