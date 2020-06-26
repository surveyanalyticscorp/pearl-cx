import React from 'react';
import {
    Clipboard,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
    Text,
} from 'react-native';


import MessageText from './MessageText';
import renderIf from '../../../global/renderIf';
import Time from './Time';
import CustomText from '../../../global/ui/CustomText';

export default class ChatMessageBubble extends React.Component {
    constructor(props) {
        super(props);
        this.onLongPress = this.onLongPress.bind(this);
    }

    handleBubbleToNext() {
        if (this.props.isSameUser(this.props.currentMessage, this.props.nextMessage) && this.props.isSameDay(this.props.currentMessage, this.props.nextMessage)) {
            return StyleSheet.flatten([styles[this.props.position].containerToNext, this.props.containerToNextStyle[this.props.position]]);
        }
        return null;
    }

    handleBubbleToPrevious() {
        if (this.props.isSameUser(this.props.currentMessage, this.props.previousMessage) && this.props.isSameDay(this.props.currentMessage, this.props.previousMessage)) {
            return StyleSheet.flatten([styles[this.props.position].containerToPrevious, this.props.containerToPreviousStyle[this.props.position]]);
        }
        return null;
    }

    renderMessageText() {
        if (this.props.currentMessage.text) {
            const {containerStyle, wrapperStyle, ...messageTextProps} = this.props;
            if (this.props.renderMessageText) {
                return this.props.renderMessageText(messageTextProps);
            }
            return <MessageText {...messageTextProps} />;
        }
        return null;
    }



    renderTime() {
        if (this.props.currentMessage.timestamp) {
            const {containerStyle, wrapperStyle, ...timeProps} = this.props;
            if (this.props.renderTime) {
                return this.props.renderTime(timeProps);
            }
            return <Time {...timeProps} />;
        }
        return null;
    }

    renderCustomView() {
        if (this.props.renderCustomView) {
            return this.props.renderCustomView(this.props);
        }
        return null;
    }

    onLongPress() {
        if (this.props.onLongPress) {
            this.props.onLongPress(this.context);
        } else {
            if (this.props.currentMessage.text) {
                const options = [
                    'Copy Text',
                    'Cancel',
                ];
                const cancelButtonIndex = options.length - 1;
                this.context.actionSheet().showActionSheetWithOptions({
                    options,
                    cancelButtonIndex,
                },
                    (buttonIndex) => {
                        switch (buttonIndex) {
                            case 0:
                                Clipboard.setString(this.props.currentMessage.text);
                                break;
                        }
                    });
            }
        }
    }

    render() {
        return (
            <View style={[styles[this.props.position].container, this.props.containerStyle[this.props.position]]}>
                <View>
                    <View style={[styles[this.props.position].wrapper, this.props.wrapperStyle[this.props.position], this.handleBubbleToNext(), this.handleBubbleToPrevious(),{minWidth: global.screenSizeFactor * 0.4, }]}>

                        <View>


                            {this.renderMessageText()}

                        </View>

                    </View>
                    <View style={[styles[this.props.position].footer,{ flexDirection: 'row', minWidth: global.screenSizeFactor * 0.4,marginTop:4}]}>

                        <View style={{ flex: 1, alignItems: 'flex-start', justifyContent:'center' }}>
                            <CustomText numberOfLines={1} ellipsizeMode={'tail'} style={{ fontSize: global.h4FontSize, color: '#9097A9' }}>{this.props.currentMessage.username}</CustomText>
                        </View>

                        <View style={{ alignItems: 'flex-end',justifyContent:'center'}}>
                            {this.renderTime()}

                        </View>

                    </View>
                </View>


            </View>
        );
    }
}

const styles = {
    left: StyleSheet.create({
        container: {
            flex: 1,
            alignItems: 'flex-start',
            marginTop: 15,
           
        },
        wrapper: {
            borderRadius: 15,
            backgroundColor: '#f0f0f0',
            marginRight: 60,

            minHeight: 20,
            justifyContent: 'flex-end',
        },
        containerToNext: {
            borderBottomLeftRadius: 3,
        },
        containerToPrevious: {
            borderTopLeftRadius: 3,
        },
        footer:{
            paddingRight: global.screenSizeFactor * 0.15,
        }
    }),
    right: StyleSheet.create({
        container: {
            flex: 1,
            alignItems: 'flex-end',
            marginTop: 12,
            
        },
        wrapper: {
            borderRadius: 15,
            backgroundColor: '#0084ff',

            marginLeft: 60,
            minHeight: 20,
            justifyContent: 'flex-end',
        },
        containerToNext: {
            borderBottomRightRadius: 3,
        },
        containerToPrevious: {
            borderTopRightRadius: 3,
        },
        footer:{
            paddingLeft: global.screenSizeFactor * 0.15
        }
    }),
    
};

// ChatMessageBubble.contextTypes = {
//     actionSheet: React.PropTypes.func,
// };

ChatMessageBubble.defaultProps = {
    touchableProps: {},
    onLongPress: null,
    renderMessageImage: null,
    renderMessageText: null,
    renderCustomView: null,
    renderTime: null,
    isSameUser: () => { },
    isSameDay: () => { },
    position: 'left',
    currentMessage: {
        text: null,
        timestamp: null,
        image: null,
    },
    nextMessage: {},
    previousMessage: {},
    containerStyle: {},
    wrapperStyle: {},
    containerToNextStyle: {},
    containerToPreviousStyle: {},
};

// ChatMessageBubble.propTypes = {
//     touchableProps: React.PropTypes.object,
//     onLongPress: React.PropTypes.func,
//     renderMessageImage: React.PropTypes.func,
//     renderMessageText: React.PropTypes.func,
//     renderCustomView: React.PropTypes.func,
//     renderTime: React.PropTypes.func,
//     isSameUser: React.PropTypes.func,
//     isSameDay: React.PropTypes.func,
//     position: React.PropTypes.oneOf(['left', 'right']),
//     currentMessage: React.PropTypes.object,
//     nextMessage: React.PropTypes.object,
//     previousMessage: React.PropTypes.object,
//     containerStyle: React.PropTypes.shape({
//         left: View.propTypes.style,
//         right: View.propTypes.style,
//     }),
//     wrapperStyle: React.PropTypes.shape({
//         left: View.propTypes.style,
//         right: View.propTypes.style,
//     }),
//     containerToNextStyle: React.PropTypes.shape({
//         left: View.propTypes.style,
//         right: View.propTypes.style,
//     }),
//     containerToPreviousStyle: React.PropTypes.shape({
//         left: View.propTypes.style,
//         right: View.propTypes.style,
//     }),
// };
