import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Dimensions,
    PixelRatio,
    TouchableWithoutFeedback
} from "react-native";
import Button from "react-native-button";
import CustomText from '../../app/global/ui/CustomText';
import Picker from 'react-native-wheel-picker'
import {Actions} from 'react-native-router-flux';


var PickerItem = Picker.Item;
var {
    height: deviceHeight,
    width: deviceWidth
} = Dimensions.get("window");

var styles = StyleSheet.create({
    container: {
        width: deviceWidth,
        height: deviceHeight,
        position: "absolute",
        top: 0,
        justifyContent: "flex-start",
        flex: 1, backgroundColor: "rgba(52,52,52,0.9)",
    },

});

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import {ActionCreators} from './actions';
import {
    ActionBarModule
} from '../../app/global/native-modules/NativeModules';
import Icon from 'react-native-vector-icons/MaterialIcons'


class LanguagePickerModal extends Component {

    constructor(props) {
        super(props);
        if (this.props.languageList) {
            this.itemList = this.props.languageList.languages;
        } else {
            this.itemList = [{languageName : "English", googleCode: "en", languageID: 0}]
        }

        this.state = {
            offset: new Animated.Value(-deviceHeight),
            selectedItem: 0,
        };
        this.filterItemList()
    }

    componentDidMount() {
        Animated.timing(this.state.offset, {
            duration: 150,
            toValue: 0
        }).start();
    }

    filterItemList() {
        let languageArray = ["en", "fr", "pt", "es", "ja", "ar"];
        if(this.itemList){
            let languageSelected = this.itemList.filter(lang => languageArray.includes(lang.googleCode));
            this.itemList = [...languageSelected];
        }

    }

    getProfileData() {
        let requestData = {};
        requestData.firstName = this.props.profileData.firstName;
        requestData.lastName = this.props.profileData.lastName;
        requestData.phoneNumber = this.props.profileData.phoneNumber;
        return requestData;
    }

    closeModal() {
        if (this.itemList[this.state.selectedItem]) {
            let languageID = this.itemList[this.state.selectedItem].languageID;
            let languageName = this.itemList[this.state.selectedItem].languageName
            this.updatePanelMemberDetails(languageID, languageName);
        }

        Animated.timing(this.state.offset, {
            duration: 150,
            toValue: -deviceHeight
        }).start(Actions.pop);
    }

    updatePanelMemberDetails(languageID, languageName) {
        if (this.props.isConnected && !this.props.isLoading) {
            let uploadData = this.getProfileData();
            uploadData["languageID"] = languageID + "";
            this.props.updateProfileDetails(uploadData).then((response) => {
                this.props.changeLanguage(this.itemList[this.state.selectedItem])
                    .then(response => {
                        ActionBarModule.updateLanguageMenuTitle(languageName);

                    });
            });
        }
    }

    getCloseIcon() {
        return require('../global/images/close_grey.png');

    }

    onPickerSelect(index) {
        this.setState({
            selectedItem: index
        })
    }


    render() {
        return (
            <View style={[styles.container]}>
                <View style={{flex: 1, justifyContent: "flex-start",}}>
                    <TouchableWithoutFeedback onPress={() => {
                        console.log("back button type")
                        Actions.pop && Actions.pop();
                    }}>
                        <View style={{flex: 0.04}}>
                            <Icon name={'chevron-left'} size={30} color={'white'}/>
                        </View>
                    </TouchableWithoutFeedback>
                    <View style={{
                        flex: 0.96,
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: deviceWidth * 0.3
                    }}>
                        <View style={{
                            paddingVertical: 10,
                            flexDirection: "row",
                            width: deviceWidth * 0.8,
                            backgroundColor: "white",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                            <Text style={{
                                color: 'grey',
                                fontSize: 20,
                                textAlign: 'center',
                                fontFamily: global.boldText
                            }}> {this.itemList[this.state.selectedItem].languageName} </Text>
                        </View>
                        <View style={{
                            borderWidth: 1 / PixelRatio.get(),
                            borderColor: '#000',
                            borderRadius: 8,
                        }}>
                            <Picker style={{
                                width: deviceWidth * 0.8,
                                height: deviceHeight * 0.2,
                                backgroundColor: '#ffffff',
                                paddingBottom: 20
                            }}
                                    selectedValue={this.state.selectedItem}
                                    itemStyle={{
                                        color: 'grey',
                                        paddingVertical: 20,
                                        fontSize: 16,
                                        fontFamily: global.boldText
                                    }}

                                    onValueChange={(index) => this.onPickerSelect(index)}>
                                {this.itemList.map((value, i) => (
                                    <PickerItem label={value.languageName} value={i} key={value.ID}/>
                                ))}
                            </Picker>
                            <Button
                                containerStyle={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: 50, width: deviceWidth * 0.8,
                                    backgroundColor: "#ffffff"
                                }}
                                onPress={this.closeModal.bind(this)}
                                isDisabled={false}>
                                <CustomText style={{
                                    color: 'grey',
                                    fontSize: 18,
                                    fontFamily: global.boldText
                                }}>Done</CustomText>
                            </Button>
                        </View>
                    </View>
                </View>
            </View>
        );
    }



}

function mapStateToProps(state) {
    return {
        languageList: state.panelLanguageData.body,
        title: state.panelHomeData.title,
        isLoading: state.isLoading,
        error: state.error.message,
        isConnected: state.network.isConnected,
        language: state.language.googleCode,
        profileData: state.panelProfileData.body,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(LanguagePickerModal);

