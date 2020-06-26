import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    Navigator,
    ScrollView,
    ListView,
    Keyboard,
    ActivityIndicator,
    DeviceEventEmitter,
    NativeEventEmitter,
    Dimensions,
    Animated,
    Image,
    RefreshControl,
    TouchableOpacity,
    NativeModules,
    Platform
} from 'react-native';
const dismissKeyboard = require('dismissKeyboard');
import CustomText from '../../../global/ui/CustomText';
import Button from 'react-native-button';
import AutoCompleteTextInput from '../../../global/widgets/AutoCompleteTextInput';
import renderIf from '../../../global/renderIf';
import { apiHandler } from '../../../global/api/APIHandler';
import KeyboardSpacer from 'react-native-keyboard-spacer';
var AndroidKeyboardAdjust = require('NativeModules').AndroidKeyboardAdjust;
export default class SupervisorField extends Component {
    constructor(props) {
        super(props);
        console.log("Selected Choice " + props.selectedChoice);
        this.state = {
            query: props.selectedChoice || "",
            selectedID: -1,
            data: [],
            loading: false,
        };
    }
    processAPIResponse(response) {
        dataJSON = JSON.stringify(response);
        this.setState({ data: response.body.memberCustomFields, loading: false });

    }

    getPanelMember() {

        if (this.state.isConnected && !this.state.showLoader) {
            //update state to start loading
            this.setState({ loading: true });
            apiHandler.getFlashLetMemberProfile(this.processAPIResponse.bind(this), { searchText: this.state.query }, (error) => {
                this.handleError(error);
            });
        }
    }

    render() {

        return (
            <View style={{ flex: 1 }}>
                {renderIf(!this.props.isPopup)(
                    <CustomText numberOfLines={1} style={{ color: 'black', fontFamily: global.boldText }}>{this.props.title}</CustomText>
                )
                }
                <View style={{ width: undefined, flex: 1, marginTop: 5 }}>
                    {this.getTextComponent()}
                </View>
            </View>
        );
    }
    getCloseIconImage() {
        if (Platform.OS != 'ios') {
            return require('../../../global/images/close_grey.png');
        } else {
            return { uri: 'close_grey.png' };
        }
    }

    componentWillMount() {

        if (Platform.OS != 'ios' && !this.props.isPopup) {
            AndroidKeyboardAdjust.setAdjustResize();
        }
    }
    getTextComponent() {
        if (!this.state.loading) {
            const { query } = this.state;
            let items = this.findItem(query);
            const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();

            return (
                <AutoCompleteTextInput
                    autoCapitalize="none"
                    autoCorrect={false}
                    listContainerStyle={styles.autocompleteContainer}
                    defaultValue={query}
                    underlineColorAndroid={'transparent'}
                    isFocused={this.state.isFocused}
                    data={items.length === 1 && comp(query, items[0].emailAddress) ? [] : items}
                    onChangeText={this.handleChangeText.bind(this)}
                    renderTextInput={this.renderTextInput.bind(this)}
                    renderItem={data => (
                        <TouchableOpacity
                            style={{ padding: 10 }}
                            onPress={() => {
                                this.props.updateSupervisorListener(data.memberId, data.emailAddress);
                                this.setState({ query: data.emailAddress, selectedID: data.memberId });
                                dismissKeyboard();
                            }}>
                            <CustomText style={styles.itemText}>{data.emailAddress}</CustomText>
                        </TouchableOpacity>
                    )}
                />
            );

        }

    }
    handleChangeText(text) {
        console.log("On Change text");
        this.setState({ query: text });
        this.resolveAndUpdateEmail(text);
        if (text.length >= 3) {
            apiHandler.getFlashLetPanelMember(this.processAPIResponse.bind(this), { searchText: text }, (error) => { })
        }
        else {
            this.setState({ data: [] });
        }
    }
    renderTextInput(props) {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextInput {...props} style={styles.inputText}
                    onFocus={() => {
                        this.setState({ isFocused: true });
                    }}
                    keyboardType='email-address'
                    ref={ref => this.textInput = ref}
                    onEndEditing={() => { this.setState({ isFocused: false }) }}
                    placeholder="Enter supervisor email address"
                    placeholderTextColor='#b2b2b2'
                    value={this.state.query} />

                {renderIf(this.state.query.length > 0)(
                    <Button
                        onPress={() => {

                            this.textInput.setNativeProps({ text: '' });
                            this.setState({ query: '', data: [] });
                            this.props.updateSupervisorListener(-1, '');
                        }
                        }
                        containerStyle={{ padding: 10 }}
                        isDisabled={false}>
                        <Image source={this.getCloseIconImage()} style={{ height: 8, width: 8 }} />
                    </Button>
                )
                }
            </View>
        )
    }
    resolveAndUpdateEmail(query) {

        if (this.hasSelectedFromList(query)) {
            this.props.updateSupervisorListener(this.state.selectedID, query);
        } else {
            this.props.updateSupervisorListener(-1, query);
        }

    }
   
    hasSelectedFromList(query) {
        this.state.data.map((item, index) => {
            if (item.emailAddress === query && item.memberId === this.state.selectedID) {
                return true;
            }
        });
        return false;
    }
    findItem(query) {
        const items = this.state.data;
        if (query === '') {
            return items;
        }
        const regex = new RegExp(`${query.trim()}`, 'i');
        return items.filter(item => item.emailAddress.search(regex) >= 0);
    }
}
const styles = StyleSheet.create({
    autocompleteContainer: {
        borderColor: '#b9b9b9',
        borderRadius: 1,
        borderTopWidth: 0,
        borderWidth: 1,
    },
    lineViewContainer: {
        height: 1,
        flex: 1,
        backgroundColor: '#b9b9b9'
    },
    itemText: {
        color: 'black',
        fontFamily: global.primaryText,
        fontSize: global.h2FontSize,
        margin: 2
    },
    inputText: {

        flex: 1,
        height: 30,
        marginVertical: 5,
        backgroundColor: 'transparent',
        padding: 5,
        color: 'black',
        fontFamily: global.primaryText,
        fontSize: global.h2FontSize

    }
});