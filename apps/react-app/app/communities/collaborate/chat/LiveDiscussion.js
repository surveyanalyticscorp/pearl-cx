import React from 'react';
import { View, StyleSheet, Image, ScrollView, Platform, TextInput } from 'react-native';

import BaseComponentWithoutScroll from '../../../global/components/BaseComponentWithoutScroll';
import SubView from '../../../global/components/SubView';
import CustomText from '../../../global/ui/CustomText';
import { Actions } from 'react-native-router-flux';
import renderIf from '../../../global/renderIf';
import ChatMessageBubble from './ChatMessageBubble';
import Button from 'react-native-button';
import LoadEarlier from './LoadEarlier';
import GiftedChat from './GiftedChat';
import Day from './Day';
import PlatformAwareKeyboardSpacer from '../../../global/ui/PlatformAwareKeyboardSpacer';
const CachedImage = require('../../../global/ImageCache/CachedImage');
const URL = require('url-parse');
var AndroidKeyboardAdjust = require('NativeModules').AndroidKeyboardAdjust;
import I18n from 'react-native-i18n';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { ActionCreators } from '../../actions/index';
import { utils } from '../../../global/Utils'
class LiveDiscussion extends BaseComponentWithoutScroll {
    socket = null;
    constructor(props) {
        super(props);
        this.state = {
            messages: [],

            loadEarlier: false,
            typingText: null,
            showCollaborators: false,
            message: '',
            collaborators: [],
            text: '',
            typingUsers: [],
        };
        this.liveDiscussion = props.discussion;
        this._isMounted = false;
        this.tempID = 0;
        this.onSend = this.onSend.bind(this);
        this.onReceive = this.onReceive.bind(this);
        this.renderBubble = this.renderBubble.bind(this);
        this.renderFooter = this.renderFooter.bind(this);
        window.navigator.userAgent = 'ReactNative';
        this.initializeAndBuildSocket();
    }
    getProfilePicURL() {

        var pat = RegExp('^(?:[a-z]+:)?//', 'i');
        if (pat.test(global.appUser.profilePic)) {
            return global.appUser.profilePic;
        }
        return global.BASE_URL + global.appUser.profilePic;

    }
    getSocketURL() {
        let actualHost = new URL(global.BASE_URL,null,true);
        let parts =actualHost.host.split('.');
        parts.splice(0,1);

        let url = "https://node."+parts.join('.') + ":443";
        console.log("Socket url- "+url);
        return url;
    }

    initializeAndBuildSocket() {
        const io = require('socket.io-client/dist/socket.io');
        this.socket = io(this.getSocketURL());
        this.socket.connect();
        this.user = {
            "emailAddress": global.appUser.emailID,
            "panelID": this.liveDiscussion.panelID,
            "chatID": this.liveDiscussion.ID,
            "profilePic": this.getProfilePicURL(),
            "isAdmin": false,
            "id": global.appUser.ID,
            "url": utils.getDomainFromUrl(global.BASE_URL),
            "username": global.appUser.firstName + ' ' + global.appUser.lastName,
            "mobileApp": true
        };
        let context = this;
        this.socket.on('connect', () => {
            console.log('Wahey -> connected!');
            context.socket.emit('joinChat', context.user);
        });
        this.socket.on('connect_failed', () => {
           utils.showToastMessage('Failed to connect to chat server. Please try again later.');
           context.props.updateLoadingStatus(false);
        });
        this.socket.on('joinSuccess', (user) => {
            console.log("After Joined- " + JSON.stringify(user));
            context.setState({
                collaborators: GiftedChat.append(context.state.collaborators, user),
                showLoader: false
            })
            this.props.updateLoadingStatus(false);
        });
        this.socket.on('userJoined', (user) => {
            console.log('user Joined- ' + JSON.stringify(user));
            if (!context.checkIfUserIsThere(user)) {
                context.setState({
                    collaborators: GiftedChat.append(context.state.collaborators, user)
                })
            }
        });
        this.socket.on('newMessage', (message) => {
            console.log(JSON.stringify(message));
            context.onReceive(message);
        });
        this.socket.on('initComments', (messages) => {
            console.log("Messages->" + JSON.stringify(messages));
            context.state.messages = [];
            context.setState({
                messages: messages.sort(function (a, b) { return b.timestamp - a.timestamp }),
                showLoader: false
            });

        });
        this.socket.on('updateMessageID', (data) => {
            console.log("Data-> " + JSON.stringify(data));
            let id = data.message.id;
            context.updateLastMessageID(data.message, data.tempID);
        });
        this.socket.on('isTyping', (user) => {

            console.log("IS typing->" + JSON.stringify(user));
            context.handleTypingUsers(user);
        });
        this.socket.on('userLeft', (user) => {
            console.log("User Left->" + JSON.stringify(user));
            let users = context.state.collaborators;
            for (let i = 0; i < users.length; i++) {
                let temp = users[i];
                if (temp.id == user.id) {
                    users.splice(i, 1);
                    break;
                }
            }
            context.setState({ collaborators: users });
        });
        this.socket.on('clearSession', (data) => {
            context.setState({ messages: [] });
        });
    }


    checkIfUserIsThere(user) {
        this.state.collaborators.map((item, index) => {
            if (item.id == user.id) {
                return true;
            }
        });
        return false;
    }

    handleTypingUsers(user) {
        let foundUser = false;
        let scope = this;
        for (var i = 0; i < this.state.typingUsers.length; i++) {
            console.log("Typing users-> " + this.state.typingUsers.length);
            var participantTyping = this.state.typingUsers[i];
            if (participantTyping.id == user.id) {
                if (participantTyping.timeout) {
                    clearTimeout(participantTyping.timeout);
                }
                foundUser = true;
                participantTyping.timeout = setTimeout(
                    function () {
                        scope.eraseWhoIsTyping(participantTyping);
                    }, 1000);
                break;
            }

        }
        if (!foundUser) {
            console.log("Typing users 0, So adding users");
            this.setState({ typingUsers: GiftedChat.append(this.state.typingUsers, user) });
            this.setState({ typingText: this.whoIsTyping() });
            user.timeout = setTimeout(
                function () {
                    scope.eraseWhoIsTyping(user)
                }, 1000);
        }
    }
    eraseWhoIsTyping(participant) {
        var index = this.state.typingUsers.indexOf(participant);
        // console.log("Index while erasing- "+ index);
        let tu = this.state.typingUsers;
        tu.splice(index, 1);
        this.setState({ typingUsers: tu });
        this.setState({ typingText: this.whoIsTyping() });
        // console.log("Typing users after erase- > "+ this.state.typingUsers.length);
    }
    whoIsTyping() {
        let whoIsTyping = '';
        if (this.state.typingUsers.length > 3) {
            whoIsTyping += I18n.t('multiple_typing',{locale: this.props.language});
        } else if (this.state.typingUsers.length > 0) {
            for (var i = 0; i < this.state.typingUsers.length; i++) {
                var participantTyping = this.state.typingUsers[i];
                whoIsTyping += (i > 0 ? ', ' : ' ') + participantTyping.username;
            }
            whoIsTyping += I18n.t('is_typing',{locale: this.props.language});
        }
        // console.log("Who is typing- " + whoIsTyping);
        return whoIsTyping;
    }
    updateLastMessageID(message, tempID) {
        console.log("Temp ID- " + tempID);

        let tempMessages = this.state.messages;

        for (var index = 0; index < tempMessages.length; index++) {
            let item = tempMessages[index];
            if (item.id == tempID) {
                tempMessages[index] = message;
                this.setState({ messages: tempMessages });
                break;
            }
        }


    }
    componentDidMount() {

    }

    componentWillMount() {
        this._isMounted = true;
        // this.setState({
        //     messages: require('./data/messages.js'),

        // });
        if (Platform.OS != 'ios') {
            AndroidKeyboardAdjust.setAdjustResize();
        }
         this.props.updateLoadingStatus(true);
    }

    getBackIconImage() {
        if (Platform.OS != 'ios') {
            return require('../../../global/images/left_arrow_grey.png');
        } else {
            return { uri: 'left_arrow_grey.png' };
        }
    }
    getCloseIconImage() {
        if (Platform.OS != 'ios') {
            return require('../../../global/images/close_grey.png');
        } else {
            return { uri: 'close_grey.png' };
        }
    }
    getCollaboratorsIconImage() {
        if (Platform.OS != 'ios') {
            return require('../../../global/images/communities/collabrators_icon.png');
        } else {
            return { uri: 'collabrators_icon.png' };
        }
    }
    componentWillUnmount() {
        this._isMounted = false;
        if (this.socket) {
            this.socket.emit('disconnect');
            this.socket.disconnect();
        }
    }

    onLoadEarlier() {

    }
    onSend(message = []) {
        this.setState(
            {
                messages: GiftedChat.append(this.state.messages, message),
                message: ''
            });

        this.socket.emit('addMessage', (message));
    }
    renderLoadEarlier(props) {
        return (<LoadEarlier {...props} />)
    }
    renderDay(props) {
        return (<Day {...props} />);
    }
    renderBubble(props) {
        return (

            <ChatMessageBubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: '#EEEFF8',
                    },
                    left: {
                        backgroundColor: '#85B1F7',
                    }

                }}
                textStyle={{
                    left: {
                        color: 'white',
                        lineHeight: Math.round(global.h2FontSize*1.5),
                        fontSize: global.h2FontSize
                    },
                    right: {
                        color: '#9097A9',
                        lineHeight: Math.round(global.h2FontSize*1.5),
                        fontSize: global.h2FontSize
                    }
                }}
                linkStyle={{
                    left: {
                        color: 'white',
                        lineHeight: Math.round(global.h2FontSize*1.3),
                        fontSize: global.h2FontSize
                    },
                    right: {
                        color: '#9097A9',
                        lineHeight: Math.round(global.h2FontSize*1.3),
                        fontSize: global.h2FontSize
                    }
                }}
            />


        );
    }
    answerDemo(messages) {
        if (messages.length > 0) {
            if ((messages[0].image || messages[0].location) || !this._isAlright) {
                this.setState({
                    typingText: 'React Native is typing'

                });
            }
        }

        setTimeout(() => {
            if (this._isMounted === true) {
                if (messages.length > 0) {
                    if (messages[0].image) {
                        this.onReceive('Nice picture!');
                    } else if (messages[0].location) {
                        this.onReceive('My favorite place');
                    } else {
                        if (!this._isAlright) {
                            this._isAlright = true;
                            this.onReceive('Alright');
                        }
                    }
                }
            }

            this.setState({
                typingText: null,

            });
        }, 1000);
    }

    onReceive(message) {
        this.setState({
            messages: GiftedChat.append(this.state.messages, message)

        });
    }
    buildMessageObjectForSend(text) {
        console.log("profilePic  : " + global.BASE_URL + global.appUser.profilePic);
        let data = {
            "chatID": this.liveDiscussion.ID,
            "memberID": global.appUser.ID,
            "message": text,
            "text": text,
            "username": global.appUser.firstName + ' ' + global.appUser.lastName,
            "isAdmin": false,
            "timestamp": new Date().getTime(),
            "profilePic": this.getProfilePicURL(),
            "id": this.tempID,
            "tempID": this.tempID--,

        };

        return (data);
    }

    renderFooter(props) {
        if (this.state.typingText) {
            return (
                <View style={styles.footerContainer}>
                    <CustomText style={styles.footerText}>
                        {this.state.typingText}
                    </CustomText>
                </View>
            );
        }
        return null;
    }
    renderChild() {
        return (
            <SubView renderTopBar={this.renderTopBar()}>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>

                        <View style={{ flex: 1}}>
                            <GiftedChat
                                messages={this.state.messages}
                                onSend={this.onSend.bind(this)}
                                loadEarlier={this.state.loadEarlier}
                                renderLoadEarlier={this.renderLoadEarlier.bind(this)}
                                renderDay={this.renderDay.bind(this)}
                                userID={global.appUser.ID}
                                onLoadEarlier={this.onLoadEarlier.bind(this)}
                                isLoadingEarlier={this.state.isLoadingEarlier}
                                placeholder={I18n.t('write_a_message',{locale:this.props.language})}
                                renderBubble={this.renderBubble.bind(this)}
                                renderFooter={this.renderFooter.bind(this)}
                                renderInputToolbar={this.renderInputToolbar.bind(this)}
                            />
                        </View>
                        {renderIf(this.state.showCollaborators)(
                            <View style={{ flex: 1 }}>
                                {this.renderCollaborators()}
                            </View>
                        )
                        }
                    </View>
                    <View style={{ width: undefined, height: 1, backgroundColor: '#e8e8e8' }} />
                    <View>
                        {this.renderComposer()}
                    </View>
                </View>
            </SubView>
        );
    }


    renderCollaborators() {
        return (
            <View style={{ padding: 5, borderWidth: 1, borderColor: '#e8e8e8', flex: 1, marginLeft:5 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', margin: 5 }}>
                    <Button onPress={() => {
                        this.setState({ showCollaborators: false })
                    }} >
                        <Image source={this.getCloseIconImage()} style={{ height: 10, width: 10 }} />
                    </Button>
                </View>
                <CustomText numberOfLines={1} ellipsizeMode={'tail'} style={{ color: '#9097A9', fontWeight: 'bold', fontSize: global.h3FontSize }}>{this.state.collaborators.length} {I18n.t('collaborators',{locale: this.props.language})}</CustomText>
                <ScrollView style={{ flex: 1, paddingRight: 14, marginTop: 5 }}>
                    {this.renderCollaboratorsList()}
                </ScrollView>
            </View>
        )
    }
    renderCollaboratorsList() {
        let contents = [];
        this.state.collaborators.map((item, index) => {
            contents.push(this.renderCollaboratorItem(item));
        });
        return contents;
    }

    renderCollaboratorItem(item) {
        return (
            <View key={item.id} style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingRight: 5, paddingVertical: 4 }}>
                <CachedImage source={{ uri: item.profilePic }} style={{ height: 18, width: 18, borderRadius: 9 }} />
                <CustomText numberOfLines={2} ellipsizeMode={'tail'} style={{ color: '#7d93ab', fontSize: global.h4FontSize, textAlign: 'left', marginLeft: 5 }}>{item.username}</CustomText>
            </View>
        );
    }

    renderTopBar() {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', paddingHorizontal: 10, paddingVertical: 20 }}>
                <View style={{
                    flex: 1,
                    backgroundColor: '#00000000',
                    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                    position: 'absolute', top: 0,
                    bottom: 0,
                    left: 0,
                    paddingHorizontal: 60,
                    right: 0,
                }}>
                    <CustomText numberOfLines={1} ellipsizeMode={'tail'} style={{ flex: 1, textAlign: 'center', color: '#7d93ab', fontSize: 20 }}>{this.props.title ? this.props.title : 'Title Here'}</CustomText>
                </View>
                <Button onPress={() => {
                    Actions.pop();
                }}>
                    <Image source={this.getBackIconImage()} style={{paddingLeft:10, paddingRight:10, height: 15, width: 15 }} />
                </Button>
                {
                    renderIf(!this.state.showCollaborators)(
                        <View style={{flex:1, flexDirection: 'row', justifyContent: 'flex-end',alignItems: 'center', marginRight: 5 }}>

                            <Button onPress={() => {
                                this.setState({ showCollaborators: true });
                                }}>
                                <CustomText numberOfLines={1} ellipsizeMode={'tail'} style={{ marginRight: 5, color: '#7d93ab', fontSize: global.h3FontSize }}>{this.state.collaborators.length}</CustomText>
                                <Image source={this.getCollaboratorsIconImage()} style={{ height: 20, width: 20 }} />
                            </Button>
                        </View>
                    )
                }
            </View>
        )
    }
    renderInputToolbar() {
        return null;
    }
    renderComposer() {
        return (
            <View>
                <View style={{ flexDirection: 'row', justifyContent: 'center', height: 44 }}>

                    <TextInput
                        placeholder={I18n.t('write_a_message',{locale:this.props.language})}
                        placeholderTextColor="#b2b2b2"
                        multiline={true}
                        onChange={(e) => {
                            console.log("On Changed Text. ");
                            this.setState({ message: e.nativeEvent.text });
                            this.props.text = e.nativeEvent.text;
                            this.socket.emit('isTyping', this.user);
                        }}
                        style={[styles.textInput, this.props.textInputStyle]}
                        value={this.state.message}
                        enablesReturnKeyAutomatically={true}
                        underlineColorAndroid="transparent"
                        {...this.props.textInputProps}
                    />
                    <View style={{ justifyContent: 'center' }}>
                        {this.renderSend()}
                    </View>
                </View>
                <PlatformAwareKeyboardSpacer />
            </View>
        );
        return null;
    }
    renderSend() {
        if (this.state.message.trim().length > 0 && this.props.isConnected) {
            return (
                <Button
                    style={{
                        flex: 1,
                        justifyContent: 'flex-end',

                    }}
                    onPress={() => {
                        this.onSend(this.buildMessageObjectForSend(this.state.message.trim()));

                    }}
                >
                    <Image source={this.getSendIconImage()} style={{ height: 30, width: 30, margin: 5 }} />
                </Button>
            );
        }
        return <View />;
    }
    getSendIconImage() {
        if (Platform.OS != 'ios') {
            return require('../../../global/images/communities/send_icon.png');
        } else {
            return { uri: 'send_icon.png' };
        }

    }

}

const styles = StyleSheet.create({
    footerContainer: {
        marginTop: 5,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10,
    },
    footerText: {
        fontSize: 14,
        color: '#aaa',
    },
    textInput: {
        flex: 1,
        marginLeft: 10,
        color: 'black',
        fontSize: global.h2FontSize,
        lineHeight: global.h2FontSize,
        marginTop: Platform.select({
            ios: 6,
            android: 0,
        }),
        marginBottom: Platform.select({
            ios: 5,
            android: 3,
        }),
    },

});


function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
  return {
    error: state.error.message,
    isConnected: state.network.isConnected,
    isLoading : state.isLoading,
      language: state.language.googleCode,

  };
}


export default connect(mapStateToProps, mapDispatchToProps)(LiveDiscussion);
